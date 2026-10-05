import React from 'react';

export default function RouteProgress({ data }) {
  if (!data) return null;

  const { routeName, distance, stopsCount, headway, stops } = data;

  const renderBusMarker = (bus) => {
    return (
      <div
        style={{
          position: 'absolute',
          top: '-46px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          zIndex: 5
        }}
      >
        {/* ID Pill Badge */}
        <div
          style={{
            backgroundColor: bus.color,
            color: '#ffffff',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '1px 6px',
            borderRadius: '4px',
            lineHeight: 1.2,
            boxShadow: `0 2px 8px ${bus.color}66`,
            whiteSpace: 'nowrap'
          }}
        >
          {bus.id}
        </div>

        {/* Bus Icon with Halo Glow */}
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: bus.color,
            border: '1.5px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: `0 0 12px ${bus.color}`
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6v6" />
            <path d="M16 6v6" />
            <rect width="16" height="16" x="4" y="3" rx="2" />
            <path d="M4 11h16" />
            <circle cx="6" cy="15" r="1" fill="#ffffff" />
            <circle cx="18" cy="15" r="1" fill="#ffffff" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: '#0c1421',
        border: '1px solid #172336',
        borderRadius: '12px',
        padding: '1.15rem 1.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          {routeName}
        </h3>

        {/* Right Info: Distance | Stops | Target Headway */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.78rem', color: '#94a3b8' }}>
          <span>{distance}</span>
          <span style={{ color: '#2d3748' }}>|</span>
          <span>{stopsCount}</span>
          <span style={{ color: '#2d3748' }}>|</span>
          <span style={{ color: '#cbd5e1' }}>{headway}</span>
        </div>
      </div>

      {/* Horizontal Route Progress Timeline Track */}
      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div
          style={{
            minWidth: '820px',
            position: 'relative',
            padding: '2.5rem 1.5rem 1.25rem'
          }}
        >
          {/* Main Track Cyan Line */}
          <div
            style={{
              position: 'absolute',
              top: '50px',
              left: '3.5rem',
              right: '3.5rem',
              height: '4px',
              backgroundColor: '#22d3ee',
              borderRadius: '2px',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
            }}
          />

          {/* Stops Along the Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2
            }}
          >
            {stops.map((stop, index) => {
              const isFirst = index === 0;
              const isLast = index === stops.length - 1;

              return (
                <div
                  key={stop.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    width: '80px'
                  }}
                >
                  {/* Bus Marker if present at this stop */}
                  {stop.bus && renderBusMarker(stop.bus)}

                  {/* Stop Node Circle */}
                  <div
                    style={{
                      width: isFirst || isLast ? '18px' : '14px',
                      height: isFirst || isLast ? '18px' : '14px',
                      borderRadius: '50%',
                      backgroundColor: isFirst ? '#ffffff' : isLast ? '#ef4444' : '#080d16',
                      border: isFirst
                        ? '3px solid #22d3ee'
                        : isLast
                        ? '3px solid #ffffff'
                        : '3px solid #ffffff',
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.8)',
                      cursor: 'pointer'
                    }}
                  />

                  {/* Stop Label Below */}
                  <span
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: isFirst || isLast ? 700 : 500,
                      color: isFirst || isLast ? '#ffffff' : '#94a3b8',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      userSelect: 'none'
                    }}
                  >
                    {stop.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
