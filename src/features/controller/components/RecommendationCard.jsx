import React from 'react';

export default function RecommendationCard({
  recommendation,
  isSelected,
  onSelect,
  onApprove,
  onReject
}) {
  const {
    priority,
    route,
    title,
    description,
    timeDelta,
    busesAffected,
    impact,
    routeBg
  } = recommendation;

  const getPriorityColors = (p) => {
    switch (p.toLowerCase()) {
      case 'high':
        return { bg: '#EF4444', text: '#FFFFFF', border: '#EF4444' };
      case 'medium':
        return { bg: '#F59E0B', text: '#070C18', border: '#F59E0B' };
      case 'low':
      default:
        return { bg: '#3B82F6', text: '#FFFFFF', border: '#3B82F6' };
    }
  };

  const getImpactColors = (imp) => {
    switch (imp.toLowerCase()) {
      case 'high impact':
        return { color: '#EF4444', icon: '📈' };
      case 'moderate impact':
        return { color: '#F59E0B', icon: '📊' };
      case 'low impact':
      default:
        return { color: '#3B82F6', icon: '📊' };
    }
  };

  const priorityColors = getPriorityColors(priority);
  const impactColors = getImpactColors(impact);

  return (
    <div
      onClick={() => onSelect(recommendation)}
      style={{
        backgroundColor: '#0F172A',
        border: isSelected ? '1px solid #00E5A3' : '1px solid rgba(148, 163, 184, 0.12)',
        borderLeft: `4px solid ${priorityColors.border}`,
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        marginBottom: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isSelected ? '0 0 16px rgba(0, 229, 163, 0.2)' : '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Left info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
            {/* Priority Badge */}
            <span
              style={{
                backgroundColor: priorityColors.bg,
                color: priorityColors.text,
                padding: '0.2rem 0.625rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: 1
              }}
            >
              {priority}
            </span>

            {/* Route Badge */}
            <span
              style={{
                backgroundColor: routeBg || priorityColors.bg,
                color: '#FFFFFF',
                padding: '0.2rem 0.625rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                lineHeight: 1
              }}
            >
              {route}
            </span>

            {/* Title */}
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginLeft: '0.25rem' }}>
              {title}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0 0 0.625rem 0', lineHeight: 1.3 }}>
            {description}
          </p>

          {/* Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem', color: '#94A3B8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{timeDelta}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span>{busesAffected}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: impactColors.color, fontWeight: 600 }}>
              <span style={{ fontSize: '0.85rem' }}>{impactColors.icon}</span>
              <span>{impact}</span>
            </div>
          </div>
        </div>

        {/* Right buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onApprove(recommendation);
            }}
            style={{
              backgroundColor: '#00E5A3',
              color: '#070C18',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00C88E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00E5A3')}
          >
            Approve
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReject(recommendation);
            }}
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              color: '#F8FAFC',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.borderColor = '#EF4444';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1E293B';
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              e.currentTarget.style.color = '#F8FAFC';
            }}
          >
            Reject
          </button>

          <div style={{ color: isSelected ? '#00E5A3' : '#64748B', fontSize: '1.25rem', marginLeft: '0.25rem' }}>
            ›
          </div>
        </div>
      </div>
    </div>
  );
}
