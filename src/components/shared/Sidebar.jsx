import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', owner: 'Jayasri' },
  { path: '/live-map', label: 'Live Map', icon: '🗺️', owner: 'JV' },
  { path: '/simulation', label: 'Simulation', icon: '🔄', owner: 'JV' },
  { path: '/incidents', label: 'Incidents', icon: '⚠️', owner: 'JV' },
  { path: '/routes', label: 'Routes', icon: '🚏', owner: 'Jayasri' },
  { path: '/controllers', label: 'Controllers', icon: '🎛️', owner: 'Jaisha' },
  { path: '/analytics', label: 'Analytics', icon: '📈', owner: 'Jaisha' },
  { path: '/settings', label: 'Settings', icon: '⚙️', owner: 'Jayasri' },
  { path: '/about', label: 'About', icon: 'ℹ️', owner: 'Jayasri' }
];

export default function Sidebar({ isCollapsed }) {
  return (
    <aside
      style={{
        width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
        height: '100vh',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease-in-out',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}
    >
      {/* BUSFLOW Branding Header */}
      <div
        style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCollapsed ? 'center' : 'flex-start'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-accent)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.875rem'
            }}
          >
            BF
          </div>
          {!isCollapsed && (
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              BUSFLOW
            </span>
          )}
        </div>
        {!isCollapsed && (
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.375rem', margin: '0.375rem 0 0 0', lineHeight: 1.2 }}>
            Keep buses moving. Keep passengers waiting less.
          </p>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-surface-secondary)' : 'transparent',
                  borderLeft: isActive && !isCollapsed ? '3px solid var(--primary-accent)' : '3px solid transparent',
                  transition: 'background-color 0.15s ease'
                })}
              >
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer System Info */}
      {!isCollapsed && (
        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div>BUSFLOW Control Center v1.0</div>
          <div style={{ color: 'var(--color-recovered)', marginTop: '0.25rem' }}>● System Active</div>
        </div>
      )}
    </aside>
  );
}
