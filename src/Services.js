import React from 'react';
import { DOC_INFO, DOCUMENT_TYPES } from './documentInfo';

const Services = ({ onBack, onGoLogin }) => (
  <div className="section">
    {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}

    <div className="form-header" style={{ textAlign: 'center' }}>
      <h2>Barangay Services</h2>
      <p>Information about the documents and certificates available through this portal.</p>
    </div>

    <div className="doc-grid" style={{ maxWidth: 1000, margin: '0 auto 24px' }}>
      {DOCUMENT_TYPES.map(t => (
        <div className="doc-card" key={t} style={{ gap: 10 }}>
          <h3 className="doc-name">{t}</h3>
          <p className="doc-desc">{DOC_INFO[t].desc}</p>
          <div style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>
            <strong style={{ color: 'var(--navy-deep)' }}>Requirements:</strong> {DOC_INFO[t].requirements.join(', ')}
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--navy-deep)', marginTop: 6 }}>
            <span>⏱ {DOC_INFO[t].processing}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="form-note" style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
      To request any of these documents, please log in to your Resident Portal account. If you don't have one yet, you can register for free.
    </div>
    {onGoLogin && (
      <div className="success-btns" style={{ marginTop: 16 }}>
        <button className="btn-primary" onClick={onGoLogin}>Resident Login</button>
      </div>
    )}
  </div>
);

export default Services;
