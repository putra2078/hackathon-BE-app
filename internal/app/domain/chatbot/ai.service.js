/**
 * AI Service
 * Calls the AI provider API.
 */
require("dotenv").config();
const apiKey = process.env.AI_API_KEY;

// Placeholder for AI API call
const generateResponse = async (prompt) => {
  console.log(`DEBUG: Calling AI API with key: ${apiKey ? '***' : 'MISSING'}`);
  // Implementation using apiKey would go here
  return "This is a placeholder AI response using the configured API key.";
};

const generateStreamingResponse = async (prompt) => {
  console.log(`DEBUG: Calling AI Streaming API with key: ${apiKey ? '***' : 'MISSING'}`);
  // Return an async iterable for streaming
  return (async function* () {
    yield { text: "This " };
    yield { text: "is " };
    yield { text: "a " };
    yield { text: "streaming " };
    yield { text: "response." };
  })();
};

module.exports = { generateResponse, generateStreamingResponse };
