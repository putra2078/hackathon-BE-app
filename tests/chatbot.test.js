require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const request = require('supertest');
const io = require('socket.io-client');
const http = require('http');
const app = require('../cmd/main'); // This should be the 'server' object
const { redisPub } = require('../internal/pkg/redis');
const conversationService = require('../internal/app/domain/chatbot/conversation.service');

let server;
let socketClient;
let testConversationId;
const port = 3002; // Use a different port for tests

jest.setTimeout(30000); // Set global timeout to 30s

const prisma = require('../internal/pkg/prisma');

beforeAll(async () => {
  console.log('beforeAll: Starting server...');
  server = http.createServer(app);
  // Store ioServer instance if possible for cleanup, otherwise proceed
  const ioServer = require('../internal/app/domain/chatbot/websocket').initSocket(server);
  await new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) return reject(err);
      console.log('beforeAll: Server started');
      resolve();
    });
  });

  // 1. Create a user for testing
  console.log('beforeAll: Creating test user...');
  try {
      await prisma.user.create({
          data: {
              id: 'test-user-id',
              name: 'Test User',
              email: 'test@example.com',
              password: 'password123'
          }
      });
      console.log('beforeAll: Test user created');
  } catch (err) {
      // User might already exist, ignore error or handle properly
      console.log('beforeAll: User likely exists, skipping creation');
  }

  // 2. Create a conversation for testing using service
  console.log('beforeAll: Creating test conversation...');
  try {
      const convo = await conversationService.create('test-user-id', 'Test Conversation');
      testConversationId = convo.id;
      console.log('beforeAll: Test conversation created:', testConversationId);
  } catch (err) {
      console.error('beforeAll: Failed to create conversation', err);
      throw err; // Stop tests if setup fails
  }
});

afterAll(async () => {
  console.log('afterAll: Shutting down...');
  if (socketClient) {
      socketClient.disconnect();
      console.log('afterAll: Socket disconnected');
  }
  
  // Clean up test data
  await prisma.message.deleteMany({ where: { conversation: { userId: 'test-user-id' } } });
  await prisma.conversation.deleteMany({ where: { userId: 'test-user-id' } });
  await prisma.user.delete({ where: { id: 'test-user-id' } });

  await new Promise((resolve) => server.close(resolve));
  await prisma.$disconnect();
  console.log('afterAll: Server and Prisma closed');
});

const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci1pZCIsImlhdCI6MTc4MzE4Mzc2OH0.CvFGiqQIFUdsMK2OqD8rn5qR_eyrkXE1RACH-cez3Oc';

jest.mock("../internal/app/domain/chatbot/ai.service", () => ({
  generateResponse: jest.fn().mockResolvedValue("Mocked AI reply"),
  generateStreamingResponse: jest.fn().mockResolvedValue(
    (async function* () {
      yield { text: "Mocked " };
      yield { text: "AI " };
      yield { text: "reply" };
    })()
  ),
}));

// ... (setup code)

describe('Chatbot API & WebSocket', () => {
  
  // 1. Pesan berhasil masuk
  it('1. should successfully send message via REST API (sync)', async () => {
    const res = await request(server)
      .post(`/api/v1/chatbot/conversations/${testConversationId}/messages/sync`)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ content: 'Hello AI' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  }, 10000);

  // 2. Pesan gagal masuk
  it('2. should return error if message is missing', async () => {
    const res = await request(server)
      .post(`/api/v1/chatbot/conversations/${testConversationId}/messages/sync`)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({});
    
    expect(res.statusCode).toBe(400);
  }, 10000);
// ...

  // 3. User berhasil terhubung ke websocket
  it('3. should connect to websocket and receive real-time message', (done) => {
    socketClient = io(`http://localhost:${port}`);
    let doneCalled = false;
    
    socketClient.on('connect', () => {
      expect(socketClient.connected).toBe(true);
      
      // Simulate backend broadcasting via Redis
      redisPub.publish('CHAT_CHANNEL', JSON.stringify({ message: 'Real-time AI response' }));
    });

    socketClient.on('message', (data) => {
      if (!doneCalled) {
        doneCalled = true;
        try {
          expect(data.message).toBe('Real-time AI response');
          done();
        } catch (error) {
          done(error);
        }
      }
    });
  }, 10000);

  // Note: Scenarios 4 & 5 (failed connection, internet issues) are hard to test 
  // reliably in a simple unit test environment without complex network mocking.
  // We can test basic timeout/connection error logic.
});
