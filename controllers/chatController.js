const Message = require('../models/Message');
const User = require('../models/User');


const getChatHistory = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                error: 'User ID is required'
            });
        }

        // Check if the target user exists
        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Prevent users from viewing their own chat history
        if (userId === currentUserId.toString()) {
            return res.status(400).json({
                error: 'Cannot retrieve chat history with yourself'
            });
        }

        // Fetch messages between current user and target user
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        })
            .populate('sender', 'username email')
            .populate('receiver', 'username email')
            .sort({ createdAt: 1 });

        res.json({
            messages,
            count: messages.length,
            chatWith: {
                id: targetUser._id,
                username: targetUser.username,
                email: targetUser.email
            }
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        // If response already sent, pass to error handler
        if (res.headersSent) {
            return next(error);
        }
        res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
};


const markMessagesAsRead = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                error: 'User ID is required'
            });
        }

        // Check if the target user exists
        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Update unread messages
        const result = await Message.updateMany(
            {
                sender: userId,
                receiver: currentUserId,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        res.json({
            message: 'Messages marked as read',
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Mark messages as read error:', error);
        // If response already sent, pass to error handler
        if (res.headersSent) {
            return next(error);
        }
        res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
};


const getUnreadCount = async (req, res, next) => {
    try {
        const count = await Message.countDocuments({
            receiver: req.user._id,
            isRead: false
        });

        res.json({
            count,
            hasUnread: count > 0
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        // If response already sent, pass to error handler
        if (res.headersSent) {
            return next(error);
        }
        res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
};

module.exports = {
    getChatHistory,
    markMessagesAsRead,
    getUnreadCount
};

