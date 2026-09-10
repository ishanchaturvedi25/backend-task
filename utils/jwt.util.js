const jwt = require('jsonwebtoken');

function generateToken(payload) {
    const secretKey = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secretKey, options);
}

function verifyToken(token) {
    const secretKey = process.env.JWT_SECRET;
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

module.exports = { generateToken, verifyToken };