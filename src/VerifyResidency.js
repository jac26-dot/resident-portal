import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://barangay-system-xf6j.onrender.com/api';

const VerifyResidency = ({ onVerified, onGoRequest }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', birthDate: '', address: '', contactNumber: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null | 'verified' | 'failed'
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.birthDate || !form.address) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/residents/verify`, form);
      const data = res.data.data;
      if (data.verified) {
        sessionStorage.setItem('verificationToken', data.token);
        sessionStorage.setItem('verifiedResident', JSON.stringify({
          residentId: data.residentId,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          address: data.address,
        }));
        setResult('verified');
        if (onVerified) onVerified(data);
      } else {
        setResult('failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result === 'verified') {
    return (
      <div className="section">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Resident Verified</h2>
          <p>You may now request barangay documents through this portal.</p>
          <div className="success-btns">
            <button className="btn-primary" onClick={onGoRequest}>Request a Document</button>
          </div>
        </div>
      </div>
    );
  }

  if (result === 'failed') {
    return (
      <div className="section">
        <div className="success-box">
          <div className="success-icon">❌</div>
          <h2>Residency Could Not Be Verified</h2>
          <p>You are not currently eligible to request documents through this portal based on the information provided.</p>
          <div className="success-details">
            <div>This can happen if your information doesn't exactly match our records, or if you're not yet registered as a resident.</div>
            <div>If you believe this is an error, please visit the barangay hall or check our <strong>Hotlines</strong> page to get in touch.</div>
          </div>
          <div className="success-btns">
            <button className="btn-outline" onClick={() => setResult(null)}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="form-header" style={{ padding: 0, marginBottom: 24, textAlign: 'center' }}>
        <h2>Verify Your Residency</h2>
        <p>Before requesting a document, we need to confirm you're a registered resident of Barangay 697 Zone 76.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input className="form-control" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input className="form-control" name="contactNumber" placeholder="09XXXXXXXXX" value={form.contactNumber} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Complete Address *</label>
            <input className="form-control" name="address" placeholder="House No., Street, Barangay, City" value={form.address} onChange={handleChange} />
          </div>
        </div>

        <div className="form-note">
          Your information is checked against official barangay records and is not shared publicly. See our privacy notice for details.
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Residency'}
        </button>
      </form>
    </div>
  );
};

export default VerifyResidency;
