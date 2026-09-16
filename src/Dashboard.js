import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ImageCropModal from './ImageCropModal';

const API = 'https://barangay-system-xf6j.onrender.com/api';

const STATUS_COLORS = {
  Pending:    { bg: '#fef3c7', color: '#c27803' },
  Processing: { bg: '#e0e7ff', color: '#4338ca' },
  Approved:   { bg: '#dbeafe', color: '#1a56db' },
  Released:   { bg: '#d1fae5', color: '#057a55' },
  Rejected:   { bg: '#fee2e2', color: '#c81e1e' },
};

const TIMELINE_STEPS = ['Pending', 'Processing', 'Approved', 'Released'];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function initials(name) {
  if (!name) return 'R';
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

const Dashboard = ({ onLogout, onRequestDocument, onTrack }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [editForm, setEditForm] = useState({ contactNumber: '', address: '' });
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState('');
  const fileInputRef = useRef(null);

  const token = localStorage.getItem('residentToken');

  const loadProfile = () => {
    if (!token) { onLogout(); return; }
    axios.get(`${API}/resident-accounts/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setData(res.data.data);
        setEditForm({
          contactNumber: res.data.data.resident?.contactNumber || '',
          address: res.data.data.resident?.address || '',
        });
      })
      .catch(err => {
        if (err.response?.status === 401) onLogout();
        else setError('Could not load your profile. Please try refreshing the page.');
      });
  };

  useEffect(() => { loadProfile(); /* eslint-disable-next-line */ }, []);

  if (error) return <div className="section"><div className="alert-error">{error}</div></div>;
  if (!data) return <div className="section"><p style={{ textAlign: 'center', color: '#6b7280' }}>Loading your account…</p></div>;

  const { resident, requests, account } = data;
  const fullName = `${resident?.firstName || ''} ${resident?.lastName || ''}`.trim();

  const total = requests.length;
  const pending = requests.filter(r => r.status === 'Pending' || r.status === 'Processing').length;
  const completed = requests.filter(r => r.status === 'Released').length;

  const recentActivity = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const notifications = requests
    .filter(r => ['Approved', 'Released', 'Rejected'].includes(r.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
    .map(r => {
      if (r.status === 'Approved') return { id: r.controlNumber + '-a', text: `Your ${r.documentType} request has been approved.`, date: r.createdAt };
      if (r.status === 'Released') return { id: r.controlNumber + '-r', text: `Your ${r.documentType} is ready — thank you for using our online portal.`, date: r.createdAt };
      return { id: r.controlNumber + '-x', text: `Your ${r.documentType} request was not approved. Please visit the barangay hall for details.`, date: r.createdAt };
    });

  // ---------------- Photo upload (with crop step) ----------------
  const [cropSrc, setCropSrc] = useState(null); // raw selected image, shown in the crop modal

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');

    const okTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!okTypes.includes(file.type)) {
      setPhotoError('Please upload a JPG or PNG image.');
      e.target.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError('Image is too large. Please choose a photo under 8MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result); // opens the crop modal — nothing uploaded yet
      e.target.value = ''; // allow re-selecting the same file later
    };
    reader.readAsDataURL(file);
  };

  const handleCropCancel = () => setCropSrc(null);

  const handleCropConfirm = async (croppedDataUrl) => {
    setCropSrc(null);
    setPhotoBusy(true);
    try {
      await axios.patch(`${API}/resident-accounts/me/photo`, { photo: croppedDataUrl }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadProfile();
    } catch (err) {
      setPhotoError(err.response?.data?.message || 'Could not upload your photo. Please try again.');
    } finally {
      setPhotoBusy(false);
    }
  };

  const handlePhotoRemove = async () => {
    setPhotoBusy(true);
    setPhotoError('');
    try {
      await axios.delete(`${API}/resident-accounts/me/photo`, { headers: { Authorization: `Bearer ${token}` } });
      loadProfile();
    } catch {
      setPhotoError('Could not remove your photo. Please try again.');
    } finally {
      setPhotoBusy(false);
    }
  };

  // ---------------- Edit profile ----------------
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditBusy(true);
    setEditError('');
    try {
      await axios.patch(`${API}/resident-accounts/me`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      setShowEditProfile(false);
      loadProfile();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Could not update your profile. Please try again.');
    } finally {
      setEditBusy(false);
    }
  };

  const profileComplete = !!(resident?.address && resident?.contactNumber && resident?.email);

  return (
    <div className="account-page">
      {/* ---------- Welcome ---------- */}
      <div className="account-welcome">
        <div className="account-welcome-inner">
          <h1>{greeting()}, {resident?.firstName || 'Resident'}.</h1>
          <p>Welcome to your Barangay 697 Zone 76 Resident Portal. Manage your information, request documents, and track your requests — all in one place.</p>
        </div>
      </div>

      <div className="account-body">
        {/* ---------- Profile header card ---------- */}
        <div className="profile-card">
          <div className="profile-photo-wrap">
            {data.account?.photoUrl ? (
              <img src={data.account.photoUrl} alt={`${fullName} profile`} className="profile-photo" />
            ) : (
              <div className="profile-photo profile-photo-placeholder">{initials(fullName)}</div>
            )}
            <button
              type="button"
              className="photo-edit-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoBusy}
              aria-label="Upload profile photo"
              title="Upload or change photo"
            >
              {photoBusy ? '…' : '✎'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              style={{ display: 'none' }}
              onChange={handlePhotoSelect}
            />
          </div>

          <div className="profile-main">
            <div className="profile-name-row">
              <h2>{fullName || 'Resident'}</h2>
              <span className="badge-status">{resident?.status || 'Active'} Resident</span>
            </div>
            <div className="profile-meta">
              <span>{resident?.address || 'No address on file'}</span>
              <span>·</span>
              <span>{resident?.contactNumber || 'No contact number'}</span>
              <span>·</span>
              <span>{resident?.email || 'No email'}</span>
            </div>
            {photoError && <div className="alert-error" style={{ margin: '10px 0 0', maxWidth: 'none' }}>{photoError}</div>}
            <p className="photo-guidance">
              Upload a clear recent photo with a plain <strong>white background</strong>. Use an ID-style portrait with your face clearly visible. Accepted formats: JPG, JPEG, PNG.
            </p>
            <div className="profile-actions">
              <button className="btn-primary btn-sm" onClick={() => setShowEditProfile(true)}>Edit Profile</button>
              <button className="btn-outline-dark btn-sm" onClick={() => fileInputRef.current?.click()}>Upload Photo</button>
              {data.account?.photoUrl && (
                <button className="btn-outline-dark btn-sm" onClick={handlePhotoRemove} disabled={photoBusy}>Remove Photo</button>
              )}
              <button className="btn-outline-dark btn-sm" onClick={() => setShowIdCard(true)}>View Barangay ID</button>
              <button className="btn-text-danger btn-sm" onClick={() => setShowLogoutConfirm(true)}>Log Out</button>
            </div>
          </div>
        </div>

        {/* ---------- Account summary ---------- */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-value">{profileComplete ? 'Complete' : 'Incomplete'}</div>
            <div className="summary-label">Profile Status</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{total}</div>
            <div className="summary-label">Document Requests</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{pending}</div>
            <div className="summary-label">Pending</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{completed}</div>
            <div className="summary-label">Completed</div>
          </div>
        </div>

        {/* ---------- Personal / Contact / Residential / Account info ---------- */}
        <h3 className="account-section-title">Resident Information</h3>
        <div className="info-cards-grid">
          <div className="info-card">
            <h4>Personal Information</h4>
            <div className="info-row"><span>Full Name</span><strong>{resident?.lastName}, {resident?.firstName} {resident?.middleName || ''}</strong></div>
            {resident?.birthDate && <div className="info-row"><span>Date of Birth</span><strong>{formatDate(resident.birthDate)}</strong></div>}
            {resident?.gender && <div className="info-row"><span>Sex</span><strong>{resident.gender}</strong></div>}
            {resident?.civilStatus && <div className="info-row"><span>Civil Status</span><strong>{resident.civilStatus}</strong></div>}
          </div>
          <div className="info-card">
            <h4>Contact Information</h4>
            <div className="info-row"><span>Mobile Number</span><strong>{resident?.contactNumber || '—'}</strong></div>
            <div className="info-row"><span>Email Address</span><strong>{resident?.email || '—'}</strong></div>
          </div>
          <div className="info-card">
            <h4>Residential Information</h4>
            <div className="info-row"><span>Address</span><strong>{resident?.address || '—'}</strong></div>
            <div className="info-row"><span>Barangay</span><strong>Barangay 697</strong></div>
            <div className="info-row"><span>Zone</span><strong>Zone 76</strong></div>
            <div className="info-row"><span>City</span><strong>Manila</strong></div>
          </div>
          <div className="info-card">
            <h4>Account Information</h4>
            <div className="info-row"><span>Email</span><strong>{resident?.email || '—'}</strong></div>
            <div className="info-row"><span>Account Created</span><strong>{formatDate(account?.createdAt)}</strong></div>
            <div className="info-row"><span>Account Status</span><strong>{account?.accountStatus || 'Approved'}</strong></div>
          </div>
        </div>

        {/* ---------- Document requests ---------- */}
        <div className="section-header-row">
          <h3 className="account-section-title" style={{ margin: 0 }}>My Document Requests</h3>
          <button className="btn-primary btn-sm" onClick={onRequestDocument}>+ Request a Document</button>
        </div>

        {requests.length === 0 ? (
          <div className="empty-state">
            <p>No document requests yet.</p>
            <p className="empty-state-sub">Need a barangay document? Start your first request online.</p>
            <button className="btn-primary" onClick={onRequestDocument}>Request a Document</button>
          </div>
        ) : (
          <div className="request-list">
            {requests.map(r => {
              const s = STATUS_COLORS[r.status] || { bg: '#f3f4f6', color: '#6b7280' };
              const stepIdx = TIMELINE_STEPS.indexOf(r.status);
              return (
                <div key={r.controlNumber} className="request-card">
                  <div className="request-card-top">
                    <div>
                      <div className="track-control">Control #: <strong>{r.controlNumber}</strong></div>
                      <div className="track-doc-type">{r.documentType}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{r.purpose}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Requested {formatDate(r.createdAt)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span className="track-status" style={{ background: s.bg, color: s.color }}>{r.status}</span>
                      <button className="btn-link" onClick={() => onTrack(r.controlNumber)}>Track Details →</button>
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
                </div>
              );
            })}
          </div>
        )}

        {/* ---------- Quick actions ---------- */}
        <h3 className="account-section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action" onClick={onRequestDocument}>
            <span className="quick-action-icon">＋</span>
            <span className="quick-action-label">Request a Document</span>
            <span className="quick-action-desc">Submit a new document request online</span>
          </button>
          <button className="quick-action" onClick={() => document.getElementById('my-requests-anchor')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="quick-action-icon">☰</span>
            <span className="quick-action-label">View My Requests</span>
            <span className="quick-action-desc">See the status of all your requests</span>
          </button>
          <button className="quick-action" onClick={() => setShowEditProfile(true)}>
            <span className="quick-action-icon">✎</span>
            <span className="quick-action-label">Update Profile</span>
            <span className="quick-action-desc">Edit your contact and address details</span>
          </button>
          <button className="quick-action" onClick={() => setShowIdCard(true)}>
            <span className="quick-action-icon">▦</span>
            <span className="quick-action-label">View Barangay ID</span>
            <span className="quick-action-desc">See your resident identification card</span>
          </button>
        </div>

        {/* ---------- Notifications / Recent activity ---------- */}
        <div className="two-col-grid">
          <div>
            <h3 className="account-section-title">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="muted-text">You have no notifications yet.</p>
            ) : (
              <div className="activity-list">
                {notifications.map(n => (
                  <div key={n.id} className="activity-item">
                    <div className="activity-dot" />
                    <div>
                      <div>{n.text}</div>
                      <div className="activity-date">{formatDate(n.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="account-section-title">Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p className="muted-text">No recent activity.</p>
            ) : (
              <div className="activity-list">
                {recentActivity.map(r => (
                  <div key={r.controlNumber} className="activity-item">
                    <div className="activity-dot" />
                    <div>
                      <div>Document request submitted — {r.documentType}</div>
                      <div className="activity-date">{formatDate(r.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------- Help / barangay info ---------- */}
        <h3 className="account-section-title">Barangay Information</h3>
        <div className="help-grid">
          <div className="help-card">
            <h4>Office Hours</h4>
            <p>Monday – Sunday, 24/7</p>
          </div>
          <div className="help-card">
            <h4>Document Processing</h4>
            <p>Track the current status of your submitted requests any time from this page.</p>
          </div>
          <div className="help-card">
            <h4>Need Help?</h4>
            <p>Email us at pb.brgy697@gmail.com or see our Emergency Hotlines page for other contact numbers.</p>
          </div>
        </div>

        <div id="my-requests-anchor" />
      </div>

      {/* ---------- Edit Profile modal ---------- */}
      {showEditProfile && (
        <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Edit Profile</h3>
            <p className="muted-text" style={{ marginTop: -6 }}>You can update your mobile number and address below. Changes to your name or email require verification at the barangay office.</p>
            {editError && <div className="alert-error" style={{ maxWidth: 'none' }}>{editError}</div>}
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  className="form-control"
                  value={editForm.contactNumber}
                  onChange={e => setEditForm({ ...editForm, contactNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  className="form-control"
                  value={editForm.address}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline-dark btn-sm" onClick={() => setShowEditProfile(false)}>Cancel</button>
                <button type="submit" className="btn-primary btn-sm" disabled={editBusy}>{editBusy ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Barangay ID modal ---------- */}
      {showIdCard && (
        <div className="modal-overlay" onClick={() => setShowIdCard(false)}>
          <div className="modal-card id-modal" onClick={e => e.stopPropagation()}>
            <div className="id-card">
              <div className="id-card-header">
                <div>
                  <div className="id-card-brgy">Barangay 697 Zone 76</div>
                  <div className="id-card-sub">Resident Identification</div>
                </div>
              </div>
              <div className="id-card-body">
                {data.account?.photoUrl ? (
                  <img src={data.account.photoUrl} alt="Resident" className="id-card-photo" />
                ) : (
                  <div className="id-card-photo id-card-photo-placeholder">{initials(fullName)}</div>
                )}
                <div className="id-card-details">
                  <div className="id-card-name">{fullName}</div>
                  <div className="id-card-row"><span>Address</span><strong>{resident?.address || '—'}</strong></div>
                  <div className="id-card-row"><span>Resident Record No.</span><strong>{resident?.id ? `RES-${String(resident.id).padStart(6, '0')}` : '—'}</strong></div>
                  <div className="id-card-row"><span>Barangay</span><strong>697, Zone 76</strong></div>
                  <div className="id-card-row"><span>Status</span><strong>{resident?.status || 'Active'}</strong></div>
                </div>
              </div>
            </div>
            <p className="id-digital-notice">
              <strong>Digital Preview.</strong> Your physical Barangay ID will be printed and released by the Barangay.
            </p>
            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button className="btn-outline-dark btn-sm" onClick={() => setShowIdCard(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Logout confirm ---------- */}
      {/* ---------- Photo crop ---------- */}
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-card modal-card-sm" onClick={e => e.stopPropagation()}>
            <h3>Log out?</h3>
            <p className="muted-text">Are you sure you want to log out of your resident account?</p>
            <div className="modal-actions">
              <button className="btn-outline-dark btn-sm" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button className="btn-danger btn-sm" onClick={onLogout}>Log Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
