import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './HomePage.css';
import homeBackground from '../../assets/home.jpeg';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section con imagen de fondo */}
      <div 
        className="home-hero"
        style={{ backgroundImage: `url(${homeBackground})` }}
      >
        <div className="hero-overlay">
          <h1 className="home-title">
            MarketPlace <span className="text-gradient">INTERCAMBIA-TEC</span>
          </h1>
          <p className="home-subtitle">
            Tu plataforma de confianza para comprar o vender dentro de la comunidad universitaria de los coyotes
          </p>
          
          {/* Quick Navigation Cards - Mismo nivel */}
          <div className="quick-nav-grid">
            <Link to="/comprar" className="quick-nav-card">
              <div className="card-content">
                <h3 className="quick-nav-title">Comprar</h3>
                <p className="quick-nav-description">Encuentra lo que necesitas a buen precio</p>
              </div>
            </Link>

            <Link to="/vender" className="quick-nav-card">
              <div className="card-content">
                <h3 className="quick-nav-title">Vender</h3>
                <p className="quick-nav-description">Da nueva vida a lo que ya no usas</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;