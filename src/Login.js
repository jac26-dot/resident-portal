import React, { useState } from 'react';
import axios from 'axios';
import PasswordInput from './PasswordInput';
import logo from './barangay-logo.png';
import brand from './brand';
import './login.css';

const API = 'https://barangay-system-xf6j.onrender.com/api';

// What happens after logging in, in order. The numbers are real:
// a request goes through these steps one after the other.
const STEPS = [
  { title: 'Request online',    text: 'Choose a document and send your request.' },
  { title: 'Follow its status', text: 'Check every request from your account.' },
  { title: 'Get notified',      text: 'We notify you when it is ready for pickup.' },
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Magandang umaga';
  if (h < 13) return 'Magandang tanghali';
  if (h < 18) return 'Magandang hapon';
  return 'Magandang gabi';
};

const Login = ({ onLoggedIn, onGoRegister, onBack }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const contact = brand.contact || {};

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/resident-accounts/login`, form);
      const data = res.data.data;
      localStorage.setItem('residentToken', data.token);
      localStorage.setItem('residentInfo', JSON.stringify({ userId: data.userId, residentId: data.residentId, name: data.name }));
      onLoggedIn(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page">
      <aside className="lg-aside">
        <img src={logo} alt="" aria-hidden="true" className="lg-watermark" />

        <div className="lg-aside-inner">
          {onBack && (
            <button className="lg-back" onClick={onBack} type="button">
              <span aria-hidden="true">&larr;</span> Back to home
            </button>
          )}

          <img src={logo} alt={`${brand.organizationName} logo`} className="lg-seal" />
          <h2>{greeting()}.</h2>
          <p className="lg-aside-sub">Sign in to request barangay documents and follow each request online.</p>

          <ol className="lg-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="lg-step-num" aria-hidden="true">{i + 1}</span>
                <span className="lg-step-text">
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="lg-org">{brand.organizationName}</div>
        </div>
      </aside>

      <section className="lg-main">
        <div className="lg-main-inner">
          <h2>Log in</h2>
          <p className="lg-lead">Use the email and password you registered with.</p>

          {error && <div className="lg-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="lg-field">
              <label className="lg-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="lg-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                aria-required="true"
              />
            </div>
            <div className="lg-field">
              <label className="lg-label" htmlFor="login-password">Password</label>
              <PasswordInput
                id="login-password"
                className="lg-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                aria-required="true"
              />
            </div>

            <button type="submit" className="lg-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="lg-divider"><span>New to the portal?</span></div>
          <button type="button" className="lg-register" onClick={onGoRegister}>Register as Resident</button>

          {(contact.email || contact.hours) && (
            <p className="lg-help">
              <strong>Can't log in?</strong>{' '}
              {contact.email && <>Email {contact.email}</>}
              {contact.email && contact.hours && ' or visit'}
              {!contact.email && contact.hours && 'Visit'}
              {contact.hours && <> the barangay hall. Office hours: {contact.hours}.</>}
              {!contact.hours && '.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Login;
