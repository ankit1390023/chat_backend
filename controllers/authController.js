const jwt = require('jsonwebtoken');
const User = require('../models/User');


const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Username, email, and password are required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User with this email or username already exists'
            });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        // If response already sent, pass to error handler
        if (res.headersSent) {
            return next(error);
        }
        res.status(500).json({
            error: error.message || 'Internal server error during registration'
        });
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        // If response already sent, pass to error handler
        if (res.headersSent) {
            return next(error);
        }
        res.status(500).json({
            error: error.message || 'Internal server error during login'
        });
    }
};


const getCurrentUser = async (req, res, next) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                isOnline: req.user.isOnline,
                lastSeen: req.user.lastSeen
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        // If response already sent, pass to error handler
        if (res.headersSent) {
            return next(error);
        }
        res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
};


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('username email isOnline lastSeen')
            .sort({ username: 1 });

        res.json({
            users,
            count: users.length
        });
    } catch (error) {
        console.error('Get all users error:', error);
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
    register,
    login,
    getCurrentUser,
    getAllUsers
};

