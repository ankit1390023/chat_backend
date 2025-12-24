const express = require('express');
const authMiddleware = require('../middleware/auth');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Get chat history with a specific user
router.get('/history/:userId', authMiddleware, chatController.getChatHistory);

// Mark messages as read from a specific user
router.put('/read/:userId', authMiddleware, chatController.markMessagesAsRead);

// Get unread message count for current user
router.get('/unread/count', authMiddleware, chatController.getUnreadCount);

module.exports = router;