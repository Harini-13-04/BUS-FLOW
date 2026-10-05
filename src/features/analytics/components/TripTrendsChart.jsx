import React, { useState } from 'react';

export default function TripTrendsChart({ data }) {
  const [granularity, setGranularity] = useState('Daily');

  const width = 540;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 200;

  const getX = (idx) => paddingLeft + (idx / (data.length - 1)) * chartWidth;
  const getY = (val) => paddingTop + chartHeight - (val / maxY) * chartHeight;

  const totalPath = data
    .map((item, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(item.totalTrips)}`)
    .join(' ');

  const onTimePath = data
    .map((item, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(item.onTimeTrips)}`)
    .join(' ');

  const areaPath = `
    ${totalPath}
    L ${getX(data.length - 1)} ${getY(0)}
    L ${getX(0)} ${getY(0)}
    Z
  `;

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '12px',
        padding: '1.25rem'
      }}
    >
      {/* Header & Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Trip Trends
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total Trips vs On-Time Completed Trips</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#00E5A3', fontWeight: 600 }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#00E5A3', borderRadius: '2px' }} />
              <span>Total Trips</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#8B5CF6', fontWeight: 600 }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#8B5CF6', borderRadius: '2px' }} />
              <span>On-Time Trips</span>
            </div>
          </div>

          {/* Granularity Dropdown */}
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value)}
            style={{
              backgroundColor: '#111C2E',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '6px',
              color: '#F8FAFC',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 1.5rem 0.25rem 0.5rem',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394A3B8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.375rem center',
              backgroundSize: '1rem'
            }}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div style={{ width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="totalTripsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5A3" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00E5A3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines & Y-Axis */}
          {[0, 50, 100, 150, 200].map((val) => {
            const yCoord = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={yCoord}
                  x2={width - paddingRight}
                  y2={yCoord}
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeDasharray={val === 0 ? 'none' : '3 3'}
                />
                <text x={paddingLeft - 8} y={yCoord + 3} fill="#64748B" fontSize="10" textAnchor="end" fontWeight="500">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Gradient Area */}
          <path d={areaPath} fill="url(#totalTripsGrad)" />

          {/* Total Trips Line */}
          <path d={totalPath} fill="none" stroke="#00E5A3" strokeWidth="2.5" />

          {/* On-Time Trips Line */}
          <path d={onTimePath} fill="none" stroke="#8B5CF6" strokeWidth="2.5" />

          {/* Dots */}
          {data.map((item, idx) => (
            <g key={idx}>
              <circle cx={getX(idx)} cy={getY(item.totalTrips)} r="4" fill="#00E5A3" stroke="#0F172A" strokeWidth="1.5" />
              <circle cx={getX(idx)} cy={getY(item.onTimeTrips)} r="4" fill="#8B5CF6" stroke="#0F172A" strokeWidth="1.5" />
            </g>
          ))}

          {/* X Axis Labels */}
          {data.map((item, idx) => (
            <text key={idx} x={getX(idx)} y={height - 5} fill="#94A3B8" fontSize="10" textAnchor="middle" fontWeight="500">
              {item.date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
