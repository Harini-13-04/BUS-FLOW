import React from 'react';

export default function SelectedRecommendation({ recommendation, onApprove, onReject }) {
  if (!recommendation) {
    return (
      <div
        style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          color: '#94A3B8'
        }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem' }}>Select a recommendation to inspect details.</p>
      </div>
    );
  }

  const {
    priority,
    route,
    title,
    description,
    routeBg,
    impactMetrics = {
      headwayImprovement: '-4 min',
      busesAffected: 3,
      onTimePerformance: '+18%'
    },
    rationales = [
      'Ahead bus is 5 min early, next bus is 8 min behind schedule.',
      'High passenger load between Vadapalani - Ashok Nagar.',
      'Holding for 4 minutes will stabilize headway and reduce bunching risk.'
    ]
  } = recommendation;

  const priorityColor =
    priority?.toLowerCase() === 'high'
      ? '#EF4444'
      : priority?.toLowerCase() === 'medium'
      ? '#F59E0B'
      : '#3B82F6';

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '12px',
        padding: '1.25rem'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#94A3B8', margin: 0 }}>
          Selected Recommendation
        </h3>

        {/* Priority Badge */}
        <span
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${priorityColor}`,
            color: priorityColor,
            padding: '0.2rem 0.625rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700
          }}
        >
          {priority} Priority
        </span>
      </div>

      {/* Title & Route */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
        <span
          style={{
            backgroundColor: routeBg || priorityColor,
            color: '#FFFFFF',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: 800
          }}
        >
          {route}
        </span>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          {title}
        </h2>
      </div>

      <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
        {description}
      </p>

      {/* Expected Impact Section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.625rem' }}>
          EXPECTED IMPACT
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
          {/* Card 1: Headway */}
          <div
            style={{
              backgroundColor: '#111C2E',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '8px',
              padding: '0.875rem 0.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF' }}>
              {impactMetrics.headwayImprovement}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginTop: '0.125rem' }}>
              Avg. headway improvement
            </div>
          </div>

          {/* Card 2: Buses Affected */}
          <div
            style={{
              backgroundColor: '#111C2E',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '8px',
              padding: '0.875rem 0.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF' }}>
              {impactMetrics.busesAffected}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginTop: '0.125rem' }}>
              Buses affected
            </div>
          </div>

          {/* Card 3: On-time Performance */}
          <div
            style={{
              backgroundColor: '#111C2E',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '8px',
              padding: '0.875rem 0.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#00E5A3' }}>
              {impactMetrics.onTimePerformance}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginTop: '0.125rem' }}>
              On-time performance
            </div>
          </div>
        </div>
      </div>

      {/* Rationale Section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
          RATIONALE
        </span>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {rationales.map((item, idx) => (
            <li key={idx} style={{ fontSize: '0.8125rem', color: '#CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.4 }}>
              <span style={{ color: '#00E5A3' }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => onApprove(recommendation)}
          style={{
            backgroundColor: '#00E5A3',
            color: '#070C18',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00C88E')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00E5A3')}
        >
          <span>✓</span> Approve & Apply
        </button>

        <button
          type="button"
          onClick={() => onReject(recommendation)}
          style={{
            backgroundColor: '#1E293B',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1E293B';
          }}
        >
          <span>✕</span> Reject
        </button>
      </div>
    </div>
  );
}
