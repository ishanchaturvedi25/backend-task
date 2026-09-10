const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/user.controller');
const { rateLimiter } = require('../middleware/rateLimiter.middleware');
const { authenticateUser } = require('../middleware/user.middleware');

router.get('/', authenticateUser, getUserProfile);
router.post('/sign-up', registerUser);
router.post('/login', rateLimiter, loginUser);

module.exports = router;