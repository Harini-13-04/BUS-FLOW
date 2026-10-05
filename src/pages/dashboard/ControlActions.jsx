import React from 'react';

export default function ControlActions({ actions = [] }) {
  const renderBusIcon = (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6v6" />
      <path d="M16 6v6" />
      <rect width="16" height="16" x="4" y="3" rx="2" />
      <path d="M4 11h16" />
      <path d="M6 15h.01" />
      <path d="M18 15h.01" />
      <path d="M7 19v2" />
      <path d="M17 19v2" />
    </svg>
  );

  return (
    <div
      style={{
        backgroundColor: '#0c1421',
        border: '1px solid #172336',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Current Control Actions
        </h3>
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.78rem',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          View All →
        </button>
      </div>

      {/* Action Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {actions.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.75rem',
              backgroundColor: '#080d16',
              borderRadius: '8px',
              border: '1px solid #141c2a',
              transition: 'background-color 0.15s'
            }}
          >
            {/* Left: Bus Icon + Bus ID + Action Text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {renderBusIcon(item.color)}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', flexShrink: 0 }}>
                {item.busId}
              </span>
              <span
                style={{
                  fontSize: '0.82rem',
                  color: '#cbd5e1',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.action}
              </span>
            </div>

            {/* Right: Duration (if present) + Three Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
              {item.duration && (
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: item.color
                  }}
                >
                  {item.duration}
                </span>
              )}
              <button
                type="button"
                title="Options"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: '0 2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                •••
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
