import React from 'react';

const STATUS_CONFIG = {
  NORMAL: {
    label: 'NORMAL',
    color: 'var(--color-normal)',
    bgColor: 'var(--color-normal-bg)',
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  AT_RISK: {
    label: 'AT RISK',
    color: 'var(--color-at-risk)',
    bgColor: 'var(--color-at-risk-bg)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  SEVERE_DELAY: {
    label: 'SEVERE DELAY',
    color: 'var(--color-severe-delay)',
    bgColor: 'var(--color-severe-delay-bg)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  RECOVERED: {
    label: 'RECOVERED',
    color: 'var(--color-recovered)',
    bgColor: 'var(--color-recovered-bg)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  }
};

export default function StatusBadge({ status = 'NORMAL', customLabel }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NORMAL;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.625rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        textTransform: 'uppercase'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.color,
          marginRight: '0.375rem'
        }}
      />
      {customLabel || config.label}
    </span>
  );
}
