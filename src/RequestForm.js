import React, { useState } from 'react';
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

const CIVIL_STATUS = ['Single', 'Married', 'Widowed', 'Separated'];

const EMPTY = {
  firstName:'', middleName:'', lastName:'', birthDate:'', gender:'Male',
  civilStatus:'Single', address:'', contactNumber:'', email:'',
  documentType:'Barangay Clearance', purpose:'',
};

const RequestForm = ({ onTrack }) => {
  const [form,     setForm]     = useState(EMPTY);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.address || !form.purpose) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      // Look up an existing resident using the PUBLIC search
      // endpoint (no admin auth required, minimal fields returned).
      const searchRes = await axios.get(`${API}/residents/search-public`, {
        params: { firstName: form.firstName, lastName: form.lastName },
      });

      let residentId = null;
      const existing = (searchRes.data.data || []).find(r =>
        r.firstName.toLowerCase() === form.firstName.toLowerCase() &&
        r.lastName.toLowerCase()  === form.lastName.toLowerCase()
      );

      if (existing) {
        residentId = existing.id;
      } else {
        const newRes = await axios.post(`${API}/residents/public`, {
          firstName:     form.firstName,
          middleName:    form.middleName,
          lastName:      form.lastName,
          birthDate:     form.birthDate,
          gender:        form.gender,
          civilStatus:   form.civilStatus,
          address:       form.address,
          contactNumber: form.contactNumber,
          email:         form.email,
        });
        residentId = newRes.data.data?.id;
      }

      const docRes = await axios.post(`${API}/documents/public`, {
        residentId,
        documentType: form.documentType,
        purpose:      form.purpose,
      });

      setSuccess(docRes.data.data);
      setForm(EMPTY);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <button className="btn-outline" onClick={() => setSuccess(null)}>Submit Another Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="form-header">
        <h2>Request a Document</h2>
        <p>Fill out the form below to request a barangay document online.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="request-form">
        {/* Document Type */}
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

        {/* Personal Info */}
        <div className="form-section">
          <h3 className="form-section-title">Personal Information</h3>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Middle Name</label>
              <input className="form-control" name="middleName" value={form.middleName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-control" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-control" name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Civil Status</label>
              <select className="form-control" name="civilStatus" value={form.civilStatus} onChange={handleChange}>
                {CIVIL_STATUS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Complete Address *</label>
            <input className="form-control" name="address" placeholder="House No., Street, Barangay, City" value={form.address} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input className="form-control" name="contactNumber" placeholder="09XXXXXXXXX" value={form.contactNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
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
