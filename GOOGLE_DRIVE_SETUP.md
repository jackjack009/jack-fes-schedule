# Google Drive Image Integration Guide 🚀

## Overview

Your website now supports **automatic image loading from Google Drive**! Upload images to a Google Drive folder and they'll automatically appear on your website.

## Setup Steps

### 1. Create Google Drive API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Drive API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

### 2. Add API Key to Your Project

Create or update `.env` file in `frontend/` folder:

```env
VITE_GOOGLE_DRIVE_API_KEY=your_api_key_here
```

**Important**: Add `.env` to `.gitignore` to keep your API key private!

### 3. Prepare Your Google Drive Folder

1. **Create a folder** in Google Drive for your images
2. **Upload your images** to the folder
3. **Make it public**:
   - Right-click folder → "Share"
   - Click "Change to anyone with the link"
   - Set to "Viewer"
   - Click "Done"
4. **Copy the folder URL** or just the folder ID

Example URL:
```
https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                         ↑ This is your folder ID
```

### 4. Update Your Sample Pages

Edit the sample page files to use your Google Drive folder:

#### For Festival Photos (`SamplesFes.jsx`):
```javascript
const driveUrl = 'https://drive.google.com/drive/folders/YOUR_FES_FOLDER_ID';
// OR just the ID:
const driveUrl = 'YOUR_FES_FOLDER_ID';
```

#### For Portrait Shoots (`SamplesShoot.jsx`):
```javascript
const driveUrl = 'https://drive.google.com/drive/folders/YOUR_SHOOT_FOLDER_ID';
```

#### For Yearbook (`SamplesKyYeu.jsx`):
```javascript
const driveUrl = 'https://drive.google.com/drive/folders/YOUR_YEARBOOK_FOLDER_ID';
```

## How It Works

```
User visits gallery page
    ↓
Website checks for Google Drive URL
    ↓
If URL exists:
    → Fetch images from Google Drive API
    → Display images automatically
    → Auto-updates when you add new images!
    ↓
If no URL or error:
    → Fallback to local images
    → Load from public/images/ folder
```

## Benefits

✅ **Easy Updates**: Just upload to Google Drive, no code changes
✅ **Auto-Sync**: New images appear automatically
✅ **No Server Storage**: Images hosted on Google Drive
✅ **Fast Loading**: Lazy loading + thumbnails
✅ **Fallback**: Works with local images if Drive unavailable

## Example Configuration

### Option 1: Google Drive (Recommended)
```javascript
// SamplesFes.jsx
const driveUrl = '1a2b3c4d5e6f7g8h9i0j'; // Your folder ID
```

### Option 2: Local Images
```javascript
// SamplesFes.jsx
const driveUrl = null; // Use local images
```

### Option 3: Mixed (Different sources for different galleries)
```javascript
// SamplesFes.jsx - Use Google Drive
const driveUrl = 'YOUR_FES_FOLDER_ID';

// SamplesShoot.jsx - Use local images
const driveUrl = null;
```

## Updating Images

### With Google Drive:
1. Upload new images to your Google Drive folder
2. Refresh your website
3. New images appear automatically! ✨

### With Local Images:
1. Add images to `frontend/public/images/[folder]/`
2. Name them: `image-1.jpg`, `image-2.jpg`, etc.
3. Refresh your website

## Troubleshooting

### Images not loading from Google Drive?

1. **Check API Key**: Make sure it's in `.env` file
2. **Check Folder Permissions**: Folder must be "Anyone with link can view"
3. **Check Folder ID**: Make sure it's correct
4. **Check Console**: Open browser DevTools for error messages
5. **Restart Dev Server**: After adding `.env`, restart `npm run dev`

### API Key not working?

1. Make sure Google Drive API is enabled in Google Cloud Console
2. Check API key restrictions (should allow your domain)
3. Wait a few minutes after creating (can take time to activate)

## Security Notes

- ✅ API key is safe for client-side use (read-only)
- ✅ Only public folders can be accessed
- ✅ Keep `.env` file in `.gitignore`
- ⚠️ Don't commit API key to GitHub
- ⚠️ Use API key restrictions in Google Cloud Console

## Cost

- Google Drive API: **FREE** for reasonable usage
- Free tier: 1 billion queries/day
- Your website usage: ~100-1000 queries/day
- **You won't hit the limit!** 😊

## Alternative: Other Cloud Storage

The same approach works with:
- **Imgur**: Public albums
- **Cloudinary**: Free tier
- **AWS S3**: Public buckets
- **Azure Blob Storage**: Public containers

Just modify the `fetchImagesFromDrive` function to use their APIs!

---

**Need help?** Check the browser console for error messages or contact support.
