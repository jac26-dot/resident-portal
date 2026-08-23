import React, { useState } from 'react';
import RequestForm from './RequestForm';
import TrackRequest from './TrackRequest';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [trackNumber, setTrackNumber] = useState('');

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-logo">🏛️</div>
            <div>
              <div className="header-title">Barangay 697 Zone 76</div>
              <div className="header-sub">Malate, Manila — Resident Portal</div>
            </div>
          </div>
          <nav className="header-nav">
            <button className={`nav-btn ${page==='home'?'active':''}`} onClick={()=>setPage('home')}>Home</button>
            <button className={`nav-btn ${page==='request'?'active':''}`} onClick={()=>setPage('request')}>Request Document</button>
            <button className={`nav-btn ${page==='track'?'active':''}`} onClick={()=>setPage('track')}>Track Request</button>
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
                  <button className="btn-primary" onClick={()=>setPage('request')}>Request a Document</button>
                  <button className="btn-outline" onClick={()=>setPage('track')}>Track My Request</button>
                </div>
              </div>
            </div>

            {/* Documents Available */}
            <div className="section">
              <h2 className="section-title">Available Documents</h2>
              <div className="doc-grid">
                {[
                  { name:'Barangay Clearance',        desc:'For employment, business, and legal purposes',        icon:'📋' },
                  { name:'Certificate of Residency',  desc:'Proof that you are a resident of this barangay',     icon:'🏠' },
                  { name:'Certificate of Indigency',  desc:'For free medical, legal, and educational assistance', icon:'🤝' },
                  { name:'Business Clearance',        desc:'Required for business permit applications',           icon:'🏪' },
                  { name:'Good Moral Certificate',    desc:'For school, employment, and other requirements',      icon:'⭐' },
                ].map(doc => (
                  <div key={doc.name} className="doc-card" onClick={()=>setPage('request')}>
                    <div className="doc-icon">{doc.icon}</div>
                    <div className="doc-name">{doc.name}</div>
                    <div className="doc-desc">{doc.desc}</div>
                    <div className="doc-request">Request Now →</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="section section-gray">
              <h2 className="section-title">How It Works</h2>
              <div className="steps-grid">
                {[
                  { step:'1', title:'Fill Out the Form', desc:'Enter your personal information and select the document you need.' },
                  { step:'2', title:'Submit Your Request', desc:'Submit online — no need to visit the barangay hall.' },
                  { step:'3', title:'Get Control Number', desc:'You will receive a control number to track your request.' },
                  { step:'4', title:'Pick Up Your Document', desc:'Visit the barangay hall to claim your document when ready.' },
                ].map(s => (
                  <div key={s.step} className="step-card">
                    <div className="step-num">{s.step}</div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="section">
              <h2 className="section-title">Contact Us</h2>
              <div className="contact-grid">
                {[
                  { icon:'📍', label:'Address',  value:'Barangay 697 Zone 76, Malate, Manila' },
                  { icon:'🕐', label:'Office Hours', value:'Monday - Friday, 8:00 AM - 5:00 PM' },
                  { icon:'📞', label:'Contact', value:'Available at the Barangay Hall' },
                ].map(c => (
                  <div key={c.label} className="contact-card">
                    <div className="contact-icon">{c.icon}</div>
                    <div className="contact-label">{c.label}</div>
                    <div className="contact-value">{c.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === 'request' && <RequestForm onTrack={(num) => { setTrackNumber(num); setPage('track'); }} />}
        {page === 'track'   && <TrackRequest initialNumber={trackNumber} />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div>🏛️ Barangay 697 Zone 76 — Malate, Manila, District V, City of Manila</div>
        <div style={{ marginTop:4, fontSize:11, opacity:0.7 }}>© {new Date().getFullYear()} Barangay Management System</div>
      </footer>
    </div>
  );
}

export default App;
