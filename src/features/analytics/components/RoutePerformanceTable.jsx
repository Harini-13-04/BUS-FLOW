import React, { useState } from 'react';

export default function RoutePerformanceTable({ data }) {
  const [showAllModal, setShowAllModal] = useState(false);

  // Show top 5 in table, full list in modal
  const displayedRows = data.slice(0, 5);

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Route Performance
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>On-time regularity & delay breakdown</span>
        </div>

        <button
          type="button"
          onClick={() => setShowAllModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#00E5A3',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          View All →
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.15)', color: '#94A3B8' }}>
              <th style={{ padding: '0.4rem 0.375rem' }}>Route</th>
              <th style={{ padding: '0.4rem 0.375rem' }}>On-Time %</th>
              <th style={{ padding: '0.4rem 0.375rem' }}>Avg. Delay</th>
              <th style={{ padding: '0.4rem 0.375rem' }}>Trips</th>
              <th style={{ padding: '0.4rem 0.375rem' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row) => (
              <tr key={row.route} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)', color: '#F8FAFC' }}>
                <td style={{ padding: '0.45rem 0.375rem' }}>
                  <span
                    style={{
                      backgroundColor: row.color || '#3B82F6',
                      color: '#FFFFFF',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.75rem'
                    }}
                  >
                    {row.route}
                  </span>
                </td>
                <td style={{ padding: '0.45rem 0.375rem', fontWeight: 700, color: '#00E5A3' }}>{row.onTime}</td>
                <td style={{ padding: '0.45rem 0.375rem', color: '#94A3B8' }}>{row.delay}</td>
                <td style={{ padding: '0.45rem 0.375rem' }}>{row.trips}</td>
                <td style={{ padding: '0.45rem 0.375rem' }}>
                  <span
                    style={{
                      color: row.isImproving === true ? '#00E5A3' : row.isImproving === false ? '#EF4444' : '#3B82F6',
                      fontWeight: 600
                    }}
                  >
                    {row.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for View All */}
      {showAllModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 12, 24, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setShowAllModal(false)}
        >
          <div
            style={{
              backgroundColor: '#0F172A',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '650px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                All Route Performance Metrics
              </h2>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#94A3B8' }}>
                    <th style={{ padding: '0.75rem' }}>Route</th>
                    <th style={{ padding: '0.75rem' }}>On-Time %</th>
                    <th style={{ padding: '0.75rem' }}>Avg. Delay</th>
                    <th style={{ padding: '0.75rem' }}>Trips</th>
                    <th style={{ padding: '0.75rem' }}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.route} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', color: '#F8FAFC' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          style={{
                            backgroundColor: row.color || '#3B82F6',
                            color: '#FFFFFF',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '6px',
                            fontWeight: 800
                          }}
                        >
                          {row.route}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#00E5A3' }}>{row.onTime}</td>
                      <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{row.delay}</td>
                      <td style={{ padding: '0.75rem' }}>{row.trips}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: row.isImproving === true ? '#00E5A3' : row.isImproving === false ? '#EF4444' : '#3B82F6' }}>
                        {row.trend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
