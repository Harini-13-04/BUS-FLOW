import React from 'react';

export default function IncidentKPIBar({ incidents }) {
  const activeCount = incidents.filter((i) => !i.isDemoResolved && i.severityStatus !== 'RECOVERED').length;
  const underResolutionCount = incidents.filter((i) => !i.isDemoResolved && i.severityStatus === 'AT_RISK').length;
  const resolvedCount = incidents.filter((i) => i.isDemoResolved || i.severityStatus === 'RECOVERED').length;
  const majorCount = incidents.filter((i) => !i.isDemoResolved && i.severityStatus === 'SEVERE_DELAY').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
      {/* 1. Active Incidents Card (Red) */}
      <div
        style={{
          backgroundColor: '#0b121e',
          border: '1px solid #1e293b',
          borderRadius: 'var(--radius-lg)',
          padding: '0.65rem 0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              flexShrink: 0
            }}
          >
            ⚠️
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
              {activeCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem', whiteSpace: 'nowrap' }}>
              Active Incidents
            </div>
          </div>
        </div>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>›</span>
      </div>

      {/* 2. Under Resolution Card (Yellow) */}
      <div
        style={{
          backgroundColor: '#0b121e',
          border: '1px solid #1e293b',
          borderRadius: 'var(--radius-lg)',
          padding: '0.65rem 0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              flexShrink: 0
            }}
          >
            🕒
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
              {underResolutionCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem', whiteSpace: 'nowrap' }}>
              Under Resolution
            </div>
          </div>
        </div>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>›</span>
      </div>

      {/* 3. Resolved Today Card (Green) */}
      <div
        style={{
          backgroundColor: '#0b121e',
          border: '1px solid #1e293b',
          borderRadius: 'var(--radius-lg)',
          padding: '0.65rem 0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              flexShrink: 0
            }}
          >
            ✓
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
              {resolvedCount + 6}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem', whiteSpace: 'nowrap' }}>
              Resolved Today
            </div>
          </div>
        </div>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>›</span>
      </div>

      {/* 4. Major Incidents Card (Blue) */}
      <div
        style={{
          backgroundColor: '#0b121e',
          border: '1px solid #1e293b',
          borderRadius: 'var(--radius-lg)',
          padding: '0.65rem 0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              flexShrink: 0
            }}
          >
            📊
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
              {majorCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem', whiteSpace: 'nowrap' }}>
              Major Incidents
            </div>
          </div>
        </div>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>›</span>
      </div>
    </div>
  );
}

