import React from 'react';

export default function HeadwaySpacingBar({ buses, selectedBusId, onSelectBus }) {
  // Fixed percentage positions for buses to guarantee zero label collisions
  const busPositions = [
    { id: 'B21', posPct: 12, labelPos: 'top' },
    { id: 'B14', posPct: 35, labelPos: 'bottom' },
    { id: 'B1', posPct: 58, labelPos: 'top' },
    { id: 'B33', posPct: 76, labelPos: 'bottom' },
    { id: 'B40', posPct: 92, labelPos: 'top' }
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            Route B14 Sequence & Headway Gap Visualization
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Illustrates vehicle spacing along corridor and trailing bunching anomaly [Simulated]
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
          Linear Headway Strip
        </span>
      </div>

      {/* Visual Corridor Container */}
      <div
        style={{
          position: 'relative',
          height: '75px',
          backgroundColor: 'var(--bg-surface-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Track Line */}
        <div style={{ position: 'absolute', top: '50%', left: '2rem', right: '2rem', height: '3px', backgroundColor: 'var(--border-light)', transform: 'translateY(-50%)', zIndex: 1 }} />

        {/* Highlighted Stall Gap between B21 and B14 */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            height: '50%',
            left: '16%',
            width: '18%',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px dashed #ef4444',
            borderRadius: '4px',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px'
          }}
        >
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.1 }}>
            +14.5m Gap
          </span>
        </div>

        {/* Render Bus Markers */}
        {busPositions.map((item) => {
          const busData = buses.find((b) => b.id === item.id) || { id: item.id, status: 'NORMAL', etaText: '3.0 min' };
          const isSelected = busData.id === selectedBusId;

          let badgeBg = '#10b981';
          if (busData.id === 'B14' || busData.status === 'SEVERE_DELAY') badgeBg = '#ef4444';
          if (busData.status === 'AT_RISK') badgeBg = '#f59e0b';

          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.posPct}%`,
                transform: 'translateX(-50%)',
                top: '50%',
                zIndex: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Top Annotation if labelPos === top */}
              {item.labelPos === 'top' && (
                <div style={{ position: 'absolute', bottom: '18px', fontSize: '0.65rem', fontWeight: 700, color: badgeBg, whiteSpace: 'nowrap' }}>
                  {busData.etaText}
                </div>
              )}

              {/* Bus Button Icon */}
              <button
                type="button"
                onClick={() => onSelectBus(busData.id)}
                style={{
                  transform: 'translateY(-50%)',
                  background: isSelected ? 'var(--busflow-green)' : 'var(--bg-surface)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  border: `2px solid ${badgeBg}`,
                  borderRadius: '6px',
                  padding: '0.2rem 0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 10px rgba(0, 229, 153, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {busData.id}
              </button>

              {/* Bottom Annotation if labelPos === bottom */}
              {item.labelPos === 'bottom' && (
                <div style={{ position: 'absolute', top: '18px', fontSize: '0.65rem', fontWeight: 700, color: badgeBg, whiteSpace: 'nowrap' }}>
                  {busData.etaText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

