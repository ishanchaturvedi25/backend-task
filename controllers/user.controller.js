const userService = require('../services/user.service');
const { generateToken } = require('../utils/jwt.util');

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if ([name, email, password].some((value) => typeof value !== 'string' || !value.trim())) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const user = await userService.registerUser({ name: name.trim(), email: email.trim().toLowerCase(), password });

    if (!user) {
      return res.status(400).json({ error: 'User registration failed' });
    }

      const { password: passwordHash, ...publicUser } = user;
      const token = generateToken({ id: user.id, email: user.email });
      res.cookie('token', token, {
        httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
      res.status(201).json(publicUser);
  } catch (error) {
    console.error('Error registering user:', error);
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'A user with that email already exists' });
      }
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body || {};
        if ([email, password].some((value) => typeof value !== 'string' || !value.trim())) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await userService.loginUser({ email: email.trim().toLowerCase(), password });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

          const { password: passwordHash, ...publicUser } = user;
          const token = generateToken({ id: user.id, email: user.email });
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json(publicUser);
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await userService.getUserProfile(userId);
        const publicUser = { ...user };
        delete publicUser.password;
        res.status(200).json(publicUser);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { registerUser, loginUser, getUserProfile };