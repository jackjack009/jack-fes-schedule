import { useState, useEffect } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ folder, title, driveUrl }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (driveUrl) {
            fetchImagesFromDrive(driveUrl);
        } else {
            loadLocalImages();
            setLoading(false);
        }
    }, [folder, driveUrl]);

    const fetchImagesFromDrive = async (url) => {
        setLoading(true);
        setError(null);

        try {
            const folderId = extractFolderId(url);

            if (!folderId) {
                throw new Error('Sai URL rồi, vui lòng nhắn tin cho JackJack');
            }

            const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

            if (!apiKey) {
                throw new Error('Í ẹ thiếu API key, vui lòng nhắn tin cho JackJack');
            }

            const apiUrl = `https://www.googleapis.com/drive/v3/files?` +
                `q='${folderId}'+in+parents+and+mimeType+contains+'image/'` +
                `&key=${apiKey}` +
                `&fields=files(id,name,mimeType,thumbnailLink,webContentLink)` +
                `&orderBy=name`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'Không load được ảnh, vui lòng nhắn tin cho JackJack');
            }

            if (data.files && data.files.length > 0) {
                const driveImages = data.files.map((file, index) => {
                    const imageUrl = `https://lh3.googleusercontent.com/d/${file.id}=w2000`;
                    const thumbnailUrl = `https://lh3.googleusercontent.com/d/${file.id}=w400`;

                    return {
                        id: file.id,
                        src: imageUrl,
                        alt: file.name || `${title} ${index + 1}`,
                        thumbnail: thumbnailUrl
                    };
                });
                setImages(driveImages);
                setError(null);
            } else {
                setImages([]);
                setError('Folder không có miếng ảnh nào luôn, vui lòng nhắn tin cho JackJack');
            }
        } catch (err) {
            console.error('Error fetching from Google Drive:', err);
            setError(err.message);
            loadLocalImages();
        } finally {
            setLoading(false);
        }
    };

    const extractFolderId = (url) => {
        // Extract folder ID from various Google Drive URL formats
        const patterns = [
            /folders\/([a-zA-Z0-9-_]+)/,
            /id=([a-zA-Z0-9-_]+)/,
            /^([a-zA-Z0-9-_]+)$/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const loadLocalImages = () => {
        const placeholderImages = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            src: `/images/${folder}/image-${i + 1}.jpg`,
            alt: `${title} ${i + 1}`,
            thumbnail: `/images/${folder}/thumb-${i + 1}.jpg`
        }));
        setImages(placeholderImages);
    };

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, images.length]);

    return (
        <div className="gallery-page">
            <div className="gallery-header">
                <h1>{title}</h1>
                {/* <p>Ngó sample của Jack Jack chụp {title.toLowerCase()}</p> */}
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Ảnh đang load nè...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p className="error-message">⚠️ {error}</p>
                    {images.length > 0 && (
                        <p className="fallback-message">Ảnh không load được, vui lòng nhắn tin cho JackJack</p>
                    )}
                </div>
            ) : null}

            <div className="gallery-grid">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="gallery-item"
                        onClick={() => openLightbox(index)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="image-wrapper">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="gallery-image"
                                loading="lazy"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {!driveUrl && (
                <div className="upload-instructions">
                    <h3>📁 Setup Instructions</h3>

                    <div className="instruction-section">
                        <h4>🚀 Auto-Sync with Google Drive (Recommended)</h4>
                        <p><strong>Benefit:</strong> Add/remove images in Google Drive → Website updates automatically!</p>
                        <ol>
                            <li>Get Google Drive API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                            <li>Add to <code>frontend/.env</code>:
                                <pre>VITE_GOOGLE_DRIVE_API_KEY=your_api_key_here</pre>
                            </li>
                            <li>Upload images to a Google Drive folder</li>
                            <li>Make folder public: Right-click → Share → "Anyone with link"</li>
                            <li>Copy folder URL or ID</li>
                            <li>Update your page component:
                                <pre>{`const driveUrl = 'YOUR_FOLDER_ID';`}</pre>
                            </li>
                            <li>Restart dev server: <code>npm run dev</code></li>
                        </ol>
                        <p><strong>Done!</strong> Images sync automatically. No manual updates needed! ✨</p>
                    </div>

                    <div className="instruction-section">
                        <h4>📂 Local Images (Simple)</h4>
                        <ol>
                            <li>Add images to: <code>frontend/public/images/{folder}/</code></li>
                            <li>Name them: <code>image-1.jpg</code>, <code>image-2.jpg</code>, etc.</li>
                            <li>Keep <code>driveUrl = null</code></li>
                        </ol>
                        <p><strong>Note:</strong> Need to redeploy when adding/removing images</p>
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {lightboxOpen && images.length > 0 && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        ×
                    </button>

                    <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        ‹
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[currentImageIndex].src}
                            alt={images[currentImageIndex].alt}
                            className="lightbox-image"
                        />
                        <div className="lightbox-caption">
                            {images[currentImageIndex].alt}
                            <span className="lightbox-counter">
                                {currentImageIndex + 1} / {images.length}
                            </span>
                        </div>
                    </div>

                    <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                        ›
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
