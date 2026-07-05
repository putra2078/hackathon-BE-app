/**
 * History Service
 * Manages conversation history and context retrieval for AI chatbot.
 */

const messageRepository = require("./message.repository");
const summaryRepository = require("./summary.repository");

/**
 * Saves a message to the conversation history.
 * @param {Object} data - { conversationId, role, content }
 * @returns {Promise<Object>}
 */
const saveMessage = async (data) => {
  return await messageRepository.save(data);
};

/**
 * Retrieves conversation context including summary and recent messages.
 * @param {string} conversationId 
 * @returns {Promise<Object>} - { summary, messages }
 */
const getContext = async (conversationId) => {
  const messages = await messageRepository.findRecent(conversationId, 20); // Get last 20 messages
  const summary = await summaryRepository.findByConversation(conversationId);
  
  return {
    summary: summary || null,
    messages
  };
};

module.exports = {
  saveMessage,
  getContext,
};
