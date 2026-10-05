import React, { useState, useEffect } from 'react';

export default function ControllerHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Controllers
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.25rem', margin: 0 }}>
          AI-assisted operational control and recommendations
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Date */}
        <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: 500 }}>
          {formattedDate}
        </div>

        {/* Time */}
        <div style={{ fontSize: '1.125rem', color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.02em' }}>
          {formattedTime}
        </div>

        {/* Live Control Mode Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(0, 229, 163, 0.12)',
            border: '1px solid rgba(0, 229, 163, 0.3)',
            color: '#00E5A3',
            padding: '0.4rem 0.875rem',
            borderRadius: '9999px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            boxShadow: '0 0 12px rgba(0, 229, 163, 0.15)'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00E5A3',
              boxShadow: '0 0 8px #00E5A3',
              display: 'inline-block'
            }}
          />
          Live Control Mode
        </div>
      </div>
    </div>
  );
}
