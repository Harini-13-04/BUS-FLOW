import React from 'react';

const VARIANT_STYLES = {
  primary: {
    backgroundColor: 'var(--primary-accent)',
    color: '#ffffff',
    border: '1px solid transparent'
  },
  secondary: {
    backgroundColor: 'var(--bg-surface-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-light)'
  },
  danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: 'var(--color-severe-delay)',
    border: '1px solid rgba(239, 68, 68, 0.4)'
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent'
  }
};

const SIZE_STYLES = {
  sm: { padding: '0.375rem 0.75rem', fontSize: '0.8125rem' },
  md: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  lg: { padding: '0.75rem 1.25rem', fontSize: '1rem' }
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  style = {}
}) {
  const vStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease-in-out',
        ...vStyle,
        ...sStyle,
        ...style
      }}
    >
      {children}
    </button>
  );
}
