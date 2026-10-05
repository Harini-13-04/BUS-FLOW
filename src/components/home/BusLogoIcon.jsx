import React from 'react';

export default function BusLogoIcon({ size = 32, color = '#00e599', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
    >
      {/* Bus Body */}
      <rect x="5" y="4" width="22" height="21" rx="4.5" fill={color} />
      {/* Windshield cutout (dark) */}
      <rect x="7.5" y="7.5" width="17" height="6.5" rx="2" fill="#050b0d" />
      {/* Destination Board indicator */}
      <rect x="11" y="5.5" width="10" height="1.2" rx="0.6" fill="#050b0d" />
      {/* Headlights (dark circles or white/glow) */}
      <circle cx="9.5" cy="18.5" r="1.75" fill="#050b0d" />
      <circle cx="22.5" cy="18.5" r="1.75" fill="#050b0d" />
      {/* Bumper / Grill line */}
      <rect x="13" y="18" width="6" height="1.2" rx="0.6" fill="#050b0d" />
      {/* Wheels */}
      <rect x="7" y="25" width="3.5" height="3" rx="1" fill={color} />
      <rect x="21.5" y="25" width="3.5" height="3" rx="1" fill={color} />
      {/* Side Mirrors */}
      <rect x="3" y="11" width="2" height="3" rx="1" fill={color} />
      <rect x="27" y="11" width="2" height="3" rx="1" fill={color} />
    </svg>
  );
}
