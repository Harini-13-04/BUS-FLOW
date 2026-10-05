import React from 'react';
import Card from '../../../components/shared/Card';
import Button from '../../../components/shared/Button';

export default function SavedScenarioDrawer({ isOpen, onClose, savedScenarios = [], onSelectSaved }) {
  if (!isOpen) return null;

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
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card
          title="📁 Saved Scenarios & Interventions"
          subtitle="Pre-configured simulation templates [Simulated Library]"
          action={
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem'
              }}
            >
              ✕
            </button>
          }
          style={{ backgroundColor: 'var(--bg-card)', border: 'none', padding: '1.25rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {savedScenarios.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {item.route} • {item.type} • {item.date}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    if (onSelectSaved) onSelectSaved('SCENARIO_B14_HOLD');
                    onClose();
                  }}
                >
                  Load Template
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

