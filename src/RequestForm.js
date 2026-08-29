import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Your real live backend — update this if it ever changes.
const API = 'https://barangay-system-xf6j.onrender.com/api';

const DOCUMENT_TYPES = [
  'Barangay Clearance',
  'Certificate of Residency',
  'Certificate of Indigency',
  'Business Clearance',
  'Good Moral Certificate',
];

const RequestForm = ({ onTrack, onVerify }) => {
  const [verified, setVerified] = useState(null); // null while checking
  const [form, setForm] = useState({ documentType: 'Barangay Clearance', purpose: '' });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('verificationToken');
    const resident = sessionStorage.getItem('verifiedResident');
    if (token && resident) {
      setVerified(JSON.parse(resident));
    } else {
      setVerified(false);
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.purpose) {
      setError('Please enter the purpose of your request.');
      return;
    }
    const token = sessionStorage.getItem('verificationToken');
    if (!token) {
      setVerified(false);
      return;
    }
    setLoading(true);
    try {
      const docRes = await axios.post(`${API}/documents/public`, {
        residentId: verified.residentId,
        documentType: form.documentType,
        purpose: form.purpose,
        verificationToken: token,
      });
      setSuccess(docRes.data.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token expired or mismatched — require re-verification.
        sessionStorage.removeItem('verificationToken');
        sessionStorage.removeItem('verifiedResident');
        setVerified(false);
      }
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Still checking sessionStorage
  if (verified === null) return null;

  // Not verified yet — send them to verification instead of the form.
  if (verified === false) {
    return (
      <div className="section">
        <div className="success-box">
          <div className="success-icon">🔒</div>
          <h2>Verification Required</h2>
          <p>Please verify your residency before requesting a document.</p>
          <div className="success-btns">
            <button className="btn-primary" onClick={onVerify}>Verify Residency</button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="section">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Request Submitted Successfully!</h2>
          <p>Your document request has been submitted. Please save your control number.</p>
          <div className="control-number-box">
            <div className="control-label">Your Control Number</div>
            <div className="control-number">{success.controlNumber}</div>
            <div className="control-note">Use this number to track your request</div>
          </div>
          <div className="success-details">
            <div><strong>Document:</strong> {success.documentType}</div>
            <div><strong>Status:</strong> {success.status || 'Pending'}</div>
            <div><strong>Next Step:</strong> Wait for the barangay to process your request. Visit the barangay hall to claim your document.</div>
          </div>
          <div className="success-btns">
            <button className="btn-primary" onClick={() => onTrack(success.controlNumber)}>Track My Request</button>
            <button className="btn-outline" onClick={() => { setSuccess(null); setForm({ documentType: 'Barangay Clearance', purpose: '' }); }}>Submit Another Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>Request a Document</h2>
        <p>Fill out the form below to request a barangay document online.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-section">
          <h3 className="form-section-title">Verified Resident</h3>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-control" value={verified.firstName} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Middle Name</label>
              <input className="form-control" value={verified.middleName || ''} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-control" value={verified.lastName} disabled />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-control" value={verified.address} disabled />
          </div>
          <div className="form-note">
            These details are locked to your verified record. If anything is incorrect, please visit the barangay hall to update your resident record.
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Document Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Document Type *</label>
              <select className="form-control" name="documentType" value={form.documentType} onChange={handleChange}>
                {DOCUMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Purpose *</label>
              <input className="form-control" name="purpose" placeholder="e.g. Employment, School enrollment..." value={form.purpose} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-note">
          <strong>Note:</strong> Please make sure all information is correct. You will need to present a valid ID when claiming your document at the barangay hall.
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Document Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
