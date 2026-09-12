import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://barangay-system-xf6j.onrender.com/api';

const STATUS_COLORS = {
  Pending: { bg: '#fef3c7', color: '#c27803' },
  Approved: { bg: '#dbeafe', color: '#1a56db' },
  Released: { bg: '#d1fae5', color: '#057a55' },
  Rejected: { bg: '#fee2e2', color: '#c81e1e' },
};

const Dashboard = ({ onLogout, onRequestDocument }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('residentToken');
    if (!token) { onLogout(); return; }
    axios.get(`${API}/resident-accounts/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setData(res.data.data))
      .catch(err => {
        if (err.response?.status === 401) onLogout();
        else setError('Could not load your profile.');
      });
  }, [onLogout]);

  if (error) return <div className="section"><div className="alert-error">{error}</div></div>;
  if (!data) return null;

  const { resident, requests } = data;

  return (
    <div className="section">
      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>My Resident Profile</h2>
        <p>Welcome back, {resident?.firstName}.</p>
      </div>

      <div className="form-section" style={{ maxWidth: 780, margin: '0 auto 24px' }}>
        <h3 className="form-section-title">Profile</h3>
        <div className="track-detail-row"><span className="track-detail-label">Full Name</span><span className="track-detail-value">{resident?.lastName}, {resident?.firstName} {resident?.middleName || ''}</span></div>
        <div className="track-detail-row"><span className="track-detail-label">Address</span><span className="track-detail-value">{resident?.address}</span></div>
        <div className="track-detail-row"><span className="track-detail-label">Contact</span><span className="track-detail-value">{resident?.contactNumber || '—'}</span></div>
        <div className="track-detail-row"><span className="track-detail-label">Email</span><span className="track-detail-value">{resident?.email || '—'}</span></div>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#14315c' }}>My Document Requests</h3>
          <button className="btn-primary btn-sm" onClick={onRequestDocument}>Request a Document</button>
        </div>

        {requests.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 14 }}>You haven't submitted any document requests yet.</p>
        ) : requests.map((r) => {
          const s = STATUS_COLORS[r.status] || { bg: '#f3f4f6', color: '#6b7280' };
          return (
            <div key={r.controlNumber} className="track-result-header" style={{ marginBottom: 10 }}>
              <div>
                <div className="track-control">Control #: <strong>{r.controlNumber}</strong></div>
                <div className="track-doc-type">{r.documentType}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{r.purpose}</div>
              </div>
              <div className="track-status" style={{ background: s.bg, color: s.color }}>{r.status}</div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button className="btn-outline" onClick={onLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default Dashboard;
