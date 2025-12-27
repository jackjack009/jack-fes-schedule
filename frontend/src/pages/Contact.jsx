import { useState } from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            {/* Pricing Section */}
            <section className="pricing-section">
                <div className="pricing-container">
                    <h1>Bảng Giá Đi Fes</h1>
                    <p className="pricing-subtitle">Các fen chọn gói theo nhu cầu nghen</p>

                    <div className="pricing-grid">
                        <div className="pricing-card featured">
                            <div className="pricing-badge">Phổ biến</div>
                            <div className="pricing-icon">👤</div>
                            <h3>Solo</h3>
                            <div className="pricing-price">
                                <span className="price">197k</span>
                                <span className="per">/người</span>
                            </div>
                            <ul className="pricing-features">
                                <li>⏱️ 15 phút</li>
                                <li>📸 4 ảnh</li>
                                <li>✨ Retouch cơ bản</li>
                                <li>🎨 Hên xui được ghép effect</li>
                            </ul>
                        </div>

                        <div className="pricing-card">
                            <div className="pricing-icon">👥</div>
                            <h3>Couple/Some</h3>
                            <div className="pricing-price">
                                <span className="price">180k</span>
                                <span className="per">/người</span>
                            </div>
                            <ul className="pricing-features">
                                <li>⏱️ 15 phút × số người</li>
                                <li>📸 4 ảnh × số người</li>
                                <li>✨ Retouch cơ bản</li>
                                <li>🎁 Giảm giá theo nhóm</li>
                            </ul>
                        </div>

                        <div className="pricing-card">
                            <div className="pricing-icon">🎨</div>
                            <h3>Effect</h3>
                            <div className="pricing-price">
                                <span className="price">Liên hệ</span>
                            </div>
                            <ul className="pricing-features">
                                <li>🌟 Ghép hiệu ứng linh tinh</li>
                                <li>🎬 Thay background vớ vẩn</li>
                                <li>✨ Retouch cơ bản (vì ko có cái nâng cao bao giờ)</li>
                                <li>💬 Chi tiết trao đổi</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="contact-container">
                    <h2>Tìm Jack ở đâu</h2>

                    <div className="contact-grid">
                        {/* Contact Information */}
                        <div className="contact-card contact-info-card">
                            <h3>📞 Thông Tin Liên Hệ</h3>
                            <div className="contact-info-list">
                                <div className="contact-info-item">
                                    <div className="info-icon">📧</div>
                                    <div className="info-content">
                                        <span className="info-label">Email</span>
                                        <a href="mailto:dongkhanh9494@gmail.com">dongkhanh9494@gmail.com</a>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="info-icon">📱</div>
                                    <div className="info-content">
                                        <span className="info-label">Phone</span>
                                        <a href="tel:+84123456789">+84 396 794 957</a>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="info-icon">📍</div>
                                    <div className="info-content">
                                        <span className="info-label">Location</span>
                                        <span>Hà Nội, Việt Nam</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social & Message Combined */}
                        <div className="contact-card social-card">
                            <h3>📱 Follow & Message</h3>
                            <p>Theo dõi để hành hung Jack Jack nào!</p>

                            <div className="social-section">
                                <h4>Follow Me</h4>
                                <a
                                    href="https://www.facebook.com/jackjack00900/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link facebook"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </a>
                            </div>

                            <div className="divider"></div>

                            <div className="message-section">
                                <h4>Send Message</h4>
                                <a
                                    href="https://www.facebook.com/messages/t/9242431789215649"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="messenger-link"
                                >
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.446 5.51 3.707 7.206V22l3.398-1.87c.907.252 1.87.387 2.895.387 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.993 12.616l-2.558-2.73-4.993 2.73 5.491-5.832 2.623 2.73 4.927-2.73-5.49 5.832z" />
                                    </svg>
                                    <span>Chat on Messenger</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
