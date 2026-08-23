import React, { useState } from 'react';
import RequestForm from './RequestForm';
import TrackRequest from './TrackRequest';
import logo from './barangay-logo.jpg';
import './App.css';

const DOCUMENTS = [
  { name: 'Barangay Clearance',       desc: 'For employment, business, and legal purposes',        icon: '📋' },
  { name: 'Certificate of Residency', desc: 'Proof that you are a resident of this barangay',      icon: '🏠' },
  { name: 'Certificate of Indigency', desc: 'For free medical, legal, and educational assistance',  icon: '🤝' },
  { name: 'Business Clearance',       desc: 'Required for registering or renewing a business permit', icon: '🏪' },
  { name: 'Good Moral Certificate',   desc: 'For school, employment, and other requirements',        icon: '✅' },
];

function App() {
  const [page, setPage] = useState('home');
  const [trackNumber, setTrackNumber] = useState('');

  const goRequest = () => setPage('request');
  const goTrack = (controlNumber) => {
    if (controlNumber) setTrackNumber(controlNumber);
    setPage('track');
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-logo">
              <img
                src={logo}
                alt="Barangay 697 Zone 76 Logo"
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="header-title">Barangay 697 Zone 76</div>
              <div className="header-sub">Malate, Manila — Resident Portal</div>
            </div>
          </div>
          <nav className="header-nav">
            <button className={`nav-btn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>Home</button>
            <button className={`nav-btn ${page === 'request' ? 'active' : ''}`} onClick={goRequest}>Request Document</button>
            <button className={`nav-btn ${page === 'track' ? 'active' : ''}`} onClick={() => goTrack()}>Track Request</button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="main">
        {page === 'home' && (
          <div>
            {/* Hero */}
            <div className="hero">
              <div className="hero-content">
                <div className="hero-badge">Republic of the Philippines • City of Manila</div>
                <h1 className="hero-title">Barangay 697 Zone 76</h1>
                <p className="hero-sub">Online Document Request Portal — Malate, Manila</p>
                <p className="hero-desc">Request your barangay documents online without leaving your home. Fast, easy, and convenient.</p>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={goRequest}>Request a Document</button>
                  <button className="btn-outline" onClick={() => goTrack()}>Track My Request</button>
                </div>
              </div>
            </div>

            {/* Documents Available */}
            <div className="section">
              <h2 className="section-title">Available Documents</h2>
              <div className="doc-grid">
                {DOCUMENTS.map((doc) => (
                  <div className="doc-card" key={doc.name}>
                    <div className="doc-icon">{doc.icon}</div>
                    <h3 className="doc-name">{doc.name}</h3>
                    <p className="doc-desc">{doc.desc}</p>
                    <button className="btn-outline btn-sm" onClick={goRequest}>Request Now</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact / Info */}
            <div className="section section-muted">
              <h2 className="section-title">Need Help?</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div>
                    <div className="info-label">Address</div>
                    <div className="info-value">Barangay 697 Zone 76, Malate, Manila</div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🕛</span>
                  <div>
                    <div className="info-label">Office Hours</div>
                    <div className="info-value">Monday–Friday, 8:00 AM – 5:00 PM</div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">✉️</span>
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-value">pb.brgy697@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === 'request' && <RequestForm onTrack={goTrack} />}
        {page === 'track' && <TrackRequest initialNumber={trackNumber} />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div>🏛️ Barangay 697 Zone 76 — Malate, Manila, District V, City of Manila</div>
        <div style={{ marginTop: 4, fontSize: 11, opacity: 0.7 }}>
          © {new Date().getFullYear()} Barangay Management System
        </div>
      </footer>
    </div>
  );
}

export default App;
