import './SlotGrid.css';

const SlotGrid = ({ selectedDate }) => {
    if (!selectedDate) {
        return (
            <div className="slot-grid-empty">
                <div className="slot-grid-empty-content">
                    <span className="empty-icon">📅</span>
                    <h3>Select a Date</h3>
                    <p>Choose a date from the list to view available time slots</p>
                </div>
            </div>
        );
    }

    return (
        <div className="slot-grid">
            <div className="slot-grid-header">
                <h3>🕐 Lịch cho {selectedDate.name}</h3>
                <div className="slot-grid-legend">
                    <div className="legend-item">
                        <span className="legend-dot available"></span>
                        <span>Trống, book đi</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot unavailable"></span>
                        <span>Đã có người giựt</span>
                    </div>
                </div>
            </div>

            <div className="slot-grid-body">
                <div className="slot-grid-items">
                    {selectedDate.slots.map((slot, index) => (
                        <div
                            key={slot._id}
                            className={`slot-item ${slot.available ? 'available' : 'unavailable'}`}
                            style={{ animationDelay: `${index * 20}ms` }}
                        >
                            <div className="slot-time">{slot.time}</div>
                            <div className="slot-status">
                                {slot.available ? (
                                    <span className="status-badge success">✓ Available</span>
                                ) : (
                                    <span className="status-badge danger">✗ Booked</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {selectedDate.fullSlot && (
                    <div className="full-slot-overlay">
                        <p className="full-slot-text">Fes này đủ KPI slot rồi, tạm dừng cho đỡ mệt. <br /> Xin mời em đi tham khảo thầy khác.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlotGrid;
