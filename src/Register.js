import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://barangay-system-xf6j.onrender.com/api';

function passwordStrength(pw) {
  if (!pw) return { label: '', pct: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Very weak', pct: 20, color: '#c81e1e' },
    { label: 'Weak', pct: 40, color: '#c27803' },
    { label: 'Fair', pct: 60, color: '#c27803' },
    { label: 'Good', pct: 80, color: '#2f5fb3' },
    { label: 'Strong', pct: 100, color: '#057a55' },
  ];
  return levels[Math.min(score, 4)];
}

const EMPTY = {
  firstName: '', middleName: '', lastName: '', birthDate: '', gender: 'Male', civilStatus: 'Single',
  address: '', contactNumber: '', email: '',
  password: '', confirmPassword: '', agreeTerms: false,
  isVoter: false, isIndigent: false, isSeniorCitizen: false,
};

const Register = ({ onDone, onGoLogin, onBack, onNeedOtp }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const strength = passwordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.agreeTerms) {
      setError('You must agree to the Terms and Conditions and Privacy Notice to continue.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/resident-accounts/register`, form);
      if (res.data.data.requiresOtp) {
        onNeedOtp(res.data.data.email);
      } else {
        setSuccess(res.data.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Account Created</h2>
          <p>{success}</p>
          <div className="success-btns">
            <button className="btn-primary" onClick={onGoLogin}>Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}
      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>Create a Resident Account</h2>
        <p>Register once to track all your document requests in one place. Admin approval is required before you can log in.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="request-form" noValidate>
        <div className="form-section">
          <h3 className="form-section-title">Personal Information</h3>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-first">First Name *</label>
              <input id="reg-first" className="form-control" name="firstName" value={form.firstName} onChange={handleChange} required aria-required="true" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-middle">Middle Name <span style={{fontWeight:400,color:'#6b7280'}}>(optional)</span></label>
              <input id="reg-middle" className="form-control" name="middleName" value={form.middleName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-last">Last Name *</label>
              <input id="reg-last" className="form-control" name="lastName" value={form.lastName} onChange={handleChange} required aria-required="true" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-dob">Date of Birth *</label>
              <input id="reg-dob" className="form-control" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required aria-required="true" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-gender">Gender</label>
              <select id="reg-gender" className="form-control" name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option><option>Female</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-civil">Civil Status</label>
            <select id="reg-civil" className="form-control" name="civilStatus" value={form.civilStatus} onChange={handleChange}>
              <option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Address & Contact</h3>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-address">Complete Address *</label>
            <input id="reg-address" className="form-control" name="address" placeholder="House No., Street, Zone 76" value={form.address} onChange={handleChange} required aria-required="true" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-contact">Contact Number *</label>
              <input id="reg-contact" className="form-control" name="contactNumber" placeholder="09XXXXXXXXX" value={form.contactNumber} onChange={handleChange} required aria-required="true" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address *</label>
              <input id="reg-email" className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required aria-required="true" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Account Security</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password *</label>
              <input id="reg-password" className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required aria-required="true" aria-describedby="pw-strength" />
              {form.password && (
                <div id="pw-strength" style={{ marginTop: 6 }}>
                  <div style={{ height: 5, background: '#eef1f5', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, transition: 'width .2s' }} />
                  </div>
                  <span style={{ fontSize: 12, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password *</label>
              <input id="reg-confirm" className="form-control" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required aria-required="true" />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <span style={{ fontSize: 12, color: '#c81e1e' }}>Passwords do not match.</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Resident Classification <span style={{fontWeight:400,color:'#6b7280',fontSize:12}}>(optional)</span></h3>
          <p className="form-note" style={{ margin: '0 0 14px' }}>
            Select any that apply. These are self-declared at registration and may be confirmed by the barangay office; selecting a classification here does not by itself constitute official verification.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5 }}>
              <input type="checkbox" name="isVoter" checked={form.isVoter} onChange={handleChange} /> Registered Voter
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5 }}>
              <input type="checkbox" name="isIndigent" checked={form.isIndigent} onChange={handleChange} /> Indigent
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5 }}>
              <input type="checkbox" name="isSeniorCitizen" checked={form.isSeniorCitizen} onChange={handleChange} /> Senior Citizen
            </label>
          </div>
        </div>

        <div className="form-note" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} style={{ marginTop: 3 }} required aria-required="true" />
          <label htmlFor="agreeTerms" style={{ fontSize: 13 }}>
            I have read and agree to the <a href="#/terms">Terms and Conditions</a> and the <a href="#/privacy">Privacy Notice</a>.
          </label>
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Resident Account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 14 }}>
          Already have an account? <button type="button" className="btn-link" onClick={onGoLogin}>Log in</button>
        </p>
      </form>
    </div>
  );
};

export default Register;
