import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './HomeIcons';

const CONTROL_STEPS = [
  {
    step: '01',
    title: 'Detect',
    tag: 'Real-time GPS',
    desc: 'Live telemetry feeds calculate instantaneous headway gaps between sequential buses on active corridors.'
  },
  {
    step: '02',
    title: 'Predict',
    tag: 'Cascade Forecast',
    desc: 'Machine-learning models anticipate headway variance before bunching pairs merge.'
  },
  {
    step: '03',
    title: 'Decide',
    tag: 'Demand-Weighted',
    desc: 'Algorithms calculate optimal holding seconds at key transit stops balancing rider wait times.'
  },
  {
    step: '04',
    title: 'Control',
    tag: 'Human-in-Loop',
    desc: 'Dispatch instructions and holding advisories are transmitted directly to depot controllers and drivers.'
  },
  {
    step: '05',
    title: 'Recover',
    tag: 'Gap Normalization',
    desc: 'Dynamic pacing stabilizes headway regularity across the entire corridor within 1-2 operational cycles.'
  },
  {
    step: '06',
    title: 'Measure',
    tag: 'EWT & Regularity',
    desc: 'Excess Waiting Time (EWT) and schedule regularity metrics are logged for continuous optimization.'
  }
];

export default function HomeAboutSection() {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      style={{
        padding: '6rem 2rem',
        backgroundColor: '#071215',
        borderTop: '1px solid rgba(0, 229, 153, 0.12)',
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
            Closed-Loop Transit Control Engine
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
            How BUSFLOW Keeps Tamil Nadu Moving
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            A continuous feedback loop engineered for high-frequency urban routes like Chennai's 21G, 102, and 570.
          </p>
        </div>

        {/* 6 Step Interactive Story Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3.5rem'
          }}
        >
          {CONTROL_STEPS.map((s) => (
            <div
              key={s.step}
              style={{
                backgroundColor: 'rgba(11, 25, 29, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(14, 34, 39, 0.9)';
                e.currentTarget.style.borderColor = 'rgba(0, 229, 153, 0.35)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(11, 25, 29, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      color: '#00e599',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    {s.step}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: '#cbd5e1',
                      fontWeight: 600
                    }}
                  >
                    {s.tag}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.5rem'
                  }}
                >
                  {s.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#94a3b8',
                    lineHeight: 1.55
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout Banner */}
        <div
          style={{
            backgroundColor: 'rgba(6, 26, 24, 0.6)',
            border: '1px solid rgba(0, 229, 153, 0.25)',
            borderRadius: '16px',
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
              Experience the Headway Simulation Engine
            </div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              Simulate disruptions, passenger surges, and automatic holding interventions in real-time.
            </div>
          </div>

          <button
            onClick={() => navigate('/simulation')}
            style={{
              backgroundColor: '#00e599',
              color: '#051417',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 10px rgba(0, 229, 153, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00ffaa';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#00e599';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Launch Simulation</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
