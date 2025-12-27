import { createContext, useContext, useState, useEffect } from 'react';
import { datesAPI } from '../services/api';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);

    const fetchDates = async (force = false) => {
        // Don't refetch if data is fresh (less than 5 minutes old) unless forced
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        if (!force && lastFetch && Date.now() - lastFetch < CACHE_DURATION && dates.length > 0) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await datesAPI.getAll();
            setDates(response.data);
            setLastFetch(Date.now());
        } catch (err) {
            console.error('Error fetching dates:', err);
            setError('Failed to load dates');
        } finally {
            setLoading(false);
        }
    };

    // Preload data on mount (after initial render)
    useEffect(() => {
        // Small delay to let the page render first
        const timer = setTimeout(() => {
            fetchDates();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const value = {
        dates,
        loading,
        error,
        fetchDates,
        refreshDates: () => fetchDates(true)
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
