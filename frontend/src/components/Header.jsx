import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-logo">
                    <h2>📅 Lịch đi fes</h2>
                </div>

                <nav className="header-nav">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/admin"
                        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                        Admin
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
