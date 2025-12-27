# 🔒 Security Setup Guide

## ⚠️ IMPORTANT: Admin Credentials Security

Your admin credentials are now stored in environment variables instead of being hardcoded. This prevents them from being exposed in your GitHub repository.

## Setup Instructions

### 1. Create Backend .env File

In the `backend/` directory, create a `.env` file (it's already in `.gitignore`):

```bash
cd backend
cp .env.example .env
```

### 2. Update Your Credentials

Edit `backend/.env` and change these values:

```env
# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=your_chosen_username
ADMIN_PASSWORD=your_secure_password
```

**⚠️ Use a strong password!** Don't use the default values.

### 3. Update MongoDB URI

Also update your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 4. Restart Backend Server

After updating `.env`, restart your backend:

```bash
npm start
```

## Production Deployment (Render)

When deploying to Render, add these environment variables in the Render dashboard:

1. Go to your Render service
2. Click "Environment" tab
3. Add these variables:
   - `ADMIN_USERNAME` = your username
   - `ADMIN_PASSWORD` = your password
   - `MONGODB_URI` = your MongoDB connection string
   - `SESSION_SECRET` = a random secret key
   - `NODE_ENV` = production

## ✅ What's Protected Now

- ✅ Admin credentials are in `.env` (not tracked by Git)
- ✅ `.env` is in `.gitignore`
- ✅ Only `.env.example` (without real credentials) is in Git
- ✅ Production uses Render environment variables

## 🚨 If You Already Pushed Credentials to GitHub

If you already committed the hardcoded credentials to GitHub:

1. **Change your password immediately** in the `.env` file
2. Delete the old admin user from MongoDB
3. Consider the old credentials compromised
4. Optionally: Remove sensitive commits from Git history (advanced)

## Best Practices

- ✅ Never commit `.env` files
- ✅ Use strong, unique passwords
- ✅ Rotate credentials periodically
- ✅ Use different credentials for development and production
- ✅ Keep `.env.example` updated (without real values)
