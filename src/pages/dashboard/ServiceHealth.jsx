import React from 'react';

export default function ServiceHealth({ data }) {
  if (!data) return null;

  return (
    <div
      style={{
        backgroundColor: '#0c1421',
        border: '1px solid #172336',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Service Health
        </h3>
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.78rem',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'color 0.15s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          View Details →
        </button>
      </div>

      {/* Health Metric Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Row 1: Target Headway */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
              {data.targetHeadway.label}
            </span>
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
            {data.targetHeadway.value}
          </span>
        </div>

        {/* Row 2: Average Headway */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" x2="18" y1="20" y2="10" />
              <line x1="12" x2="12" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="14" />
            </svg>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
              {data.averageHeadway.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
              {data.averageHeadway.value}
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#10b981' }}>
              {data.averageHeadway.trend}
            </span>
          </div>
        </div>

        {/* Row 3: On-Time Performance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
              {data.onTimePerformance.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
              {data.onTimePerformance.value}
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#10b981' }}>
              {data.onTimePerformance.trend}
            </span>
          </div>
        </div>

        {/* Row 4: Route Recovery Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '0.55rem 0 0.15rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
              {data.routeRecoveryStatus.label}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
              {data.routeRecoveryStatus.value}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>
              {data.routeRecoveryStatus.subtitle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
