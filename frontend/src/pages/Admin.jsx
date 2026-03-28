import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { authAPI, datesAPI } from '../services/api';
import { useData } from '../context/DataContext';
import './Admin.css';

const Admin = () => {
    const { refreshDates } = useData();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [modalDateId, setModalDateId] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalLocation, setModalLocation] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDates();
        }
    }, [isAuthenticated]);

    const checkAuth = async () => {
        try {
            const response = await authAPI.checkAuth();
            setIsAuthenticated(response.data.authenticated);
        } catch (err) {
            console.error('Auth check error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authAPI.login({ username, password });
            setIsAuthenticated(true);
            setUsername('');
            setPassword('');
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                'Login failed';
            setError(errorMessage);
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            setIsAuthenticated(false);
            setDates([]);
            setSelectedDate(null);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const fetchDates = async () => {
        try {
            const response = await datesAPI.getAll();
            setDates(response.data);
            if (selectedDate) {
                const updatedSelected = response.data.find(d => d._id === selectedDate._id);
                if (updatedSelected) {
                    setSelectedDate(updatedSelected);
                } else if (response.data.length > 0) {
                    setSelectedDate(response.data[0]);
                } else {
                    setSelectedDate(null);
                }
            } else if (response.data.length > 0) {
                setSelectedDate(response.data[0]);
            }
        } catch (err) {
            console.error('Error fetching dates:', err);
        }
    };

    // Open modal for creating a new date
    const openCreateModal = () => {
        setModalMode('create');
        setModalDateId(null);
        setModalTitle('');
        setModalLocation('');
        setShowModal(true);
    };

    // Open modal for editing an existing date
    const openEditModal = (date, e) => {
        if (e) { e.stopPropagation(); }
        setModalMode('edit');
        setModalDateId(date._id);
        setModalTitle(date.name);
        setModalLocation(date.location || '');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalTitle('');
        setModalLocation('');
        setModalDateId(null);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (!modalTitle.trim()) return;
        setModalLoading(true);
        try {
            if (modalMode === 'create') {
                await datesAPI.create({ name: modalTitle.trim(), location: modalLocation.trim() });
            } else {
                await datesAPI.update(modalDateId, { name: modalTitle.trim(), location: modalLocation.trim() });
            }
            closeModal();
            await fetchDates();
            await refreshDates();
        } catch (err) {
            console.error('Error saving date:', err);
            setError('Failed to save date');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteDate = async (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        try {
            await datesAPI.delete(id);
            await fetchDates();
            await refreshDates();
        } catch (err) {
            console.error('Error deleting date:', err);
            setError('Failed to delete date');
        }
    };

    const handleToggleSlot = async (dateId, slotId) => {
        try {
            setError('');
            await datesAPI.toggleSlot(dateId, slotId);
            await fetchDates();
            await refreshDates();
        } catch (err) {
            console.error('Error toggling slot:', err);
            const errorMsg = err.response?.data?.message || 'Failed to toggle slot';
            setError(errorMsg);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleToggleFullSlot = async (dateId) => {
        try {
            setError('');
            await datesAPI.toggleFullSlot(dateId);
            await fetchDates();
            await refreshDates();
        } catch (err) {
            console.error('Error toggling fullSlot:', err);
            setError('Failed to toggle full slot');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(dates);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setDates(items);
        try {
            await datesAPI.reorder(items.map(d => d._id));
            await refreshDates();
        } catch (err) {
            console.error('Error reordering dates:', err);
            fetchDates();
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="admin-page">
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-header">
                            <h2>🔐 Admin Login</h2>
                            <p>Cái này dành cho Dách Dách thôi</p>
                        </div>
                        <form onSubmit={handleLogin} className="login-form">
                            {error && (
                                <div className="alert alert-error">{error}</div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                Login
                            </button>
                            <div className="login-hint">
                                <small>Hoi đừng có cố login làm chi</small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Date Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modalMode === 'create' ? '+ Add Date' : '✏️ Edit Date'}</h3>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleModalSubmit} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={modalTitle}
                                    onChange={(e) => setModalTitle(e.target.value)}
                                    placeholder="e.g., Artist Day 29/3"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={modalLocation}
                                    onChange={(e) => setModalLocation(e.target.value)}
                                    placeholder="e.g., Hall A, Floor 2"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-success" disabled={modalLoading}>
                                    {modalLoading ? 'Saving...' : (modalMode === 'create' ? 'Add Date' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="admin-header">
                <div>
                    <h1>⚙️ Admin Panel</h1>
                    <p>Manage dates and slot availability</p>
                </div>
                <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                    <button onClick={() => setError('')} className="alert-close">×</button>
                </div>
            )}

            <div className="admin-content">
                {/* Left Sidebar */}
                <div className="admin-sidebar">
                    <div className="admin-controls">
                        <button className="btn btn-success" style={{ width: '100%' }} onClick={openCreateModal}>
                            + Add Date
                        </button>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="dates">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="draggable-date-list"
                                >
                                    {dates.map((date, index) => (
                                        <Draggable key={date._id} draggableId={date._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`draggable-date-item ${selectedDate?._id === date._id ? 'active' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                                                >
                                                    <span
                                                        {...provided.dragHandleProps}
                                                        className="drag-handle"
                                                    >
                                                        ⋮⋮
                                                    </span>

                                                    <div
                                                        className="date-content"
                                                        onClick={() => setSelectedDate(date)}
                                                    >
                                                        <span className="date-name">{date.name}</span>
                                                        {date.location && (
                                                            <span className="date-location-admin">{date.location}</span>
                                                        )}
                                                    </div>

                                                    <div className="date-actions">
                                                        <button
                                                            onClick={(e) => openEditModal(date, e)}
                                                            className="action-btn edit-btn"
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteDate(date._id, e)}
                                                            className="action-btn delete-btn"
                                                            title="Delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* Right Panel - Slot Grid */}
                <div className="admin-main">
                    {!selectedDate ? (
                        <div className="empty-state">
                            <span className="empty-icon">📅</span>
                            <h3>Select a Date</h3>
                            <p>Choose a date from the list to manage its slots</p>
                        </div>
                    ) : (
                        <div className="slot-management">
                            <div className="slot-management-header">
                                <div>
                                    <h3>🕐 Manage Slots for {selectedDate.name}</h3>
                                    <p>Click on any slot to toggle its availability</p>
                                </div>
                                <button
                                    onClick={() => handleToggleFullSlot(selectedDate._id)}
                                    className={`btn-full-slot ${selectedDate.fullSlot ? 'active' : ''}`}
                                >
                                    {selectedDate.fullSlot ? '🔴 Full Slot: ON' : '⚪ Full Slot: OFF'}
                                </button>
                            </div>

                            <div className="slots-grid-wrapper">
                                {selectedDate.fullSlot && (
                                    <div className="admin-full-slot-banner" aria-label="Full Slot active">
                                        🔴 Full Slot mode is ON — viewers see an overlay
                                    </div>
                                )}
                                <div className={`slots-grid-admin${selectedDate.fullSlot ? ' full-slot-active' : ''}`}>
                                    {selectedDate.slots.map((slot) => (
                                        <button
                                            key={slot._id}
                                            onClick={() => handleToggleSlot(selectedDate._id, slot._id)}
                                            className={`admin-slot-item ${slot.available ? 'available' : 'unavailable'}`}
                                        >
                                            <div className="slot-time">{slot.time}</div>
                                            <div className="slot-status-badge">
                                                {slot.available ? (
                                                    <span className="badge-available">✓ Available</span>
                                                ) : (
                                                    <span className="badge-unavailable">✗ Booked</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
