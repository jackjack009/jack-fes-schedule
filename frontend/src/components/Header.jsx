import { Link, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const [showSamplesMenu, setShowSamplesMenu] = useState(false);
    const timeoutRef = useRef(null);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowSamplesMenu(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowSamplesMenu(false);
        }, 200);
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to="/" className="logo">
                    JACKJACK
                </Link>

                <nav className="main-nav">
                    <div
                        className="nav-item-wrapper"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span className={`nav-link ${location.pathname.startsWith('/samples') ? 'active' : ''}`}>
                            Samples
                        </span>
                        {showSamplesMenu && (
                            <div className="submenu">
                                <Link
                                    to="/samples/fes"
                                    className="submenu-item"
                                >
                                    Fes
                                </Link>
                                <Link
                                    to="/samples/shoot"
                                    className="submenu-item"
                                >
                                    Shoot
                                </Link>
                                <Link
                                    to="/samples/ky-yeu"
                                    className="submenu-item"
                                >
                                    Kỷ Yếu
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/calendar" className={`nav-link ${isActive('/calendar') ? 'active' : ''}`}>
                        Calendar
                    </Link>

                    <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                        Price/Contact
                    </Link>

                    <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                        Admin
                    </Link>

                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
