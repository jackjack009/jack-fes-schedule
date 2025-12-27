import ImageGallery from '../components/ImageGallery';

const SamplesFes = () => {
    // ========================================
    // AUTO-SYNC WITH GOOGLE DRIVE
    // ========================================
    // Just add/remove images in Google Drive folder
    // → Website updates automatically! No code changes needed!

    // Setup (one-time):
    // 1. Get API key: https://console.cloud.google.com/
    // 2. Add to frontend/.env: VITE_GOOGLE_DRIVE_API_KEY=your_key
    // 3. Create Google Drive folder, make it public
    // 4. Get folder ID from URL: https://drive.google.com/drive/folders/FOLDER_ID
    // 5. Paste folder ID below:

    const driveUrl = '1jOu3pNP4SwUTcPIvUy-xncQN4VlkcohM'; // Replace with your Google Drive folder ID

    // Example:
    // const driveUrl = '1a2b3c4d5e6f7g8h9i0j';

    // ========================================
    // OR USE LOCAL IMAGES (simpler, but manual)
    // ========================================
    // Keep driveUrl = null
    // Add images to: frontend/public/images/fes/
    // Name them: image-1.jpg, image-2.jpg, etc.

    return <ImageGallery folder="fes" title="Festival Photography" driveUrl={driveUrl} />;
};

export default SamplesFes;
