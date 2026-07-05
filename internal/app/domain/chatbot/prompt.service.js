/**
 * Prompt Service
 * Builds prompts for the AI model.
 */

const buildPrompt = ({ summary, recentMessages, currentMessage }) => {
  let prompt = "You are a helpful assistant.\n\n";
  
  if (summary) {
    prompt += `Conversation Summary: ${summary.summary}\n\n`;
  }
  
  recentMessages.forEach(msg => {
    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
  });
  
  prompt += `User: ${currentMessage.content}\n`;
  prompt += "Assistant:";
  
  return prompt;
};

module.exports = { buildPrompt };
