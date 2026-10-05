import React from 'react';

export default function TopBusiestRoutes({ data }) {
  const maxPassengers = 4500;

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
          Top 5 Busiest Routes
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Highest passenger volume corridors</span>
      </div>

      {/* Horizontal Ranking Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {data.map((item, index) => {
          const fillWidth = (item.passengers / maxPassengers) * 100;

          return (
            <div key={item.route} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', width: '14px' }}>
                    #{index + 1}
                  </span>
                  <span
                    style={{
                      backgroundColor: item.color,
                      color: '#FFFFFF',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.75rem'
                    }}
                  >
                    {item.route}
                  </span>
                  <span style={{ color: '#CBD5E1', fontWeight: 500 }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 800, color: '#FFFFFF' }}>
                  {item.passengers.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#111C2E',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: `${fillWidth}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
