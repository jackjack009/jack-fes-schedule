import { useState, useEffect } from 'react';
import DateList from '../components/DateList';
import SlotGrid from '../components/SlotGrid';
import GameSection from '../components/games/GameSection';
import { useData } from '../context/DataContext';
import './Calendar.css';

const Calendar = () => {
    const { dates, loading, error, refreshDates } = useData();
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        // Auto-select first date if available
        if (dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[0]);
        }
    }, [dates, selectedDate]);

    // Update selected date when dates change
    useEffect(() => {
        if (selectedDate && dates.length > 0) {
            const updatedDate = dates.find(d => d._id === selectedDate._id);
            if (updatedDate) {
                setSelectedDate(updatedDate);
            }
        }
    }, [dates, selectedDate]);

    return (
        <div className="calendar-page">
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Lịch vẫn đang load. Hihi thông cảm...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={refreshDates} className="retry-btn">Thử lại</button>
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

export default Calendar;
