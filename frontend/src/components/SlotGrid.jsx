import { useState } from 'react';
import './SlotGrid.css';

const FB_PAGE   = 'https://www.facebook.com/jackjack00900/';
const MESSENGER = 'https://m.me/jackjack00900';

const SlotGrid = ({ selectedDate }) => {
    const [activeSlot, setActiveSlot] = useState(null); // slot object | null

    const openPopup  = (slot) => setActiveSlot(slot);
    const closePopup = ()     => setActiveSlot(null);

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
        <>
            {/* Slot-book popup */}
            {activeSlot && (
                <div className="slot-popup-overlay" onClick={closePopup}>
                    <div className="slot-popup-card" onClick={(e) => e.stopPropagation()}>
                        <button className="slot-popup-close" onClick={closePopup} aria-label="Close">×</button>

                        <div className="slot-popup-icon">🕐</div>
                        <p className="slot-popup-time">{activeSlot.time}</p>
                        <p className="slot-popup-msg">
                            Slot này còn, muốn book thì nhắn thằng Jack liền!
                        </p>

                        <div className="slot-popup-actions">
                            <a
                                href={FB_PAGE}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="slot-popup-btn slot-popup-btn--fb"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </a>
                            {/* <a
                                href={MESSENGER}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="slot-popup-btn slot-popup-btn--msg"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.446 5.51 3.707 7.206V22l3.398-1.87c.907.252 1.87.387 2.895.387 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.993 12.616l-2.558-2.73-4.993 2.73 5.491-5.832 2.623 2.73 4.927-2.73-5.49 5.832z" />
                                </svg>
                                Message
                            </a> */}
                        </div>
                    </div>
                </div>
            )}

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
                                onClick={() => slot.available && openPopup(slot)}
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
                            <p className="full-slot-text">
                                {selectedDate.fullSlotMessage
                                    ? selectedDate.fullSlotMessage
                                    : <>Fes này đủ KPI slot rồi, tạm dừng cho đỡ mệt. <br /> Xin mời em đi tham khảo thầy khác.</>
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SlotGrid;
