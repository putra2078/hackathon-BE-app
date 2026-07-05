/**
 * Conversation Service
 * Business logic layer for managing chatbot conversations.
 * Handles creation, retrieval, renaming, and deletion of conversations.
 */

const conversationRepository = require("./conversation.repository");

/**
 * Creates a new conversation for a user.
 * @param {string} userId - The ID of the user creating the conversation.
 * @param {string} [title] - Optional title for the conversation. Defaults to 'New Conversation'.
 * @returns {Promise<Object>} The newly created conversation object.
 */
const create = async (userId, title) => {
  const conversationTitle = title || "New Conversation";
  const conversation = await conversationRepository.create({
    userId,
    title: conversationTitle,
  });
  return conversation;
};

/**
 * Finds a conversation by its ID.
 * @param {string} id - The conversation ID.
 * @returns {Promise<Object>} The conversation object.
 * @throws {Error} 404 error if conversation is not found.
 */
const findById = async (id) => {
  const conversation = await conversationRepository.findById(id);
  if (!conversation) {
    const error = new Error("Conversation not found");
    error.statusCode = 404;
    throw error;
  }
  return conversation;
};

/**
 * Retrieves all conversations belonging to a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} Array of conversation objects.
 */
const findAllByUser = async (userId) => {
  const conversations = await conversationRepository.findByUserId(userId);
  return conversations;
};

/**
 * Renames a conversation by updating its title.
 * @param {string} id - The conversation ID.
 * @param {string} title - The new title for the conversation.
 * @returns {Promise<Object>} The updated conversation object.
 */
const rename = async (id, title) => {
  const updated = await conversationRepository.update(id, { title });
  return updated;
};

/**
 * Removes a conversation by ID.
 * Verifies the conversation exists before attempting deletion.
 * @param {string} id - The conversation ID.
 * @returns {Promise<Object>} The deletion result.
 * @throws {Error} 404 error if conversation is not found.
 */
const remove = async (id) => {
  const conversation = await conversationRepository.findById(id);
  if (!conversation) {
    const error = new Error("Conversation not found");
    error.statusCode = 404;
    throw error;
  }
  return await conversationRepository.remove(id);
};

module.exports = {
  create,
  findById,
  findAllByUser,
  rename,
  remove,
};
