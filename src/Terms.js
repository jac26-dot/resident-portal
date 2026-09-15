import React from 'react';

const Terms = ({ onBack }) => (
  <div className="section legal-page">
    <button className="back-btn" onClick={onBack}>← Back</button>

    <div className="legal-header">
      <h2>Terms and Conditions</h2>
      <p>Barangay 697 Zone 76 Resident Portal</p>
    </div>

    <div className="legal-body">
      <h3>1. Introduction</h3>
      <p>These Terms and Conditions govern your use of the Barangay 697 Zone 76 Resident Portal ("the Portal"), an online service that allows residents to register an account, request barangay documents, and track the status of their requests. By using the Portal, you agree to these terms.</p>

      <h3>2. Eligibility</h3>
      <p>The Portal is intended for residents of Barangay 697 Zone 76, Malate, Manila. Account registration requires accurate personal information that matches, or can be matched against, the barangay's resident records. Accounts are reviewed and approved by barangay administrators before full access is granted.</p>

      <h3>3. Resident Accounts</h3>
      <p>You are responsible for the accuracy of the information you provide when registering. Submitting false or misleading information may result in your registration being rejected or your account being suspended.</p>

      <h3>4. Account Security</h3>
      <p>You are responsible for keeping your login credentials confidential. Notify the barangay office if you believe your account has been accessed without your permission. The barangay is not responsible for actions taken through your account if your credentials were shared or compromised due to your own actions.</p>

      <h3>5. Online Document Requests</h3>
      <p>The Portal allows approved residents to request barangay documents online. Submitting a request does not guarantee approval — all requests are subject to review by barangay staff. You will need to present a valid ID when claiming a physical document at the barangay hall.</p>

      <h3>6. Information Accuracy</h3>
      <p>The information you provide for document requests (purpose, document type, and related details) must be accurate and used only for lawful purposes. The barangay reserves the right to reject requests containing inaccurate or incomplete information.</p>

      <h3>7. Prohibited Use</h3>
      <p>You may not use the Portal to submit fraudulent requests, impersonate another resident, attempt to access another resident's account or information, or otherwise misuse the service.</p>

      <h3>8. Administrative Review</h3>
      <p>Barangay administrators may review, approve, reject, or request clarification on any account registration or document request submitted through the Portal, at their discretion, in accordance with standard barangay procedures.</p>

      <h3>9. Service Availability</h3>
      <p>The Portal is provided on an "as available" basis. The barangay does not guarantee uninterrupted access and is not liable for temporary unavailability due to maintenance or technical issues.</p>

      <h3>10. Changes to Terms</h3>
      <p>These Terms may be updated from time to time to reflect changes in barangay procedures or the Portal's features. Continued use of the Portal after changes are posted constitutes acceptance of the updated Terms.</p>

      <h3>11. Contact Information</h3>
      <p>For questions about these Terms, please contact the Barangay 697 Zone 76 office at pb.brgy697@gmail.com or visit during office hours.</p>
    </div>
  </div>
);

export default Terms;
