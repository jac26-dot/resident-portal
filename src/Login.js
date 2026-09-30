import React, { useState } from 'react';
import axios from 'axios';
import PasswordInput from './PasswordInput';
import logo from './barangay-logo.png';

const API = 'https://barangay-system-xf6j.onrender.com/api';

const POINTS = [
  { text: 'Request barangay documents online', d: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6' },
  { text: 'Track the status of every request', d: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4' },
  { text: 'Get notified when it is ready', d: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0' },
];

const Login = ({ onLoggedIn, onGoRegister, onBack }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="auth-page">
      <div className="auth-wrap">
        {onBack && <button className="back-btn" onClick={onBack} type="button">&larr; Back</button>}

        <div className="auth-card">
          <aside className="auth-aside">
            <img src={logo} alt="Barangay 697 Zone 76 logo" className="auth-logo" />
            <h2>Welcome back</h2>
            <p>Barangay 697 Zone 76 e-Serbisyo. Your barangay services, online.</p>
            <ul className="auth-points">
              {POINTS.map((p) => (
                <li key={p.text}>
                  <span className="auth-point-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={p.d} /></svg>
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
          </aside>

          <div className="auth-main">
            <div className="form-header">
              <h2>Login</h2>
              <p>Log in to view your document requests and profile.</p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="request-form" noValidate>
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Email Address *</label>
                  <input id="login-email" className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required aria-required="true" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">Password *</label>
                  <PasswordInput id="login-password" className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required aria-required="true" />
                </div>
              </div>

              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>

              <p className="auth-foot">
                Don't have an account? <button type="button" className="btn-link" onClick={onGoRegister}>Register as Resident</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;