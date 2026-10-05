import React from 'react';
import {
  ShieldCheckIcon,
  UsersIcon,
  ChartBarIcon,
  LeafIcon
} from './HomeIcons';

const FEATURES = [
  {
    id: 'bunching',
    title: 'Prevent Bus Bunching',
    desc: 'Detect and avoid uneven bus spacing in real time.',
    icon: <ShieldCheckIcon size={22} color="#00e599" />,
    iconBg: 'rgba(0, 229, 153, 0.14)'
  },
  {
    id: 'passenger',
    title: 'Passenger-Aware Control',
    desc: 'Consider passenger demand for fair and efficient decisions.',
    icon: <UsersIcon size={22} color="#f59e0b" />,
    iconBg: 'rgba(245, 158, 11, 0.14)'
  },
  {
    id: 'data',
    title: 'Data-Driven Decisions',
    desc: 'Use real-time data and simulation insights.',
    icon: <ChartBarIcon size={22} color="#38bdf8" />,
    iconBg: 'rgba(56, 189, 248, 0.14)'
  },
  {
    id: 'reliable',
    title: 'More Reliable Service',
    desc: 'Shorter waiting times and smoother cities.',
    icon: <LeafIcon size={22} color="#00e599" />,
    iconBg: 'rgba(0, 229, 153, 0.14)'
  }
];

export default function HeroFeatureStrip() {
  return (
    <div
      className="hero-feature-strip-grid"
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        background: 'transparent',
        border: 'none',
        padding: '0',
        boxShadow: 'none'
      }}
    >
      {FEATURES.map((item, index) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: index === 0 ? '0' : '1.25rem',
            paddingRight: '1.25rem',
            borderRight:
              index < FEATURES.length - 1
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : 'none',
            boxSizing: 'border-box'
          }}
        >
          {/* Accent Icon Container */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: item.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}
          >
            {item.icon}
          </div>

          {/* Feature Text */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.25,
                letterSpacing: '-0.01em'
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: '0.76rem',
                color: '#94a3b8',
                lineHeight: 1.4,
                marginTop: '4px'
              }}
            >
              {item.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
