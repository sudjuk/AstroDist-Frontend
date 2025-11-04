import { Link } from 'react-router-dom';
import './styles/HomePage.css';

function HomePage() {
  return (
    <>
      <div className="div-wrapper">
        <Link to="/" className="text-wrapper-3">AstroDist</Link>
        <nav className="nav-right"><Link to="/astronomy" className="nav-link-right">Days</Link></nav>
      </div>
      <div className="home-video-container">
        <video className="home-background-video" autoPlay loop muted playsInline>
          <source src="/Endless Space.mp4" type="video/mp4" />
        </video>
        <div className="home-content">
          <h1 className="hero-title">AstroDist</h1>
          <p className="hero-subtitle">Сервис для расчёта расстояния до астероидов</p>
        </div>
      </div>
    </>
  );
}

export default HomePage;


