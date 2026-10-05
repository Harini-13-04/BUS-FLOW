import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ isSidebarCollapsed, onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <header
      style={{
        height: 'var(--header-height, 56px)',
        backgroundColor: 'var(--header-bg, #070C18)',
        borderBottom: '1px solid var(--border-color, rgba(148, 163, 184, 0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        userSelect: 'none',
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* Left Section: Sidebar Toggle & Collapsed Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Toggle Navigation Sidebar"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary, #94A3B8)',
            padding: '0.4rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {isSidebarCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--busflow-green, #00E5A3)',
                color: '#070C18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#070C18" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="13" rx="2" />
                <path d="M7 16v4" />
                <path d="M17 16v4" />
                <circle cx="7" cy="12" r="1.5" />
                <circle cx="17" cy="12" r="1.5" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary, #FFFFFF)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                BUSFLOW
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)' }}>Tamil Nadu State Transport</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Section: Theme Toggle, Notifications, & TNSTC Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Light / Dark Mode Theme Toggle */}
        <div
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.06)' : '#0F172A',
            border: '1px solid var(--border-color, rgba(148, 163, 184, 0.15))',
            borderRadius: '9999px',
            padding: '3px',
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
              color: isLight ? '#f59e0b' : '#64748b',
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
              backgroundColor: !isLight ? '#1e293b' : 'transparent',
              color: !isLight ? '#f8fafc' : '#64748b',
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

        {/* Notification Bell Badge */}
        <div style={{ position: 'relative', cursor: 'pointer' }} title="Notifications">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isLight ? '#f1f5f9' : '#0F172A',
              border: '1px solid var(--border-color, rgba(148, 163, 184, 0.15))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary, #94A3B8)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '0.625rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--header-bg, #070C18)'
            }}
          >
            1
          </span>
        </div>

        {/* Tamil Nadu State Transport Corporation Branding Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #F59E0B 0%, #D97706 100%)',
              border: '2px solid var(--busflow-green, #00E5A3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0, 229, 163, 0.3)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary, #F8FAFC)', display: 'block', lineHeight: 1.1 }}>
              Tamil Nadu
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', display: 'block', lineHeight: 1.1 }}>
              State Transport Corporation
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

