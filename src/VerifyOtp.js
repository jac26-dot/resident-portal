import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://barangay-system-xf6j.onrender.com/api';
const RESEND_COOLDOWN = 60;

const VerifyOtp = ({ onVerified, onBack }) => {
  const email = sessionStorage.getItem('pendingOtpEmail') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/resident-accounts/verify-email`, { email, otp });
      sessionStorage.removeItem('pendingOtpEmail');
      setDone(res.data.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg('');
    setError('');
    try {
      const res = await axios.post(`${API}/resident-accounts/resend-otp`, { email });
      setResendMsg(res.data.data.message);
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="section">
        <div className="alert-error">No pending verification found. Please register or log in again.</div>
        <div className="success-btns" style={{ marginTop: 16 }}>
          <button className="btn-primary" onClick={onBack}>Back to Home</button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="section">
        <div className="success-box">
          <h2>Email Verified</h2>
          <p>{done}</p>
          <div className="success-btns">
            <button className="btn-primary" onClick={onVerified}>Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}
      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>Verify Your Email</h2>
        <p>We sent a verification code to <strong>{email}</strong>.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {resendMsg && !error && <div className="form-note" style={{ maxWidth: 420, margin: '0 auto 20px' }}>{resendMsg}</div>}

      <form onSubmit={handleVerify} className="request-form" style={{ maxWidth: 360 }} noValidate>
        <div className="form-section">
          <div className="form-group">
            <label className="form-label" htmlFor="otp-input">6-Digit Code</label>
            <input
              id="otp-input"
              className="form-control"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              style={{ fontSize: 22, letterSpacing: 8, textAlign: 'center', fontFamily: 'monospace' }}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoFocus
            />
          </div>
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 14 }}>
          Didn't receive the code?{' '}
          <button
            type="button"
            className="btn-link"
            onClick={handleResend}
            disabled={resendLoading || cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;
