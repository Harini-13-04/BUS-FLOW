import React, { useState } from 'react';
import Button from '../../components/shared/Button';

import IncidentKPIBar from './components/IncidentKPIBar';
import IncidentTable from './components/IncidentTable';
import IncidentDetailDrawer from './components/IncidentDetailDrawer';
import RecommendedActions from './components/RecommendedActions';
import LogIncidentModal from './components/LogIncidentModal';

import { INITIAL_MOCK_INCIDENTS } from './data/mockIncidentsData';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(INITIAL_MOCK_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-B14-STALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  // Local state Handlers
  const handleFocusB14Stall = () => {
    setSelectedIncidentId('INC-B14-STALL');
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Header Bar matching reference screenshot 3 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Incidents
          </h1>
          <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
            Detect, manage and mitigate disruptions in real-time
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.8125rem', color: '#cbd5e1', fontWeight: 500 }}>
            Wed, 24 Jul 2024 &nbsp; <strong style={{ color: '#f8fafc', fontWeight: 700 }}>10:24 AM</strong>
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Live Monitoring
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button size="sm" variant="secondary" onClick={handleFocusB14Stall}>
              Focus B14 Stall
            </Button>
            <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
              + Log New Incident
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Top 4 KPI Row matching reference screenshot 3 */}
      <IncidentKPIBar incidents={incidents} />

      {/* 2-Column Responsive OCC Control-Room Layout: Active Incidents (Left ~40%) vs Incident Details (Right ~60%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedIncident ? 'minmax(280px, 4fr) minmax(340px, 6fr)' : '1fr',
          gap: '1rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Active Incidents Registry List */}
        <IncidentTable
          incidents={incidents}
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

      {/* Bottom Section: Recommended Actions (3 Cards in 1 Row) */}
      <RecommendedActions incident={selectedIncident} />

      {/* Log Incident Modal */}
      <LogIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitIncident={handleAddIncident}
      />
    </div>
  );
}


