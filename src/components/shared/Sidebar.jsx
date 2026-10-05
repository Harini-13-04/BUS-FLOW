import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', owner: 'Jayasri' },
  { path: '/live-map', label: 'Live Map', icon: '🗺️', owner: 'JV' },
  { path: '/simulation', label: 'Simulation', icon: '▶', owner: 'JV' },
  { path: '/incidents', label: 'Incidents', icon: '⚠️', owner: 'JV' },
  { path: '/routes', label: 'Routes', icon: '🔑', owner: 'Jayasri' },
  { path: '/controllers', label: 'Controllers', icon: '🎛️', owner: 'Jaisha' },
  { path: '/analytics', label: 'Analytics', icon: '📈', owner: 'Jaisha' },
  { path: '/settings', label: 'Settings', icon: '⚙️', owner: 'Jayasri' }
];

export default function Sidebar({ isCollapsed }) {
  return (
    <aside
      style={{
        width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
        height: '100vh',
        backgroundColor: '#060c17',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s ease-in-out',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}
    >
      <div>
        {/* BUSFLOW Tamil Nadu Header */}
        <div
          style={{
            padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1.25rem 1rem 1.25rem',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#059669',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem'
              }}
            >
              🚌
            </div>
            {!isCollapsed && (
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  BUSFLOW
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.1rem' }}>
                  Tamil Nadu State Transport
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '0.75rem 0.5rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: isCollapsed ? '0.75rem' : '0.625rem 0.875rem',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? '#059669' : 'transparent',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer Tamil Nadu Gopuram Lineart Graphic */}
      {!isCollapsed && (
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1e293b', backgroundColor: '#040812' }}>
          {/* Neon Green Tamil Nadu Temple Gopuram Vector */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem' }}>
            <svg width="80" height="70" viewBox="0 0 100 90" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.75">
              <path d="M 42 8 L 58 8 L 56 18 L 44 18 Z" />
              <path d="M 38 18 L 62 18 L 60 30 L 40 30 Z" />
              <path d="M 34 30 L 66 30 L 63 44 L 37 44 Z" />
              <path d="M 30 44 L 70 44 L 67 60 L 33 60 Z" />
              <path d="M 25 60 L 75 60 L 72 78 L 28 78 Z" />
              <path d="M 20 78 L 80 78 L 80 90 L 20 90 Z" />
              <circle cx="46" cy="4" r="1.8" fill="#10b981" />
              <circle cx="50" cy="3" r="1.8" fill="#10b981" />
              <circle cx="54" cy="4" r="1.8" fill="#10b981" />
              <path d="M 43 90 L 43 78 A 7 7 0 0 1 57 78 L 57 90" fill="rgba(16, 185, 129, 0.2)" />
              <line x1="32" y1="78" x2="32" y2="90" />
              <line x1="68" y1="78" x2="68" y2="90" />
            </svg>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.25 }}>
            Smarter Buses
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', lineHeight: 1.25 }}>
            Smoother Cities
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#10b981', marginTop: '0.2rem', fontWeight: 600 }}>
            For a Better Tamil Nadu
          </div>
        </div>
      )}
    </aside>
  );
}
