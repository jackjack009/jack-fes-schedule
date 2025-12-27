import ImageGallery from '../components/ImageGallery';

const SamplesKyYeu = () => {
    // AUTO-SYNC: Just add your Google Drive folder ID
    // Images update automatically when you add/remove them in Drive!

    const driveUrl = '1bFE2Rrn_r8PU0JvEweJljl2r07JJewB1'; // Replace with your folder ID

    // Example: const driveUrl = '1a2b3c4d5e6f7g8h9i0j';

    return <ImageGallery folder="ky-yeu" title="Yearbook Photography" driveUrl={driveUrl} />;
};

export default SamplesKyYeu;
