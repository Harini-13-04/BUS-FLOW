import React, { useState } from 'react';

export default function PassengerLoadChart({ data }) {
  const [filterMode, setFilterMode] = useState('Time Slot');

  const width = 540;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 75000;

  const getBarHeight = (val) => (val / maxVal) * chartHeight;
  const getX = (idx) => paddingLeft + (idx / data.length) * chartWidth + (chartWidth / data.length) * 0.15;
  const barWidth = (chartWidth / data.length) * 0.7;

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '12px',
        padding: '1.25rem'
      }}
    >
      {/* Header & Filter Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Passenger Load Distribution
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Hourly passenger volume across operational time slots</span>
        </div>

        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
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
          <option value="Time Slot">Time Slot</option>
          <option value="Peak Hours">Peak Hours</option>
        </select>
      </div>

      {/* SVG Bar Chart */}
      <div style={{ width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          {/* Y Axis Gridlines */}
          {[0, 25000, 50000, 75000].map((val) => {
            const yCoord = paddingTop + chartHeight - (val / maxVal) * chartHeight;
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
                <text x={paddingLeft - 8} y={yCoord + 3} fill="#64748B" fontSize="9" textAnchor="end" fontWeight="500">
                  {val === 0 ? '0' : `${val / 1000}k`}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const bHeight = getBarHeight(item.passengers);
            const xCoord = getX(idx);
            const yCoord = paddingTop + chartHeight - bHeight;

            // Gradient / Color per bar (peak hours stand out in cyan/teal)
            const isPeak = item.passengers >= 60000;
            const barColor = isPeak ? '#00E5A3' : '#3B82F6';

            return (
              <g key={item.timeSlot}>
                <rect
                  x={xCoord}
                  y={yCoord}
                  width={barWidth}
                  height={bHeight}
                  rx="4"
                  fill={barColor}
                  opacity="0.85"
                />
                {/* Value on top of bar */}
                <text
                  x={xCoord + barWidth / 2}
                  y={yCoord - 4}
                  fill="#F8FAFC"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {`${(item.passengers / 1000).toFixed(0)}k`}
                </text>

                {/* X Axis Label */}
                <text
                  x={xCoord + barWidth / 2}
                  y={height - 8}
                  fill="#94A3B8"
                  fontSize="9"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {item.timeSlot}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
