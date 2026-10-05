import React from 'react';
import Card from '../../../components/shared/Card';
import Button from '../../../components/shared/Button';

export default function IncidentFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  incidents
}) {
  return (
    <Card style={{ padding: '0.875rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search by Incident ID, Bus ID (e.g. B14), or Location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-surface-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Severity Filter Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
          <Button
            size="sm"
            variant={activeFilter === 'ALL' ? 'primary' : 'ghost'}
            onClick={() => onFilterChange('ALL')}
          >
            All ({incidents.length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'SEVERE_DELAY' ? 'danger' : 'ghost'}
            onClick={() => onFilterChange('SEVERE_DELAY')}
          >
            Stalls / Severe ({incidents.filter((i) => i.severityStatus === 'SEVERE_DELAY' && !i.isDemoResolved).length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'AT_RISK' ? 'secondary' : 'ghost'}
            onClick={() => onFilterChange('AT_RISK')}
          >
            At Risk ({incidents.filter((i) => i.severityStatus === 'AT_RISK' && !i.isDemoResolved).length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'RESOLVED' ? 'secondary' : 'ghost'}
            onClick={() => onFilterChange('RESOLVED')}
          >
            Resolved ({incidents.filter((i) => i.isDemoResolved || i.severityStatus === 'RECOVERED').length})
          </Button>
        </div>
      </div>
    </Card>
  );
}
