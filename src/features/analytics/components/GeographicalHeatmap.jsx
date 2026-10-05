import React, { useState } from 'react';

const HEATMAP_NODES = [
  { id: 'cmbt', name: 'CMBT', x: 90, y: 115, labelPos: 'top', delayLevel: 'MEDIUM', delayMin: '7 min', busCount: 20, color: '#F59E0B' },
  { id: 'anna', name: 'Anna Nagar', x: 250, y: 65, labelPos: 'top', delayLevel: 'LOW', delayMin: '2 min', busCount: 16, color: '#00E5A3' },
  { id: 'vada', name: 'Vadapalani', x: 420, y: 160, labelPos: 'top', delayLevel: 'HIGH', delayMin: '14 min', busCount: 32, color: '#EF4444' },
  { id: 'ashok', name: 'Ashok Nagar', x: 580, y: 240, labelPos: 'bottom', delayLevel: 'MEDIUM', delayMin: '5 min', busCount: 14, color: '#F59E0B' },
  { id: 'tnagar', name: 'T. Nagar', x: 750, y: 220, labelPos: 'bottom', delayLevel: 'HIGH', delayMin: '10 min', busCount: 28, color: '#EF4444' },
  { id: 'central', name: 'Chennai', x: 940, y: 75, labelPos: 'top', delayLevel: 'HIGH', delayMin: '11 min', busCount: 25, color: '#EF4444' },
  { id: 'adyar', name: 'Adyar', x: 1060, y: 265, labelPos: 'bottom', delayLevel: 'LOW', delayMin: '1 min', busCount: 12, color: '#00E5A3' }
];

export default function GeographicalHeatmap() {
  const [activePoint, setActivePoint] = useState(null);
  const [heatmapType, setHeatmapType] = useState('Delay Heatmap');

  const width = 1200;
  const height = 310;

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '12px',
        padding: '1.25rem',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header & Filter Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Geographical Heatmap
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Chennai Corridor Live Delay & Congestion Network</span>
        </div>

        <select
          value={heatmapType}
          onChange={(e) => setHeatmapType(e.target.value)}
          style={{
            backgroundColor: '#111C2E',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '6px',
            color: '#F8FAFC',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.35rem 1.75rem 0.35rem 0.625rem',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394A3B8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1rem'
          }}
        >
          <option value="Delay Heatmap">Delay Heatmap</option>
          <option value="Passenger Demand">Passenger Demand</option>
          <option value="Speed Corridor">Speed Corridor</option>
        </select>
      </div>

      {/* Map Container */}
      <div
        style={{
          width: '100%',
          height: '280px',
          backgroundColor: '#070C1A',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden',
          userSelect: 'none'
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            {/* Soft Radial Heatmap Glow Filters */}
            <radialGradient id="gradRed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#EF4444" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#F97316" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="gradOrange" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#EAB308" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="gradGreen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5A3" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#00E5A3" stopOpacity="0.45" />
              <stop offset="75%" stopColor="#06B6D4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00E5A3" stopOpacity="0" />
            </radialGradient>

            {/* Neon Route Glow Filter */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Micro Street Grid Pattern */}
            <pattern id="streetGridPattern" width="28" height="24" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 24" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="0.6" />
            </pattern>
          </defs>

          {/* 1. Base Dark Blue Land Mass (Extends 100% across container) */}
          <rect width={width} height={height} fill="#070D1E" />
          <rect width={width} height={height} fill="url(#streetGridPattern)" />

          {/* 2. Bay of Bengal / Ocean Surface (Right side edge: x 1120 to 1200) */}
          <path
            d="M 1120 0 Q 1100 80 1130 160 T 1110 310 L 1200 310 L 1200 0 Z"
            fill="#030713"
          />
          {/* Ocean Coastline Highlight */}
          <path
            d="M 1120 0 Q 1100 80 1130 160 T 1110 310"
            fill="none"
            stroke="rgba(6, 182, 212, 0.35)"
            strokeWidth="1.8"
          />
          {/* Subtle Coastline Glow */}
          <path
            d="M 1120 0 Q 1100 80 1130 160 T 1110 310"
            fill="none"
            stroke="rgba(0, 229, 163, 0.15)"
            strokeWidth="6"
          />

          {/* 3. Detailed City Street Grid Lines across 100% width */}
          <g stroke="rgba(148, 163, 184, 0.07)" strokeWidth="0.8" fill="none">
            {/* Major Arterial Roads spanning left to right */}
            <line x1="10" y1="65" x2="1115" y2="65" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />
            <line x1="10" y1="160" x2="1125" y2="160" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />
            <line x1="10" y1="240" x2="1110" y2="240" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />

            <line x1="90" y1="10" x2="90" y2="300" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />
            <line x1="250" y1="10" x2="250" y2="300" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />
            <line x1="420" y1="10" x2="420" y2="300" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />
            <line x1="580" y1="10" x2="580" y2="300" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />
            <line x1="750" y1="10" x2="750" y2="300" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />
            <line x1="940" y1="10" x2="940" y2="300" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />
            <line x1="1060" y1="10" x2="1060" y2="300" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1.2" />

            {/* Dense Secondary City Streets */}
            <line x1="10" y1="35" x2="1100" y2="35" />
            <line x1="10" y1="115" x2="1115" y2="115" />
            <line x1="10" y1="200" x2="1120" y2="200" />
            <line x1="10" y1="280" x2="1105" y2="280" />

            <line x1="170" y1="10" x2="170" y2="300" />
            <line x1="335" y1="10" x2="335" y2="300" />
            <line x1="500" y1="10" x2="500" y2="300" />
            <line x1="665" y1="10" x2="665" y2="300" />
            <line x1="845" y1="10" x2="845" y2="300" />
            <line x1="1000" y1="10" x2="1000" y2="300" />

            {/* Diagonal Connecting Roads */}
            <line x1="90" y1="115" x2="250" y2="65" />
            <line x1="250" y1="65" x2="940" y2="75" />
            <line x1="420" y1="160" x2="750" y2="220" />
            <line x1="580" y1="240" x2="1060" y2="265" />
          </g>

          {/* 4. Primary Neon Cyan Transit Corridors Spanning Full Width */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#routeGlow)">
            {/* Main Trunk Corridor: CMBT -> Vadapalani -> Ashok Nagar -> T. Nagar -> Adyar */}
            <path
              d="M 90 115 L 420 160 L 580 240 L 750 220 L 1060 265"
              stroke="#00F0FF"
              strokeWidth="3.2"
              opacity="0.95"
            />

            {/* North-South Link: Anna Nagar -> Vadapalani */}
            <path
              d="M 250 65 L 420 160"
              stroke="#06B6D4"
              strokeWidth="2.8"
              opacity="0.9"
            />

            {/* East Corridor: T. Nagar -> Chennai */}
            <path
              d="M 750 220 L 940 75"
              stroke="#00F0FF"
              strokeWidth="2.8"
              opacity="0.9"
            />

            {/* North Express: Anna Nagar -> Chennai */}
            <path
              d="M 250 65 L 940 75"
              stroke="#06B6D4"
              strokeWidth="2.2"
              opacity="0.75"
              strokeDasharray="5 3"
            />
          </g>

          {/* 5. Radial Glowing Heatmap Hotspots */}
          {HEATMAP_NODES.map((pt) => {
            const isHovered = activePoint && activePoint.id === pt.id;
            const gradId = pt.delayLevel === 'HIGH' ? 'url(#gradRed)' : pt.delayLevel === 'MEDIUM' ? 'url(#gradOrange)' : 'url(#gradGreen)';
            const rHeat = pt.delayLevel === 'HIGH' ? (isHovered ? 45 : 38) : pt.delayLevel === 'MEDIUM' ? (isHovered ? 36 : 30) : (isHovered ? 30 : 24);

            return (
              <g
                key={pt.id}
                onMouseEnter={() => setActivePoint(pt)}
                onMouseLeave={() => setActivePoint(null)}
                onClick={() => setActivePoint(pt)}
                style={{ cursor: 'pointer' }}
              >
                {/* Soft Radial Heat Glow */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={rHeat}
                  fill={gradId}
                  style={{ transition: 'all 0.25s ease' }}
                />

                {/* Inner Core Spot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7.5 : 5.5}
                  fill={pt.color}
                  stroke="#070D1E"
                  strokeWidth="2"
                  style={{ transition: 'all 0.2s ease' }}
                />
              </g>
            );
          })}

          {/* 6. Crisp Small Location Labels */}
          {HEATMAP_NODES.map((pt) => {
            const isHovered = activePoint && activePoint.id === pt.id;
            const yOffset = pt.labelPos === 'top' ? -14 : 22;

            return (
              <text
                key={`label-${pt.id}`}
                x={pt.x}
                y={pt.y + yOffset}
                fill={isHovered ? '#FFFFFF' : '#E2E8F0'}
                fontSize="11"
                fontWeight={isHovered ? '800' : '600'}
                textAnchor="middle"
                style={{
                  pointerEvents: 'none',
                  transition: 'all 0.2s ease',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 0.8)'
                }}
              >
                {pt.name}
              </text>
            );
          })}
        </svg>

        {/* Floating Right Glassmorphism Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '6px',
            padding: '0.45rem 0.875rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.75rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>High Delay</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>Medium Delay</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00E5A3', boxShadow: '0 0 8px #00E5A3' }} />
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>Low Delay</span>
          </div>
        </div>

        {/* Floating Interactive Tooltip */}
        {activePoint && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${activePoint.color}`,
              borderRadius: '6px',
              padding: '0.45rem 0.85rem',
              boxShadow: '0 6px 20px rgba(0,0,0,0.8)',
              fontSize: '0.75rem',
              zIndex: 20,
              pointerEvents: 'none'
            }}
          >
            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.825rem' }}>{activePoint.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{ color: activePoint.color, fontWeight: 700 }}>{activePoint.delayLevel} DELAY</span>
              <span style={{ color: '#94A3B8' }}>• {activePoint.delayMin} avg delay</span>
              <span style={{ color: '#00E5A3', fontWeight: 600 }}>• {activePoint.busCount} buses active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



