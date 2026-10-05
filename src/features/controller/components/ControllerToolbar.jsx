import React from 'react';

export default function ControllerToolbar({
  activeTab,
  onTabChange,
  pendingCount = 5,
  activeCount = 12,
  selectedRoute,
  onRouteFilterChange,
  autoMode,
  onAutoModeToggle
}) {
  const tabs = [
    {
      id: 'recommendations',
      label: `AI Recommendations (${pendingCount})`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 'active',
      label: `Active Controls (${activeCount})`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      id: 'history',
      label: 'Control History',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    }
  ];

  const routes = ['All Routes', 'B21', 'B14', 'B33', 'B40', 'B12'];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}
    >
      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#00E5A3' : '#94A3B8',
                backgroundColor: isActive ? 'rgba(0, 229, 163, 0.12)' : '#0F172A',
                border: isActive ? '1px solid #00E5A3' : '1px solid rgba(148, 163, 184, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right side: Route dropdown & Auto Mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Route Filter Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0F172A',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '8px',
            padding: '0.2rem 0.5rem 0.2rem 0.75rem',
            gap: '0.5rem'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="13" rx="2" />
            <path d="M7 16v4" />
            <path d="M17 16v4" />
            <circle cx="7" cy="12" r="1" />
            <circle cx="17" cy="12" r="1" />
          </svg>
          <select
            value={selectedRoute}
            onChange={(e) => onRouteFilterChange(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#F8FAFC',
              fontSize: '0.875rem',
              fontWeight: 500,
              paddingRight: '1rem',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394A3B8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
              backgroundSize: '1.25rem'
            }}
          >
            {routes.map((r) => (
              <option key={r} value={r} style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Auto Mode Toggle */}
        <div
          onClick={onAutoModeToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            backgroundColor: '#0F172A',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '8px',
            padding: '0.4rem 0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: autoMode ? '#FFFFFF' : '#94A3B8' }}>
            Auto Mode
          </span>
          <div
            style={{
              width: '38px',
              height: '20px',
              borderRadius: '9999px',
              backgroundColor: autoMode ? '#00E5A3' : '#1E293B',
              position: 'relative',
              transition: 'background-color 0.2s ease'
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                position: 'absolute',
                top: '2px',
                left: autoMode ? '20px' : '2px',
                transition: 'left 0.2s ease'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
