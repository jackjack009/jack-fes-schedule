import ImageGallery from '../components/ImageGallery';

const SamplesDesign = () => {
    // AUTO-SYNC: Just add your Google Drive folder ID
    // Images update automatically when you add/remove them in Drive!

    const driveUrl = '1OUzomtABPf7v6r1y-TL3jMWkBuqoIZjE';

    return <ImageGallery folder="design" title="Design" driveUrl={driveUrl} />;
};

export default SamplesDesign;
