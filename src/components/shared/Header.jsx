import React from 'react';
<<<<<<< HEAD

export default function Header({ isSidebarCollapsed, onToggleSidebar }) {
  return (
    <header
      style={{
        height: '60px',
        backgroundColor: '#001119',
        borderBottom: '1px solid #102636',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        userSelect: 'none'
      }}
    >
      {/* Left: Hamburger + BUSFLOW Official Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Toggle Navigation Sidebar"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            padding: '0.35rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <line x1="1" y1="2" x2="21" y2="2" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="1" y1="8" x2="21" y2="8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="1" y1="14" x2="21" y2="14" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        {/* BUSFLOW Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Cyan/Teal Front-Facing Bus Icon */}
          <div
            style={{
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00f5c4',
              flexShrink: 0
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              {/* Bus Outer Body with curved roof */}
              <rect x="4" y="4" width="20" height="18" rx="4" stroke="#00f5c4" strokeWidth="2" fill="rgba(0, 245, 196, 0.08)" />
              {/* Side Mirrors */}
              <path d="M2 9v4M26 9v4" stroke="#00f5c4" strokeWidth="2" strokeLinecap="round" />
              {/* Windshield */}
              <path d="M7 8h14v5H7z" fill="#00f5c4" fillOpacity="0.25" stroke="#00f5c4" strokeWidth="1.2" />
              {/* Headlights */}
              <circle cx="8" cy="17.5" r="1.5" fill="#00f5c4" />
              <circle cx="20" cy="17.5" r="1.5" fill="#00f5c4" />
              {/* Front Grille Line */}
              <line x1="11.5" y1="17.5" x2="16.5" y2="17.5" stroke="#00f5c4" strokeWidth="1.5" strokeLinecap="round" />
              {/* Tires / Lower Base */}
              <line x1="7" y1="23" x2="10" y2="23" stroke="#00f5c4" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="23" x2="21" y2="23" stroke="#00f5c4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* BUSFLOW Title & Subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1.1 }}>
              <span
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em'
                }}
              >
                BUS
              </span>
              <span
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  color: '#00f5c4',
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 10px rgba(0, 245, 196, 0.4)'
                }}
              >
                FLOW
              </span>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 400,
                color: '#8fa0b5',
                letterSpacing: '0.01em',
                marginTop: '1px'
              }}
            >
              Tamil Nadu State Transport
            </span>
=======
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
>>>>>>> 3b4e75566151e08388df1df77bb4eaef9469c0da
          </div>
        </div>

<<<<<<< HEAD
      {/* Right: Theme Toggle, Notification Bell, Small Clean TN Emblem & Corporation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
        {/* Day/Night Theme Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#021420',
            border: '1px solid #132c3f',
            borderRadius: '9999px',
            padding: '2px 3px',
            gap: '3px'
=======
        {/* Notification Bell with red dot */}
        <div
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
>>>>>>> 3b4e75566151e08388df1df77bb4eaef9469c0da
          }}
          title="Notifications"
        >
<<<<<<< HEAD
          {/* Sun icon (Golden Yellow rays) */}
          <div
            title="Light Mode"
            style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              cursor: 'pointer'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4.5" fill="#f59e0b" />
              <line x1="12" y1="1.5" x2="12" y2="4" stroke="#f59e0b" />
              <line x1="12" y1="20" x2="12" y2="22.5" stroke="#f59e0b" />
              <line x1="4.5" y1="4.5" x2="6.3" y2="6.3" stroke="#f59e0b" />
              <line x1="17.7" y1="17.7" x2="19.5" y2="19.5" stroke="#f59e0b" />
              <line x1="1.5" y1="12" x2="4" y2="12" stroke="#f59e0b" />
              <line x1="20" y1="12" x2="22.5" y2="12" stroke="#f59e0b" />
              <line x1="4.5" y1="19.5" x2="6.3" y2="17.7" stroke="#f59e0b" />
              <line x1="17.7" y1="6.3" x2="19.5" y2="4.5" stroke="#f59e0b" />
            </svg>
          </div>

          {/* Active Moon Knob (White circle with dark crescent inside) */}
          <div
            title="Dark Theme Active"
            style={{
              backgroundColor: '#ffffff',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#001119',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
        </div>

        {/* Notification Bell with Red Dot */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            title="System Alerts"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          {/* Red indicator dot */}
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
=======
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
>>>>>>> 3b4e75566151e08388df1df77bb4eaef9469c0da
              width: '7px',
              height: '7px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
<<<<<<< HEAD
              boxShadow: '0 0 6px #ef4444'
=======
              boxShadow: '0 0 4px #ef4444'
>>>>>>> 3b4e75566151e08388df1df77bb4eaef9469c0da
            }}
          />
        </div>

<<<<<<< HEAD
        {/* Small Clean Official Tamil Nadu Emblem + Corporation Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Official Emblem: small, clean, exact */}
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
              alt="Government of Tamil Nadu Emblem"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Text Title */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.01em'
=======
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
>>>>>>> 3b4e75566151e08388df1df77bb4eaef9469c0da
              }}
            >
              Tamil Nadu
            </span>
            <span
              style={{
<<<<<<< HEAD
                fontSize: '0.7rem',
                fontWeight: 400,
                color: '#8fa0b5',
=======
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
>>>>>>> 3b4e75566151e08388df1df77bb4eaef9469c0da
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
