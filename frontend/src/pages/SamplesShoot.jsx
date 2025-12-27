import ImageGallery from '../components/ImageGallery';

const SamplesShoot = () => {
    // AUTO-SYNC: Just add your Google Drive folder ID
    // Images update automatically when you add/remove them in Drive!

    const driveUrl = '1y5UB7xb-3OGpYnJAQAEReNiFJPJZRW7F'; // Replace with your folder ID

    // Example: const driveUrl = '1a2b3c4d5e6f7g8h9i0j';

    return <ImageGallery folder="shoot" title="Outdoor/Indoor Shoots" driveUrl={driveUrl} />;
};

export default SamplesShoot;
