/**
 * Streaming Service
 * Handles SSE streaming.
 */

const streamToSSE = async (stream, res) => {
  let fullResponseText = "";
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  for await (const chunk of stream) {
    const text = chunk.text || chunk.content || "";
    fullResponseText += text;
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  }
  
  res.write('data: [DONE]\n\n');
  res.end();
  
  return fullResponseText;
};

module.exports = { streamToSSE };
