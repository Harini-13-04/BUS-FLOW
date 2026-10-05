import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';

import IncidentKPIBar from './components/IncidentKPIBar';
import IncidentFilterBar from './components/IncidentFilterBar';
import IncidentTable from './components/IncidentTable';
import IncidentDetailDrawer from './components/IncidentDetailDrawer';
import RecommendedActions from './components/RecommendedActions';
import LogIncidentModal from './components/LogIncidentModal';

import { INITIAL_MOCK_INCIDENTS } from './data/mockIncidentsData';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(INITIAL_MOCK_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-B14-STALL'); // Default to Traffic Congestion for reference screenshot
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter & Search Logic
  const filteredIncidents = incidents.filter((item) => {
    if (activeFilter === 'SEVERE_DELAY' && (item.severityStatus !== 'SEVERE_DELAY' || item.isDemoResolved)) return false;
    if (activeFilter === 'AT_RISK' && (item.severityStatus !== 'AT_RISK' || item.isDemoResolved)) return false;
    if (activeFilter === 'RESOLVED' && !item.isDemoResolved && item.severityStatus !== 'RECOVERED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = item.id.toLowerCase().includes(q);
      const matchesBus = item.busId.toLowerCase().includes(q);
      const matchesLoc = item.location.toLowerCase().includes(q);
      const matchesTitle = item.title.toLowerCase().includes(q);
      return matchesId || matchesBus || matchesLoc || matchesTitle;
    }

    return true;
  });

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  // Local state Handlers
  const handleToggleResolve = (id) => {
    setIncidents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDemoResolved: !item.isDemoResolved } : item
      )
    );
  };

  const handleAddIncident = (newIncident) => {
    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncidentId(newIncident.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Bar matching reference screenshot 1 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Incidents
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Detect, manage and mitigate disruptions in real-time [Simulated Data]
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Wed, 24 Jul 2024 &nbsp; <strong style={{ color: 'var(--text-heading)' }}>10:24 AM</strong>
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Live Monitoring
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button size="sm" variant="secondary" onClick={() => setSelectedIncidentId('INC-B14-STALL')}>
              Focus B14 Stall
            </Button>
            <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
              + Log New Incident
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Top KPI Row */}
      <IncidentKPIBar incidents={incidents} />

      {/* Search & Severity Filter Bar */}
      <IncidentFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        incidents={incidents}
      />

      {/* 2-Column Responsive Control-Room Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedIncident ? 'minmax(300px, 4.2fr) minmax(340px, 5.8fr)' : '1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Active Incidents Registry List */}
        <IncidentTable
          incidents={filteredIncidents}
          selectedIncidentId={selectedIncidentId}
          onSelectIncident={(id) => setSelectedIncidentId(id)}
        />

        {/* Right Column: Selected Incident Details Console */}
        {selectedIncident && (
          <IncidentDetailDrawer
            incident={selectedIncident}
            onClose={() => setSelectedIncidentId(null)}
            onToggleResolve={handleToggleResolve}
          />
        )}
      </div>

      {/* Bottom Section: Recommended Actions */}
      <RecommendedActions />

      {/* Log Incident Modal */}
      <LogIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitIncident={handleAddIncident}
      />
    </div>
  );
}

