import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Cùng nhau bắt trọn <span className="highlight">Khoảnh khắc của bạn</span>
                        </h1>
                        <p className="hero-subtitle">
                            Chuyên đi chụp fes.
                            Lâu lâu đi chụp ngoài, kỷ yếu lung tung.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/samples/fes" className="btn btn-primary">
                                Ngó samples
                            </Link>
                            <Link to="/contact" className="btn btn-secondary">
                                Ngó giá cả
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img
                            src="/images/hero-photo.jpg"
                            alt="Jack Photography"
                            className="hero-photo"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="image-placeholder" style={{ display: 'none' }}>
                            <span>📸</span>
                            <p>Add your photo to:</p>
                            <code>frontend/public/images/hero-photo.jpg</code>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-container">
                    <h2 className="section-title">About Me</h2>
                    <div className="about-content">
                        <div className="about-image">
                            <img
                                src="/images/portrait.png"
                                alt="Jack Portrait"
                                className="portrait-photo"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="image-placeholder" style={{ display: 'none' }}>
                                <span>👤</span>
                                <p>Add your portrait to:</p>
                                <code>frontend/public/images/portrait.jpg</code>
                            </div>
                        </div>
                        <div className="about-text">
                            <h3>Hello các fen, Jack Jack nè</h3>
                            <p>
                                Nếu các fen đi fes mà cần 1 anh photographer đẹp trai, thông minh, duyên dáng, hài hước, dễ thương, đáng yêu, tận tình, chu đáo, chăm như chăm con, trả ảnh đẹp lung linh,
                                thì các fen hãy thức tỉnh đi. Không có ai hoàn hảo dị đâu.
                                Jack Jack là người tiệm cận sự hoàn hảo đó nhất rồi 😎
                            </p>
                            <p>
                                Hi vọng các fen sẽ ủng hộ Jack Jack, và có nhiều giây phút chụp choẹt vui vẻ nghen!
                            </p>
                            <div className="stats">
                                <div className="stat-item">
                                    <h4>200+</h4>
                                    <p>Khách iu hài hòng</p>
                                </div>
                                <div className="stat-item">
                                    <h4>50+</h4>
                                    <p>Fes đã từng có dấu chân</p>
                                </div>
                                <div className="stat-item">
                                    <h4>2+</h4>
                                    <p>Năm kinh nghiệm bấm máy</p>
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
                            <div className="service-icon">🎉</div>
                            <h3>Chụp fes</h3>
                            <p>Các thể loại fes ở Hà Nội này cứ rảnh là mình đi được hết</p>
                        </Link>

                        <Link to="/samples/shoot" className="service-card">
                            <div className="service-icon">📷</div>
                            <h3>Shoot ngoài</h3>
                            <p>Mặc dù hạn chế nhận shoot ngoài nhưng mà có team là đi liền</p>
                        </Link>

                        <Link to="/samples/ky-yeu" className="service-card">
                            <div className="service-icon">🎓</div>
                            <h3>Kỷ Yếu</h3>
                            <p>Tốt nghiệp mà muốn ảnh xinh? Chọn ngay anh Jack Jack</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2>Các fen đã sẵn sàng bùng nổ với Jack Jack chưa?</h2>
                    <p>Check xem mình rảnh rỗi khung giờ nào và búc ngay nè</p>
                    <div className="cta-buttons">
                        <Link to="/calendar" className="btn btn-primary">
                            Xem lịch
                        </Link>
                        <Link to="/contact" className="btn btn-secondary">
                            Lên kí hợp đồng
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
