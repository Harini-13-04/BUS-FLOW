import React from 'react';
import Card from '../../../components/shared/Card';
import Button from '../../../components/shared/Button';

export default function SavedScenarioDrawer({ savedScenarios, onSelectSaved }) {
  return (
    <Card
      title="Saved Interventions & Strategy Library"
      subtitle="Pre-configured simulation templates [Illustrative Template Library]"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {savedScenarios.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {item.route} • {item.type} • {item.date}
              </div>
            </div>

            <Button size="sm" variant="ghost" onClick={() => onSelectSaved(item.id)}>
              Load Template
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
