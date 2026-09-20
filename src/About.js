import React from 'react';

const About = ({ onBack }) => (
  <div className="section">
    {onBack && <button className="back-btn" onClick={onBack} type="button">← Back</button>}

    <div className="form-header" style={{ textAlign: 'center' }}>
      <h2>About Barangay 697 Zone 76</h2>
      <p>Serving the residents of Malate, Manila — District V, City of Manila.</p>
    </div>

    <div className="legal-page" style={{ margin: '0 auto' }}>
      <div className="legal-body">
        <h3>About the Barangay</h3>
        <p>Barangay 697 Zone 76 is the smallest local government unit serving the residents of this community in Malate, Manila. The barangay is responsible for delivering basic services, maintaining peace and order, and issuing official documents and certifications to its residents.</p>

        <h3>Mission</h3>
        <p>To provide accessible, transparent, and efficient barangay services to every resident, and to foster a safe, organized, and well-informed community.</p>

        <h3>Vision</h3>
        <p>A barangay where residents can easily access government services, participate in community life, and rely on a responsive local administration.</p>

        <h3>Office Information</h3>
        <p>The barangay hall serves as the main point of contact for document requests, community concerns, and local government transactions. Residents are encouraged to visit the office in person for transactions that require physical verification, such as claiming approved documents.</p>

        <h3>Contact Information</h3>
        <p>Email: pb.brgy697@gmail.com</p>
        <p>Address: 1858 L. M. Guerrero St., Manila, Philippines, 1004</p>

        <h3>Office Hours</h3>
        <p>Monday – Sunday, 24/7</p>

        <h3>Barangay Location</h3>
        <p>Barangay 697 Zone 76, Malate, Manila, District V, City of Manila, Philippines.</p>
      </div>
    </div>
  </div>
);

export default About;
