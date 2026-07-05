/**
 * Message Service
 * Core business logic layer for the AI chatbot message flow.
 * Orchestrates the full send/receive pipeline including context retrieval,
 * prompt construction, AI response generation (streaming & non-streaming),
 * history management, auto-titling, and background summarization.
 */

const conversationRepository = require("./conversation.repository");
const messageRepository = require("./message.repository");
const historyService = require("./history.service");
const promptService = require("./prompt.service");
const aiService = require("./ai.service");
const streamingService = require("./streaming.service");
const memoryService = require("./memory.service");
const conversationService = require("./conversation.service");
const { withTimeout } = require("../../../pkg/with-timeout");

/**
 * Sends a message in a conversation and generates a streaming AI response.
 * This is the main chat flow orchestrator.
 *
 * Flow:
 * 1. Verify conversation exists
 * 2. Save user message to history
 * 3. Retrieve conversation context (summary + recent messages)
 * 4. Build the prompt for the AI model
 * 5. Generate a streaming AI response
 * 6. Stream the response to the client via SSE (if res is provided)
 * 7. Collect full response text
 * 8. Save assistant message to history
 * 9. Update conversation's lastMessage preview
 * 10. Auto-generate title if this is the first message
 * 11. Trigger background summarization if needed
 *
 * @param {string} conversationId - The conversation ID.
 * @param {string} content - The user's message content.
 * @param {Object} [res] - Express response object for SSE streaming.
 * @returns {Promise<string>} The full AI response text.
 */
const send = async (conversationId, content, res) => {
  console.log(`DEBUG: send() started for conversation: ${conversationId}`);
  // 1. Verify conversation exists
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) {
    console.log(`DEBUG: Conversation not found: ${conversationId}`);
    const error = new Error("Conversation not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Save user message
  await historyService.saveMessage({
    conversationId,
    role: "user",
    content,
  });
  console.log('DEBUG: User message saved');

  // 3. Get conversation context (summary + recent messages)
  const context = await historyService.getContext(conversationId);
  console.log('DEBUG: Context retrieved');

  // 4. Build prompt for the AI model
  const prompt = promptService.buildPrompt({
    summary: context.summary?.summary,
    recentMessages: context.messages,
    currentMessage: { role: "user", content },
  });
  console.log('DEBUG: Prompt built');

  // 5. Generate AI streaming response
  const stream = await withTimeout(
      aiService.generateStreamingResponse(prompt),
      15000,
      "AI streaming response generation"
  );
  console.log('DEBUG: Streaming response generated');

  // 6 & 7. Stream to client and collect full response
  let fullResponseText = "";

  if (res) {
    console.log('DEBUG: Streaming to SSE');
    fullResponseText = await streamingService.streamToSSE(stream, res);
  } else {
    console.log('DEBUG: Collecting stream manually');
    // Collect stream without SSE if no response object
    for await (const chunk of stream) {
      const text = chunk.text || chunk.content || "";
      fullResponseText += text;
    }
  }
  console.log('DEBUG: Stream collected, full text length:', fullResponseText.length);

  // 8. Save assistant message
  await historyService.saveMessage({
    conversationId,
    role: "assistant",
    content: fullResponseText,
  });
  console.log('DEBUG: Assistant message saved');

  // 9. Update conversation lastMessage preview
  await conversationRepository.update(conversationId, {
    lastMessage: fullResponseText.substring(0, 100),
  });
  console.log('DEBUG: Conversation updated');

  // ... (rest of the method unchanged)

  // 10. Auto-generate title if first message
  if (context.messages.length <= 1) {
    _autoGenerateTitle(conversationId, content).catch((err) => {
      console.error("Failed to auto-generate conversation title:", err.message);
    });
  }

  // 11. Check if summarization is needed and trigger in background
  if (memoryService.shouldSummarize(context.messages)) {
    memoryService.generateSummary(conversationId).catch((err) => {
      console.error("Failed to generate summary:", err.message);
    });
  }

  return fullResponseText;
};

/**
 * Sends a message and generates a non-streaming AI response.
 * Same flow as send() but returns the response as a JSON-serializable object.
 *
 * @param {string} conversationId - The conversation ID.
 * @param {string} content - The user's message content.
 * @returns {Promise<Object>} Object containing the AI response.
 */
const sendNonStreaming = async (conversationId, content) => {
  // 1. Verify conversation exists
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) {
    const error = new Error("Conversation not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Save user message
  await historyService.saveMessage({
    conversationId,
    role: "user",
    content,
  });

  // 3. Get conversation context
  const context = await historyService.getContext(conversationId);

  // 4. Build prompt
  const prompt = promptService.buildPrompt({
    summary: context.summary?.summary,
    recentMessages: context.messages,
    currentMessage: { role: "user", content },
  });

  // 5. Generate non-streaming AI response
  const responseText = await withTimeout(
      aiService.generateResponse(prompt),
      15000,
      "AI response generation"
  );

  // 6. Save assistant message
  await historyService.saveMessage({
    conversationId,
    role: "assistant",
    content: responseText,
  });

  // 7. Update conversation lastMessage preview
  await conversationRepository.update(conversationId, {
    lastMessage: responseText.substring(0, 100),
  });

  // 8. Auto-generate title if first message
  if (context.messages.length <= 1) {
    _autoGenerateTitle(conversationId, content).catch((err) => {
      console.error("Failed to auto-generate conversation title:", err.message);
    });
  }

  // 9. Check if summarization is needed and trigger in background
  if (memoryService.shouldSummarize(context.messages)) {
    memoryService.generateSummary(conversationId).catch((err) => {
      console.error("Failed to generate summary:", err.message);
    });
  }

  return {
    role: "assistant",
    content: responseText,
  };
};

/**
 * Retrieves all messages for a given conversation.
 * @param {string} conversationId - The conversation ID.
 * @returns {Promise<Array<Object>>} Array of message objects.
 */
const getMessages = async (conversationId) => {
  const messages = await messageRepository.findByConversation(conversationId);
  return messages;
};

/**
 * Deletes a single message by ID.
 * @param {string} id - The message ID.
 * @returns {Promise<Object>} The deletion result.
 */
const deleteMessage = async (id) => {
  return await messageRepository.remove(id);
};

/**
 * Regenerates an AI response by deleting the specified assistant message
 * (and all subsequent messages) and re-running the send flow with the
 * last user message.
 *
 * @param {string} conversationId - The conversation ID.
 * @param {string} messageId - The assistant message ID to regenerate from.
 * @param {Object} [res] - Express response object for SSE streaming.
 * @returns {Promise<string>} The new AI response text.
 */
const regenerate = async (conversationId, messageId, res) => {
  // Get all messages in the conversation
  const messages = await messageRepository.findByConversation(conversationId);

  // Find the index of the target message
  const targetIndex = messages.findIndex(
    (msg) => msg.id === messageId || msg._id?.toString() === messageId
  );

  if (targetIndex === -1) {
    const error = new Error("Message not found");
    error.statusCode = 404;
    throw error;
  }

  // Delete the target message and all messages after it
  const messagesToDelete = messages.slice(targetIndex);
  for (const msg of messagesToDelete) {
    await messageRepository.remove(msg.id || msg._id);
  }

  // Find the last user message before the deleted ones
  const remainingMessages = messages.slice(0, targetIndex);
  const lastUserMessage = [...remainingMessages]
    .reverse()
    .find((msg) => msg.role === "user");

  if (!lastUserMessage) {
    const error = new Error("No user message found to regenerate from");
    error.statusCode = 400;
    throw error;
  }

  // Re-run the send flow with the last user message
  return await send(conversationId, lastUserMessage.content, res);
};

/**
 * Auto-generates a conversation title based on the first user message.
 * Runs as a background task — errors are caught by the caller.
 *
 * @param {string} conversationId - The conversation ID.
 * @param {string} userMessage - The user's first message content.
 * @returns {Promise<void>}
 * @private
 */
const _autoGenerateTitle = async (conversationId, userMessage) => {
  const titlePrompt = promptService.buildPrompt({
    summary: null,
    recentMessages: [],
    currentMessage: {
      role: "user",
      content: `Generate a short, concise title (max 6 words) for a conversation that starts with this message: "${userMessage}". Reply with ONLY the title, no quotes, no extra text.`,
    },
  });

  const title = await aiService.generateResponse(titlePrompt);
  const cleanTitle = title.trim().replace(/^["']|["']$/g, "");

  await conversationService.rename(conversationId, cleanTitle);
};

module.exports = {
  send,
  sendNonStreaming,
  getMessages,
  deleteMessage,
  regenerate,
};
