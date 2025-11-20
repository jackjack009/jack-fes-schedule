# 🚀 Quick Start Guide - Slot Booking System

## ⚠️ IMPORTANT: Node.js is Required

Node.js is not currently installed on your system. You need to install it before proceeding.

## Step 1: Install Node.js

### Download and Install Node.js

1. Visit: https://nodejs.org/
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer (.msi file)
4. Follow the installation wizard:
   - Accept the license agreement
   - Keep default installation path
   - **IMPORTANT**: Make sure "Add to PATH" is checked
   - Install all recommended tools
5. Restart your terminal/PowerShell after installation

### Verify Installation

Open a new PowerShell window and run:

```powershell
node --version
npm --version
```

You should see version numbers (e.g., v18.x.x or v20.x.x for Node, and 9.x.x or 10.x.x for npm).

---

## Step 2: Choose Your MongoDB Option

### Option A: MongoDB Atlas (Cloud - Recommended for Beginners)

**Advantages**: No local installation, free tier, accessible anywhere

1. **Sign Up**: Go to https://www.mongodb.com/cloud/atlas/register
2. **Create Account**: Use Google/GitHub or email
3. **Create Free Cluster**:
   - Choose "Shared" (Free tier)
   - Select a cloud provider (AWS recommended)
   - Choose a region close to you
   - Click "Create Cluster" (takes 3-5 minutes)

4. **Create Database User**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin`
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Whitelist Your IP**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

6. **Get Connection String**:
   - Go back to "Database" (Clusters)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password
   - Add `slot-booking` at the end

   **Final format**:
   ```
   mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/slot-booking
   ```

7. **Update Backend .env**:
   - Open `e:\Code\Antigravity\project1\backend\.env`
   - Replace the MONGODB_URI line with your connection string

### Option B: Local MongoDB Installation

**Advantages**: Works offline, faster for development

1. **Download**: https://www.mongodb.com/try/download/community
2. **Install**:
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (optional GUI tool)
3. **Verify**: MongoDB should start automatically
4. **Connection String**: Already configured in `.env` as:
   ```
   mongodb://localhost:27017/slot-booking
   ```

---

## Step 3: Install Project Dependencies

After Node.js is installed, open PowerShell in the project directory:

### Install Backend Dependencies

```powershell
cd e:\Code\Antigravity\project1\backend
npm install
```

Wait for installation to complete (may take 1-2 minutes).

### Install Frontend Dependencies

```powershell
cd e:\Code\Antigravity\project1\frontend
npm install
```

Wait for installation to complete (may take 2-3 minutes).

---

## Step 4: Start the Application

You need **TWO PowerShell windows**.

### PowerShell Window 1 - Backend Server

```powershell
cd e:\Code\Antigravity\project1\backend
npm run dev
```

**Expected Output**:
```
✅ Connected to MongoDB
✅ Default admin created (username: admin, password: admin123)
🚀 Server running on http://localhost:5000
```

**Leave this window running!**

### PowerShell Window 2 - Frontend Server

```powershell
cd e:\Code\Antigravity\project1\frontend
npm run dev
```

**Expected Output**:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Leave this window running!**

---

## Step 5: Access the Application

Open your web browser and go to:

**http://localhost:5173**

### Test the Application

1. **Home Page**: You should see the slot booking interface
2. **Admin Panel**: Click "Admin" in the header
3. **Login**: Use credentials:
   - Username: `admin`
   - Password: `admin123`
4. **Create a Date**: Try creating a new date
5. **Toggle Slots**: Click on slots to change availability
6. **Drag to Reorder**: Drag dates to reorder them
7. **Theme Toggle**: Click the sun/moon icon to switch themes

---

## 🎯 Quick Checklist

- [ ] Node.js installed (v18 or higher)
- [ ] MongoDB set up (Atlas or Local)
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Backend server running (http://localhost:5000)
- [ ] Frontend server running (http://localhost:5173)
- [ ] Application accessible in browser
- [ ] Admin login working
- [ ] Can create/edit/delete dates
- [ ] Can toggle slot availability
- [ ] Theme switching works

---

## 🐛 Common Issues

### "npm is not recognized"
- **Solution**: Restart PowerShell after installing Node.js
- If still not working, restart your computer

### "Cannot connect to MongoDB"
- **Atlas**: Check your connection string, password, and IP whitelist
- **Local**: Ensure MongoDB service is running

### Port 5000 or 5173 already in use
- **Solution**: Close other applications using these ports, or change ports in configuration

### Dependencies installation fails
- **Solution**: Run as Administrator, or try:
  ```powershell
  npm cache clean --force
  npm install
  ```

---

## 📚 Next Steps

Once everything is running:

1. Read the full `README.md` for detailed documentation
2. Explore the admin panel features
3. Test on different devices (mobile, tablet)
4. Try both light and dark themes
5. Create multiple dates and manage slots

---

## 🆘 Need Help?

If you encounter issues:

1. Check the error messages in both PowerShell windows
2. Verify all prerequisites are installed
3. Ensure both servers are running
4. Check the browser console for errors (F12)

---

**Ready to get started? Follow the steps above! 🚀**
