import React from 'react';

export default function AlertIndicator({ count = 0, state = 'normal', onClick }) {
  const isAlert = count > 0;
  const badgeColor = state === 'severe' ? 'var(--color-severe-delay)' : isAlert ? 'var(--color-at-risk)' : 'var(--text-muted)';

  return (
    <button
      type="button"
      onClick={onClick}
      title={isAlert ? `${count} Active Alerts` : 'System Operational — No active alerts'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.375rem 0.75rem',
        backgroundColor: 'var(--bg-surface-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: '0.8125rem',
        cursor: onClick ? 'pointer' : 'default',
        fontWeight: 500
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: badgeColor,
          boxShadow: isAlert ? `0 0 8px ${badgeColor}` : 'none'
        }}
      />
      <span>Alerts</span>
      {count > 0 && (
        <span
          style={{
            backgroundColor: badgeColor,
            color: '#ffffff',
            borderRadius: '9999px',
            padding: '0.1rem 0.4rem',
            fontSize: '0.75rem',
            fontWeight: 700
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
