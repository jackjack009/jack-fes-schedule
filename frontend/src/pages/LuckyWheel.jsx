import React, { useState } from 'react';
import './LuckyWheel.css';

const segments = [
    { title: 'Lì xì', detail: 'Bốc ngẫu nhiên 1 cái lì xì từ anh Jack', background: '#BF4646' },
    { title: 'Sủa', detail: 'Ngồi và sủa gâu gâu như 1 con chóa :>', background: '#7EACB5' },
    { title: 'Lì xì', detail: 'Bốc ngẫu nhiên 1 cái lì xì từ anh Jack', background: '#BF4646' },
    { title: 'Facebook', detail: 'Lên bài post Facebook rằng bạn rất thèm cứt', background: '#134E8E' },
    { title: 'Lì xì', detail: 'Bốc ngẫu nhiên 1 cái lì xì từ anh Jack', background: '#BF4646' },
    { title: 'Hát 1 bài', detail: 'Dài ít nhất 30 giây', background: '#87B6BC' },
    { title: 'Lì xì', detail: 'Bốc ngẫu nhiên 1 cái lì xì từ anh Jack', background: '#BF4646' },
    { title: 'Truth time', detail: 'Trả lời thật lòng 1 câu hỏi', background: '#8A7650' }
];

const SPIN_DURATION = 5200; // ms — 30% longer than original 4000ms

const LuckyWheel = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const spin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setShowPopup(false);

        const segmentSize = 360 / segments.length; // 45°

        // 1. Pick a winner up-front
        const targetIndex = Math.floor(Math.random() * segments.length);

        // 2. Compute exactly what final rotation lands the pointer (at 90°, = 3-o'clock)
        //    on the CENTER of targetIndex's slice.
        //    Slice i spans [i*45, (i+1)*45]° from the wheel's 0° (top).
        //    Center of slice i from wheel's perspective = i*45 + 22.5°
        //    Pointer is at 90° in screen space.
        //    Condition: (90 - finalRotation) mod 360 = targetCenter
        //    → finalRotation mod 360 = (90 - targetCenter + 360) % 360
        const targetCenter = targetIndex * segmentSize + segmentSize / 2;
        const finalRelative = (90 - targetCenter + 360) % 360;

        // 3. Figure out how far to spin from current rotation
        const currentRelative = rotation % 360;
        let delta = finalRelative - currentRelative;
        if (delta <= 0) delta += 360;

        // 4. Add 8 full rotations for a long, dramatic spin
        const newRotation = rotation + 8 * 360 + delta;
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setResult(segments[targetIndex]);
            setShowPopup(true);
        }, SPIN_DURATION);
    };

    return (
        <div className="luckywheel-page">
            <div className="luckywheel-container">
                <h2 className="luckywheel-title">Chiếc nón kì dị,<br></br>thưởng phạt công tâm!</h2>

                <div className="wheel-wrapper">
                    {/* Pointer on the right, pointing INTO the wheel */}
                    <div className="wheel-pointer"></div>

                    <div
                        className="wheel-inner"
                        onClick={spin}
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: isSpinning
                                ? `transform ${SPIN_DURATION}ms cubic-bezier(0.22, 1, 0.15, 1)`
                                : 'none'
                        }}
                    >
                        <svg viewBox="0 0 100 100" className="wheel-svg">
                            {segments.map((seg, i) => {
                                const angle = 360 / segments.length; // 45°
                                const startAngle = angle * i;

                                const x1 = 50 + 50 * Math.cos(((startAngle - 90) * Math.PI) / 180);
                                const y1 = 50 + 50 * Math.sin(((startAngle - 90) * Math.PI) / 180);
                                const x2 = 50 + 50 * Math.cos(((startAngle + angle - 90) * Math.PI) / 180);
                                const y2 = 50 + 50 * Math.sin(((startAngle + angle - 90) * Math.PI) / 180);

                                // Mid angle of this slice for text placement
                                const midAngle = startAngle + angle / 2;
                                const midRad = ((midAngle - 90) * Math.PI) / 180;
                                // Position text at ~65% of the radius from center
                                const textR = 32;
                                const tx = 50 + textR * Math.cos(midRad);
                                const ty = 50 + textR * Math.sin(midRad);

                                return (
                                    <g key={i}>
                                        {/* Slice */}
                                        <path
                                            d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                                            fill={seg.background}
                                            stroke="#fff"
                                            strokeWidth="0.15"
                                        />
                                        {/* Radial text: centered at (tx,ty), rotated along the radius */}
                                        <text
                                            x={tx}
                                            y={ty}
                                            className="wheel-text"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="#fff"
                                            transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                                        >
                                            {seg.title}
                                        </text>
                                    </g>
                                );
                            })}
                            {/* Center circle */}
                            <circle cx="50" cy="50" r="9" fill="#fff" />
                            <circle cx="50" cy="50" r="7" fill="#1a1a1a" />
                            <circle cx="50" cy="50" r="3" fill="#fff" />
                        </svg>
                    </div>
                </div>

                <div className="spin-hint">
                    {isSpinning ? 'Đang quay...' : 'Chạm vào vòng quay để bắt đầu!'}
                </div>

                {showPopup && result && (
                    <div className="result-overlay" onClick={() => setShowPopup(false)}>
                        <div className="result-popup" onClick={e => e.stopPropagation()}>
                            <div className="result-header">
                                <h3>Kết quả</h3>
                                <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
                            </div>
                            <div className="result-body">
                                <h4 style={{ color: result.background }}>{result.title}</h4>
                                <p>{result.detail}</p>
                            </div>
                            <button className="confirm-btn" onClick={() => setShowPopup(false)}>Đã hiểu!</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LuckyWheel;
