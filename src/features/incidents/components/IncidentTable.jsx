import React from 'react';
import Card from '../../../components/shared/Card';

export default function IncidentTable({ incidents, selectedIncidentId, onSelectIncident }) {
  return (
    <Card
      title="Active Incidents"
      action={
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
          View All →
        </span>
      }
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.875rem', boxShadow: 'var(--shadow-card)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {incidents.map((item) => {
          const isSelected = item.id === selectedIncidentId;
          const isMajor = item.severityBadge === 'Major';

          let iconBg = 'rgba(239, 68, 68, 0.2)';
          let iconColor = '#ef4444';
          let borderLeftColor = '#ef4444';
          let iconSymbol = '⚠️';

          if (item.iconType === 'bunching') {
            iconBg = 'rgba(245, 158, 11, 0.2)';
            iconColor = '#f59e0b';
            borderLeftColor = '#f59e0b';
            iconSymbol = '👥';
          } else if (item.iconType === 'delay') {
            iconBg = 'rgba(239, 68, 68, 0.2)';
            iconColor = '#ef4444';
            borderLeftColor = '#ef4444';
            iconSymbol = '🚌';
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelectIncident(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.875rem',
                backgroundColor: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface-secondary)',
                borderLeft: `4px solid ${borderLeftColor}`,
                borderTop: '1px solid var(--border-subtle)',
                borderRight: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: iconBg,
                    color: iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}
                >
                  {iconSymbol}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-heading)' }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: isMajor ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                        color: isMajor ? '#ef4444' : '#f59e0b',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '9999px'
                      }}
                    >
                      {item.severityBadge || 'Moderate'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    {item.location}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                    {item.affectsText}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {item.reportedTime}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>›</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
