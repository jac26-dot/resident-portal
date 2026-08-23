import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Your real live backend — update this if it ever changes.
const API = 'https://barangay-system-xf6j.onrender.com/api';

const STATUS_COLORS = {
  'Pending':  { bg:'#fef3c7', color:'#c27803' },
  'Approved': { bg:'#dbeafe', color:'#1a56db' },
  'Released': { bg:'#d1fae5', color:'#057a55' },
  'Rejected': { bg:'#fee2e2', color:'#c81e1e' },
};

const TrackRequest = ({ initialNumber }) => {
  const [controlNumber, setControlNumber] = useState(initialNumber || '');
  const [result,        setResult]        = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  useEffect(() => {
    if (initialNumber) handleTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!controlNumber.trim()) { setError('Please enter your control number.'); return; }
    setError(''); setLoading(true); setResult(null);
    try {
      const res = await axios.get(`${API}/documents/track/${encodeURIComponent(controlNumber.trim())}`);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.status === 404
        ? 'No document request found with this control number. Please check and try again.'
        : 'Failed to track request. Please try again.');
    } finally { setLoading(false); }
  };

  const statusStyle = result ? (STATUS_COLORS[result.status] || { bg:'#f3f4f6', color:'#6b7280' }) : {};

  return (
    <div className="section">
      <div className="form-header">
        <h2>Track Your Request</h2>
        <p>Enter your control number to check the status of your document request.</p>
      </div>

      <form onSubmit={handleTrack} className="track-form">
        <div className="track-input-row">
          <input
            className="form-control track-input"
            placeholder="Enter Control Number (e.g. BRY-2026-1234)"
            value={controlNumber}
            onChange={e => setControlNumber(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
        {error && <div className="alert-error" style={{ marginTop:12 }}>{error}</div>}
      </form>

      {result && (
        <div className="track-result">
          <div className="track-result-header">
            <div>
              <div className="track-control">Control #: <strong>{result.controlNumber}</strong></div>
              <div className="track-doc-type">{result.documentType}</div>
            </div>
            <div className="track-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
              {result.status}
            </div>
          </div>

          <div className="track-details">
            <div className="track-detail-row">
              <span className="track-detail-label">Requested By</span>
              <span className="track-detail-value">{result.Resident ? `${result.Resident.lastName}, ${result.Resident.firstName}` : '—'}</span>
            </div>
            <div className="track-detail-row">
              <span className="track-detail-label">Purpose</span>
              <span className="track-detail-value">{result.purpose}</span>
            </div>
            <div className="track-detail-row">
              <span className="track-detail-label">Date Requested</span>
              <span className="track-detail-value">{new Date(result.createdAt).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' })}</span>
            </div>
            {result.fee > 0 && (
              <div className="track-detail-row">
                <span className="track-detail-label">Fee</span>
                <span className="track-detail-value">₱{parseFloat(result.fee).toFixed(2)}</span>
              </div>
            )}
            {result.remarks && (
              <div className="track-detail-row">
                <span className="track-detail-label">Remarks</span>
                <span className="track-detail-value">{result.remarks}</span>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="status-timeline">
            {['Pending','Approved','Released'].map((s, i) => {
              const statuses = ['Pending','Approved','Released','Rejected'];
              const currentIdx = statuses.indexOf(result.status);
              const stepIdx    = statuses.indexOf(s);
              const isDone     = result.status === 'Released' ? stepIdx <= 2 : stepIdx < currentIdx;
              const isCurrent  = s === result.status;
              const isRejected = result.status === 'Rejected';
              return (
                <div key={s} className="timeline-step">
                  <div className={`timeline-dot ${isDone||isCurrent?'active':''} ${isCurrent?'current':''}`}
                    style={{ background: isCurrent ? (isRejected?'#c81e1e':'#1a56db') : isDone ? '#057a55' : '#e5e7eb' }}>
                    {isDone && !isCurrent ? '✓' : i+1}
                  </div>
                  <div className={`timeline-label ${isCurrent?'current':''}`}>{s}</div>
                  {i < 2 && <div className={`timeline-line ${isDone?'done':''}`}></div>}
                </div>
              );
            })}
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            {result.status === 'Pending'  && <div className="next-step pending">⏳ Your request is being reviewed by the barangay staff. Please wait for updates.</div>}
            {result.status === 'Approved' && <div className="next-step approved">✅ Your document has been approved! Please visit the barangay hall to claim it. Bring a valid ID.</div>}
            {result.status === 'Released' && <div className="next-step released">🎉 Your document has been released. Thank you for using our online portal!</div>}
            {result.status === 'Rejected' && <div className="next-step rejected">❌ Your request was rejected. Please visit the barangay hall for more information. {result.remarks && `Reason: ${result.remarks}`}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackRequest;
