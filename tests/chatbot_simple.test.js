const request = require('supertest');
const app = require('../cmd/main');

describe('Chatbot REST API', () => {
  
  it('should successfully send message via POST /api/v1/chatbot/send', async () => {
    const res = await request(app)
      .post('/api/v1/chatbot/send')
      .send({ message: 'Hello AI' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Message sent');
  });

  it('should return 400 error if message is missing', async () => {
    const res = await request(app)
      .post('/api/v1/chatbot/send')
      .send({});
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Message is required');
  });
});
