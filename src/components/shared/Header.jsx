import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ isSidebarCollapsed, onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <header
      style={{
        height: 'var(--header-height, 56px)',
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Real Working Light / Dark Mode Toggle Pill */}
        <div
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        >
          {/* Sun Icon */}
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: isLight ? '#ffffff' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              boxShadow: isLight ? '0 1px 4px rgba(0, 0, 0, 0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            ☀️
          </div>

          {/* Moon Icon */}
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: !isLight ? '#0c1a1d' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              boxShadow: !isLight ? '0 0 6px rgba(0, 0, 0, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🌙
          </div>
        </div>

        {/* Notification Bell with red dot */}
        <div
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '7px',
              height: '7px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              boxShadow: '0 0 4px #ef4444'
            }}
          />
        </div>

        {/* Official Tamil Nadu Government Emblem & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src="/tn-emblem.png"
            alt="Government of Tamil Nadu"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-heading)',
                lineHeight: 1.15
              }}
            >
              Tamil Nadu
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.15
              }}
            >
              State Transport Corporation
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
