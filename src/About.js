import React from 'react';
import brand from './brand';

const About = ({ onBack }) => (
  <div className="section">
    {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}

    <div className="form-header" style={{ textAlign: 'center' }}>
      <h2>About Barangay Malate, Manila, District V, City of Manila</h2>
      <p>Serving the residents of Malate, Manila — District V, City of Manila.</p>
    </div>

    <div className="legal-page" style={{ margin: '0 auto' }}>
      <div className="legal-body">
        <h3>About the Barangay</h3>
        <p>Barangay Malate, Manila, District V, City of Manila is the smallest local government unit serving the residents of this community in Malate, Manila. The barangay is responsible for delivering basic services, maintaining peace and order, and issuing official documents and certifications to its residents.</p>

        <h3>Mission</h3>
        <p>To provide accessible, transparent, and efficient barangay services to every resident, and to foster a safe, organized, and well-informed community.</p>

        <h3>Vision</h3>
        <p>A barangay where residents can easily access government services, participate in community life, and rely on a responsive local administration.</p>

        <h3>Office Information</h3>
        <p>The barangay hall serves as the main point of contact for document requests, community concerns, and local government transactions. Residents are encouraged to visit the office in person for transactions that require physical verification, such as claiming approved documents.</p>

        <h3>Contact Information</h3>
        <p>Email: {brand.contact.email}</p>
        <p>Address: {brand.contact.address}</p>

        <h3>Office Hours</h3>
        <p>{brand.contact.hours}</p>

        <h3>Barangay Location</h3>
        <p>Barangay Malate, Manila, District V, City of Manila, Malate, Manila, District V, City of Manila, Philippines.</p>
      </div>
    </div>
  </div>
);

export default About;
