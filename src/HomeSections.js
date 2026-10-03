import React, { useState, useEffect, useCallback } from 'react';
import './home-sections.css';

const IMG = `${process.env.PUBLIC_URL || ''}/images/gallery`;

/* ---- Administrator: edit these values. Leave `number` empty until the official number is confirmed. ---- */
const HOTLINES = [
  { id: 'barangay', icon: 'landmark', name: 'Barangay Office', number: '', cta: 'Call Barangay',
    desc: 'Reach the barangay hall for assistance, reports, and community concerns.' },
  { id: 'police', icon: 'shield', name: 'Police', number: '(02) 8523-8378', cta: 'Call Police',
    desc: 'Manila Police District. Report crimes, threats, or situations that need police assistance.' },
  { id: 'fire', icon: 'flame', name: 'Fire & Rescue', number: '(02) 8426-0219', cta: 'Call Fire & Rescue',
    desc: 'Bureau of Fire Protection. Report fires and request rescue services.' },
  { id: 'medical', icon: 'medical', name: 'Medical Emergency', number: '143', cta: 'Call for Medical Help',
    desc: 'Philippine Red Cross. Request an ambulance or urgent medical assistance.' },
];

const ICONS = {
  phone: <><path d='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'/></>,
  kit: <><rect x='3' y='7' width='18' height='13' rx='2'/><path d='M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M12 11v5M9.5 13.5h5'/></>,
  home: <><path d='M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5M10 20v-6h4v6'/></>,
  clipboard: <><path d='M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1zM8 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2M9 12h6M9 16h6'/></>,
  landmark: <><path d='M3 9l9-6 9 6M4 9h16M6 11v7M10 11v7M14 11v7M18 11v7M3 21h18'/></>,
  shield: <><path d='M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4'/></>,
  flame: <><path d='M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z'/></>,
  medical: <><rect x='3' y='3' width='18' height='18' rx='3'/><path d='M12 8v8M8 12h8'/></>,
  pin: <><path d='M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></>,
  clock: <><circle cx='12' cy='12' r='9'/><path d='M12 7v5l3 2'/></>,
  mail: <><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3 7l9 6 9-6'/></>,
  doc: <><path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6'/></>,
  search: <><circle cx='11' cy='11' r='7'/><path d='M20 20l-4-4'/></>,
  bell: <><path d='M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0'/></>,
  idcard: <><rect x='3' y='5' width='18' height='14' rx='2'/><circle cx='9' cy='11' r='2'/><path d='M6 16c.6-2 5.4-2 6 0M15 10h3M15 14h3'/></>,
};
function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

const KIT = ['Drinking water', 'Food', 'Flashlight', 'First-aid kit', 'Batteries', 'Important documents'];
const TOPICS = ['Earthquake', 'Fire', 'Flood', 'Severe weather'];

const PHOTOS = [
  { id: 'mural-1', label: 'Gallery', title: 'Colorful Community Mural',
    desc: 'A vibrant mural celebrating community, culture, music, and local creativity.',
    alt: 'A colorful painted mural showing musicians, a woman with a cello, and flowers',
    base: 'gallery-photo', sizes: [800, 1600], w: 1600, h: 1200, pos: 'center' },
  { id: 'mural-2', label: 'Community Art', title: 'Faces and Flowers',
    desc: 'A colorful display of painted faces and lotus flowers representing creativity and community.',
    alt: 'Close-up of a painted face and lotus flowers in the mural',
    base: 'gallery-detail-2', sizes: [640, 1200], w: 1200, h: 900, pos: 'center' },
  { id: 'mural-3', label: 'Community Art', title: 'Music and Community',
    desc: 'A detailed mural featuring musical instruments and artistic expressions.',
    alt: 'Close-up of painted guitars and a cello in the mural',
    base: 'gallery-detail-1', sizes: [640, 1200], w: 1200, h: 900, pos: 'center' },
];

const src = (p, i) => `${IMG}/${p.base}-${p.sizes[i]}.jpg`;
const srcSet = (p) => p.sizes.map((s, i) => `${src(p, i)} ${s}w`).join(', ');

function ExpandCard({ icon, title, children, extra, btn }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hs-card hs-card-dark">
      <div className="hs-icon"><Icon name={icon} /></div>
      <h3>{title}</h3>
      {children}
      {open && <div className="hs-extra">{extra}</div>}
      <button className="hs-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Hide' : btn}
      </button>
    </div>
  );
}

function Lightbox({ index, onClose, onMove }) {
  const p = PHOTOS[index];
  const key = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onMove(-1);
    if (e.key === 'ArrowRight') onMove(1);
  }, [onClose, onMove]);
  useEffect(() => {
    document.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = prev; };
  }, [key]);
  return (
    <div className="hs-lightbox" role="dialog" aria-modal="true" aria-label={p.title} onClick={onClose}>
      <div className="hs-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="hs-lb-close" onClick={onClose} aria-label="Close photo">✕</button>
        <img src={src(p, 1)} srcSet={srcSet(p)} sizes="90vw" alt={p.alt} />
        <div className="hs-lb-cap">
          <h3>{p.title}</h3>
          <p>{p.desc}</p>
        </div>
        <div className="hs-lb-nav" hidden={PHOTOS.length < 2}>
          <button onClick={() => onMove(-1)} aria-label="Previous photo">← Previous</button>
          <span>{index + 1} / {PHOTOS.length}</span>
          <button onClick={() => onMove(1)} aria-label="Next photo">Next →</button>
        </div>
      </div>
    </div>
  );
}

export default function HomeSections({ navTo }) {
  const [open, setOpen] = useState(null);
  const move = useCallback((d) => setOpen((i) => (i + d + PHOTOS.length) % PHOTOS.length), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      {/* ---------- Emergency Preparedness Center ---------- */}
      <section className="hs-section hs-navy" id="emergency-section">
        <div className="hs-wrap">
          <h2 className="hs-title">Emergency &amp; Disaster Preparedness</h2>
          <p className="hs-lead">Stay prepared before, during, and after an emergency. Access essential safety information, preparedness guides, and emergency contacts for your household.</p>
          <div className="hs-grid-4">
            <div className="hs-card hs-card-dark">
              <div className="hs-icon"><Icon name="phone" /></div>
              <h3>Emergency Contacts</h3>
              <ul className="hs-list">
                <li>Barangay Emergency Hotline</li><li>Police</li><li>Fire &amp; Rescue</li><li>Medical Emergency</li>
              </ul>
              <button className="hs-btn" onClick={() => navTo('hotlines')}>View Emergency Hotlines</button>
            </div>
            <ExpandCard icon="kit" title="Emergency Kit" btn="View Checklist"
              extra={<p>Check your kit every few months and replace expired items.</p>}>
              <ul className="hs-list hs-check">{KIT.map((k) => <li key={k}>{k}</li>)}</ul>
            </ExpandCard>
            <ExpandCard icon="home" title="Evacuation Guide" btn="View Guide"
              extra={<p><strong>Assembly areas:</strong> to be provided by the barangay. Details will appear here once the administrator adds them.</p>}>
              <ul className="hs-list">
                <li>Evacuation reminders</li><li>Assembly areas</li><li>Preparedness instructions</li>
              </ul>
            </ExpandCard>
            <ExpandCard icon="clipboard" title="Safety Guides" btn="Safety Guides"
              extra={<p>Detailed step-by-step guides for each topic will be added by the barangay.</p>}>
              <ul className="hs-list">{TOPICS.map((t) => <li key={t}>{t}</li>)}</ul>
            </ExpandCard>
          </div>
        </div>
      </section>

      {/* ---------- Emergency Contact Directory ---------- */}
      <section className="hs-section" id="hotlines-section">
        <div className="hs-wrap">
          <h2 className="hs-title">Emergency Hotlines</h2>
          <p className="hs-lead">For emergencies, contact the appropriate emergency service immediately.</p>
          <div className="hs-grid-4">
            {HOTLINES.map((h) => (
              <div className="hs-card hs-card-light" key={h.id}>
                <div className="hs-icon hs-icon-lg"><Icon name={h.icon} /></div>
                <h3>{h.name}</h3>
                {h.number
                  ? <a className="hs-number" href={`tel:${h.number.replace(/[^\d+]/g, '')}`}>{h.number}</a>
                  : <p className="hs-number hs-pending">Number to be added by the barangay</p>}
                <p className="hs-desc">{h.desc}</p>
                {h.number
                  ? <a className="hs-btn hs-btn-navy" href={`tel:${h.number.replace(/[^\d+]/g, '')}`}>{h.cta}</a>
                  : <button className="hs-btn hs-btn-navy" onClick={() => navTo('hotlines')}>See hotline page</button>}
              </div>
            ))}
          </div>
          <div className="hs-more"><button className="hs-link" onClick={() => navTo('hotlines')}>View All Emergency Hotlines →</button></div>
        </div>
      </section>

      {/* ---------- Community Gallery ---------- */}
      <section className="hs-section hs-muted" id="gallery-section">
        <div className="hs-wrap">
          <h2 className="hs-title">Community Gallery</h2>
          <p className="hs-lead">Moments from Barangay Malate, Manila, District V, City of Manila.</p>
          <div className="hs-gallery">
            {PHOTOS.map((p, i) => (
              <figure className={`hs-photo ${i === 0 ? 'hs-feature' : ''}`} key={p.id}>
                <button className="hs-photo-btn" onClick={() => setOpen(i)} aria-label={`Open larger photo: ${p.title}`}>
                  <img src={src(p, i === 0 ? 1 : 0)} srcSet={srcSet(p)} sizes={i === 0 ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 35vw, 100vw'}
                    width={p.w} height={p.h} alt={p.alt} loading="lazy" decoding="async" style={{ objectPosition: p.pos }} />
                </button>
                <figcaption>
                  <span className="hs-tag">{p.label}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="hs-more"><button className="hs-link" onClick={() => navTo('gallery')}>View Full Gallery →</button></div>
        </div>
      </section>

      {open !== null && <Lightbox index={open} onClose={close} onMove={move} />}
    </>
  );
}
