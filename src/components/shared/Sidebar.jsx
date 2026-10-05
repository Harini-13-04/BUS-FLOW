import React from 'react';
import { NavLink } from 'react-router-dom';
import BusLogoIcon from '../home/BusLogoIcon';

// Clean SVG Icons for Sidebar
function HomeIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MapIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function PlayCircleIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill={color} />
    </svg>
  );
}

function AlertTriangleIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function RouteIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}

function SlidersIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function AnalyticsIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function SettingsIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/live-map', label: 'Live Map', icon: MapIcon },
  { path: '/simulation', label: 'Simulation', icon: PlayCircleIcon },
  { path: '/incidents', label: 'Incidents', icon: AlertTriangleIcon },
  { path: '/routes', label: 'Routes', icon: RouteIcon },
  { path: '/controllers', label: 'Controllers', icon: SlidersIcon },
  { path: '/analytics', label: 'Analytics', icon: AnalyticsIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon }
];

export default function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '230px',
        minWidth: isCollapsed ? '72px' : '230px',
        height: '100vh',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        overflow: 'hidden'
      }}
    >
      {/* Top Section: Hamburger & Brand Header */}
      <div>
        <div
          style={{
            padding: '1rem 1.15rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          {/* Hamburger toggle */}
          <button
            type="button"
            onClick={onToggle}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
          >
            ☰
          </button>

          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <BusLogoIcon size={26} color="var(--busflow-green)" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  <span style={{ color: 'var(--text-heading)' }}>BUS</span>
                  <span style={{ color: 'var(--busflow-green)' }}>FLOW</span>
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '1px', whiteSpace: 'nowrap' }}>
                  Tamil Nadu State Transport
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '0.5rem 0.65rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: isCollapsed ? '0.65rem' : '0.65rem 0.85rem',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--busflow-green)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--primary-accent-bg)' : 'transparent',
                      borderLeft: isActive && !isCollapsed ? '3px solid var(--busflow-green)' : '3px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent size={18} color={isActive ? 'var(--busflow-green)' : 'var(--text-secondary)'} />
                        {!isCollapsed && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Section: Tamil Nadu Landmark / Temple Line Art & Motto */}
      {!isCollapsed && (
        <div
          style={{
            position: 'relative',
            padding: '0 0.45rem 1.25rem',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxSizing: 'border-box'
          }}
        >
          {/* Large natural emerald line-art temple illustration */}
          <img
            src="/sidebar-temple.png"
            alt="Tamil Nadu Temple Heritage"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              marginBottom: '0.75rem',
              filter: 'drop-shadow(0 0 6px var(--busflow-green-glow))',
              pointerEvents: 'none'
            }}
          />

          {/* Footer Motto Text */}
          <div
            style={{
              width: '100%',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              textAlign: 'left',
              paddingLeft: '0.55rem'
            }}
          >
            <div>Smarter Buses</div>
            <div>Smoother Cities</div>
            <div style={{ color: 'var(--busflow-green)', fontWeight: 700, marginTop: '2px' }}>
              For a Better Tamil Nadu
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
