import React from 'react';
import { ShieldCheckIcon, UsersIcon, ChartBarIcon, LeafIcon } from './HomeIcons';

const FEATURE_CARDS = [
  {
    id: 'anti-bunching',
    title: 'Prevent Bus Bunching',
    subtitle: 'Real-time Spacing Control',
    icon: <ShieldCheckIcon size={24} color="#00e599" />,
    iconBg: 'rgba(0, 229, 153, 0.15)',
    desc: 'Continuous real-time tracking detects headway compression before vehicles pair up. Dynamic holding suggestions keep buses evenly spaced.'
  },
  {
    id: 'passenger-aware',
    title: 'Passenger-Aware Control',
    subtitle: 'Demand-Weighted Decisions',
    icon: <UsersIcon size={24} color="#f59e0b" />,
    iconBg: 'rgba(245, 158, 11, 0.15)',
    desc: 'Incorporates real-time passenger loads and waiting passenger density across stops to make equitable holding decisions that minimize total waiting time.'
  },
  {
    id: 'data-insights',
    title: 'Data-Driven Decisions',
    subtitle: 'Simulation & Predictive ML',
    icon: <ChartBarIcon size={24} color="#38bdf8" />,
    iconBg: 'rgba(56, 189, 248, 0.15)',
    desc: 'Integrates real-time telemetry with a predictive simulation engine to test intervention strategies under adverse traffic and weather conditions.'
  },
  {
    id: 'reliable-service',
    title: 'More Reliable Service',
    subtitle: 'Commuter Confidence',
    icon: <LeafIcon size={24} color="#00e599" />,
    iconBg: 'rgba(0, 229, 153, 0.15)',
    desc: 'Transitions public transport management from rigid schedule-adherence to resilient headway regularity, reducing passenger wait frustration.'
  }
];

export default function HomeFeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: '6rem 2rem',
        backgroundColor: '#050b0d',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 229, 153, 0.1)',
              border: '1px solid rgba(0, 229, 153, 0.25)',
              color: '#00e599',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.85rem'
            }}
          >
            Core Capabilities
          </div>
          <h2
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '0.85rem'
            }}
          >
            Built for Modern Transport Operations
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Empowering Tamil Nadu State Transport Corporation with real-time headway intelligence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.id}
              style={{
                backgroundColor: 'rgba(11, 23, 26, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.75rem',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(14, 30, 34, 0.95)';
                e.currentTarget.style.borderColor = 'rgba(0, 229, 153, 0.35)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 229, 153, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(11, 23, 26, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                {card.icon}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#00e599', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                {card.subtitle}
              </div>

              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.75rem'
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  lineHeight: 1.6
                }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
