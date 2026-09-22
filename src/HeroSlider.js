import React, { useState, useEffect, useRef } from 'react';

const SLIDES = [
  { src: '/images/hero/hero-1.jpg', alt: 'Barangay police clearing the street during heavy rain' },
  { src: '/images/hero/hero-2.jpg', alt: 'DRRMO ambulance on standby' },
  { src: '/images/hero/hero-3.jpg', alt: 'Barangay 697 Zone 76 community event' },
];

const HeroSlider = ({ children }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`hero-slide ${i === index ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.src})` }}
          role="img"
          aria-label={slide.alt}
        />
      ))}
      <div className="hero-slide-overlay" />

      <div className="hero-slider-content">{children}</div>

      <div className="hero-slider-dots">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={`hero-slider-dot ${i === index ? 'active' : ''}`}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
