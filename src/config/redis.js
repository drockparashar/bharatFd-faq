// config/redis.js
const Redis = require('ioredis');

// Initialize Redis client
const redis = new Redis({
  host: 'localhost', // Replace with your Redis server host
  port: 6379, // Replace with your Redis server port if different
});

module.exports = redis;
