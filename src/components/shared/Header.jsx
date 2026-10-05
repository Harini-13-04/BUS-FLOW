import React from 'react';

export default function Header({ isSidebarCollapsed, onToggleSidebar }) {
  return (
    <header
      style={{
        height: '60px',
        backgroundColor: '#060c17',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '0.2rem'
          }}
        >
          ☰
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
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
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              BUSFLOW
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>
              Tamil Nadu State Transport
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Sun/Moon Dark Theme Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '9999px',
            padding: '0.2rem 0.35rem',
            gap: '0.35rem',
            fontSize: '0.8125rem'
          }}
        >
          <span style={{ opacity: 0.6, cursor: 'pointer' }}>☀️</span>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f8fafc',
              fontSize: '0.75rem'
            }}
          >
            🌙
          </div>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: '1.125rem', color: '#94a3b8' }}>🔔</span>
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }}
          />
        </div>

        {/* Tamil Nadu State Transport Seal Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid #1e293b', paddingLeft: '1rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#fef08a',
              border: '2px solid #eab308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#854d0e',
              overflow: 'hidden'
            }}
          >
            🏛️
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
              Tamil Nadu
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
              State Transport Corporation
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
