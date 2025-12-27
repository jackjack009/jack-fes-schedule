# Auto-Sync Google Drive Images 🔄

## What You Get

**Add/remove images in Google Drive → Website updates automatically!**

No code changes, no redeployment needed. Just manage your images in Google Drive like a normal folder! ✨

## One-Time Setup (5 minutes)

### Step 1: Get Google Drive API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. **Enable Google Drive API**:
   - Click "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (looks like: `AIzaSyAbc123...`)

### Step 2: Add API Key to Project

Create `frontend/.env` file (if it doesn't exist):

```env
VITE_GOOGLE_DRIVE_API_KEY=AIzaSyAbc123def456ghi789...
```

**Important**: 
- Don't commit this file to GitHub!
- `.env` should already be in `.gitignore`

### Step 3: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder (e.g., "Festival Photos")
3. **Make it public**:
   - Right-click folder → "Share"
   - Click "Change to anyone with the link"
   - Set permission to "Viewer"
   - Click "Done"

### Step 4: Get Folder ID

From your folder URL:
```
https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                         ↑ This is your folder ID
```

Copy just the ID part: `1a2b3c4d5e6f7g8h9i0j`

### Step 5: Update Your Page

Edit the sample page (e.g., `frontend/src/pages/SamplesFes.jsx`):

```javascript
// Change this:
const driveUrl = null;

// To this (paste your folder ID):
const driveUrl = '1a2b3c4d5e6f7g8h9i0j';
```

### Step 6: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Done! 🎉

Now you can:
- ✅ Upload images to Google Drive folder → They appear on website
- ✅ Delete images from folder → They disappear from website
- ✅ Rename images → Names update on website
- ✅ No code changes needed!
- ✅ No redeployment needed!

## How It Works

```
User visits gallery page
    ↓
Website calls Google Drive API
    ↓
Gets list of all images in folder
    ↓
Displays them automatically
    ↓
User adds/removes images in Drive
    ↓
Next page refresh shows updated images!
```

## Managing Images

### To Add Images:
1. Upload to your Google Drive folder
2. Refresh website
3. New images appear! ✨

### To Remove Images:
1. Delete from Google Drive folder
2. Refresh website
3. Images disappear! 🗑️

### To Reorder Images:
Images are sorted alphabetically by filename. To control order:
- Name files: `01-photo.jpg`, `02-photo.jpg`, etc.
- Or: `a-photo.jpg`, `b-photo.jpg`, etc.

## Multiple Galleries

You can use different folders for each gallery:

```javascript
// SamplesFes.jsx
const driveUrl = '1abc...'; // Festival folder

// SamplesShoot.jsx
const driveUrl = '2def...'; // Portrait folder

// SamplesKyYeu.jsx
const driveUrl = '3ghi...'; // Yearbook folder
```

## Troubleshooting

### Images not loading?

1. **Check API Key**:
   - Make sure it's in `frontend/.env`
   - Restart dev server after adding

2. **Check Folder Permissions**:
   - Folder must be "Anyone with link can view"
   - Check in Google Drive sharing settings

3. **Check Folder ID**:
   - Make sure it's correct (no extra characters)
   - Should be just the ID, not the full URL

4. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for error messages
   - They'll tell you exactly what's wrong

### API Key not working?

1. Make sure Google Drive API is enabled
2. Wait a few minutes (can take time to activate)
3. Check API key restrictions in Google Cloud Console
4. Make sure there are no typos in `.env` file

### Still having issues?

The gallery will automatically fall back to local images if Google Drive fails. You'll see an error message explaining what went wrong.

## Cost & Limits

- **Free**: Google Drive API is free for reasonable usage
- **Quota**: 1 billion queries/day (you won't hit this!)
- **Your usage**: ~10-100 queries/day
- **No credit card needed** for free tier

## Security

- ✅ API key is safe for client-side use (read-only)
- ✅ Only public folders can be accessed
- ✅ No sensitive data exposed
- ⚠️ Keep `.env` in `.gitignore`
- ⚠️ Don't share API key publicly

## Benefits vs Local Images

| Feature | Google Drive | Local Images |
|---------|-------------|--------------|
| Auto-sync | ✅ Yes | ❌ No |
| Easy updates | ✅ Yes | ❌ Need redeploy |
| Manage from phone | ✅ Yes | ❌ No |
| Setup complexity | ⚠️ Medium | ✅ Simple |
| Requires API key | ✅ Yes | ❌ No |

## Recommendation

- **Use Google Drive** if you update images frequently
- **Use local images** if you rarely change images

Both work perfectly! Choose what fits your workflow. 🚀

---

**Need help?** Check the browser console for detailed error messages.
