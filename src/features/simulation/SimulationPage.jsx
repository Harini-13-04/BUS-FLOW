import React, { useState } from 'react';
import ScenarioControls from './components/ScenarioControls';
import IllustrativeImpactComparison from './components/IllustrativeImpactComparison';
import BusImpactTable from './components/BusImpactTable';

import { MOCK_SIMULATION_SCENARIOS } from './data/mockSimulationData';

export default function SimulationPage() {
  const [scenarios] = useState(MOCK_SIMULATION_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState('SCENARIO_B14_HOLD');
  const [isApplied, setIsApplied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('run');

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const handleToggleRun = () => {
    setIsRunning((prev) => !prev);
    if (!isRunning) {
      setIsApplied(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsApplied(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Bar matching reference screenshot 2 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Simulation
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Model and analyze bus operations under different scenarios [Simulated Model]
          </p>
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Wed, 24 Jul 2024 &nbsp; <strong style={{ color: 'var(--text-heading)' }}>10:24 AM</strong>
        </div>
      </div>

      {/* Top Navigation Tabs matching reference screenshot 2 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('run')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'run' ? 'var(--primary-accent-bg)' : 'var(--bg-surface-secondary)',
            color: activeTab === 'run' ? 'var(--busflow-green)' : 'var(--text-secondary)',
            border: activeTab === 'run' ? '1px solid var(--busflow-green)' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          ▶ Run Simulation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('compare')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'compare' ? 'var(--primary-accent-bg)' : 'var(--bg-surface-secondary)',
            color: activeTab === 'compare' ? 'var(--busflow-green)' : 'var(--text-secondary)',
            border: activeTab === 'compare' ? '1px solid var(--busflow-green)' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          📊 Compare Scenarios
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'saved' ? 'var(--primary-accent-bg)' : 'var(--bg-surface-secondary)',
            color: activeTab === 'saved' ? 'var(--busflow-green)' : 'var(--text-secondary)',
            border: activeTab === 'saved' ? '1px solid var(--busflow-green)' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          📁 Saved Scenarios
        </button>
      </div>

      {/* 2-Column Desktop OCC Layout: Scenario Config (Left) vs Expected Impact (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 4fr) minmax(340px, 6fr)',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Scenario Configuration */}
        <ScenarioControls
          scenarios={scenarios}
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={(id) => {
            setSelectedScenarioId(id);
            setIsApplied(false);
            setIsRunning(false);
          }}
          isRunning={isRunning}
          onToggleRun={handleToggleRun}
          onReset={handleReset}
        />

        {/* Right Column: Expected Impact Summary, Headway Comparison Line Chart & Dual Bar Charts */}
        <IllustrativeImpactComparison
          scenario={activeScenario}
          isApplied={isApplied}
        />
      </div>

      {/* Full-Width Section: Bus-wise Impact Table (B21) */}
      <BusImpactTable isApplied={isApplied} />
    </div>
  );
}

