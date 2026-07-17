import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dateRoutes from './routes/dates.js';
import { syncGoogleSheets } from './services/sheetSync.js';
import Admin from './models/Admin.js';
import dns from 'dns';

// Fix Node.js DNS resolution bug on Windows where it incorrectly defaults to 127.0.0.1
try {
    const dnsServers = dns.getServers();
    if (dnsServers.length === 1 && dnsServers[0] === '127.0.0.1') {
        dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    }
} catch (e) {
    console.warn('Failed to set custom DNS servers:', e.message);
}

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
        'https://www.jackjack.cc',
        'https://jackjack.cc'
    ],
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'slot-booking-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'lax' for localhost
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
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            console.error('❌ FATAL ERROR: ADMIN_USERNAME or ADMIN_PASSWORD is not defined in environment variables.');
            process.exit(1);
        }

        const existingAdmin = await Admin.findOne({ username: adminUsername });
        if (existingAdmin) {
            existingAdmin.password = adminPassword;
            await existingAdmin.save();
            console.log(`✅ Admin password updated from env (username: ${adminUsername})`);
        } else {
            const defaultAdmin = new Admin({
                username: adminUsername,
                password: adminPassword
            });
            await defaultAdmin.save();
            console.log(`✅ Default admin created (username: ${adminUsername})`);
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            
            // Run initial sync after a short delay (5 seconds) to allow the app to fully load
            setTimeout(() => {
                syncGoogleSheets().catch(err => {
                    console.error('❌ Initial Google Sheets sync failed:', err);
                });
            }, 5000);

            // Set up background sync interval (every 5 minutes)
            setInterval(() => {
                syncGoogleSheets().catch(err => {
                    console.error('❌ Background Google Sheets sync failed:', err);
                });
            }, 5 * 60 * 1000);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

startServer();
