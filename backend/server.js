import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dateRoutes from './routes/dates.js';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy is required for cookies to work on Render/Heroku
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://jack-fes-schedule.vercel.app',
        'https://www.jackjack.cc/'
    ],
    credentials: true
})); 
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'slot-booking-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Always true for cross-site (Render is HTTPS)
        sameSite: 'none', // Required for cross-site cookies
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    })); 

            // Routes
            app.use('/api/auth', authRoutes);
app.use('/api/dates', dateRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Database connection and server start
const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // DELETE OLD ADMIN IF EXISTS
               await Admin.deleteOne({ username: 'admin' });
        console.log('🗑️ Removed old "admin" user if existed');

        // Check if default admin exists
        const adminExists = await Admin.findOne({ username: 'jackjack' });
        if (!adminExists) {
            const defaultAdmin = new Admin({
                username: 'jackjack',
                password: 'jackjack00900'
            });
            await defaultAdmin.save();
            console.log('✅ Default admin created (username: jackjack, password: jackjack00900)');
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

startServer();
