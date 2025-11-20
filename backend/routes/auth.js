import express from 'express';
import Admin from '../models/Admin.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set session
        req.session.adminId = admin._id;
        req.session.username = admin.username;

        res.json({
            message: 'Login successful',
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not logout' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Check authentication status
router.get('/check', (req, res) => {
    if (req.session && req.session.adminId) {
        res.json({
            authenticated: true,
            admin: {
                id: req.session.adminId,
                username: req.session.username
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

export default router;
