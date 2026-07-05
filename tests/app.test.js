const request = require('supertest');
const app = require('../cmd/main');

describe('GET /', () => {
  it('should return 200 and success message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hackathon Backend API');
  });
});

describe('GET /health', () => {
  it('should return 200 and server running message', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Server is running');
  });
});
