import React from 'react';
import Card from '../../../components/shared/Card';
import StatusBadge from '../../../components/shared/StatusBadge';
import Button from '../../../components/shared/Button';

export default function BusTelemetryDrawer({ bus, onClose }) {
  if (!bus) return null;

  const isStalled = bus.isStalled;

  return (
    <Card
      title={`Vehicle Telemetry — Bus ${bus.id}`}
      subtitle={`Assigned Route: ${bus.routeId} [Simulated Data]`}
      action={
        <Button size="sm" variant="ghost" onClick={onClose}>
          ✕ Close
        </Button>
      }
      style={{
        borderLeft: isStalled ? '4px solid var(--color-severe-delay)' : '1px solid var(--border-color)'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Speed</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            {bus.speedKmh} km/h
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passenger Occupancy</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            {bus.occupancyPct}%
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Headway Gap</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            {bus.headwayGapMinutes} min
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '0.625rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
          <div style={{ marginTop: '0.25rem' }}>
            <StatusBadge status={bus.status} />
          </div>
        </div>
      </div>

      {/* Operational Note Banner */}
      <div
        style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: isStalled ? 'var(--color-severe-delay-bg)' : 'var(--bg-surface-secondary)',
          border: isStalled ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
          fontSize: '0.8125rem',
          color: isStalled ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '0.2rem', color: isStalled ? 'var(--color-severe-delay)' : 'var(--text-primary)' }}>
          {isStalled ? '⚠️ Active Stall Event Detected' : 'Operational Log'}
        </div>
        <div>{bus.note}</div>
      </div>
    </Card>
  );
}
