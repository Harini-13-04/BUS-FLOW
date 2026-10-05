import React from 'react';

export default function AnalyticsFilterBar({ filters, onFilterChange, onApplyFilters }) {
  const routes = ['All Routes', 'B21', 'B14', 'B33', 'B40', 'B12'];
  const periods = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];
  const metrics = ['All Metrics', 'Headway', 'On-Time %', 'Passenger Count', 'Delays'];
  const regions = ['All Regions', 'Central Chennai', 'North Corridor', 'South Express', 'Outer Suburbs'];

  const selectStyle = {
    backgroundColor: '#111C2E',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '8px',
    color: '#F8FAFC',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0.5rem 2rem 0.5rem 0.75rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394A3B8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
    backgroundSize: '1.25rem'
  };

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '12px',
        padding: '0.875rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
        {/* Route Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Route
          </label>
          <select
            value={filters.route}
            onChange={(e) => onFilterChange('route', e.target.value)}
            style={selectStyle}
          >
            {routes.map((r) => (
              <option key={r} value={r} style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Time Period Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Time Period
          </label>
          <select
            value={filters.timePeriod}
            onChange={(e) => onFilterChange('timePeriod', e.target.value)}
            style={selectStyle}
          >
            {periods.map((p) => (
              <option key={p} value={p} style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Metric Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Metric
          </label>
          <select
            value={filters.metric}
            onChange={(e) => onFilterChange('metric', e.target.value)}
            style={selectStyle}
          >
            {metrics.map((m) => (
              <option key={m} value={m} style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Area / Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => onFilterChange('region', e.target.value)}
            style={selectStyle}
          >
            {regions.map((rg) => (
              <option key={rg} value={rg} style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
                {rg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apply Button */}
      <div style={{ alignSelf: 'flex-end' }}>
        <button
          type="button"
          onClick={onApplyFilters}
          style={{
            backgroundColor: '#00E5A3',
            color: '#070C18',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            boxShadow: '0 2px 8px rgba(0, 229, 163, 0.2)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00C88E')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00E5A3')}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
