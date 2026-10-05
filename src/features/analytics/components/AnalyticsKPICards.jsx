import React from 'react';

export default function AnalyticsKPICards({ kpis }) {
  const cards = [
    {
      id: 'trips',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2">
          <rect x="3" y="3" width="18" height="13" rx="2" />
          <path d="M7 16v4" />
          <path d="M17 16v4" />
          <circle cx="7" cy="12" r="1.5" />
          <circle cx="17" cy="12" r="1.5" />
        </svg>
      ),
      bg: '#059669',
      value: kpis.totalTrips.value,
      label: kpis.totalTrips.label,
      trend: kpis.totalTrips.trend,
      trendColor: '#00E5A3'
    },
    {
      id: 'passengers',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      bg: '#0284C7',
      value: kpis.passengersServed.value,
      label: kpis.passengersServed.label,
      trend: kpis.passengersServed.trend,
      trendColor: '#00E5A3'
    },
    {
      id: 'ontime',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      bg: '#7C3AED',
      value: kpis.onTimePerformance.value,
      label: kpis.onTimePerformance.label,
      trend: kpis.onTimePerformance.trend,
      trendColor: '#00E5A3'
    },
    {
      id: 'traveltime',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2">
          <circle cx="6" cy="19" r="3" />
          <circle cx="18" cy="5" r="3" />
          <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H15" />
        </svg>
      ),
      bg: '#D97706',
      value: kpis.avgTravelTime.value,
      label: kpis.avgTravelTime.label,
      trend: kpis.avgTravelTime.trend,
      trendColor: '#00E5A3'
    },
    {
      id: 'incidents',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      bg: '#DC2626',
      value: kpis.incidents.value,
      label: kpis.incidents.label,
      trend: kpis.incidents.trend,
      trendColor: '#EF4444'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: '12px',
            padding: '1.125rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            transition: 'transform 0.15s ease, border-color 0.15s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Square Icon Container */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {card.icon}
          </div>

          {/* Value, Label & Trend */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: card.trendColor, marginTop: '0.2rem', fontWeight: 600 }}>
              {card.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
