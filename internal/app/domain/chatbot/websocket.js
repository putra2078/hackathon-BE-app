const { Server } = require('socket.io');
const { redisSub } = require('../../../pkg/redis');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Subscribe to Redis
  redisSub.subscribe('CHAT_CHANNEL');
  redisSub.on('message', (channel, message) => {
    if (channel === 'CHAT_CHANNEL') {
      io.emit('message', JSON.parse(message));
    }
  });
};

module.exports = { initSocket };
