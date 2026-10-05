import React from 'react';

export default function ImpactPreviewChart({ recommendation }) {
  // Time points: 10:00 AM, 10:30 AM, 11:00 AM, 11:30 AM, 12:00 PM
  const timeLabels = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];

  // Headway values
  const currentHeadways = [5.0, 8.5, 7.2, 12.0, 6.0];
  const controlledHeadways = [5.0, 5.8, 5.5, 6.0, 5.2];

  // SVG dimensions
  const width = 500;
  const height = 150;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 15;

  const getX = (idx) => paddingLeft + (idx / (timeLabels.length - 1)) * chartWidth;
  const getY = (val) => paddingTop + chartHeight - (val / maxY) * chartHeight;

  const currentPath = currentHeadways
    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`)
    .join(' ');

  const controlledPath = controlledHeadways
    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`)
    .join(' ');

  const areaPath = `
    ${controlledPath}
    L ${getX(controlledHeadways.length - 1)} ${getY(0)}
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
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
          Impact Preview (Next 2 Hours)
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem', color: '#94A3B8' }}>
          {/* Current */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ display: 'inline-block', width: '16px', height: '0', borderTop: '2px dashed #94A3B8' }} />
            <span>Current</span>
          </div>

          {/* With Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '16px',
                height: '3px',
                backgroundColor: '#00E5A3',
                borderRadius: '2px'
              }}
            />
            <span style={{ color: '#00E5A3', fontWeight: 600 }}>With Control</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ width: '100%', position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="ctrlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5A3" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00E5A3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[0, 5, 10, 15].map((gridVal) => {
            const yCoord = getY(gridVal);
            return (
              <g key={gridVal}>
                <line
                  x1={paddingLeft}
                  y1={yCoord}
                  x2={width - paddingRight}
                  y2={yCoord}
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeDasharray={gridVal === 0 ? 'none' : '3 3'}
                />
                <text
                  x={paddingLeft - 8}
                  y={yCoord + 3}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="end"
                  fontWeight="500"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Y Axis Title */}
          <text
            x={10}
            y={height / 2}
            fill="#64748B"
            fontSize="9"
            fontWeight="600"
            transform={`rotate(-90 10 ${height / 2})`}
            textAnchor="middle"
          >
            Headway (min)
          </text>

          {/* Gradient area */}
          <path d={areaPath} fill="url(#ctrlGrad)" />

          {/* Current line */}
          <path d={currentPath} fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />

          {/* Controlled line */}
          <path d={controlledPath} fill="none" stroke="#00E5A3" strokeWidth="2.5" />

          {/* Current dots */}
          {currentHeadways.map((val, idx) => (
            <circle
              key={`curr-${idx}`}
              cx={getX(idx)}
              cy={getY(val)}
              r="3.5"
              fill="#0F172A"
              stroke="#64748B"
              strokeWidth="2"
            />
          ))}

          {/* Controlled dots */}
          {controlledHeadways.map((val, idx) => (
            <circle
              key={`ctrl-${idx}`}
              cx={getX(idx)}
              cy={getY(val)}
              r="4"
              fill="#00E5A3"
              stroke="#0F172A"
              strokeWidth="1.5"
            />
          ))}

          {/* X Axis Time Labels */}
          {timeLabels.map((timeText, idx) => (
            <text
              key={timeText}
              x={getX(idx)}
              y={height - 5}
              fill="#94A3B8"
              fontSize="10"
              textAnchor="middle"
              fontWeight="500"
            >
              {timeText}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
