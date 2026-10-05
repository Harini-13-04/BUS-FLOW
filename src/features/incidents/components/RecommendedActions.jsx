import React, { useState } from 'react';
import Card from '../../../components/shared/Card';

export default function RecommendedActions() {
  const [applied, setApplied] = useState({});

  const handleApply = (id) => {
    setApplied((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const actions = [
    {
      id: 'ACT-01',
      icon: '🚌',
      title: 'Hold B21 at Vadapalani',
      subtitle: 'Stabilize headway, avoid bunching'
    },
    {
      id: 'ACT-02',
      icon: '🔀',
      title: 'Divert B23 via 100 Feet Road',
      subtitle: 'Estimated saving: 6 min'
    },
    {
      id: 'ACT-03',
      icon: 'ℹ️',
      title: 'Notify Passengers',
      subtitle: 'Send delay alert for B21, B23, B24'
    }
  ];

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem', color: '#f59e0b' }}>✨</span>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
            Recommended Actions
          </h3>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
          * Illustrative actions — no live dispatch or passenger notification is performed.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {actions.map((act) => {
          const isApplied = applied[act.id];

          return (
            <Card
              key={act.id}
              style={{
                backgroundColor: '#0b121e',
                border: '1px solid #1e293b',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}
                >
                  {act.icon}
                </div>

                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {act.subtitle}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApply(act.id)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: isApplied ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  border: isApplied ? '1px solid #10b981' : '1px solid #10b981',
                  color: '#10b981',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {isApplied ? '✓ Applied (Simulated)' : 'Apply'}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

