import React from 'react';

export default function DelayCausesChart({ data, totalIncidents = 18 }) {
  // Compute SVG Donut arc paths
  const size = 135;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

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
          Delay Causes
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Root cause classification of delays</span>
      </div>

      {/* Donut & Legend Container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* SVG Donut Chart */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.map((item) => {
              const dasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const dashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.percentage;

              return (
                <circle
                  key={item.cause}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dasharray}
                  strokeDashoffset={dashoffset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  style={{ transition: 'stroke-dasharray 0.3s ease' }}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
              {totalIncidents}
            </span>
            <span style={{ fontSize: '0.625rem', color: '#94A3B8', marginTop: '2px', fontWeight: 600 }}>
              Incidents
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {data.map((item) => (
            <div key={item.cause} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <span style={{ color: '#CBD5E1', fontWeight: 500 }}>{item.cause}</span>
              </div>
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
