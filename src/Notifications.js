import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://barangay-system-xf6j.onrender.com/api';
const READ_KEY = 'notificationsLastRead';

function formatDateTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// Builds the notification feed from real account/request data only —
// no invented events. A "changed" event only fires when updatedAt is
// meaningfully later than createdAt, so a request that has never
// moved past Pending doesn't get a false "status changed" entry.
export function buildNotifications(data) {
  const items = [];
  const { requests, account } = data;

  requests.forEach(r => {
    items.push({
      id: `${r.controlNumber}-submitted`,
      date: r.createdAt,
      text: `Your ${r.documentType} request (${r.controlNumber}) was received.`,
    });

    const changed = r.updatedAt && new Date(r.updatedAt) - new Date(r.createdAt) > 60 * 1000;
    if (changed) {
      if (r.status === 'Approved') {
        items.push({ id: `${r.controlNumber}-approved`, date: r.updatedAt, text: `Your ${r.documentType} request has been approved.` });
      } else if (r.status === 'Released') {
        items.push({ id: `${r.controlNumber}-released`, date: r.updatedAt, text: `Your ${r.documentType} is ready for pickup.` });
      } else if (r.status === 'Rejected') {
        items.push({ id: `${r.controlNumber}-rejected`, date: r.updatedAt, text: `Your ${r.documentType} request was not approved. Please visit the barangay hall for details.` });
      }
    }
  });

  if (account && account.accountStatus === 'Approved' && account.updatedAt && account.createdAt &&
      new Date(account.updatedAt) - new Date(account.createdAt) > 60 * 1000) {
    items.push({ id: 'account-approved', date: account.updatedAt, text: 'Your resident account has been approved.' });
  }

  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const Notifications = ({ onBack }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [lastRead, setLastRead] = useState(null);

  const token = localStorage.getItem('residentToken');

  useEffect(() => {
    if (!token) { setError('You must be logged in to view notifications.'); return; }
    // Capture the previous "last read" mark BEFORE we update it, so
    // this visit still shows what was unread coming in.
    setLastRead(localStorage.getItem(READ_KEY));

    axios.get(`${API}/resident-accounts/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setData(res.data.data);
        localStorage.setItem(READ_KEY, new Date().toISOString());
      })
      .catch(() => setError('Could not load notifications. Please try again.'));
    // eslint-disable-next-line
  }, []);

  if (error) return <div className="section"><div className="alert-error">{error}</div></div>;
  if (!data) return <div className="section"><p style={{ textAlign: 'center', color: 'var(--ink-muted)' }}>Loading notifications…</p></div>;

  const notifications = buildNotifications(data);
  const lastReadTime = lastRead ? new Date(lastRead).getTime() : 0;

  return (
    <div className="section">
      {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}
      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>Notifications</h2>
        <p>Updates about your account and document requests.</p>
      </div>

      <div className="request-form">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications yet.</p>
            <p className="empty-state-sub">You'll see updates here when your requests or account status change.</p>
          </div>
        ) : (
          <div className="activity-list">
            {notifications.map(n => {
              const isUnread = new Date(n.date).getTime() > lastReadTime;
              return (
                <div key={n.id} className="activity-item">
                  <div className={`activity-dot ${isUnread ? 'unread' : ''}`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <span>{n.text}</span>
                      {isUnread && <span className="notif-new-badge">New</span>}
                    </div>
                    <div className="activity-date">{formatDateTime(n.date)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
