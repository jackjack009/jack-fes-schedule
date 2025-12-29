import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { authAPI, datesAPI } from '../services/api';
import { useData } from '../context/DataContext';
import './Admin.css';

const Admin = () => {
    const { refreshDates } = useData(); // Get refresh function from context
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newDateName, setNewDateName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            // Handle rate limit error (429) or other errors
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

            // Update selectedDate if it exists in the new data
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

    const handleCreateDate = async (e) => {
        e.preventDefault();
        if (!newDateName.trim()) return;

        try {
            await datesAPI.create({ name: newDateName });
            setNewDateName('');
            await fetchDates();
            await refreshDates();
        } catch (err) {
            console.error('Error creating date:', err);
            setError('Failed to create date');
        }
    };

    const handleUpdateDate = async (id) => {
        if (!editingName.trim()) return;

        try {
            await datesAPI.update(id, { name: editingName });
            setEditingId(null);
            setEditingName('');
            await fetchDates();
            await refreshDates();
        } catch (err) {
            console.error('Error updating date:', err);
            setError('Failed to update date');
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
        console.log('Toggle slot called:', { dateId, slotId });
        try {
            setError('');
            console.log('Calling API...');
            const response = await datesAPI.toggleSlot(dateId, slotId);
            console.log('API response:', response);
            await fetchDates(); // Refresh admin page data
            await refreshDates(); // Refresh global context (for Calendar page)
            console.log('Dates refreshed');
        } catch (err) {
            console.error('Error toggling slot:', err);
            console.error('Error response:', err.response);
            const errorMsg = err.response?.data?.message || 'Failed to toggle slot';
            setError(errorMsg);
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
            fetchDates(); // Revert on error
        }
    };

    const generateDefaultDateName = () => {
        const today = new Date();
        return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
                                <div className="alert alert-error">
                                    {error}
                                </div>
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
                {/* Left Sidebar - Date List with Drag & Drop */}
                <div className="admin-sidebar">
                    <div className="admin-controls">
                        <h3>Create New Date</h3>
                        <form onSubmit={handleCreateDate} className="create-form">
                            <input
                                type="text"
                                className="form-input"
                                value={newDateName}
                                onChange={(e) => setNewDateName(e.target.value)}
                                placeholder={`e.g., ${generateDefaultDateName()}`}
                                required
                            />
                            <button type="submit" className="btn btn-success btn-sm">
                                + Add Date
                            </button>
                        </form>
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
                                                        {editingId === date._id ? (
                                                            <input
                                                                type="text"
                                                                className="edit-input"
                                                                value={editingName}
                                                                onChange={(e) => setEditingName(e.target.value)}
                                                                onBlur={() => handleUpdateDate(date._id)}
                                                                onKeyPress={(e) => e.key === 'Enter' && handleUpdateDate(date._id)}
                                                                autoFocus
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        ) : (
                                                            <span className="date-name">{date.name}</span>
                                                        )}
                                                    </div>

                                                    <div className="date-actions">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingId(date._id);
                                                                setEditingName(date.name);
                                                            }}
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
                                <h3>🕐 Manage Slots for {selectedDate.name}</h3>
                                <p>Click on any slot to toggle its availability</p>
                            </div>

                            <div className="slots-grid-admin">
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
