# Quick Start: Google Drive Images 🚀

## TL;DR - 3 Steps to Get Started

### 1️⃣ Get Google Drive API Key (5 minutes)
1. Go to https://console.cloud.google.com/
2. Create project → Enable "Google Drive API"
3. Create API Key → Copy it

### 2️⃣ Add API Key to Project
Create `frontend/.env` file:
```env
VITE_GOOGLE_DRIVE_API_KEY=paste_your_key_here
```

### 3️⃣ Configure Your Gallery
Edit `frontend/src/pages/SamplesFes.jsx`:
```javascript
// Change this line:
const driveUrl = null;

// To this (with your folder ID):
const driveUrl = '1a2b3c4d5e6f7g8h9i0j';
```

**Done!** Restart dev server and your images will load from Google Drive! ✨

## How to Get Folder ID

Your Google Drive folder URL looks like:
```
https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                         ↑ This is your folder ID
```

Just copy the part after `/folders/`

## Make Folder Public

1. Right-click folder in Google Drive
2. Click "Share"
3. Change to "Anyone with the link"
4. Set permission to "Viewer"
5. Click "Done"

## Test It

1. Upload some images to your Google Drive folder
2. Refresh your website
3. Navigate to Samples → Fes (or whichever you configured)
4. Images should appear! 🎉

## Troubleshooting

**Images not showing?**
- Check browser console (F12) for errors
- Make sure folder is public
- Restart dev server after adding .env
- Wait a few minutes (API key activation)

**Still not working?**
- Use local images instead (set `driveUrl = null`)
- Check full guide: `GOOGLE_DRIVE_SETUP.md`

---

**Pro Tip**: You can use different Google Drive folders for each gallery (Fes, Shoot, Kỷ Yếu)!
