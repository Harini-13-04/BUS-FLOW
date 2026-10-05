import React from 'react';

export default function RouteMapCanvas({ buses, stops, selectedBusId, onSelectBus }) {
  // Generate SVG path connecting stops
  const pathD = stops.reduce((acc, stop, idx) => {
    return idx === 0 ? `M ${stop.x} ${stop.y}` : `${acc} L ${stop.x} ${stop.y}`;
  }, '');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '560px',
        backgroundColor: '#060b14',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 32px rgba(0, 0, 0, 0.8)'
      }}
    >
      {/* Background OCC Grid Pattern */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.15, pointerEvents: 'none' }}
      >
        <defs>
          <pattern id="occGridBg" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#occGridBg)" />
      </svg>

      {/* Main Vector Map SVG View */}
      <svg
        viewBox="0 0 600 350"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* Background Transit Paths */}
        <path d="M 80 80 L 260 120 L 380 220 L 480 260" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="3" fill="none" />
        <path d="M 210 170 L 360 220 L 290 270" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="3" fill="none" />

        {/* Main Corridor Glow Track */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(16, 185, 129, 0.2)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Main Corridor Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highway Shields */}
        <g transform="translate(100, 240)">
          <rect x="-14" y="-8" width="28" height="16" rx="3" fill="#f59e0b" />
          <text y="3" textAnchor="middle" fill="#000" fontSize="7.5" fontWeight="900">NH 48</text>
        </g>
        <g transform="translate(420, 80)">
          <rect x="-16" y="-8" width="32" height="16" rx="3" fill="#f59e0b" />
          <text y="3" textAnchor="middle" fill="#000" fontSize="7.5" fontWeight="900">NH 716</text>
        </g>

        {/* Landmark Station Badges */}
        <g transform="translate(190, 205)">
          <rect x="-6" y="-10" width="105" height="20" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" strokeWidth="1" />
          <text x="46" y="3" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="600">🚌 Koyambedu Terminus</text>
        </g>

        <g transform="translate(260, 285)">
          <rect x="-6" y="-10" width="85" height="20" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" strokeWidth="1" />
          <text x="36" y="3" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="600">✈️ Chennai Airport</text>
        </g>

        <g transform="translate(430, 160)">
          <rect x="-6" y="-10" width="85" height="20" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" strokeWidth="1" />
          <text x="36" y="3" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="600">🚆 Chennai Central</text>
        </g>

        {/* Render Corridor Stops */}
        {stops.map((stop) => {
          const isTop = stop.labelPos === 'top';
          const labelY = isTop ? -14 : 20;

          return (
            <g key={stop.id} transform={`translate(${stop.x}, ${stop.y})`}>
              <circle r="6" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              <circle r="2.5" fill="#f8fafc" />
              <text
                y={labelY}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="8.5"
                fontWeight="600"
                style={{ userSelect: 'none' }}
              >
                {stop.name}
              </text>
            </g>
          );
        })}

        {/* Render Bus Vehicles */}
        {buses.map((bus) => {
          const isSelected = bus.id === selectedBusId;
          const isStalled = bus.id === 'B14' || bus.isStalled;

          let badgeFill = '#10b981'; // Green
          if (bus.id === 'B14' || bus.status === 'SEVERE_DELAY') badgeFill = '#ef4444'; // Red
          if (bus.status === 'AT_RISK') badgeFill = '#f59e0b'; // Yellow

          return (
            <g
              key={bus.id}
              transform={`translate(${bus.currentLocation.x}, ${bus.currentLocation.y})`}
              onClick={() => onSelectBus(bus.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Stall Warning Pulse Ring around B14 */}
              {isStalled && (
                <circle r="22" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8">
                  <animate attributeName="r" values="14;26;14" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Selection Halo */}
              {isSelected && (
                <circle r="18" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
              )}

              {/* Bus Badge Box */}
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill={badgeFill} stroke="#ffffff" strokeWidth={isSelected ? 2 : 0} />

              {/* Bus ID Label */}
              <text
                y="3"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="800"
                style={{ userSelect: 'none' }}
              >
                {bus.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Map Legend (Bottom-Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #1e293b',
          borderRadius: '9999px',
          padding: '0.4rem 0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#cbd5e1'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>On Time</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <span>At Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <span>Delayed</span>
        </div>
      </div>

      {/* Map Controls (Bottom-Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          right: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}
      >
        <button
          type="button"
          title="Target Vehicle"
          style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          🎯
        </button>
        <button
          type="button"
          title="Zoom In"
          style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
        >
          +
        </button>
        <button
          type="button"
          title="Zoom Out"
          style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
        >
          −
        </button>
      </div>
    </div>
  );
}

