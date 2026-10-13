import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PasswordInput from './PasswordInput';
import logo from './barangay-logo.png';
import brand from './brand';
import './register.css';

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
    { label: 'Weak', pct: 40, color: '#a45f00' },
    { label: 'Fair', pct: 60, color: '#8a5d00' },
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

// What happens after this form, in order.
const STEPS = [
  { title: 'Fill in this form',  text: 'Use your real name and a number we can reach.' },
  { title: 'Wait for approval',  text: 'The barangay office checks your details.' },
  { title: 'Log in',             text: 'Request documents and track them online.' },
];

const Register = ({ onDone, onGoLogin, onBack }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const errorRef = useRef(null);

  // The form is long, so bring the error into view when it appears.
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

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
      setSuccess(res.data.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">
      <aside className="rg-aside">
        <div className="rg-aside-bg" aria-hidden="true">
          <img src={logo} alt="" className="rg-watermark" />
        </div>

        <div className="rg-aside-inner">
          {onBack && (
            <button className="rg-back" onClick={onBack} type="button">
              <span aria-hidden="true">&larr;</span> Back to home
            </button>
          )}

          <img src={logo} alt={`${brand.organizationName} logo`} className="rg-seal" />
          <h2>Create a resident account</h2>
          <p className="rg-aside-sub">
            Register once to track all your document requests in one place.
            An admin must approve your account before you can log in.
          </p>

          <ol className="rg-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="rg-step-num" aria-hidden="true">{i + 1}</span>
                <span className="rg-step-text">
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <section className="rg-main">
        <div className="rg-main-inner">
          {success ? (
            <div className="rg-done" role="status">
              <span className="rg-done-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              <h2>Account created</h2>
              <p>{success}</p>
              <button type="button" className="rg-submit" onClick={onGoLogin}>Go to Login</button>
            </div>
          ) : (
            <>
              <p className="rg-required-note">Fields marked * are required.</p>

              {error && <div className="rg-error" role="alert" ref={errorRef}>{error}</div>}

              <form onSubmit={handleSubmit} className="rg-form" noValidate>
                <fieldset className="rg-section">
                  <legend className="rg-section-title">Personal information</legend>
                  <div className="rg-row">
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-first">First name *</label>
                      <input id="reg-first" className="rg-input" name="firstName" value={form.firstName} onChange={handleChange} autoComplete="given-name" required aria-required="true" />
                    </div>
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-middle">Middle name <small>(optional)</small></label>
                      <input id="reg-middle" className="rg-input" name="middleName" value={form.middleName} onChange={handleChange} autoComplete="additional-name" />
                    </div>
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-last">Last name *</label>
                      <input id="reg-last" className="rg-input" name="lastName" value={form.lastName} onChange={handleChange} autoComplete="family-name" required aria-required="true" />
                    </div>
                  </div>
                  <div className="rg-row">
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-dob">Date of birth *</label>
                      <input id="reg-dob" className="rg-input" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} autoComplete="bday" required aria-required="true" />
                    </div>
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-gender">Gender</label>
                      <select id="reg-gender" className="rg-input rg-select" name="gender" value={form.gender} onChange={handleChange}>
                        <option>Male</option><option>Female</option>
                      </select>
                    </div>
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-civil">Civil status</label>
                      <select id="reg-civil" className="rg-input rg-select" name="civilStatus" value={form.civilStatus} onChange={handleChange}>
                        <option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="rg-section">
                  <legend className="rg-section-title">Address and contact</legend>
                  <div className="rg-field rg-full">
                    <label className="rg-label" htmlFor="reg-address">Complete address *</label>
                    <input id="reg-address" className="rg-input" name="address" placeholder="House No., Street, Barangay" value={form.address} onChange={handleChange} autoComplete="street-address" required aria-required="true" />
                  </div>
                  <div className="rg-row">
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-contact">Contact number *</label>
                      <input id="reg-contact" className="rg-input" name="contactNumber" placeholder="09XXXXXXXXX" value={form.contactNumber} onChange={handleChange} autoComplete="tel" inputMode="tel" required aria-required="true" />
                    </div>
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-email">Email address *</label>
                      <input id="reg-email" className="rg-input" type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" required aria-required="true" />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="rg-section">
                  <legend className="rg-section-title">Account security</legend>
                  <div className="rg-row">
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-password">Password *</label>
                      <PasswordInput id="reg-password" className="rg-input" type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" required aria-required="true" aria-describedby="pw-strength" />
                      {form.password && (
                        <div id="pw-strength" className="rg-strength">
                          <div className="rg-strength-track">
                            <div className="rg-strength-bar" style={{ width: `${strength.pct}%`, background: strength.color }} />
                          </div>
                          <span style={{ color: strength.color }}>{strength.label}</span>
                        </div>
                      )}
                    </div>
                    <div className="rg-field">
                      <label className="rg-label" htmlFor="reg-confirm">Confirm password *</label>
                      <PasswordInput id="reg-confirm" className="rg-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" required aria-required="true" />
                      {form.confirmPassword && form.password !== form.confirmPassword && (
                        <span className="rg-hint-bad">Passwords do not match.</span>
                      )}
                    </div>
                  </div>
                  <p className="rg-help">Use at least 8 characters. A mix of letters, numbers and symbols is stronger.</p>
                </fieldset>

                <fieldset className="rg-section">
                  <legend className="rg-section-title">Resident classification <small>(optional)</small></legend>
                  <p className="rg-note">
                    Select any that apply. These are self-declared at registration and may be confirmed by the barangay office; selecting a classification here does not by itself constitute official verification.
                  </p>
                  <div className="rg-checks">
                    <label className="rg-check">
                      <input type="checkbox" name="isVoter" checked={form.isVoter} onChange={handleChange} /> Registered voter
                    </label>
                    <label className="rg-check">
                      <input type="checkbox" name="isIndigent" checked={form.isIndigent} onChange={handleChange} /> Indigent
                    </label>
                    <label className="rg-check">
                      <input type="checkbox" name="isSeniorCitizen" checked={form.isSeniorCitizen} onChange={handleChange} /> Senior citizen
                    </label>
                  </div>
                </fieldset>

                <label className="rg-agree" htmlFor="agreeTerms">
                  <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} required aria-required="true" />
                  <span>
                    I have read and agree to the <a href="#/terms">Terms and Conditions</a> and the <a href="#/privacy">Privacy Notice</a>.
                  </span>
                </label>

                <button type="submit" className="rg-submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Resident Account'}
                </button>

                <p className="rg-login-line">
                  Already have an account? <button type="button" className="rg-login-link" onClick={onGoLogin}>Log in</button>
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Register;
