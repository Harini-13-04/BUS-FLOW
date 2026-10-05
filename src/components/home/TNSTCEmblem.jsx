import React from 'react';

export default function TNSTCEmblem({ size = 38, style = {} }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 78, 59, 0.4))',
        border: '1.5px solid rgba(0, 229, 153, 0.4)',
        boxShadow: '0 0 10px rgba(0, 229, 153, 0.2)',
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
      title="Tamil Nadu State Transport Corporation"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Outer Circular Ring with Dashed Tech Accent */}
        <circle cx="50" cy="50" r="46" stroke="#00e599" strokeWidth="2.5" strokeOpacity="0.7" />
        <circle cx="50" cy="50" r="41" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
        <circle cx="50" cy="50" r="37" fill="#041e1a" fillOpacity="0.9" />

        {/* Tamil Nadu Gopuram Temple Silhouette */}
        <path
          d="M50 14 L53 22 H47 Z"
          fill="#f59e0b"
        />
        <path
          d="M45 22 H55 L57 32 H43 Z"
          fill="#00e599"
        />
        <path
          d="M41 32 H59 L62 44 H38 Z"
          fill="#f59e0b"
        />
        <path
          d="M36 44 H64 L67 58 H33 Z"
          fill="#00e599"
        />
        <path
          d="M31 58 H69 L72 74 H28 Z"
          fill="#f59e0b"
        />
        
        {/* Gopuram Gateway Door */}
        <path
          d="M43 74 C43 66 57 66 57 74 Z"
          fill="#041e1a"
        />

        {/* Base Pillars / Foundation */}
        <rect x="24" y="74" width="52" height="4" rx="1" fill="#00e599" />
        <rect x="20" y="78" width="60" height="3" rx="1" fill="#f59e0b" />

        {/* Ashoka Chakra / Radiant Spoke Centerpiece */}
        <circle cx="50" cy="51" r="5.5" stroke="#ef4444" strokeWidth="1.2" fill="#041e1a" />
        <circle cx="50" cy="51" r="2" fill="#ef4444" />

        {/* Subtle Garland Arc */}
        <path
          d="M16 50 A34 34 0 0 0 84 50"
          stroke="#00e599"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
}
