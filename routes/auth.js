const express = require('express');
const authMiddleware = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current authenticated user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Get all users (excluding current user)
router.get('/users', authMiddleware, authController.getAllUsers);

module.exports = router;
