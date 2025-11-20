import { useState, useEffect } from 'react';
import DateList from '../components/DateList';
import SlotGrid from '../components/SlotGrid';
import GameSection from '../components/games/GameSection';
import { datesAPI } from '../services/api';
import './Home.css';

const Home = () => {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDates();
    }, []);

    const fetchDates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await datesAPI.getAll();
            setDates(response.data);

            // Auto-select first date if available
            if (response.data.length > 0 && !selectedDate) {
                setSelectedDate(response.data[0]);
            }
        } catch (err) {
            console.error('Error fetching dates:', err);
            setError('Failed to load dates. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const headerText = loading
        ? "Lịch chưa load xong đâu, đợi tí nha. Then kiu."
        : "Lịch để check coi Jack ế show đến đâu. Muốn búc thì nhắm cái nào Available nghen. Iu thương";

    return (
        <div className="home-page">
            <div className="welcome-header">
                <h1>{headerText}</h1>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading slots...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <span className="error-icon">⚠️</span>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button onClick={fetchDates} className="btn btn-primary">
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="home-container">
                    <div className="home-sidebar">
                        <DateList
                            dates={dates}
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                        />
                    </div>

                    <div className="home-content">
                        <SlotGrid selectedDate={selectedDate} />
                    </div>
                </div>
            )}

            <div className="games-container-wrapper">
                <h2 className="games-header-text">Chơi game tí đỡ stress nè</h2>
                <GameSection />
            </div>
        </div>
    );
};

export default Home;
