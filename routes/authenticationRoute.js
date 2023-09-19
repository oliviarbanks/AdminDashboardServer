const router = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env
const User = require('../models/User'); // Import your User model

// Secret key for JWT
const secretKey = process.env.JWT_SECRET || 'your-default-secret-key';

// Registration route
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const id = await User.create(username, password, email);
    res.status(201).json({ message: 'User registered', userId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.getByUsername(username);

    if (user && await user.verifyPassword(password)) {
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Token validation route
router.post('/validate-token', (req, res) => {
  const token = req.body.token;

  try {
    const decodedToken = jwt.verify(token, secretKey);

    if (decodedToken.userId) {
      res.status(200).json({ valid: true });
    } else {
      res.status(401).json({ valid: false });
    }
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
