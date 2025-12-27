# Simple Google Drive Setup (No API Key!) 🎉

## Good News!

**You DON'T need Google Cloud Console or API keys!** Just use direct image links from Google Drive.

## How It Works

### Step 1: Upload Images to Google Drive

1. Create a folder in Google Drive
2. Upload your images
3. Make folder public: Right-click → Share → "Anyone with link can view"

### Step 2: Get Image IDs

For each image you want to show:

1. Right-click the image in Google Drive
2. Click "Get link"
3. You'll get a link like:
   ```
   https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view
                                  ↑ This is the image ID
   ```
4. Copy just the ID part: `1a2b3c4d5e6f7g8h9i0j`

### Step 3: Add to Your Page

Edit your sample page (e.g., `SamplesFes.jsx`):

```javascript
// Format: 'folderId|imageId1,imageId2,imageId3'
const driveUrl = 'folder123|img1abc,img2def,img3ghi';
```

**Example with real IDs:**
```javascript
const driveUrl = '1abc|1def2ghi3jkl,4mno5pqr6stu,7vwx8yz9abc';
```

### Step 4: Done! ✨

Refresh your website and the images will appear!

## Full Example

```javascript
// SamplesFes.jsx
import ImageGallery from '../components/ImageGallery';

const SamplesFes = () => {
    // List your Google Drive image IDs separated by commas
    const driveUrl = 'myFolder|' +
        '1a2b3c4d5e6f7g8h,' +  // Image 1
        '2b3c4d5e6f7g8h9,' +  // Image 2
        '3c4d5e6f7g8h9i0';    // Image 3

    return <ImageGallery folder="fes" title="Festival Photography" driveUrl={driveUrl} />;
};

export default SamplesFes;
```

## Alternative: Use Local Images (Even Simpler!)

If Google Drive feels complicated, just use local images:

1. Put images in: `frontend/public/images/fes/`
2. Name them: `image-1.jpg`, `image-2.jpg`, etc.
3. Set `driveUrl = null`

```javascript
const driveUrl = null; // Use local images
```

## Which Method to Choose?

### Use Google Drive if:
- ✅ You want to update images without touching code
- ✅ You have many images
- ✅ You want to manage images from phone/tablet

### Use Local Images if:
- ✅ You want the simplest setup
- ✅ You have few images
- ✅ You don't mind redeploying when adding images

## Tips

- **Organize**: Keep image IDs in a text file for easy reference
- **Test**: Add one image first to make sure it works
- **Quality**: Compress images before uploading (use TinyPNG)
- **Names**: Use descriptive file names in Google Drive for easy identification

## Troubleshooting

**Images not showing?**
1. Check that Google Drive folder/images are public
2. Make sure image IDs are correct (no spaces, correct format)
3. Check browser console (F12) for errors
4. Try with just one image first

**Still not working?**
- Use local images instead (`driveUrl = null`)
- Much simpler and works every time!

---

**Recommendation**: Start with local images to get familiar, then switch to Google Drive later if needed!
