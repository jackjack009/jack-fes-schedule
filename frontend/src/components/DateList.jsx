import './DateList.css';

const DateList = ({ dates, selectedDate, onSelectDate }) => {
    return (
        <div className="date-list">
            <div className="date-list-header">
                <h3>📆 Dates</h3>
            </div>

            <div className="date-list-items">
                {dates.length === 0 ? (
                    <div className="date-list-empty">
                        <p>No dates available</p>
                        <span>Contact admin to add dates</span>
                    </div>
                ) : (
                    dates.map((date, index) => (
                        <div
                            key={date._id}
                            className={`date-item ${selectedDate?._id === date._id ? 'active' : ''}`}
                            onClick={() => onSelectDate(date)}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="date-item-content">
                                <span className="date-item-name">{date.name}</span>
                                <span className="date-item-slots">
                                    {date.slots.filter(s => s.available).length} / {date.slots.length}
                                </span>
                            </div>
                            <div className="date-item-indicator"></div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DateList;
