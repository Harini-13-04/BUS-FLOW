import React, { useState } from 'react';

export default function LiveRouteOverview({ routeData }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const { routeName, routeSpan } = routeData;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.45));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
  const handleResetZoom = () => setZoomLevel(1);

  // Main Route 21G geographic path coordinates
  const stops = [
    { id: 'AN', name: 'Anna Nagar', fullName: 'Anna Nagar (Terminal)', x: 90, y: 130, isTerminal: true, labelSide: 'top' },
    { id: 'TP', name: 'Tower Park', fullName: 'Tower Park', x: 175, y: 165, labelSide: 'bottom' },
    { id: 'SN', name: 'Shenoy Nagar', fullName: 'Shenoy Nagar', x: 265, y: 195, labelSide: 'bottom' },
    { id: 'CM', name: 'CMBT', fullName: 'CMBT', x: 350, y: 220, labelSide: 'bottom' },
    { id: 'AR', name: 'Arumbakkam', fullName: 'Arumbakkam', x: 420, y: 235, labelSide: 'top' },
    { id: 'VD', name: 'Vadapalani', fullName: 'Vadapalani', x: 490, y: 255, labelSide: 'bottom' },
    { id: 'AN2', name: 'Ashok Nagar', fullName: 'Ashok Nagar', x: 565, y: 270, labelSide: 'bottom' },
    { id: 'KK', name: 'KK Nagar', fullName: 'KK Nagar', x: 635, y: 250, labelSide: 'top' },
    { id: 'TN', name: 'T. Nagar', fullName: 'T. Nagar (Terminal)', x: 725, y: 225, isTerminal: true, labelSide: 'bottom' }
  ];

  // Smooth SVG path passing through all 9 corridor stops
  const routePathD = `M 90 130 C 130 145, 150 158, 175 165 C 215 178, 235 190, 265 195 C 305 208, 325 216, 350 220 C 380 226, 395 232, 420 235 C 450 242, 465 250, 490 255 C 520 263, 540 269, 565 270 C 595 268, 615 258, 635 250 C 665 238, 695 230, 725 225`;

  // Affected congestion corridor segment (between Arumbakkam and Vadapalani)
  const congestionSegmentD = `M 420 235 C 450 242, 465 250, 490 255`;

  // Active fleet vehicles positioned along the corridor
  const buses = [
    { id: 'B1', status: 'NORMAL', color: '#38bdf8', x: 175, y: 165, stopName: 'Tower Park' },
    { id: 'B14', status: 'AT_RISK', color: '#f59e0b', x: 265, y: 195, stopName: 'Shenoy Nagar' },
    { id: 'B21', status: 'SEVERE_DELAY', color: '#ef4444', x: 460, y: 248, stopName: 'Near Vadapalani' },
    { id: 'B33', status: 'RECOVERED', color: '#10b981', x: 565, y: 270, stopName: 'Ashok Nagar' },
    { id: 'B40', status: 'NORMAL', color: '#38bdf8', x: 655, y: 242, stopName: 'KK Nagar Area' }
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.15rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        height: '100%',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      {/* Card Header: Title & Route Selector Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
            Live Route Overview
          </h3>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              color: '#0284c7',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              padding: '1px 6px',
              borderRadius: '4px'
            }}
          >
            ACTIVE CORRIDOR
          </span>
        </div>

        {/* Route Selector Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.35rem 0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--busflow-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6v6" />
            <path d="M16 6v6" />
            <rect width="16" height="16" x="4" y="3" rx="2" />
            <path d="M4 11h16" />
            <path d="M6 15h.01" />
            <path d="M18 15h.01" />
            <path d="M7 19v2" />
            <path d="M17 19v2" />
          </svg>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {routeName}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {routeSpan}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Main Transport Control Map Area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: '430px',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#060b13',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Layer 1: Dark Satellite Aerial Map Texture */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url('/assets/chennai_map.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 42%',
            opacity: 0.45,
            filter: 'brightness(0.35) contrast(1.4) saturate(0.5)'
          }}
        />

        {/* Ambient Dark OCC Vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(6, 11, 19, 0.2) 0%, rgba(6, 11, 19, 0.88) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Layer 2: Vector GIS Transit SVG Layer */}
        <svg
          viewBox="0 0 840 400"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <defs>
            {/* Cyan Route Glow */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Subtle Vehicle Glows */}
            <radialGradient id="haloBlue">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="haloAmber">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="haloRed">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="haloGreen">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>

            {/* Directional Chevron Marker for Route Flow */}
            <marker id="routeFlowArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 1 L 6 5 L 0 9" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </marker>

            {/* Warning Hatch Pattern for Congestion Zone */}
            <pattern id="warningHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" />
            </pattern>
          </defs>

          {/* OCC Coordinate Grid Background */}
          <g stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1">
            <line x1="120" y1="0" x2="120" y2="400" strokeDasharray="3 6" />
            <line x1="280" y1="0" x2="280" y2="400" strokeDasharray="3 6" />
            <line x1="440" y1="0" x2="440" y2="400" strokeDasharray="3 6" />
            <line x1="600" y1="0" x2="600" y2="400" strokeDasharray="3 6" />
            <line x1="740" y1="0" x2="740" y2="400" strokeDasharray="3 6" />
            <line x1="0" y1="100" x2="840" y2="100" strokeDasharray="3 6" />
            <line x1="0" y1="200" x2="840" y2="200" strokeDasharray="3 6" />
            <line x1="0" y1="300" x2="840" y2="300" strokeDasharray="3 6" />
          </g>

          {/* Regional Geographic Context: Cooum River & Waterways */}
          <g stroke="rgba(14, 165, 233, 0.22)" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M 60 160 Q 180 180 290 170 T 520 180 T 780 150" />
            <text x="320" y="165" fill="#38bdf8" fontSize="7" opacity="0.6" fontStyle="italic">Cooum River</text>
          </g>

          {/* Major Chennai Arterial Road Corridors */}
          <g stroke="rgba(148, 163, 184, 0.16)" strokeWidth="2.2" fill="none">
            {/* Inner Ring Road / 100 Feet Road */}
            <path d="M 330 30 L 370 380" />
            {/* Poonamallee High Road */}
            <path d="M 40 100 Q 250 140 450 150 T 800 120" />
            {/* Anna Salai / Mount Road */}
            <path d="M 460 380 L 680 180 L 780 120" />
            {/* Arcot Road */}
            <path d="M 420 280 L 580 340" />
          </g>

          {/* Road Network Labels */}
          <text x="210" y="115" fill="#64748b" fontSize="7.5" fontWeight="600" opacity="0.75">Poonamallee High Rd</text>
          <text x="375" y="70" fill="#64748b" fontSize="7.5" fontWeight="600" opacity="0.75">Inner Ring Rd (100 Ft Rd)</text>
          <text x="690" y="170" fill="#64748b" fontSize="7.5" fontWeight="600" opacity="0.75">Anna Salai</text>

          {/* Landmark Area Badges */}
          <g transform="translate(325, 240)">
            <rect x="0" y="0" width="70" height="15" rx="3" fill="rgba(15, 23, 42, 0.8)" stroke="#1e293b" strokeWidth="0.8" />
            <text x="35" y="10" textAnchor="middle" fill="#94a3b8" fontSize="6.8" fontWeight="600">🚌 Koyambedu</text>
          </g>

          {/* Regional District Watermarks */}
          <text x="280" y="150" fill="#64748b" fontSize="8" fontWeight="500" opacity="0.7">Kilpauk</text>
          <text x="365" y="190" fill="#64748b" fontSize="8" fontWeight="500" opacity="0.7">Aminjikarai</text>
          <text x="510" y="195" fill="#64748b" fontSize="8" fontWeight="500" opacity="0.7">Nungambakkam</text>
          <text x="660" y="275" fill="#64748b" fontSize="8" fontWeight="500" opacity="0.7">KK Nagar</text>

          {/* Watermark: "Chennai" with OCC Geolocation Coordinates */}
          <g transform="translate(710, 115)">
            <text
              x="0"
              y="0"
              fill="#cbd5e1"
              fontSize="18"
              fontWeight="800"
              letterSpacing="0.05em"
              opacity="0.85"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
            >
              Chennai
            </text>
            <text x="0" y="14" fill="#64748b" fontSize="7.5" fontWeight="500" letterSpacing="0.04em">
              13.0827° N, 80.2707° E
            </text>
          </g>

          {/* Incident / Congestion Zone Hull (Visually surrounding Arumbakkam - Vadapalani) */}
          <g>
            {/* Translucent Congestion Buffer Hull */}
            <path
              d="M 405 215 C 455 225, 475 235, 505 240 C 515 255, 510 275, 495 278 C 455 270, 435 260, 405 252 C 395 240, 395 222, 405 215 Z"
              fill="rgba(239, 68, 68, 0.12)"
              stroke="rgba(239, 68, 68, 0.5)"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Congestion warning hatch fill */}
            <path
              d="M 405 215 C 455 225, 475 235, 505 240 C 515 255, 510 275, 495 278 C 455 270, 435 260, 405 252 C 395 240, 395 222, 405 215 Z"
              fill="url(#warningHatch)"
              opacity="0.4"
            />

            {/* Red Pulsing Bottleneck on Route Track */}
            <path
              d={congestionSegmentD}
              fill="none"
              stroke="#ef4444"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="6 4"
              opacity="0.85"
            >
              <animate attributeName="stroke-dashoffset" values="20;0" dur="1.2s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Main Route 21G Outer Glow Corridor */}
          <path
            d={routePathD}
            fill="none"
            stroke="rgba(34, 211, 238, 0.25)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlow)"
          />

          {/* Main Route Core Line (Vibrant Cyan) */}
          <path
            d={routePathD}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={routePathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Directional Chevrons along Route Corridor (Anna Nagar → T. Nagar) */}
          {/* Chevron 1: between AN and TP */}
          <g transform="translate(135, 150) rotate(22)">
            <polyline points="-3,-3 2,0 -3,3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          </g>
          {/* Chevron 2: between SN and CMBT */}
          <g transform="translate(305, 208) rotate(16)">
            <polyline points="-3,-3 2,0 -3,3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          </g>
          {/* Chevron 3: between VD and AN2 */}
          <g transform="translate(528, 264) rotate(12)">
            <polyline points="-3,-3 2,0 -3,3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          </g>
          {/* Chevron 4: between KK and TN */}
          <g transform="translate(680, 238) rotate(-16)">
            <polyline points="-3,-3 2,0 -3,3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          </g>

          {/* Traffic Incident Callout — Visually connected to Congestion Zone */}
          <g transform="translate(460, 132)">
            {/* Red anchor bracket line directly pointing down to B21 / congestion bottleneck */}
            <path d="M 0 28 L 0 95 L -10 112" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.9" />
            <circle cx="-10" cy="112" r="3" fill="#ef4444" />
            <circle cx="-10" cy="112" r="7" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.6">
              <animate attributeName="r" values="3;9;3" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.5s" repeatCount="indefinite" />
            </circle>

            {/* Incident Callout Card */}
            <g transform="translate(-75, -8)">
              <rect
                x="0"
                y="0"
                width="150"
                height="38"
                rx="6"
                fill="rgba(38, 10, 14, 0.95)"
                stroke="#ef4444"
                strokeWidth="1.2"
                filter="drop-shadow(0 4px 14px rgba(239, 68, 68, 0.4))"
              />
              {/* Red Warning Triangle Icon */}
              <g transform="translate(10, 9)">
                <path d="M 8 2 L 1 16 L 15 16 Z" fill="#ef4444" />
                <path d="M 8 7 L 8 11 M 8 13 L 8 14.2" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
              </g>
              {/* Incident Header & Subtitle */}
              <text x="32" y="15" fill="#ffffff" fontSize="8.5" fontWeight="700">
                Traffic Congestion
              </text>
              <text x="32" y="27" fill="#fca5a5" fontSize="7.5" fontWeight="600">
                +5 min delay • Arumbakkam link
              </text>
            </g>
          </g>

          {/* Stop Nodes & Staggered Non-Overlapping Labels */}
          {stops.map((stop) => {
            const isTerminal = stop.isTerminal;
            const isTN = stop.id === 'TN';
            const isAN = stop.id === 'AN';
            const isTop = stop.labelSide === 'top';

            return (
              <g key={stop.id} transform={`translate(${stop.x}, ${stop.y})`}>
                {/* Terminal Stop Outer Halo Ring */}
                {isTerminal && (
                  <circle
                    r="8.5"
                    fill="#080d16"
                    stroke={isTN ? '#ef4444' : '#ffffff'}
                    strokeWidth="2.2"
                  />
                )}

                {/* Stop Center Node */}
                <circle
                  r={isTerminal ? 4 : 4}
                  fill={isTerminal ? (isTN ? '#ffffff' : '#22d3ee') : '#ffffff'}
                  stroke="#080d16"
                  strokeWidth="1.5"
                  boxShadow="0 0 4px rgba(0,0,0,0.8)"
                />

                {/* Staggered Stop Label with Subtle Dark Contrast Backing */}
                <g transform={`translate(0, ${isTop ? -18 : 22})`}>
                  <rect
                    x={-(stop.name.length * 2.8 + 8)}
                    y="-9"
                    width={stop.name.length * 5.6 + 16}
                    height="14"
                    rx="3"
                    fill="rgba(6, 11, 20, 0.82)"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="0.8"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    fill={isTerminal ? '#ffffff' : '#e2e8f0'}
                    fontSize={isTerminal ? '8' : '7.5'}
                    fontWeight={isTerminal ? '700' : '500'}
                    style={{ userSelect: 'none' }}
                  >
                    {isTerminal ? (isAN ? 'Anna Nagar (Term)' : 'T. Nagar (Term)') : stop.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Realistic Fleet Vehicle Markers */}
          {buses.map((bus) => {
            const isRed = bus.status === 'SEVERE_DELAY';
            const isYellow = bus.status === 'AT_RISK';
            const isGreen = bus.status === 'RECOVERED';

            const haloGrad = isRed
              ? 'url(#haloRed)'
              : isYellow
              ? 'url(#haloAmber)'
              : isGreen
              ? 'url(#haloGreen)'
              : 'url(#haloBlue)';

            return (
              <g key={bus.id} transform={`translate(${bus.x}, ${bus.y})`} style={{ cursor: 'pointer' }}>
                {/* Controlled Vehicle Pulse Halo */}
                <circle r="15" fill={haloGrad} opacity="0.6">
                  {isRed && <animate attributeName="r" values="12;18;12" dur="1.8s" repeatCount="indefinite" />}
                  {isRed && <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />}
                </circle>

                {/* Bus ID Pill Badge directly above vehicle */}
                <g transform="translate(0, -18)">
                  <rect
                    x="-12"
                    y="-7"
                    width="24"
                    height="14"
                    rx="3"
                    fill={bus.color}
                    stroke="#ffffff"
                    strokeWidth="0.9"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="800"
                    style={{ userSelect: 'none' }}
                  >
                    {bus.id}
                  </text>
                </g>

                {/* Realistic Bus Vehicle Marker (Front View) */}
                <g transform="translate(-10, -5)">
                  {/* Bus Body Chassis */}
                  <rect
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    rx="4"
                    fill={bus.color}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.7))"
                  />
                  {/* Front Windshield Glass */}
                  <rect x="3" y="3" width="14" height="6" rx="1.5" fill="#080d16" />
                  {/* Headlights */}
                  <circle cx="5" cy="14" r="1.5" fill="#ffffff" />
                  <circle cx="15" cy="14" r="1.5" fill="#ffffff" />
                  {/* Front Grille Bar */}
                  <line x1="8" y1="14" x2="12" y2="14" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                  {/* Side Mirrors */}
                  <rect x="-2" y="6" width="2" height="3" rx="0.5" fill={bus.color} />
                  <rect x="20" y="6" width="2" height="3" rx="0.5" fill={bus.color} />
                </g>
              </g>
            );
          })}
        </svg>

        {/* Layer 3: Clean, Compact Legend (Bottom-Left) */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            borderRadius: '9999px',
            padding: '0.35rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-card)',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
            <span>Normal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span>At Risk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span>Severe Delay</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>Recovered</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', border: '1.5px solid var(--text-secondary)', backgroundColor: 'transparent' }} />
            <span>Stop</span>
          </div>
        </div>

        {/* Layer 4: Professional Unified Map Controls (Right Side) */}
        <div
          style={{
            position: 'absolute',
            bottom: '75px',
            right: '14px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.15rem',
              fontWeight: 700,
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.15rem',
              fontWeight: 700,
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            −
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="Locate Route Corridor"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--busflow-green)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="22" y1="12" x2="18" y2="12" />
              <line x1="6" y1="12" x2="2" y2="12" />
              <line x1="12" y1="6" x2="12" y2="2" />
              <line x1="12" y1="22" x2="12" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
