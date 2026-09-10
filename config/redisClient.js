const redis = require('redis');
const client = redis.createClient({
    url: process.env.REDIS_URL,
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

async function connectRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}

module.exports = { client, connectRedis };