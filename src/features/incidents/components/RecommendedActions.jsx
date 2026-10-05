import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/shared/Card';

export default function RecommendedActions({ incident }) {
  const navigate = useNavigate();
  const [applied, setApplied] = useState({});

  const handleApply = (id) => {
    setApplied((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const defaultActions = [
    {
      id: 'ACT-01',
      icon: '🚌',
      title: 'Hold B12 at Stop 4 (Tech Park) — 3.0 min',
      subtitle: 'Hold preceding bus B12 (180s) to absorb trailing headway gap',
      scenarioId: 'SCENARIO_B14_HOLD'
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

  const actions = (incident?.recommendedActions?.length > 0)
    ? incident.recommendedActions
    : defaultActions;

  return (
    <div style={{ marginTop: '0.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '1rem', color: '#f59e0b' }}>✨</span>
          <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Recommended Actions {incident ? `— ${incident.title}` : ''}
          </h3>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          * Illustrative actions — no live dispatch or passenger notification is performed.
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '0.875rem'
        }}
      >
        {actions.map((act) => {
          const isApplied = applied[act.id];

          return (
            <Card
              key={act.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                padding: '0.875rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}
                >
                  {act.icon}
                </div>

                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.3 }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {act.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleApply(act.id)}
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.6rem',
                    backgroundColor: isApplied ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minWidth: '90px'
                  }}
                >
                  {isApplied ? '✓ Applied' : 'Apply'}
                </button>

                {act.scenarioId && (
                  <button
                    type="button"
                    onClick={() => navigate(`/simulation?scenario=${act.scenarioId}`)}
                    style={{
                      flex: 1,
                      padding: '0.4rem 0.6rem',
                      backgroundColor: 'rgba(37, 99, 235, 0.15)',
                      border: '1px solid #2563eb',
                      color: '#2563eb',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      minWidth: '120px'
                    }}
                  >
                    ⚡ Simulate Recovery ➔
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


