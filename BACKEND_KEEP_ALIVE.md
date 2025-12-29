# 🔥 Backend Keep-Alive System

## Overview

This system prevents your Render.com free tier backend from going to sleep, ensuring fast response times for users.

---

## 🎯 How It Works

### **Hybrid Approach:**

1. **UptimeRobot (External):**
   - Pings backend every 5 minutes
   - Works 24/7, even when no users are on the site
   - URL: `https://jack-schedule-api.onrender.com/api/health`

2. **Frontend Polling (Internal):**
   - Pings backend every 10 minutes while users browse
   - Sends initial ping 30 seconds after page load
   - Automatically stops when user leaves

---

## 📊 Ping Schedule

```
Time    | UptimeRobot | Frontend | Backend Status
--------|-------------|----------|---------------
0:00    | ✅ Ping     | -        | ✅ Awake
0:05    | ✅ Ping     | -        | ✅ Awake
0:10    | ✅ Ping     | ✅ Ping  | ✅ Awake
0:15    | ✅ Ping     | -        | ✅ Awake
0:20    | ✅ Ping     | ✅ Ping  | ✅ Awake
```

**Result:** Backend never sleeps! ⚡

---

## 🔧 Implementation Details

### **Frontend (DataContext.jsx)**

```javascript
// Keep-alive interval: 10 minutes
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000;

// Pings: https://jack-schedule-api.onrender.com/api/health
// Timing:
// - Initial ping: 30 seconds after page load
// - Recurring pings: Every 10 minutes
```

### **Backend (server.js)**

```javascript
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
```

---

## ✅ Benefits

1. **No Cold Starts:**
   - Backend stays warm 24/7
   - Users get instant responses

2. **Zero Cost:**
   - UptimeRobot free tier
   - Frontend polling is built-in

3. **Redundancy:**
   - If one method fails, the other keeps it alive
   - UptimeRobot works even when site has no visitors

4. **Smart Timing:**
   - 10-minute intervals prevent excessive API calls
   - Stays well within Render's free tier limits

---

## 📈 Monitoring

### **Check UptimeRobot Dashboard:**
- Monitor uptime percentage
- View response times
- Get alerts if backend goes down

### **Check Browser Console:**
You'll see logs like:
```
✅ Initial keep-alive ping sent
✅ Backend keep-alive ping sent
```

If you see:
```
⚠️ Keep-alive ping failed (backend may be sleeping)
```
This means the backend is waking up (30-60 seconds).

---

## 🎛️ Configuration

### **Change Ping Interval:**

Edit `frontend/src/context/DataContext.jsx`:

```javascript
// Current: 10 minutes
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000;

// Change to 5 minutes:
const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000;

// Change to 15 minutes:
const KEEP_ALIVE_INTERVAL = 15 * 60 * 1000;
```

**Recommendation:** Keep at 10 minutes for optimal balance.

---

## 🚨 Troubleshooting

### **Backend Still Sleeping?**

1. **Check UptimeRobot:**
   - Is it active?
   - Is the URL correct?
   - Check monitoring interval (should be 5 minutes)

2. **Check Frontend:**
   - Open browser console
   - Look for keep-alive logs
   - Verify `VITE_API_URL` is set correctly in Vercel

3. **Check Render:**
   - View logs in Render dashboard
   - Look for health check requests
   - Verify service is running

### **Too Many Requests?**

If you're hitting rate limits:
- Increase `KEEP_ALIVE_INTERVAL` to 15 minutes
- Adjust UptimeRobot to 10-minute intervals

---

## 📊 Expected Behavior

### **User Visits Site:**
1. Page loads
2. After 30 seconds: Initial ping sent
3. Every 10 minutes: Keep-alive ping sent
4. User leaves: Pinging stops

### **No Users on Site:**
1. UptimeRobot pings every 5 minutes
2. Backend stays awake
3. Ready for next user instantly

---

## 🎯 Performance Impact

- **Network:** Minimal (1 small request every 10 minutes)
- **Backend:** Negligible (health endpoint is very lightweight)
- **User Experience:** Zero impact (runs in background)
- **Cost:** Free!

---

## ✅ Setup Checklist

- [x] UptimeRobot configured
  - URL: `https://jack-schedule-api.onrender.com/api/health`
  - Interval: 5 minutes
  
- [x] Frontend keep-alive implemented
  - Location: `DataContext.jsx`
  - Interval: 10 minutes
  
- [x] Backend health endpoint exists
  - Endpoint: `/api/health`
  - Returns: `{ status: 'OK', message: 'Server is running' }`

---

## 🎉 You're All Set!

Your backend will now stay warm 24/7, providing fast response times for all users!

**Monitor it:**
- UptimeRobot dashboard: Check uptime stats
- Browser console: See keep-alive logs
- Render dashboard: View health check requests
