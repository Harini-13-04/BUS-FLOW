import React from 'react';

export default function ControllerKPICards({ activeControls = 12, pendingDecisions = 5 }) {
  const kpis = [
    {
      id: 'active',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      iconBg: '#059669',
      iconColor: '#FFFFFF',
      value: activeControls,
      label: 'Active Controls',
      trend: '↑ 3 from last hour',
      trendColor: '#00E5A3'
    },
    {
      id: 'pending',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.59 2.8 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
        </svg>
      ),
      iconBg: '#D97706',
      iconColor: '#FFFFFF',
      value: pendingDecisions,
      label: 'Pending Decisions',
      trend: '↑ 2 new',
      trendColor: '#F59E0B'
    },
    {
      id: 'accuracy',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      iconBg: '#0284C7',
      iconColor: '#FFFFFF',
      value: '89%',
      label: 'Recommendation Accuracy',
      trend: '↑ 6% this week',
      trendColor: '#00E5A3'
    },
    {
      id: 'delay',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15" />
        </svg>
      ),
      iconBg: '#7C3AED',
      iconColor: '#FFFFFF',
      value: '35 min',
      label: 'Avg. Delay Reduction',
      trend: '↓ 12% vs last week',
      trendColor: '#EF4444'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}
    >
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: '12px',
            padding: '1.125rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'transform 0.15s ease, border-color 0.15s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Square Icon Box */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: kpi.iconBg,
              color: kpi.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {kpi.icon}
          </div>

          {/* Value, Label & Trend */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '0.25rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: kpi.trendColor, marginTop: '0.25rem', fontWeight: 600 }}>
              {kpi.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
