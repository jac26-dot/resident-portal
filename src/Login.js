import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://barangay-system-xf6j.onrender.com/api';

const Login = ({ onLoggedIn, onGoRegister, onBack, onNeedOtp }) => {
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
      if (err.response?.data?.requiresOtp && onNeedOtp) {
        onNeedOtp(err.response.data.email);
        return;
      }
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}

      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>Resident Login</h2>
        <p>Log in to view your document requests and profile.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="request-form" noValidate style={{ maxWidth: 420 }}>
        <div className="form-section">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address *</label>
            <input id="login-email" className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required aria-required="true" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password *</label>
            <input id="login-password" className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required aria-required="true" />
          </div>
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 14 }}>
          Don't have an account? <button type="button" className="btn-link" onClick={onGoRegister}>Register as Resident</button>
        </p>
      </form>
    </div>
  );
};

export default Login;
