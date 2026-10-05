import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ isSidebarCollapsed, onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header
      style={{
        height: 'var(--header-height, 56px)',
        backgroundColor: 'var(--header-bg, #050b0d)',
        borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        userSelect: 'none',
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* Left: Hamburger + BUSFLOW Official Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Toggle Navigation Sidebar"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-heading, #ffffff)',
            padding: '0.35rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <line x1="1" y1="2" x2="21" y2="2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="1" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="1" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        {/* BUSFLOW Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Front-Facing Bus Icon */}
          <div
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--busflow-green, #00e599)',
              flexShrink: 0
            }}
          >
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="4" width="20" height="18" rx="4" stroke="currentColor" strokeWidth="2" fill={isLight ? 'rgba(0, 168, 107, 0.08)' : 'rgba(0, 229, 153, 0.08)'} />
              <path d="M2 9v4M26 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 8h14v5H7z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="8" cy="17.5" r="1.5" fill="currentColor" />
              <circle cx="20" cy="17.5" r="1.5" fill="currentColor" />
              <line x1="11.5" y1="17.5" x2="16.5" y2="17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="23" x2="10" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="23" x2="21" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* BUSFLOW Title & Subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1.1 }}>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-heading, #ffffff)',
                  letterSpacing: '-0.02em'
                }}
              >
                BUS
              </span>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--busflow-green, #00e599)',
                  letterSpacing: '-0.02em',
                  textShadow: isLight ? 'none' : '0 0 10px rgba(0, 229, 153, 0.4)'
                }}
              >
                FLOW
              </span>
            </div>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 500,
                color: 'var(--text-secondary, #94a3b8)',
                letterSpacing: '0.01em',
                marginTop: '1px'
              }}
            >
              Tamil Nadu State Transport
            </span>
          </div>
        </div>
      </div>

      {/* Right: Date/Time, Theme Toggle, Notification Bell, Tamil Nadu State Emblem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
        {/* Live Date & Time Clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.65rem',
            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            borderRadius: 'var(--radius-md, 8px)',
            fontSize: '0.74rem'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--busflow-green, #00e599)',
              boxShadow: isLight ? '0 0 4px #00a86b' : '0 0 6px #00e599'
            }}
          />
          <span style={{ color: 'var(--text-secondary, #94a3b8)', fontWeight: 500 }}>
            {formattedDate}
          </span>
          <span style={{ color: 'var(--text-heading, #ffffff)', fontWeight: 700, fontFamily: 'monospace' }}>
            {formattedTime}
          </span>
        </div>

        {/* Working Light / Dark Mode Toggle Pill */}
        <div
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
            borderRadius: '9999px',
            padding: '2px 3px',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            gap: '2px'
          }}
          title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        >
          {/* Sun Icon */}
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: isLight ? '#ffffff' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              boxShadow: isLight ? '0 1px 4px rgba(0, 0, 0, 0.15)' : 'none',
              transition: 'all 0.2s ease',
              color: isLight ? '#d97706' : 'var(--text-muted)'
            }}
          >
            ☀️
          </div>

          {/* Moon Icon */}
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: !isLight ? 'rgba(0, 229, 153, 0.2)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              boxShadow: !isLight ? '0 0 6px rgba(0, 229, 153, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              color: !isLight ? '#00e599' : 'var(--text-muted)'
            }}
          >
            🌙
          </div>
        </div>

        {/* Notification Bell with Red Dot */}
        <div
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="System Alerts"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #94a3b8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              boxShadow: '0 0 6px #ef4444'
            }}
          />
        </div>

        {/* Small Clean Official Tamil Nadu Emblem + Corporation Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <img
              src="/assets/tamil_nadu_emblem.png"
              onError={(e) => { e.currentTarget.src = '/tn-emblem.png'; }}
              alt="Government of Tamil Nadu Emblem"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-heading, #ffffff)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em'
              }}
            >
              Tamil Nadu
            </span>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 500,
                color: 'var(--text-secondary, #94a3b8)',
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
