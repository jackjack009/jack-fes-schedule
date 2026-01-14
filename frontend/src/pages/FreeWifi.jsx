import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './FreeWifi.css';

const FreeWifi = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const imageSrc = isMobile ? '/images/middlefinger2.jpg' : '/images/middlefinger.jpg';

    return (
        <div className="freewifi-container">
            <h2>Ôi bạn ơi</h2>
            <img
                src={imageSrc}
                alt="Free WiFi"
                className="wifi-image"
            />
            <h4>Trên đời này hàng free từ trên trời rơi xuống thì chỉ có nước mưa với cứt chim thôi~</h4>
            <Link to="/" className="home-button">
                Về trang chủ đi bạn ơi
            </Link>
        </div>
    );
};

export default FreeWifi;
