# 📅 Slot Booking System - MERN Stack

A modern, stunning slot booking website with admin management capabilities. Features include real-time availability tracking, drag-and-drop date reordering, light/dark themes, and fully responsive design.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### User Features
- 📆 **Date Selection**: Browse available dates in an elegant sidebar
- 🕐 **Slot Viewing**: View 32 time slots (10 AM - 6 PM, 15-minute intervals)
- ✅ **Availability Status**: Color-coded slots showing available/booked status
- 🌓 **Light/Dark Mode**: Seamless theme switching with localStorage persistence
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices

### Admin Features
- 🔐 **Secure Login**: Session-based authentication
- ➕ **Date Management**: Create, edit, and delete dates
- 🎯 **Slot Control**: Click to toggle slot availability
- 🔄 **Drag & Drop**: Reorder dates with smooth animations
- ⚡ **Real-time Updates**: Changes reflect immediately

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **react-beautiful-dnd** - Drag and drop functionality
- **Vanilla CSS** - Custom design system with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **express-session** - Session management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Choose one option:
  - **Option 1**: Local MongoDB installation - [Download](https://www.mongodb.com/try/download/community)
  - **Option 2**: MongoDB Atlas (Cloud) - [Sign up](https://www.mongodb.com/cloud/atlas/register)

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to Project

```bash
cd e:\Code\Antigravity\project1
```

### Step 2: Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended for beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account
2. Create a new cluster (free tier available)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your database user password
7. Add `/slot-booking` at the end of the connection string

Example:
```
mongodb+srv://admin:mypassword@cluster0.abc123.mongodb.net/slot-booking
```

#### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically, or run `net start MongoDB`
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Your connection string will be: `mongodb://localhost:27017/slot-booking`

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The .env file is already created with default local MongoDB settings
# If using MongoDB Atlas, edit the .env file and update MONGODB_URI
# Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slot-booking
```

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install
```

## 🎮 Running the Application

You'll need **two terminal windows** - one for backend, one for frontend.

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
✅ Default admin created (username: admin, password: admin123)
🚀 Server running on http://localhost:5000
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/health

## 👤 Default Admin Credentials

```
Username: admin
Password: admin123
```

⚠️ **Important**: Change these credentials in production!

## 📱 Usage Guide

### For Users (Home Page)

1. Navigate to the home page
2. Select a date from the left sidebar (20% width)
3. View available time slots on the right (80% width)
4. Green slots are available, red slots are booked
5. Toggle between light/dark mode using the theme button in header

### For Admins (Admin Panel)

1. Click "Admin" in the header
2. Login with credentials (admin/admin123)
3. **Create Date**: Enter a date name and click "Create Date"
4. **Edit Date**: Click the "Edit" button, modify the name, and click "Save"
5. **Delete Date**: Click the "Delete" button (confirmation required)
6. **Toggle Slot**: Click any slot to change its availability
7. **Reorder Dates**: Drag the handle (⋮⋮) to reorder dates
8. **Logout**: Click "Logout" when done

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effects on header
- **Gradient Accents**: Vibrant HSL-based color gradients
- **Smooth Animations**: Micro-interactions on hover and click
- **Responsive Grid**: Adapts to all screen sizes
- **Custom Scrollbar**: Styled scrollbars matching the theme
- **Staggered Animations**: Elements animate in sequence for visual appeal

## 📁 Project Structure

```
project1/
├── backend/
│   ├── models/
│   │   ├── Admin.js          # Admin user model
│   │   └── Date.js           # Date & slots model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── dates.js          # Date/slot management routes
│   ├── middleware/
│   │   └── auth.js           # Auth middleware
│   ├── server.js             # Express server
│   ├── package.json
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx    # Navigation header
│   │   │   ├── DateList.jsx  # Date sidebar
│   │   │   └── SlotGrid.jsx  # Slot display grid
│   │   ├── pages/
│   │   │   ├── Home.jsx      # User-facing page
│   │   │   └── Admin.jsx     # Admin panel
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # Theme management
│   │   ├── services/
│   │   │   └── api.js        # API service layer
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
MONGODB_URI=mongodb://localhost:27017/slot-booking
PORT=5000
SESSION_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### Frontend Proxy Configuration

The frontend is configured to proxy API requests to the backend automatically. No additional configuration needed for development.

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:
- Ensure MongoDB service is running
- Check if the connection string in `.env` is correct
- For Atlas: Verify your IP is whitelisted in Network Access
- For Atlas: Ensure database user credentials are correct

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**: Change the PORT in `backend/.env` to another port (e.g., 5001)

### npm Not Recognized

**Error**: `npm is not recognized as an internal or external command`

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Dependencies Installation Failed

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 🚀 Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `SESSION_SECRET`
3. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2

### Frontend

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

### Environment Variables for Production

Update the frontend API base URL to point to your production backend URL.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check auth status

### Dates & Slots
- `GET /api/dates` - Get all dates (public)
- `POST /api/dates` - Create date (admin)
- `PUT /api/dates/:id` - Update date name (admin)
- `DELETE /api/dates/:id` - Delete date (admin)
- `PUT /api/dates/:id/slots/:slotId` - Toggle slot (admin)
- `PUT /api/dates/reorder/all` - Reorder dates (admin)

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed with user experience in mind
- Inspired by contemporary web design trends

---

**Need Help?** Open an issue or contact the development team.

**Enjoy your slot booking system! 🎉**
