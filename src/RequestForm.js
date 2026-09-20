import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DOC_INFO, DOCUMENT_TYPES } from './documentInfo';

// Your real live backend — update this if it ever changes.
const API = 'https://barangay-system-xf6j.onrender.com/api';

const STEP_LABELS = ['Select Document', 'Your Information', 'Requirements', 'Review', 'Submit'];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------
// Multi-step wizard — logged-in, already-approved residents only.
// ---------------------------------------------------------------
const ResidentWizard = ({ verified, residentToken, onTrack, onBack }) => {
  const [step, setStep] = useState(0);
  const [documentType, setDocumentType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [file, setFile] = useState(null); // { name, dataUrl }
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const goNext = () => { setError(''); setStep(s => Math.min(s + 1, 4)); };
  const goPrev = () => { setError(''); setStep(s => Math.max(s - 1, 0)); };

  const handleFileSelect = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileError('');
    const okTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!okTypes.includes(f.type)) {
      setFileError('Please upload a JPG, PNG, or PDF file.');
      e.target.value = '';
      return;
    }
    if (f.size > 3 * 1024 * 1024) {
      setFileError('File is too large. Please choose a file under 3MB.');
      e.target.value = '';
      return;
    }
    const dataUrl = await readFileAsDataUrl(f);
    setFile({ name: f.name, dataUrl });
    e.target.value = '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const body = { documentType, purpose };
      if (file) body.requirementFile = { dataUrl: file.dataUrl, fileName: file.name };
      const res = await axios.post(`${API}/resident-accounts/me/documents`, body, {
        headers: { Authorization: `Bearer ${residentToken}` },
      });
      setSuccess(res.data.data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const info = documentType ? DOC_INFO[documentType] : null;

  return (
    <div className="section">
      {onBack && step === 0 && <button className="back-btn" onClick={onBack} type="button">← Back</button>}
      {step > 0 && step < 4 && <button className="back-btn" onClick={goPrev} type="button">← Back</button>}

      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>Request a Document</h2>
        {step < 4 && <p>Step {step + 1} of 4 — {STEP_LABELS[step]}</p>}
      </div>

      {step < 4 && (
        <div className="wizard-steps">
          {STEP_LABELS.slice(0, 4).map((label, i) => (
            <React.Fragment key={label}>
              <div className={`wizard-step-dot ${i <= step ? 'active' : ''}`}>{i < step ? '✓' : i + 1}</div>
              {i < 3 && <div className={`wizard-step-line ${i < step ? 'active' : ''}`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}

      <div className="request-form">
        {step === 0 && (
          <div className="form-section">
            <h3 className="form-section-title">Select a Document</h3>
            <div className="wizard-doc-grid">
              {DOCUMENT_TYPES.map(t => (
                <button
                  type="button"
                  key={t}
                  className={`wizard-doc-option ${documentType === t ? 'selected' : ''}`}
                  onClick={() => setDocumentType(t)}
                >
                  <div className="wizard-doc-option-name">{t}</div>
                  <div className="wizard-doc-option-desc">{DOC_INFO[t].desc}</div>
                  <div className="wizard-doc-option-meta">
                    <span>⏱ {DOC_INFO[t].processing}</span>
                  </div>
                </button>
              ))}
            </div>
            {info && (
              <div className="form-note" style={{ marginTop: 16 }}>
                <strong>Requirements:</strong> {info.requirements.join(', ')}
              </div>
            )}
            <button type="button" className="btn-primary btn-full" disabled={!documentType} onClick={goNext} style={{ marginTop: 16 }}>
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="form-section">
            <h3 className="form-section-title">Your Information</h3>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-control" value={verified.firstName} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Middle Name</label>
                <input className="form-control" value={verified.middleName || ''} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-control" value={verified.lastName} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-control" value={verified.address} disabled />
            </div>
            <div className="form-note">
              These details come from your resident account. If anything is incorrect, please visit the barangay hall to update your record.
            </div>
            <button type="button" className="btn-primary btn-full" onClick={goNext} style={{ marginTop: 8 }}>Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h3 className="form-section-title">Requirements</h3>
            <div className="form-group">
              <label className="form-label">Purpose *</label>
              <input className="form-control" placeholder="e.g. Employment, School enrollment..." value={purpose} onChange={e => setPurpose(e.target.value)} />
            </div>

            <label className="form-label">Supporting Document <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>(optional)</span></label>
            {!file ? (
              <div className="wizard-upload-box">
                <input type="file" id="req-file" accept="image/jpeg,image/jpg,image/png,application/pdf" style={{ display: 'none' }} onChange={handleFileSelect} />
                <label htmlFor="req-file" className="btn-outline-dark btn-sm" style={{ cursor: 'pointer' }}>Upload File</label>
                <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 8 }}>JPG, PNG, or PDF. Max 3MB.</p>
              </div>
            ) : (
              <div className="wizard-file-preview">
                {file.dataUrl.startsWith('data:image') ? (
                  <img src={file.dataUrl} alt={file.name} />
                ) : (
                  <div className="wizard-file-icon">📄</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <button type="button" className="btn-link" onClick={() => setFile(null)}>Remove &amp; replace</button>
                </div>
              </div>
            )}
            {fileError && <div className="alert-error" style={{ maxWidth: 'none', marginTop: 10 }}>{fileError}</div>}

            <button type="button" className="btn-primary btn-full" disabled={!purpose} onClick={goNext} style={{ marginTop: 16 }}>Continue</button>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h3 className="form-section-title">Review Your Request</h3>
            <div className="track-detail-row"><span className="track-detail-label">Document</span><span className="track-detail-value">{documentType}</span></div>
            <div className="track-detail-row"><span className="track-detail-label">Purpose</span><span className="track-detail-value">{purpose}</span></div>
            <div className="track-detail-row"><span className="track-detail-label">Requestor</span><span className="track-detail-value">{verified.lastName}, {verified.firstName}</span></div>
            <div className="track-detail-row"><span className="track-detail-label">Address</span><span className="track-detail-value">{verified.address}</span></div>
            <div className="track-detail-row"><span className="track-detail-label">Supporting File</span><span className="track-detail-value">{file ? file.name : 'None attached'}</span></div>

            <button type="button" className="btn-primary btn-full" disabled={loading} onClick={handleSubmit} style={{ marginTop: 16 }}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        )}

        {step === 4 && success && (
          <div className="success-box">
            <h2>Request Submitted Successfully!</h2>
            <p>Your document request has been submitted. Please save your Request ID.</p>
            <div className="control-number-box">
              <div className="control-label">Your Request ID</div>
              <div className="control-number">{success.controlNumber}</div>
              <div className="control-note">Use this ID to track your request</div>
            </div>
            <div className="success-details">
              <div><strong>Document:</strong> {success.documentType}</div>
              <div><strong>Date Submitted:</strong> {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div><strong>Status:</strong> {success.status || 'Pending'}</div>
              <div><strong>Next Step:</strong> Wait for the barangay to process your request. Visit the barangay hall to claim your document once ready.</div>
            </div>
            <div className="success-btns">
              <button className="btn-primary" onClick={() => onTrack(success.controlNumber)}>Track My Request</button>
              <button className="btn-outline" onClick={() => { setStep(0); setSuccess(null); setDocumentType(''); setPurpose(''); setFile(null); }}>Submit Another Request</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// Main export — routes between the resident wizard and the
// simpler guest (not logged in) verification-based form.
// ---------------------------------------------------------------
const RequestForm = ({ onTrack, onVerify, onBack }) => {
  const [mode, setMode] = useState(null); // 'resident' | 'guest' | null (checking)
  const [verified, setVerified] = useState(null); // guest-flow verification result
  const [form, setForm] = useState({ documentType: 'Barangay Clearance', purpose: '' });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(null);

  const residentToken = localStorage.getItem('residentToken');

  useEffect(() => {
    if (residentToken) {
      axios.get(`${API}/resident-accounts/me`, { headers: { Authorization: `Bearer ${residentToken}` } })
        .then(res => {
          setVerified({
            residentId: res.data.data.resident.id,
            firstName: res.data.data.resident.firstName,
            middleName: res.data.data.resident.middleName,
            lastName: res.data.data.resident.lastName,
            address: res.data.data.resident.address,
          });
          setMode('resident');
        })
        .catch(() => {
          setMode('guest');
        });
      return;
    }

    const token = sessionStorage.getItem('verificationToken');
    const resident = sessionStorage.getItem('verifiedResident');
    if (token && resident) {
      setVerified(JSON.parse(resident));
    } else {
      setVerified(false);
    }
    setMode('guest');
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.purpose) {
      setError('Please enter the purpose of your request.');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('verificationToken');
      if (!token) { setVerified(false); setLoading(false); return; }
      const docRes = await axios.post(`${API}/documents/public`, {
        residentId: verified.residentId,
        documentType: form.documentType,
        purpose: form.purpose,
        verificationToken: token,
      });
      setSuccess(docRes.data.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        sessionStorage.removeItem('verificationToken');
        sessionStorage.removeItem('verifiedResident');
        setVerified(false);
      }
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === null) return null;

  if (mode === 'resident') {
    return <ResidentWizard verified={verified} residentToken={residentToken} onTrack={onTrack} onBack={onBack} />;
  }

  if (verified === false) {
    return (
      <div className="section">
        {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}
        <div className="success-box">
          <h2>Verification Required</h2>
          <p>Please verify your residency before requesting a document, or log in to your resident account to skip this step.</p>
          <div className="success-btns">
            <button className="btn-primary" onClick={onVerify}>Verify Residency</button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="section">
        <div className="success-box">
          <h2>Request Submitted Successfully!</h2>
          <p>Your document request has been submitted. Please save your control number.</p>
          <div className="control-number-box">
            <div className="control-label">Your Control Number</div>
            <div className="control-number">{success.controlNumber}</div>
            <div className="control-note">Use this number to track your request</div>
          </div>
          <div className="success-details">
            <div><strong>Document:</strong> {success.documentType}</div>
            <div><strong>Status:</strong> {success.status || 'Pending'}</div>
            <div><strong>Next Step:</strong> Wait for the barangay to process your request. Visit the barangay hall to claim your document.</div>
          </div>
          <div className="success-btns">
            <button className="btn-primary" onClick={() => onTrack(success.controlNumber)}>Track My Request</button>
            <button className="btn-outline" onClick={() => { setSuccess(null); setForm({ documentType: 'Barangay Clearance', purpose: '' }); }}>Submit Another Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}
      <div className="form-header" style={{ textAlign: 'center' }}>
        <h2>Request a Document</h2>
        <p>Fill out the form below to request a barangay document online.</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-section">
          <h3 className="form-section-title">Verified Resident</h3>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-control" value={verified.firstName} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Middle Name</label>
              <input className="form-control" value={verified.middleName || ''} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-control" value={verified.lastName} disabled />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-control" value={verified.address} disabled />
          </div>
          <div className="form-note">
            These details are locked to your verified record. If anything is incorrect, please visit the barangay hall to update your resident record.
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Document Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Document Type *</label>
              <select className="form-control" name="documentType" value={form.documentType} onChange={handleChange}>
                {DOCUMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Purpose *</label>
              <input className="form-control" name="purpose" placeholder="e.g. Employment, School enrollment..." value={form.purpose} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-note">
          <strong>Note:</strong> Please make sure all information is correct. You will need to present a valid ID when claiming your document at the barangay hall.
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Document Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
