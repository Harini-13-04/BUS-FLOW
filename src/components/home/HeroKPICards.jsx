import React from 'react';
import { MiniBusIcon, WarningTriangleIcon, UsersIcon } from './HomeIcons';

const KPI_DATA = [
  {
    id: 'routes',
    value: '12',
    label: 'Routes monitored',
    icon: <MiniBusIcon size={18} color="#00e599" />,
    iconBg: 'rgba(0, 229, 153, 0.12)',
    accentBorder: 'rgba(0, 229, 153, 0.3)'
  },
  {
    id: 'buses',
    value: '47',
    label: 'Buses active',
    icon: <MiniBusIcon size={18} color="#38bdf8" />,
    iconBg: 'rgba(56, 189, 248, 0.12)',
    accentBorder: 'rgba(56, 189, 248, 0.3)'
  },
  {
    id: 'incidents',
    value: '3',
    label: 'Incidents',
    icon: <WarningTriangleIcon size={18} color="#ef4444" />,
    iconBg: 'rgba(239, 68, 68, 0.12)',
    accentBorder: 'rgba(239, 68, 68, 0.3)'
  },
  {
    id: 'bunching',
    value: '8',
    label: 'Bunching risks',
    icon: <UsersIcon size={18} color="#f59e0b" />,
    iconBg: 'rgba(245, 158, 11, 0.12)',
    accentBorder: 'rgba(245, 158, 11, 0.3)'
  }
];

export default function HeroKPICards({ stats = KPI_DATA }) {
  return (
    <div
      className="hero-kpi-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '0.65rem',
        margin: '0 0 1.25rem 0',
        maxWidth: '580px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {stats.map((kpi) => (
        <div
          key={kpi.id}
          style={{
            backgroundColor: 'rgba(7, 20, 24, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.65rem 0.65rem',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(10, 28, 33, 0.95)';
            e.currentTarget.style.borderColor = kpi.accentBorder;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(7, 20, 24, 0.85)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Icon Badge */}
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              backgroundColor: kpi.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {kpi.icon}
          </div>

          {/* Value and Label - FULL LABELS IN ONE ROW */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              {kpi.value}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: '#94a3b8',
                fontWeight: 500,
                lineHeight: 1.2,
                marginTop: '1px',
                whiteSpace: 'nowrap'
              }}
            >
              {kpi.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
