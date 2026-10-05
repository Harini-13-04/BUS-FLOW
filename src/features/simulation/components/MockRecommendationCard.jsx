import React from 'react';
import Card from '../../../components/shared/Card';
import StatusBadge from '../../../components/shared/StatusBadge';
import Button from '../../../components/shared/Button';

export default function MockRecommendationCard({ scenario, isApplied, onApplyIntervention }) {
  if (!scenario) return null;

  return (
    <Card
      title="Mock Operational Recommendation"
      subtitle="Predefined illustrative intervention guidance [Frontend Mock Data]"
      action={
        <StatusBadge
          status={isApplied ? 'RECOVERED' : 'AT_RISK'}
          customLabel={isApplied ? 'INTERVENTION SIMULATED' : 'PROPOSED MOCK ACTION'}
        />
      }
      style={{
        borderLeft: isApplied ? '4px solid var(--color-recovered)' : '4px solid var(--color-at-risk)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Recommendation Text Banner */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isApplied ? 'var(--color-recovered-bg)' : 'var(--color-at-risk-bg)',
            border: isApplied ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            lineHeight: 1.5
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: isApplied ? 'var(--color-recovered)' : 'var(--color-at-risk)' }}>
            💡 {scenario.recommendedAction}
          </div>
          <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
            Objective: Prevent trailing Bus B15 from bunching behind stalled Bus B14 by holding Bus B12 to create an even headway distribution [Simulated].
          </div>
        </div>

        {/* Action Button & Disclaimer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            * Note: Frontend illustrative model only. Controller approval remains out of scope.
          </div>

          <Button
            variant={isApplied ? 'secondary' : 'primary'}
            onClick={onApplyIntervention}
            style={{
              backgroundColor: isApplied ? 'var(--bg-surface-secondary)' : 'var(--color-recovered)',
              color: isApplied ? 'var(--text-primary)' : '#0b0f17',
              fontWeight: 700
            }}
          >
            {isApplied ? '✓ Intervention Applied in Demo' : 'Simulate Intervention →'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
