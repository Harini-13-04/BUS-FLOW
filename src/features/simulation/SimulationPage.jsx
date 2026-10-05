import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ScenarioControls from './components/ScenarioControls';
import IllustrativeImpactComparison from './components/IllustrativeImpactComparison';
import BusImpactTable from './components/BusImpactTable';
import SavedScenarioDrawer from './components/SavedScenarioDrawer';
import CompareScenarioModal from './components/CompareScenarioModal';

import { MOCK_SIMULATION_SCENARIOS, SAVED_INTERVENTIONS } from './data/mockSimulationData';

export default function SimulationPage() {
  const [searchParams] = useSearchParams();
  const queryScenario = searchParams.get('scenario');
  const [scenarios] = useState(MOCK_SIMULATION_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState(queryScenario || 'SCENARIO_B14_HOLD');
  const [isApplied, setIsApplied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [demandPct, setDemandPct] = useState(30);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    if (queryScenario) {
      setSelectedScenarioId(queryScenario);
    }
  }, [queryScenario]);

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
    setDemandPct(30);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Header Bar matching reference screenshot 3 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Simulation
          </h1>
          <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
            Model and analyze bus operations under different scenarios
          </p>
        </div>

        <div style={{ fontSize: '0.8125rem', color: '#cbd5e1', fontWeight: 500 }}>
          Wed, 24 Jul 2024 &nbsp; <strong style={{ color: '#f8fafc', fontWeight: 700 }}>10:24 AM</strong>
        </div>
      </div>

      {/* Top Navigation Action Pills matching reference screenshot 3 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleToggleRun}
          style={{
            padding: '0.45rem 0.9rem',
            backgroundColor: isRunning ? '#1e293b' : '#10b981',
            color: isRunning ? '#cbd5e1' : '#031019',
            border: isRunning ? '1px solid #334155' : '1px solid #10b981',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
          }}
        >
          <span>▶</span> {isRunning ? 'Pause Simulation' : 'Run Simulation'}
        </button>
        <button
          type="button"
          onClick={() => setIsCompareOpen(true)}
          style={{
            padding: '0.45rem 0.9rem',
            backgroundColor: isCompareOpen ? 'rgba(16, 185, 129, 0.15)' : '#0f172a',
            color: isCompareOpen ? '#10b981' : '#cbd5e1',
            border: '1px solid #1e293b',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>📊</span> Compare Scenarios
        </button>
        <button
          type="button"
          onClick={() => setIsSavedOpen(true)}
          style={{
            padding: '0.45rem 0.9rem',
            backgroundColor: isSavedOpen ? 'rgba(16, 185, 129, 0.15)' : '#0f172a',
            color: isSavedOpen ? '#10b981' : '#cbd5e1',
            border: '1px solid #1e293b',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>📁</span> Saved Scenarios
        </button>
      </div>

      {/* 2-Column Desktop OCC Dashboard Layout: Scenario Config (~33%) vs Expected Impact (~67%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(290px, 3.3fr) minmax(340px, 6.7fr)',
          gap: '1rem',
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
          demandPct={demandPct}
          onDemandChange={setDemandPct}
        />

        {/* Right Column: Expected Impact Summary, Headway Comparison Line Chart & Dual Bar Charts */}
        <IllustrativeImpactComparison
          scenario={activeScenario}
          isApplied={isApplied}
          demandPct={demandPct}
        />
      </div>

      {/* Full-Width Section: Bus-wise Impact Table */}
      <BusImpactTable scenario={activeScenario} isApplied={isApplied} />

      {/* Saved Scenarios Drawer Modal */}
      <SavedScenarioDrawer
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedScenarios={SAVED_INTERVENTIONS}
        onSelectSaved={(id) => {
          setSelectedScenarioId(id);
          setIsApplied(false);
          setIsRunning(false);
        }}
      />

      {/* Compare Scenarios Modal */}
      <CompareScenarioModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        scenarios={scenarios}
      />
    </div>
  );
}



