import React from 'react';
import { NavLink } from 'react-router-dom';
import templeArt from '../../assets/exact_temple_art.jpg';

const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    path: '/live-map',
    label: 'Live Map',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    )
  },
  {
    path: '/simulation',
    label: 'Simulation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    )
  },
  {
    path: '/incidents',
    label: 'Incidents',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  },
  {
    path: '/routes',
    label: 'Routes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3" />
        <circle cx="18" cy="5" r="3" />
        <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H15" />
      </svg>
    )
  },
  {
    path: '/controllers',
    label: 'Controllers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  }
];

export default function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '230px',
        minWidth: isCollapsed ? '72px' : '230px',
        height: '100vh',
        backgroundColor: 'var(--sidebar-bg, #070C18)',
        borderRight: '1px solid var(--border-color, rgba(148, 163, 184, 0.1))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Top Section: BUSFLOW Branding & Navigation */}
      <div>
        <div
          style={{
            padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div
            onClick={onToggle}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--busflow-green, #00E5A3)',
              color: '#070C18',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title="Toggle Sidebar"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#070C18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="13" rx="2" />
              <path d="M7 16v4" />
              <path d="M17 16v4" />
              <circle cx="7" cy="12" r="1.5" />
              <circle cx="17" cy="12" r="1.5" />
            </svg>
          </div>
          {!isCollapsed && (
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary, #FFFFFF)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                BUSFLOW
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary, #94A3B8)', fontWeight: 400, marginTop: '2px', display: 'block' }}>
                Tamil Nadu State Transport
              </span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '0.5rem 0.625rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: isCollapsed ? '0.75rem 0' : '0.625rem 0.875rem',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--busflow-green, #00E5A3)' : 'var(--text-secondary, #94A3B8)',
                    backgroundColor: isActive ? 'var(--primary-accent-bg, rgba(0, 229, 163, 0.12))' : 'transparent',
                    borderLeft: isActive && !isCollapsed ? '3px solid var(--busflow-green, #00E5A3)' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1, color: isActive ? 'var(--busflow-green, #00E5A3)' : 'inherit' }}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Section: Tamil Nadu Temple Heritage Art & Motto */}
      {!isCollapsed && (
        <div
          style={{
            padding: '0 1.25rem 1.25rem 1.25rem',
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {/* Green Line Art Temple Illustration */}
          <div style={{ width: '100%', height: '130px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={templeArt}
              alt="Tamil Nadu Temple"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'bottom center',
                mixBlendMode: 'screen',
                filter: 'brightness(1.1) contrast(1.1)',
                display: 'block'
              }}
            />
          </div>

          {/* Slogan Text */}
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #94A3B8)', lineHeight: 1.45, fontWeight: 400 }}>
            <div>Smarter Buses</div>
            <div>Smoother Cities</div>
            <div style={{ color: 'var(--busflow-green, #00E5A3)', fontWeight: 700, marginTop: '2px' }}>For a Better Tamil Nadu</div>
          </div>
        </div>
      )}
    </aside>
  );
}
