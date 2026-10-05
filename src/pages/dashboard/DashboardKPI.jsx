import React from 'react';

export default function DashboardKPI({ kpi }) {
  const renderIcon = () => {
    switch (kpi.type) {
      case 'bus':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      case 'bunching':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        );
      case 'incident':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L1 21h22L12 2zm0 4.5l8.2 14H3.8L12 6.5zm-1 4.5v5h2v-5h-2zm0 6v2h2v-2h-2z" />
          </svg>
        );
      case 'regularity':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-card)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Left Icon Container */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: kpi.bgTint,
            color: kpi.accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {renderIcon()}
        </div>

        {/* Content: Value, Label, Trend/Status */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-heading)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em'
            }}
          >
            {kpi.value}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginTop: '0.15rem',
              fontWeight: 500
            }}
          >
            {kpi.label}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: kpi.trendColor || kpi.statusColor,
              marginTop: '0.2rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            {kpi.status && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: kpi.statusColor,
                  display: 'inline-block'
                }}
              />
            )}
            {kpi.status ? kpi.status : kpi.trend}
          </div>
        </div>
      </div>

      {/* Right Chevron */}
      <div style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}
