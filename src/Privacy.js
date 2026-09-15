import React from 'react';

const Privacy = ({ onBack }) => (
  <div className="section legal-page">
    <button className="back-btn" onClick={onBack}>← Back</button>

    <div className="legal-header">
      <h2>Privacy Notice</h2>
      <p>Barangay 697 Zone 76 Resident Portal</p>
    </div>

    <div className="legal-body">
      <h3>What Personal Information We Collect</h3>
      <p>When you register or use the Portal, we collect information such as your full name, date of birth, gender, civil status, address, contact number, and email address. If you submit a document request, we also collect the document type and purpose you provide.</p>

      <h3>How Information Is Used</h3>
      <p>Your information is used to verify your identity as a resident, process your account registration, process and track document requests, and allow barangay staff to contact you regarding your account or requests.</p>

      <h3>Resident Registration Information</h3>
      <p>Information you submit during registration is checked against the barangay's existing resident records to confirm your residency. This helps prevent duplicate or fraudulent registrations.</p>

      <h3>Uploaded Documents/Photos</h3>
      <p>If you upload a profile photo, it is stored and associated only with your own resident account. Your uploaded photo is not publicly visible — it can only be viewed by you and by authorized barangay administrators (for example, when preparing your official Barangay ID).</p>

      <h3>Document Requests</h3>
      <p>Details of your document requests (type, purpose, status, and control number) are stored so you and barangay staff can track the request from submission to release.</p>

      <h3>Data Sharing/Disclosure</h3>
      <p>Your information is used internally by Barangay 697 Zone 76 for resident record-keeping and document processing. We do not sell your information. Information may be disclosed if required by law or a valid government request.</p>

      <h3>Data Retention</h3>
      <p>Resident records and document request history are retained as part of the barangay's official records-keeping practices. If an account or resident record is removed from active use, it may be archived rather than permanently deleted, so that related document request history remains intact.</p>

      <h3>Data Security</h3>
      <p>We take reasonable measures to protect your information, including requiring login credentials to access your account and restricting resident information so residents can only view their own records.</p>

      <h3>Resident Rights</h3>
      <p>You may request to review or correct your personal information by contacting the barangay office. Certain identity details may require an in-person visit to update, to prevent unauthorized changes to official records.</p>

      <h3>Cookies/Analytics</h3>
      <p>The Portal does not currently use third-party analytics or advertising cookies.</p>

      <h3>Third-Party Services</h3>
      <p>The Portal does not currently share your information with third-party services beyond what is necessary to operate the barangay's own systems.</p>

      <h3>Contact Information / Privacy Inquiries</h3>
      <p>For questions or concerns about how your information is handled, please contact the Barangay 697 Zone 76 office at pb.brgy697@gmail.com or visit during office hours.</p>
    </div>
  </div>
);

export default Privacy;
