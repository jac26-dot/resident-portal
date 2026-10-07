import React from 'react';

const PHOTOS = [
  '/gallery/photo1.jpg',
  '/gallery/photo2.jpg',
  '/gallery/photo3.jpg',
  '/gallery/photo4.jpg',
  '/gallery/photo5.jpg',
  '/gallery/photo6.jpg',
  '/gallery/photo7.jpg',
  '/gallery/photo8.jpg',
];

const Gallery = () => {
  return (
    <div className="section">
      <div className="form-header" style={{ padding: 0, marginBottom: 32, textAlign: 'center' }}>
        <h2>Community Gallery</h2>
        <p>Photos from Barangay Sample, Sample City, Philippines.</p>
      </div>

      <div className="gallery-grid">
        {PHOTOS.map((src) => (
          <div className="gallery-item" key={src}>
            <img src={src} alt="A colorful community mural" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;

