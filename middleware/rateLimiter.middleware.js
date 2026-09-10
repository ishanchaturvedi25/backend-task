const { client: redisClient } = require('../config/redisClient');

async function rateLimiter(req, res, next) {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;

    if (!redisClient.isReady || !redisClient.isOpen) {
        return next();
    }

    try {
        const count = await redisClient.incr(key);
        if (count === 1) {
            await redisClient.expire(key, 60);
        }

        if (count > 5) {
            const ttl = await redisClient.ttl(key);
            res.set('Retry-After', String(Math.max(ttl, 1)));
            return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
        }

        next();
    } catch (error) {
        console.error('Redis error:', error);
        next();
    }
}

module.exports = { rateLimiter };