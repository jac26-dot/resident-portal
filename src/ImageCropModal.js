import React, { useState, useRef, useEffect } from 'react';

const FRAME = 280; // displayed crop frame size in px (square)
const OUTPUT = 480; // exported image size in px (square)

/**
 * A lightweight, dependency-free crop modal. Loads the given image
 * source, lets the user drag to reposition and use a slider to zoom,
 * and exports a square-cropped JPEG data URL on confirm. Nothing is
 * uploaded until the user clicks "Crop & Save".
 */
const ImageCropModal = ({ imageSrc, onCancel, onConfirm }) => {
  const imgRef = useRef(null);
  const [natural, setNatural] = useState(null); // { width, height }
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ left: 0, top: 0 }); // image top-left, relative to frame
  const dragRef = useRef(null); // { startX, startY, startLeft, startTop }

  const baseScale = natural ? FRAME / Math.min(natural.width, natural.height) : 1;
  const scale = baseScale * zoom;
  const dispW = natural ? natural.width * scale : 0;
  const dispH = natural ? natural.height * scale : 0;

  const clamp = (left, top, w, h) => ({
    left: Math.min(0, Math.max(FRAME - w, left)),
    top: Math.min(0, Math.max(FRAME - h, top)),
  });

  const handleImgLoad = () => {
    const img = imgRef.current;
    const w = img.naturalWidth, h = img.naturalHeight;
    setNatural({ width: w, height: h });
    const s = FRAME / Math.min(w, h);
    setPos({ left: (FRAME - w * s) / 2, top: (FRAME - h * s) / 2 });
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    if (!natural) { setZoom(newZoom); return; }
    const newScale = baseScale * newZoom;
    const newW = natural.width * newScale, newH = natural.height * newScale;
    // Keep the current frame-center point anchored while zooming.
    const cx = FRAME / 2, cy = FRAME / 2;
    const ratio = newScale / scale;
    const newLeft = cx - (cx - pos.left) * ratio;
    const newTop = cy - (cy - pos.top) * ratio;
    setZoom(newZoom);
    setPos(clamp(newLeft, newTop, newW, newH));
  };

  const startDrag = (clientX, clientY) => {
    dragRef.current = { startX: clientX, startY: clientY, startLeft: pos.left, startTop: pos.top };
  };
  const moveDrag = (clientX, clientY) => {
    if (!dragRef.current) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    setPos(clamp(dragRef.current.startLeft + dx, dragRef.current.startTop + dy, dispW, dispH));
  };
  const endDrag = () => { dragRef.current = null; };

  useEffect(() => {
    const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();
    const onTouchMove = (e) => { if (e.touches[0]) moveDrag(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
    // eslint-disable-next-line
  }, [dispW, dispH]);

  const handleConfirm = () => {
    if (!natural) return;
    const sourceSize = FRAME / scale;
    const sourceX = -pos.left / scale;
    const sourceY = -pos.top / scale;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgRef.current, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT, OUTPUT);
    onConfirm(canvas.toDataURL('image/jpeg', 0.92));
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card crop-modal" onClick={e => e.stopPropagation()}>
        <h3>Crop Your Photo</h3>
        <p className="muted-text" style={{ marginTop: -6 }}>
          Drag to reposition and use the slider to zoom. Only the area inside the square will be saved.
        </p>

        <div
          className="crop-frame"
          style={{ width: FRAME, height: FRAME }}
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => e.touches[0] && startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={handleImgLoad}
            draggable={false}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              width: dispW || 'auto',
              height: dispH || 'auto',
              userSelect: 'none',
              cursor: 'grab',
            }}
          />
        </div>

        <div className="crop-zoom-row">
          <span>−</span>
          <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={handleZoomChange} />
          <span>+</span>
        </div>

        <div className="modal-actions">
          <button className="btn-outline-dark btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={handleConfirm} disabled={!natural}>Crop &amp; Save</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
