import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    path: '/live-map',
    label: 'Live Map',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" x2="9" y1="3" y2="18" />
        <line x1="15" x2="15" y1="6" y2="21" />
      </svg>
    )
  },
  {
    path: '/simulation',
    label: 'Simulation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
      </svg>
    )
  },
  {
    path: '/incidents',
    label: 'Incidents',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
      </svg>
    )
  },
  {
    path: '/routes',
    label: 'Routes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3" />
        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
        <circle cx="18" cy="5" r="3" />
      </svg>
    )
  },
  {
    path: '/controllers',
    label: 'Controllers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10" />
        <line x1="12" x2="12" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="14" />
      </svg>
    )
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10" strokeLinecap="round" />
        <line x1="12" x2="12" y1="20" y2="4" strokeLinecap="round" />
        <line x1="6" x2="6" y1="20" y2="14" strokeLinecap="round" />
        <circle cx="18" cy="7" r="2" fill="currentColor" />
        <circle cx="12" cy="3" r="2" fill="currentColor" />
        <circle cx="6" cy="11" r="2" fill="currentColor" />
      </svg>
    )
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
];

export default function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside
      style={{
        width: isCollapsed ? 'var(--sidebar-width-collapsed, 72px)' : 'var(--sidebar-width, 230px)',
        minWidth: isCollapsed ? 'var(--sidebar-width-collapsed, 72px)' : 'var(--sidebar-width, 230px)',
        height: 'calc(100vh - var(--header-height, 56px))',
        backgroundColor: 'var(--sidebar-bg, #04090b)',
        borderRight: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
        position: 'sticky',
        top: 'var(--header-height, 56px)',
        zIndex: 40,
        overflowX: 'hidden',
        overflowY: 'auto',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      {/* Upper Navigation Section */}
      <div>
        {/* Navigation List */}
        <nav style={{ padding: '0.85rem 0.65rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: isCollapsed ? '0.65rem' : '0.6rem 0.85rem',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-md, 8px)',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--busflow-green, #00e599)' : 'var(--text-secondary, #94a3b8)',
                    backgroundColor: isActive ? 'var(--primary-accent-bg, rgba(0, 229, 153, 0.12))' : 'transparent',
                    border: isActive
                      ? '1px solid var(--border-green, rgba(0, 229, 153, 0.25))'
                      : '1px solid transparent',
                    position: 'relative',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator Left Glow */}
                      {isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: '6px',
                            bottom: '6px',
                            width: '3.5px',
                            backgroundColor: 'var(--busflow-green, #00e599)',
                            borderRadius: '0 3px 3px 0',
                            boxShadow: '0 0 8px var(--busflow-green-glow, rgba(0, 229, 153, 0.4))'
                          }}
                        />
                      )}

                      {/* Icon */}
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? 'var(--busflow-green, #00e599)' : 'var(--text-secondary, #94a3b8)'
                        }}
                      >
                        {item.icon}
                      </span>

                      {/* Label */}
                      {!isCollapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sidebar Lower Section: Exact Tamil Nadu Temple Artwork + Slogan */}
      {!isCollapsed && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0 0.85rem 1.25rem 0.85rem',
            marginTop: 'auto'
          }}
        >
          {/* Natural Emerald Line-Art Temple Illustration */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '0.65rem'
            }}
          >
            <img
              src="/sidebar-temple.png"
              onError={(e) => { e.currentTarget.src = '/assets/sidebar_temple_transparent.png'; }}
              alt="Tamil Nadu Gopuram Heritage"
              style={{
                width: '100%',
                maxWidth: '175px',
                height: 'auto',
                objectFit: 'contain',
                opacity: 0.95,
                filter: 'drop-shadow(0 0 8px var(--busflow-green-glow, rgba(0, 229, 153, 0.2)))',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Slogan Typography */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              paddingLeft: '0.35rem',
              width: '100%'
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 500,
                color: 'var(--text-secondary, #94a3b8)',
                lineHeight: 1.35,
                letterSpacing: '0.01em'
              }}
            >
              Smarter Buses
            </span>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 500,
                color: 'var(--text-secondary, #94a3b8)',
                lineHeight: 1.35,
                letterSpacing: '0.01em'
              }}
            >
              Smoother Cities
            </span>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--busflow-green, #00e599)',
                lineHeight: 1.35,
                letterSpacing: '0.01em',
                marginTop: '1px'
              }}
            >
              For a Better Tamil Nadu
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
