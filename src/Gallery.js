import React from 'react';

const PHOTOS = [
  { src: '/gallery/photo1.jpg', caption: 'Community Clean-Up Team, Barangay Hall' },
  { src: '/gallery/photo2.jpg', caption: 'Street Clean-Up Drive' },
  { src: '/gallery/photo3.jpg', caption: 'Daily Street Sweeping' },
  { src: '/gallery/photo4.jpg', caption: 'Neighborhood Clean-Up' },
  { src: '/gallery/photo5.jpg', caption: 'Clean-Up During Rainy Season' },
  { src: '/gallery/photo6.jpg', caption: 'Rainy Day Community Service' },
];

const Gallery = () => {
  return (
    <div className="section">
      <div className="form-header" style={{ padding: 0, marginBottom: 32 }}>
        <h2>Community Gallery</h2>
        <p>Photos from barangay clean-up drives and community activities.</p>
      </div>

      <div className="gallery-grid">
        {PHOTOS.map((photo) => (
          <div className="gallery-item" key={photo.src}>
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <div className="gallery-caption">{photo.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
