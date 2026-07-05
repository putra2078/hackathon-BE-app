/**
 * Chatbot Handler
 * HTTP request handler layer for the chatbot domain.
 * Responsible for parsing requests, delegating to services, and sending responses.
 * Contains no business logic — all logic lives in the service layer.
 */

const conversationService = require("./conversation.service");
const messageService = require("./message.service");

/**
 * Creates a new conversation for the authenticated user.
 * POST /conversations
 * @param {Object} req - Express request. Body: { title?: string }
 * @param {Object} res - Express response.
 */
const createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await conversationService.create(req.user.id, title);
    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: conversation,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieves all conversations for the authenticated user.
 * GET /conversations
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 */
const getConversations = async (req, res) => {
  try {
    const conversations = await conversationService.findAllByUser(req.user.id);
    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieves a single conversation by ID.
 * GET /conversations/:id
 * @param {Object} req - Express request. Params: { id: string }
 * @param {Object} res - Express response.
 */
const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await conversationService.findById(id);
    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Renames a conversation.
 * PATCH /conversations/:id
 * @param {Object} req - Express request. Params: { id: string }, Body: { title: string }
 * @param {Object} res - Express response.
 */
const renameConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const conversation = await conversationService.rename(id, title);
    return res.status(200).json({
      success: true,
      message: "Conversation renamed successfully",
      data: conversation,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Deletes a conversation.
 * DELETE /conversations/:id
 * @param {Object} req - Express request. Params: { id: string }
 * @param {Object} res - Express response.
 */
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    await conversationService.remove(id);
    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieves all messages for a conversation.
 * GET /conversations/:conversationId/messages
 * @param {Object} req - Express request. Params: { conversationId: string }
 * @param {Object} res - Express response.
 */
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await messageService.getMessages(conversationId);
    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Sends a message in a conversation and streams the AI response via SSE.
 * POST /conversations/:conversationId/messages
 * Note: This handler does NOT send a JSON response — streaming handles the response.
 * @param {Object} req - Express request. Params: { conversationId: string }, Body: { content: string }
 * @param {Object} res - Express response (used for SSE streaming).
 */
const sendMessage = async (req, res) => {
  console.log('DEBUG: sendMessage handler called');
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    console.log(`DEBUG: conversationId: ${conversationId}, content: ${content}`);

    if (!content) {
      console.log('DEBUG: Content missing');
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Delegate to messageService.send() — streaming handles the response via res
    console.log('DEBUG: Delegating to messageService.send()');
    await messageService.send(conversationId, content, res);
    console.log('DEBUG: messageService.send() finished');
  } catch (error) {
    console.error('DEBUG: sendMessage handler error:', error);
    // Only send error response if headers haven't been sent (streaming may have started)
    if (!res.headersSent) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

/**
 * Sends a message and returns the AI response as JSON (non-streaming).
 * POST /conversations/:conversationId/messages/sync
 * @param {Object} req - Express request. Params: { conversationId: string }, Body: { content: string }
 * @param {Object} res - Express response.
 */
const sendMessageNonStreaming = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const response = await messageService.sendNonStreaming(
      conversationId,
      content
    );
    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Deletes a message by ID.
 * DELETE /messages/:id
 * @param {Object} req - Express request. Params: { id: string }
 * @param {Object} res - Express response.
 */
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await messageService.deleteMessage(id);
    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Regenerates an AI response for a specific message in a conversation.
 * Deletes the target assistant message and all subsequent messages,
 * then re-runs the chat flow with the last user message.
 * POST /conversations/:conversationId/messages/:messageId/regenerate
 * @param {Object} req - Express request. Params: { conversationId: string, messageId: string }
 * @param {Object} res - Express response (used for SSE streaming).
 */
const regenerateMessage = async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;
    await messageService.regenerate(conversationId, messageId, res);
  } catch (error) {
    if (!res.headersSent) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  getMessages,
  sendMessage,
  sendMessageNonStreaming,
  deleteMessage,
  regenerateMessage,
};
