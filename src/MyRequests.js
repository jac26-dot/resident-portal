import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://barangay-system-xf6j.onrender.com/api';

const STATUS_COLORS = {
  Pending:  { bg: '#fef3c7', color: '#c27803' },
  Approved: { bg: '#dbeafe', color: '#1a56db' },
  Released: { bg: '#d1fae5', color: '#057a55' },
  Rejected: { bg: '#fee2e2', color: '#c81e1e' },
};

const TIMELINE_STEPS = ['Pending', 'Approved', 'Released'];
const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Released', 'Rejected'];
const ACTIVE_STATUSES = ['Pending', 'Approved'];

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

const MyRequests = ({ initialFilter = 'All', title, onBack, onRequestDocument }) => {
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [expandedId, setExpandedId] = useState(null);

  const token = localStorage.getItem('residentToken');

  useEffect(() => {
    if (!token) { setError('You must be logged in to view your requests.'); return; }
    axios.get(`${API}/resident-accounts/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRequests(res.data.data.requests))
      .catch(() => setError('Could not load your requests. Please try again.'));
    // eslint-disable-next-line
  }, []);

  if (error) return <div className="section"><div className="alert-error">{error}</div></div>;
  if (requests === null) return <div className="section"><p style={{ textAlign: 'center', color: 'var(--ink-muted)' }}>Loading your requests…</p></div>;

  const filtered = requests.filter(r => {
    const matchesStatus =
      statusFilter === 'All' ? true :
      statusFilter === 'Active' ? ACTIVE_STATUSES.includes(r.status) :
      r.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || r.documentType.toLowerCase().includes(q) || r.controlNumber.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="section">
      {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}
      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>{title || 'My Requests'}</h2>
        <p>Search, filter, and track every document request you've submitted.</p>
      </div>

      <div className="request-form">
        <div className="myrequests-toolbar">
          <input
            className="form-control"
            style={{ maxWidth: 320 }}
            placeholder="Search by document or Request ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="myrequests-filters">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                type="button"
                className={`myrequests-filter-chip ${statusFilter === f ? 'active' : ''}`}
                onClick={() => setStatusFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No document requests yet.</p>
            <p className="empty-state-sub">
              {requests.length === 0 ? "Need a barangay document? Start your first request online." : 'No requests match your search or filter.'}
            </p>
            {requests.length === 0 && onRequestDocument && (
              <button className="btn-primary" onClick={onRequestDocument}>Request a Document</button>
            )}
          </div>
        ) : (
          <div className="request-list">
            {filtered.map(r => {
              const s = STATUS_COLORS[r.status] || { bg: '#f3f4f6', color: '#6b7280' };
              const stepIdx = TIMELINE_STEPS.indexOf(r.status);
              const expanded = expandedId === r.controlNumber;
              return (
                <div key={r.controlNumber} className="request-card">
                  <div
                    className="request-card-top"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpandedId(expanded ? null : r.controlNumber)}
                  >
                    <div>
                      <div className="track-control">Request ID: <strong>{r.controlNumber}</strong></div>
                      <div className="track-doc-type">{r.documentType}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{r.purpose}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>Requested {formatDate(r.createdAt)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span className="track-status" style={{ background: s.bg, color: s.color }}>{r.status}</span>
                      <span className="btn-link">{expanded ? 'Hide details ▲' : 'View details ▼'}</span>
                    </div>
                  </div>

                  {r.status !== 'Rejected' && (
                    <div className="mini-timeline">
                      {TIMELINE_STEPS.map((step, i) => (
                        <React.Fragment key={step}>
                          <div className={`mini-dot ${i <= stepIdx ? 'done' : ''}`} title={step} />
                          {i < TIMELINE_STEPS.length - 1 && <div className={`mini-line ${i < stepIdx ? 'done' : ''}`} />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {expanded && (
                    <div className="myrequests-expanded">
                      {r.requirementFileName && (
                        <div className="track-detail-row"><span className="track-detail-label">Uploaded File</span><span className="track-detail-value">{r.requirementFileName}</span></div>
                      )}
                      {r.remarks && (
                        <div className="track-detail-row"><span className="track-detail-label">Remarks</span><span className="track-detail-value">{r.remarks}</span></div>
                      )}
                      {r.status === 'Pending'  && <div className="next-step pending" style={{ marginTop: 10 }}>⏳ Your request is being reviewed by barangay staff. Please check back for updates.</div>}
                      {r.status === 'Approved' && <div className="next-step approved" style={{ marginTop: 10 }}>✅ Your document has been approved. Please visit the barangay hall to claim it — bring a valid ID.</div>}
                      {r.status === 'Released' && <div className="next-step released" style={{ marginTop: 10 }}>🎉 Your document has been released. Thank you for using our online portal!</div>}
                      {r.status === 'Rejected' && <div className="next-step rejected" style={{ marginTop: 10 }}>Your request was not approved. Please visit the barangay hall for details.</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
