import React from 'react';

export default function HeroBadge({
  text = 'Smarter Buses  •  Smoother Cities  •  Better Journeys'
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.35rem 0.95rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(5, 25, 23, 0.75)',
        border: '1px solid rgba(0, 229, 153, 0.35)',
        boxShadow: '0 0 15px rgba(0, 229, 153, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        margin: '0 0 1.15rem 0',
        maxWidth: 'fit-content'
      }}
    >
      <span
        style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#00e599',
          letterSpacing: '0.03em'
        }}
      >
        {text}
      </span>
    </div>
  );
}
