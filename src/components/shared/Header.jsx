import React from 'react';
import { useLocation } from 'react-router-dom';
import AlertIndicator from './AlertIndicator';

const ROUTE_NAMES = {
  '/dashboard': 'Operations Dashboard',
  '/live-map': 'Live Network Map',
  '/simulation': 'Simulation Control',
  '/incidents': 'Incident Center',
  '/routes': 'Routes & Lines',
  '/controllers': 'Controller Management',
  '/analytics': 'Performance Analytics',
  '/settings': 'System Settings',
  '/about': 'About BUSFLOW'
};

export default function Header({ isSidebarCollapsed, onToggleSidebar }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = ROUTE_NAMES[currentPath] || 'Operations Control';

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Toggle Navigation Sidebar"
          style={{
            background: 'none',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          {isSidebarCollapsed ? '☰' : '✕'}
        </button>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            BUSFLOW Control System
          </span>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
            {pageTitle}
          </h2>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <AlertIndicator count={0} state="normal" />

        {/* Theme Toggle Foundation */}
        <button
          type="button"
          title="Dark Theme Active"
          style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            padding: '0.375rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            cursor: 'default'
          }}
        >
          🌙 Dark Mode
        </button>
      </div>
    </header>
  );
}
