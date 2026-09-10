const { client: redisClient } = require('../config/redisClient');

async function rateLimiter(req, res, next) {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;

    try {
        const record = await redisClient.get(key);
        if (record) {
            const { count, timestamp } = JSON.parse(record);
            if (Date.now() - timestamp < 60000) {
                if (count >= 5) {
                    return res.status(429).json({ error: 'Too many requests' });
                }
                await redisClient.set(key, JSON.stringify({ count: count + 1, timestamp }), { EX: 60 });
            } else {
                await redisClient.set(key, JSON.stringify({ count: 1, timestamp: Date.now() }), { EX: 60 });
            }
        } else {
            await redisClient.set(key, JSON.stringify({ count: 1, timestamp: Date.now() }), { EX: 60 });
        }
        next();
    } catch (error) {
        console.error('Redis error:', error);
        // Fail open: if Redis is unavailable, allow requests rather than blocking
        next();
    }
}

module.exports = { rateLimiter };