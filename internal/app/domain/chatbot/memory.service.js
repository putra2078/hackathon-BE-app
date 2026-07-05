/**
 * Memory Service
 * Handles conversation memory and summarization.
 */

const summaryRepository = require("./summary.repository");

const shouldSummarize = (messages) => {
  // Simple logic: summarize every 10 messages
  return messages.length > 0 && messages.length % 10 === 0;
};

const generateSummary = async (conversationId) => {
  // Placeholder for summarization logic
  return await summaryRepository.create({
    conversationId,
    summary: "This is a placeholder summary.",
  });
};

module.exports = { shouldSummarize, generateSummary };
