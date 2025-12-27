# 🚀 Deployment Guide - Vercel + Render + Custom Domain

## 📋 Security Audit Summary

### ✅ Security Status: GOOD (with action items below)

**What's Protected:**
- ✅ Admin credentials moved to environment variables
- ✅ `.env` files in `.gitignore`
- ✅ Passwords hashed with bcrypt
- ✅ Session secrets configurable
- ✅ CORS properly configured for custom domain
- ✅ HTTP-only cookies enabled
- ✅ Secure cookies in production

**⚠️ Action Items:**
1. Update backend `.env` with strong credentials
2. Set environment variables in Render
3. Set environment variables in Vercel
4. Update Google Drive API key restrictions

---

## 🌐 Deployment Architecture

```
User (jackjack.cc)
    ↓
Vercel (Frontend - React)
    ↓
Render (Backend - Node.js/Express)
    ↓
MongoDB Atlas (Database)
```

---

## 📦 Part 1: Backend Deployment (Render)

### Step 1: Prepare Backend

Your backend is already configured! CORS includes:
- `https://www.jackjack.cc`
- `https://jackjack.cc`

### Step 2: Deploy to Render

1. **Create New Web Service:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder

2. **Configure Build Settings:**
   ```
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables:**
   Click "Environment" and add:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   SESSION_SECRET=your_random_secret_key_minimum_32_characters
   ADMIN_USERNAME=your_secure_username
   ADMIN_PASSWORD=your_secure_password
   PORT=5000
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy your Render URL (e.g., `https://your-app.onrender.com`)

### Step 3: Update MongoDB Atlas

1. Go to MongoDB Atlas
2. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
   - Or add Render's IP addresses for better security

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Set Environment Variables in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:

```
VITE_API_URL=https://your-app.onrender.com/api
VITE_GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
```

**Important:** Replace `your-app.onrender.com` with your actual Render URL!

### Step 2: Deploy

Vercel auto-deploys from GitHub. Just push your code:

```bash
git add .
git commit -m "Production ready"
git push origin main
```

### Step 3: Configure Custom Domain (jackjack.cc)

1. **In Vercel:**
   - Go to Settings → Domains
   - Add domain: `jackjack.cc`
   - Add domain: `www.jackjack.cc`
   - Vercel will show you DNS records

2. **In Your Domain Registrar:**
   Add these DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP)

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation** (5-30 minutes)

---

## 🔧 Part 3: Final Configuration

### Update Google Drive API Key Restrictions

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Edit your API key
4. Application restrictions → HTTP referrers
5. Add these URLs:
   ```
   https://jackjack.cc/*
   https://www.jackjack.cc/*
   https://*.vercel.app/*
   http://localhost:5173/*
   ```

### Test Your Deployment

1. **Test Frontend:**
   - Visit `https://jackjack.cc`
   - Should load without errors

2. **Test Backend Connection:**
   - Go to Calendar page
   - Should load dates from backend

3. **Test Admin Login:**
   - Go to `/admin`
   - Login with your credentials
   - Should authenticate successfully

4. **Test Google Drive:**
   - Go to Samples pages
   - Images should load from Google Drive

---

## 📝 Environment Variables Checklist

### Backend (Render)
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI=mongodb+srv://...`
- [ ] `SESSION_SECRET=random_32_char_string`
- [ ] `ADMIN_USERNAME=your_username`
- [ ] `ADMIN_PASSWORD=your_password`
- [ ] `PORT=5000`

### Frontend (Vercel)
- [ ] `VITE_API_URL=https://your-app.onrender.com/api`
- [ ] `VITE_GOOGLE_DRIVE_API_KEY=your_api_key`

---

## 🔒 Security Best Practices

### ✅ Already Implemented
- Session-based authentication
- Password hashing with bcrypt
- HTTP-only cookies
- CORS restrictions
- Environment variable usage

### 🎯 Recommended Additional Security

1. **Rate Limiting** (Optional but recommended):
   ```bash
   npm install express-rate-limit
   ```

2. **Helmet.js** (Security headers):
   ```bash
   npm install helmet
   ```

3. **Strong Session Secret:**
   Generate a random 32+ character string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch dates"
- **Check:** Backend URL in Vercel environment variables
- **Check:** CORS settings include your domain
- **Check:** Render service is running

### Issue: "Google Drive images not loading"
- **Check:** API key is set in Vercel
- **Check:** API key restrictions include your domain
- **Check:** Google Drive folders are public

### Issue: "Admin login not working"
- **Check:** Credentials set in Render environment variables
- **Check:** MongoDB connection is working
- **Check:** Cookies are enabled in browser

### Issue: "Custom domain not working"
- **Check:** DNS records are correct
- **Check:** Wait for DNS propagation (up to 48 hours)
- **Check:** SSL certificate is active in Vercel

---

## 📊 Monitoring

### Render Dashboard
- View logs: Logs tab
- Check metrics: Metrics tab
- Monitor uptime: Events tab

### Vercel Dashboard
- View deployments: Deployments tab
- Check analytics: Analytics tab
- Monitor errors: Logs tab

---

## 🔄 Updating Your Site

### Frontend Changes
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel auto-deploys!

### Backend Changes
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render auto-deploys!

---

## ✅ Pre-Deployment Checklist

- [ ] Backend `.env` has strong credentials
- [ ] MongoDB Atlas allows Render IP
- [ ] Render environment variables set
- [ ] Vercel environment variables set
- [ ] Google Drive API key restrictions updated
- [ ] Custom domain DNS configured
- [ ] Test all features locally first
- [ ] `.env` files NOT committed to Git
- [ ] All sensitive data in environment variables

---

## 🎉 You're Ready!

Your site will be live at:
- **Primary:** https://jackjack.cc
- **WWW:** https://www.jackjack.cc
- **Vercel:** https://your-project.vercel.app

Need help? Check the troubleshooting section or Render/Vercel documentation.
