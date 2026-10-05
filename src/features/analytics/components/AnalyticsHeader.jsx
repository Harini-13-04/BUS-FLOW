import React, { useState, useEffect } from 'react';

export default function AnalyticsHeader({ dateRange, onDateRangeChange }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const ranges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month'];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Analytics
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.25rem', margin: 0 }}>
          Data-driven insights for better bus operations
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* Date */}
        <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: 500 }}>
          {formattedDate}
        </div>

        {/* Time */}
        <div style={{ fontSize: '1.125rem', color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.02em' }}>
          {formattedTime}
        </div>

        {/* Date Range Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '0.75rem', fontSize: '0.85rem', color: '#94A3B8', pointerEvents: 'none' }}>
            📅
          </span>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            style={{
              backgroundColor: '#0F172A',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '8px',
              color: '#F8FAFC',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.45rem 2.25rem 0.45rem 2.25rem',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394A3B8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.25rem'
            }}
          >
            {ranges.map((r) => (
              <option key={r} value={r} style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
