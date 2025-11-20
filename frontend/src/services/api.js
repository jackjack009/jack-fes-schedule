import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    checkAuth: () => api.get('/auth/check')
};

// Dates API
export const datesAPI = {
    getAll: () => api.get('/dates'),
    create: (data) => api.post('/dates', data),
    update: (id, data) => api.put(`/dates/${id}`, data),
    delete: (id) => api.delete(`/dates/${id}`),
    toggleSlot: (dateId, slotId) => api.put(`/dates/${dateId}/slots/${slotId}`),
    reorder: (dateIds) => api.put('/dates/reorder/all', { dateIds })
};

export default api;
