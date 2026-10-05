import React, { useState } from 'react';

// Route list mock data matching reference screenshot
const ROUTES_LIST = [
  { id: 'B1', origin: 'Anna Nagar', destination: 'T. Nagar', status: 'On Time', badgeColor: '#0284c7' },
  { id: 'B14', origin: 'Shenoy Nagar', destination: 'CMBT', status: 'At Risk', badgeColor: '#d97706' },
  { id: 'B21', origin: 'Vadapalani', destination: 'Arumbakkam', status: 'Delayed', badgeColor: '#dc2626' },
  { id: 'B33', origin: 'Ashok Nagar', destination: 'KK Nagar', status: 'On Time', badgeColor: '#0284c7' },
  { id: 'B40', origin: 'KK Nagar', destination: 'T. Nagar', status: 'On Time', badgeColor: '#0284c7' },
  { id: 'B12', origin: 'Velachery', destination: 'Guindy', status: 'On Time', badgeColor: '#059669' },
  { id: 'B18', origin: 'Tambaram', destination: 'Chromepet', status: 'On Time', badgeColor: '#059669' },
  { id: 'B25', origin: 'Avadi', destination: 'Ambattur', status: 'At Risk', badgeColor: '#d97706' },
  { id: 'B30', origin: 'Broadway', destination: 'Adyar', status: 'On Time', badgeColor: '#059669' },
  { id: 'B37', origin: 'Perungudi', destination: 'Sholinganallur', status: 'On Time', badgeColor: '#059669' }
];

const STOPS_DATA = [
  { name: 'Vadapalani (Start)', dwell: '0 sec' },
  { name: 'Nungambakkam', dwell: '28 sec' },
  { name: 'Aminjikarai', dwell: '32 sec' },
  { name: 'Arumbakkam', dwell: '26 sec' },
  { name: 'CMBT (Intermediate)', dwell: '35 sec' },
  { name: 'Koyambedu', dwell: '31 sec' },
  { name: 'Arumbakkam (End)', dwell: '0 sec' }
];

// Hourly Performance Bar Chart Data matching screenshot
const PERFORMANCE_DATA = [
  { time: '6 AM', height: 45, status: 'on-time' },
  { time: '', height: 60, status: 'on-time' },
  { time: '8 AM', height: 75, status: 'on-time' },
  { time: '', height: 50, status: 'on-time' },
  { time: '10 AM', height: 65, status: 'at-risk' },
  { time: '', height: 70, status: 'at-risk' },
  { time: '12 PM', height: 40, status: 'on-time' },
  { time: '', height: 55, status: 'delayed' },
  { time: '2 PM', height: 80, status: 'delayed' },
  { time: '', height: 45, status: 'at-risk' },
  { time: '4 PM', height: 65, status: 'on-time' },
  { time: '', height: 75, status: 'at-risk' },
  { time: '6 PM', height: 55, status: 'delayed' },
  { time: '', height: 70, status: 'delayed' },
  { time: '8 PM', height: 60, status: 'at-risk' },
  { time: '', height: 50, status: 'on-time' },
  { time: '10 PM', height: 75, status: 'at-risk' },
  { time: '', height: 40, status: 'on-time' },
  { time: '', height: 80, status: 'delayed' },
  { time: '', height: 65, status: 'on-time' },
  { time: '', height: 70, status: 'on-time' },
  { time: '', height: 50, status: 'on-time' }
];

export default function RoutesPage() {
  const [selectedRouteId, setSelectedRouteId] = useState('B21');
  const [activeTab, setActiveTab] = useState('Route Details');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ color: 'var(--text-primary)', minHeight: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. Page Header with Title, Timestamp, Search & Add Route */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
            Routes
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Manage and monitor bus routes across Tamil Nadu
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
            <span>Wed, 24 Jul 2024</span>
            <span style={{ color: 'var(--busflow-green)', fontWeight: 600 }}>10:24 AM</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                gap: '0.5rem',
                width: '280px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search route no., name or corridor..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  width: '100%'
                }}
              />
            </div>

            {/* Add Route Button */}
            <button
              style={{
                backgroundColor: 'transparent',
                border: '1.5px solid var(--busflow-green)',
                color: 'var(--busflow-green)',
                borderRadius: '8px',
                padding: '0.45rem 1rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 10px var(--busflow-green-glow)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--busflow-green)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--busflow-green)';
              }}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
              <span>Add Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Cards - 4 in ONE Single Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        
        {/* Card 1: Total Routes */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-normal-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-normal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="15" rx="3" />
              <path d="M3 9h18" />
              <circle cx="7.5" cy="14.5" r="1.5" fill="var(--color-normal)" />
              <circle cx="16.5" cy="14.5" r="1.5" fill="var(--color-normal)" />
              <path d="M5 18v2" />
              <path d="M19 18v2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>286</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Total Routes</div>
          </div>
        </div>

        {/* Card 2: On Schedule */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-recovered-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-recovered)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>210</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>On Schedule</div>
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>›</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.65rem' }}>
            <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '73%', height: '100%', backgroundColor: 'var(--color-recovered)', borderRadius: '2px' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>73%</span>
          </div>
        </div>

        {/* Card 3: At Risk */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-at-risk-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-at-risk)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>54</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>At Risk</div>
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>›</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.65rem' }}>
            <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '19%', height: '100%', backgroundColor: 'var(--color-at-risk)', borderRadius: '2px' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>19%</span>
          </div>
        </div>

        {/* Card 4: Delayed */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-severe-delay-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-severe-delay)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>22</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Delayed</div>
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>›</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.65rem' }}>
            <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '8%', height: '100%', backgroundColor: 'var(--color-severe-delay)', borderRadius: '2px' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>8%</span>
          </div>
        </div>

      </div>

      {/* 3. Main Content Area - 2 Columns (Left: Route List 340px, Right: Details 1fr) */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* Left Column: All Routes List Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {/* List Header */}
          <div style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              All Routes (286)
            </span>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--border-subtle)',
                border: '1px solid var(--border-color)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>All Status</span>
              <span style={{ fontSize: '0.65rem' }}>▼</span>
            </div>
          </div>

          {/* Route Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ROUTES_LIST.map((route) => {
              const isSelected = selectedRouteId === route.id;
              let statusBg = 'var(--color-recovered-bg)';
              let statusColor = 'var(--color-recovered)';
              if (route.status === 'At Risk') {
                statusBg = 'var(--color-at-risk-bg)';
                statusColor = 'var(--color-at-risk)';
              } else if (route.status === 'Delayed') {
                statusBg = 'var(--color-severe-delay-bg)';
                statusColor = 'var(--color-severe-delay)';
              } else if (route.status === 'On Time' && route.badgeColor === '#0284c7') {
                statusBg = 'var(--color-normal-bg)';
                statusColor = 'var(--color-normal)';
              }

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--primary-accent-bg)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--busflow-green)' : '3px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {/* Route ID Badge */}
                    <div
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: route.badgeColor,
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        minWidth: '32px',
                        textAlign: 'center'
                      }}
                    >
                      {route.id}
                    </div>

                    {/* Route Origin -> Destination */}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {route.origin} → {route.destination}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Status Badge */}
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor: statusBg,
                        color: statusColor,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: statusColor }} />
                      {route.status}
                    </span>

                    {/* Right Chevron */}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>›</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Footer */}
          <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', padding: '0.2rem 0.4rem' }}>←</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--busflow-green)', color: '#ffffff', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>1</span>
            {['2', '3', '4', '5', '...', '29'].map((p, idx) => (
              <span key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {p}
              </span>
            ))}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', padding: '0.2rem 0.4rem' }}>→</span>
          </div>

        </div>

        {/* Right Column: Selected Route Details (B21) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Selected Route Header Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(220, 38, 38, 0.4)'
                }}
              >
                B21
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>
                  Vadapalani → Arumbakkam
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', gap: '0.5rem' }}>
                  <span>12.5 km</span>
                  <span>|</span>
                  <span>24 stops</span>
                  <span>|</span>
                  <span>Average Headway: 6 min</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  backgroundColor: 'var(--color-severe-delay-bg)',
                  color: 'var(--color-severe-delay)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-severe-delay)' }} />
                Delayed
              </span>

              <button
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                ···
              </button>
            </div>
          </div>

          {/* 4 Route Mini-KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.85rem' }}>
            
            {/* Mini Card 1 */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-recovered-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-recovered)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="15" rx="3" />
                  <path d="M3 9h18" />
                  <circle cx="7.5" cy="14.5" r="1.5" fill="var(--color-recovered)" />
                  <circle cx="16.5" cy="14.5" r="1.5" fill="var(--color-recovered)" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>8</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Buses in Service</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-recovered)', marginTop: '2px', fontWeight: 600 }}>↑ 1 from schedule</div>
              </div>
            </div>

            {/* Mini Card 2 */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-severe-delay-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-severe-delay)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>8.2 min</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Current Headway</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-severe-delay)', marginTop: '2px', fontWeight: 600 }}>↑ 2.2 min</div>
              </div>
            </div>

            {/* Mini Card 3 */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-purple-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>3,420</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Daily Ridership</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-recovered)', marginTop: '2px', fontWeight: 600 }}>↑ 6% vs last week</div>
              </div>
            </div>

            {/* Mini Card 4 */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-at-risk-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-at-risk)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="M4.93 4.93l2.83 2.83" />
                  <path d="M16.24 16.24l2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <circle cx="12" cy="12" r="6" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>68%</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>On-Time Performance</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-severe-delay)', marginTop: '2px', fontWeight: 600 }}>↓ 12% vs last week</div>
              </div>
            </div>

          </div>

          {/* Tabs Navigation Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
            {['Route Details', 'Stops (24)', 'Schedule', 'Buses (8)', 'Performance', 'Incidents (2)'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.4rem 0.2rem',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--busflow-green)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {tab}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: 0,
                        right: 0,
                        height: '2.5px',
                        backgroundColor: 'var(--busflow-green)',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px var(--busflow-green-glow)'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Two-Column Route Information & Key Stops */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* Left Card: Route Information */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.15rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.85rem 0', color: 'var(--text-heading)' }}>
                Route Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { label: 'Route No.', value: 'B21' },
                  { label: 'Origin', value: 'Vadapalani' },
                  { label: 'Destination', value: 'Arumbakkam' },
                  { label: 'Distance', value: '12.5 km' },
                  { label: 'Total Stops', value: '24' },
                  { label: 'Scheduled Headway', value: '6 min' },
                  { label: 'Peak Headway', value: '4 min' },
                  { label: 'Off-peak Headway', value: '8 min' },
                  { label: 'Operating Hours', value: '05:30 AM – 11:30 PM' }
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Key Stops Timeline */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.15rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-heading)' }}>
                  Key Stops
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg. Dwell Time</span>
              </div>

              {/* Vertical Emerald Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                {STOPS_DATA.map((stop, idx) => {
                  const isLast = idx === STOPS_DATA.length - 1;
                  return (
                    <div key={stop.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {/* Node circle & vertical connecting line */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              border: '2px solid var(--busflow-green)',
                              backgroundColor: 'var(--bg-surface)',
                              zIndex: 2
                            }}
                          />
                          {!isLast && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                width: '1.5px',
                                height: '22px',
                                backgroundColor: 'var(--border-green)',
                                zIndex: 1
                              }}
                            />
                          )}
                        </div>

                        <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{stop.name}</span>
                      </div>

                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stop.dwell}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Card: Recent Performance Bar Chart */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.15rem',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-heading)' }}>
                Recent Performance
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--busflow-green)' }} />
                  On Time
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-at-risk)' }} />
                  At Risk
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-severe-delay)' }} />
                  Delayed
                </span>
              </div>
            </div>

            {/* Hourly Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', gap: '6px', padding: '0 0.5rem' }}>
              {PERFORMANCE_DATA.map((item, idx) => {
                let barColor = 'var(--busflow-green)';
                if (item.status === 'at-risk') barColor = 'var(--color-at-risk)';
                if (item.status === 'delayed') barColor = 'var(--color-severe-delay)';

                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '12px',
                        height: `${item.height}%`,
                        backgroundColor: barColor,
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.2s ease'
                      }}
                      title={`${item.status}: ${item.height}%`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Time labels row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', padding: '0 0.5rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <span>6 AM</span>
              <span>8 AM</span>
              <span>10 AM</span>
              <span>12 PM</span>
              <span>2 PM</span>
              <span>4 PM</span>
              <span>6 PM</span>
              <span>8 PM</span>
              <span>10 PM</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
