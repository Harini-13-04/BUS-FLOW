import React from 'react';
import Card from '../../../components/shared/Card';

export default function IncidentTable({ incidents, selectedIncidentId, onSelectIncident }) {
  return (
    <Card
      title="Active Incidents"
      action={
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>
          View All →
        </span>
      }
      style={{ backgroundColor: '#0b121e', border: '1px solid #1e293b', padding: '1rem' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                padding: '0.875rem 1rem',
                backgroundColor: isSelected ? '#1e293b' : '#0f172a',
                borderLeft: `4px solid ${borderLeftColor}`,
                borderTop: '1px solid #1e293b',
                borderRight: '1px solid #1e293b',
                borderBottom: '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: iconBg,
                    color: iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}
                >
                  {iconSymbol}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#f8fafc' }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: isMajor ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                        color: isMajor ? '#ef4444' : '#f59e0b',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px'
                      }}
                    >
                      {item.severityBadge || 'Moderate'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78125rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                    {item.location}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                    {item.affectsText}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {item.reportedTime}
                </span>
                <span style={{ color: '#64748b', fontSize: '1rem' }}>›</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
