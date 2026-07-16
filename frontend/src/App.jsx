import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Calendar from './pages/Calendar';
import SamplesFes from './pages/SamplesFes';
import SamplesDesign from './pages/SamplesDesign';
import SamplesShoot from './pages/SamplesShoot';
import SamplesKyYeu from './pages/SamplesKyYeu';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import FreeWifi from './pages/FreeWifi';
import LuckyWheel from './pages/LuckyWheel';
import './index.css';
import './effects.css';

function AppContent() {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === '/freewifi';

    return (
        <div className="app-wrapper">
            {!hideHeaderFooter && <Header />}
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/samples" element={<Navigate to="/samples/fes" replace />} />
                    <Route path="/samples/fes" element={<SamplesFes />} />
                    <Route path="/samples/design" element={<SamplesDesign />} />
                    <Route path="/samples/shoot" element={<SamplesShoot />} />
                    <Route path="/samples/ky-yeu" element={<SamplesKyYeu />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/freewifi" element={<FreeWifi />} />
                    <Route path="/luckywheel" element={<LuckyWheel />} />
                </Routes>
            </main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <DataProvider>
                <Router>
                    <ScrollToTop />
                    <ScrollProgress />
                    <AppContent />
                </Router>
            </DataProvider>
        </ThemeProvider>
    );
}

export default App;
