const messageService = require('../internal/app/domain/chatbot/message.service');
const conversationService = require('../internal/app/domain/chatbot/conversation.service');
const prisma = require('../internal/pkg/prisma');

describe('Message Service AI Integration', () => {
    let conversationId;

    beforeAll(async () => {
        // Setup a user and conversation
        const user = await prisma.user.create({
            data: { id: 'test-user-id-ai', name: 'AI Test', email: 'aitest@example.com', password: 'password' }
        });
        const convo = await conversationService.create(user.id, 'AI Test Convo');
        conversationId = convo.id;
    });

    afterAll(async () => {
        // Cleanup
        await prisma.message.deleteMany({ where: { conversation: { id: conversationId } } });
        await prisma.conversation.deleteMany({ where: { id: conversationId } });
        await prisma.user.delete({ where: { id: 'test-user-id-ai' } });
        await prisma.$disconnect();
    });

    it('should successfully trigger AI service and receive response', async () => {
        console.log('DEBUG: Testing message service orchestration');
        const content = 'Hello AI, please respond.';
        
        // Use non-streaming for simplicity in unit test
        const response = await messageService.sendNonStreaming(conversationId, content);
        
        console.log('DEBUG: Message service response:', response);
        expect(response).toBeDefined();
        expect(response.role).toBe('assistant');
        expect(response.content).toBeDefined();
    }, 20000); // 20s timeout
});
