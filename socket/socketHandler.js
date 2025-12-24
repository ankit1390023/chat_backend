const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

// Store active connections
const activeUsers = new Map();

const socketHandler = (io) => {
    // Socket authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.userId = user._id.toString();
            socket.username = user.username;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.username} (${socket.userId})`);

        // Update user status to online
        await User.findByIdAndUpdate(socket.userId, {
            isOnline: true,
            socketId: socket.id,
            lastSeen: new Date()
        });

        // Store active user
        activeUsers.set(socket.userId, socket.id);

        // Broadcast online status to all users
        io.emit('user_status', {
            userId: socket.userId,
            username: socket.username,
            isOnline: true
        });

        // Send active users to the connected user
        const onlineUsers = Array.from(activeUsers.keys());
        socket.emit('online_users', onlineUsers);

        // Handle private message
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, content } = data;

                // Save message to database
                const message = new Message({
                    sender: socket.userId,
                    receiver: receiverId,
                    content
                });
                await message.save();

                // Populate sender info
                await message.populate('sender', 'username email');
                await message.populate('receiver', 'username email');

                // Send to receiver if online
                const receiverSocketId = activeUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receive_message', {
                        messageId: message._id,
                        sender: {
                            id: message.sender._id,
                            username: message.sender.username,
                            email: message.sender.email
                        },
                        receiver: {
                            id: message.receiver._id,
                            username: message.receiver.username,
                            email: message.receiver.email
                        },
                        content: message.content,
                        isRead: message.isRead,
                        createdAt: message.createdAt
                    });
                }

                // Confirm to sender
                socket.emit('message_sent', {
                    messageId: message._id,
                    receiver: {
                        id: message.receiver._id,
                        username: message.receiver.username,
                        email: message.receiver.email
                    },
                    content: message.content,
                    createdAt: message.createdAt,
                    delivered: !!receiverSocketId
                });

            } catch (error) {
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle typing indicator
        socket.on('typing', (data) => {
            const { receiverId, isTyping } = data;
            const receiverSocketId = activeUsers.get(receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('user_typing', {
                    userId: socket.userId,
                    username: socket.username,
                    isTyping
                });
            }
        });

        // Handle message read receipt
        socket.on('message_read', async (data) => {
            try {
                const { messageId } = data;

                const message = await Message.findByIdAndUpdate(
                    messageId,
                    { isRead: true, readAt: new Date() },
                    { new: true }
                );

                if (message) {
                    const senderSocketId = activeUsers.get(message.sender.toString());
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('message_read_receipt', {
                            messageId: message._id,
                            readAt: message.readAt
                        });
                    }
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.username} (${socket.userId})`);

            // Update user status to offline
            await User.findByIdAndUpdate(socket.userId, {
                isOnline: false,
                socketId: null,
                lastSeen: new Date()
            });

            // Remove from active users
            activeUsers.delete(socket.userId);

            // Broadcast offline status
            io.emit('user_status', {
                userId: socket.userId,
                username: socket.username,
                isOnline: false,
                lastSeen: new Date()
            });
        });
    });
};

module.exports = socketHandler;