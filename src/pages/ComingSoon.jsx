import React from 'react';

export default function ComingSoon({ pageTitle = 'Page' }) {
  return (
    <div style={{ padding: '2.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>BUSFLOW</h1>
      <h2 style={{ fontSize: '2.25rem', color: '#f3f4f6', marginTop: '0.5rem', marginBottom: '0.5rem' }}>{pageTitle}</h2>
      <p style={{ fontSize: '1rem', color: '#9ca3af' }}>Coming soon</p>
    </div>
  );
}
