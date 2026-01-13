import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const [showSamplesMenu, setShowSamplesMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const timeoutRef = useRef(null);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
        setShowSamplesMenu(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const toggleSamplesMenuMobile = () => {
        setShowSamplesMenu(!showSamplesMenu);
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to="/" className="logo">
                    JACKJACK
                </Link>

                {/* Hamburger Button */}
                <button
                    className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Desktop Navigation */}
                <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <div
                        className="nav-item-wrapper"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span
                            className={`nav-link ${location.pathname.startsWith('/samples') ? 'active' : ''}`}
                            onClick={(e) => {
                                // Only toggle on mobile (when hamburger menu is open)
                                if (mobileMenuOpen) {
                                    toggleSamplesMenuMobile();
                                }
                                // On desktop, prevent default to avoid any navigation
                                e.preventDefault();
                            }}
                        >
                            Samples
                            <span className="dropdown-arrow">{showSamplesMenu ? '▲' : '▼'}</span>
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
                        Lịch đi fes
                    </Link>

                    <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                        Giá/Contact
                    </Link>

                    <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                        Admin
                    </Link>

                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </nav>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="mobile-overlay"
                        onClick={toggleMobileMenu}
                    />
                )}
            </div>
        </header>
    );
};

export default Header;
