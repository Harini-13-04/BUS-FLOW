import React from 'react';
import Card from '../../../components/shared/Card';

export default function CompareScenarioModal({ isOpen, onClose, scenarios }) {
  if (!isOpen) return null;

  const scenarioA = scenarios.find((s) => s.id === 'SCENARIO_B14_HOLD') || scenarios[0];
  const scenarioB = scenarios.find((s) => s.id === 'SCENARIO_B14_SKIP') || scenarios[1] || scenarios[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          backgroundColor: '#0b121e',
          border: '1px solid #1e293b',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.85)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card
          title="📊 Compare Simulation Scenarios"
          subtitle="Side-by-side operational comparison of recovery strategies [Simulated Model]"
          action={
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem'
              }}
            >
              ✕
            </button>
          }
          style={{ backgroundColor: '#0b121e', border: 'none', padding: '1.25rem' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
            {/* Strategy A */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                PRIMARY STRATEGY
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
                {scenarioA.name.split(':')[0]}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.4 }}>
                {scenarioA.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#94a3b8' }}>Headway Variance:</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>{scenarioA.simulatedMetrics.headwayVarianceMin} min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#94a3b8' }}>Bunching Risk:</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>{scenarioA.simulatedMetrics.bunchingRisk.split(' ')[0]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#94a3b8' }}>Excess Pass. Wait:</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>{scenarioA.simulatedMetrics.excessPassengerWaitMin} min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                  <span style={{ color: '#94a3b8' }}>Recovery Time:</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>{scenarioA.simulatedMetrics.fleetRecoveryTimeMin} min</span>
                </div>
              </div>
            </div>

            {/* Strategy B */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #3b82f6', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                ALTERNATE STRATEGY
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
                {scenarioB.name.split(':')[0]}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.4 }}>
                {scenarioB.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#94a3b8' }}>Headway Variance:</span>
                  <span style={{ fontWeight: 800, color: '#60a5fa' }}>{scenarioB.simulatedMetrics.headwayVarianceMin} min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#94a3b8' }}>Bunching Risk:</span>
                  <span style={{ fontWeight: 800, color: '#f59e0b' }}>{scenarioB.simulatedMetrics.bunchingRisk.split(' ')[0]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#94a3b8' }}>Excess Pass. Wait:</span>
                  <span style={{ fontWeight: 800, color: '#60a5fa' }}>{scenarioB.simulatedMetrics.excessPassengerWaitMin} min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                  <span style={{ color: '#94a3b8' }}>Recovery Time:</span>
                  <span style={{ fontWeight: 800, color: '#60a5fa' }}>{scenarioB.simulatedMetrics.fleetRecoveryTimeMin} min</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
