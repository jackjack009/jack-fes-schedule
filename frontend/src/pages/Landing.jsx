import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-grid">
                    <div className="hero-content">
                        <p className="hero-subtitle">Visual Storyteller</p>
                        <h1 className="hero-title">
                            Capturing <br />
                            <span className="hero-title-italic">The Unseen</span>
                        </h1>
                        <p className="hero-description">
                            Chuyên đi chụp fes. Lâu lâu đi chụp ngoài, kỷ yếu lung tung.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/samples/fes" className="hero-btn hero-btn-primary">
                                Ngó samples
                            </Link>
                            <Link to="/contact" className="hero-btn hero-btn-secondary">
                                Ngó giá cả
                            </Link>
                        </div>
                    </div>

                    <div className="hero-image">
                        <img src="/images/hero-photo.jpg" alt="Jack Jack Photography" />
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <svg className="scroll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="about-container">
                    <div className="about-header">
                        <h2 className="section-title">About Me</h2>
                    </div>

                    <div className="about-content">
                        <div className="about-image">
                            <img src="/images/portrait.jpg" alt="Jack Jack" />
                        </div>
                        <div className="about-text">
                            <h3 className="about-greeting">Hello các fen, Jack Jack nè</h3>
                            <p className="about-bio">
                                Nếu các fen đi fes mà cần 1 anh photographer đẹp trai, thông minh, duyên dáng, hài hước, dễ thương, đáng yêu, tận tình, chu đáo, chăm như chăm con, trả ảnh đẹp lung linh,
                                thì các fen hãy thức tỉnh đi.
                                Không có ai hoàn hảo dị đâu. Jack Jack là người tiệm cận sự hoàn hảo đó nhất rồi 😎
                            </p>
                            <p className="about-bio">
                                Hi vọng các fen sẽ ủng hộ Jack Jack, và có nhiều giây phút chụp choẹt vui vẻ nghen!
                            </p>
                            <div className="about-stats">
                                <div className="stat-item">
                                    <span className="stat-number">200+</span>
                                    <span className="stat-label">Khách iu hài hòng</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">50+</span>
                                    <span className="stat-label">Fes đã từng có dấu chân</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">2+</span>
                                    <span className="stat-label">Năm kinh nghiệm bấm máy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="services-container">
                    <h2 className="section-title">Dịch vụ bên mình</h2>

                    <div className="services-grid">
                        <Link to="/samples/fes" className="service-card">
                            <div className="service-icon">🎭</div>
                            <h3 className="service-title">Chụp fes</h3>
                            <p className="service-description">
                                Các thể loại fes ở Hà Nội này cứ rảnh là mình đi được hết.
                            </p>
                        </Link>

                        <Link to="/samples/shoot" className="service-card">
                            <div className="service-icon">📸</div>
                            <h3 className="service-title">Shoot ngoài</h3>
                            <p className="service-description">
                                Mặc dù hạn chế nhận shoot ngoài nhưng mà có team là đi liền.
                            </p>
                        </Link>

                        <Link to="/samples/ky-yeu" className="service-card">
                            <div className="service-icon">🎓</div>
                            <h3 className="service-title">Kỷ Yếu</h3>
                            <p className="service-description">
                                Tốt nghiệp mà muốn ảnh xinh? Chọn ngay anh Jack Jack.
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">
                        Các fen đã sẵn sàng bùng nổ với Jack Jack chưa?
                    </h2>
                    <p className="cta-subtitle">
                        Check xem mình rảnh rỗi khung giờ nào và búc ngay nè
                    </p>
                    <div className="cta-buttons">
                        <Link to="/calendar" className="cta-button cta-button-primary">
                            Xem lịch
                        </Link>
                        <Link to="/contact" className="cta-button cta-button-secondary">
                            Lên kí hợp đồng
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
