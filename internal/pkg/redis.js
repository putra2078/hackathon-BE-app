const Redis = require('ioredis');

const redisPub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const redisSub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

module.exports = { redisPub, redisSub };
