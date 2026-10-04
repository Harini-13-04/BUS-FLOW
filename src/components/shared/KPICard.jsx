import React from 'react';
import Card from './Card';
import StatusBadge from './StatusBadge';

export default function KPICard({ label, value, subtitle, status, icon, style = {} }) {
  return (
    <Card style={{ padding: '1.25rem', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.2 }}>
            {value}
          </div>
        </div>
        {icon && (
          <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || status) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          {subtitle && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</span>}
          {status && <StatusBadge status={status} />}
        </div>
      )}
    </Card>
  );
}
