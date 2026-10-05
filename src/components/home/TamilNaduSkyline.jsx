import React from 'react';

export default function TamilNaduSkyline() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 'none',
        margin: '0.5rem 0 0 0',
        padding: 0,
        lineHeight: 0,
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        background: 'transparent',
        border: 'none'
      }}
    >
      <img
        src="/tn-skyline.png"
        alt="Tamil Nadu Heritage Landmarks Skyline"
        style={{
          width: '100%',
          height: 'auto',
          minHeight: '90px',
          maxHeight: '140px',
          objectFit: 'cover',
          objectPosition: 'bottom center',
          display: 'block',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          filter: 'drop-shadow(0 0 10px rgba(0, 229, 153, 0.35))'
        }}
      />
    </div>
  );
}
