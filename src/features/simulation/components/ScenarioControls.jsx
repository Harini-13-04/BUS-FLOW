import React, { useState } from 'react';
import Card from '../../../components/shared/Card';

export default function ScenarioControls({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  isRunning,
  onToggleRun,
  onReset
}) {
  const [simType, setSimType] = useState('demand');
  const [demandPct, setDemandPct] = useState(30);
  const [weatherImpact, setWeatherImpact] = useState(true);
  const [includeIncidents, setIncludeIncidents] = useState(false);
  const [includeDiversion, setIncludeDiversion] = useState(false);

  return (
    <Card
      title="Scenario Configuration"
      subtitle="Model and analyze bus operations under different scenarios [Simulated Data]"
      action={
        <button
          type="button"
          onClick={onReset}
          style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          🔄 Reset
        </button>
      }
      style={{ backgroundColor: '#0b121e', border: '1px solid #1e293b', padding: '1.25rem' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Select Route */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
            Select Route
          </label>
          <select
            value={selectedScenarioId}
            onChange={(e) => onSelectScenario(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="SCENARIO_B21_DEMAND">🚌 B21 - Vadapalani → Arumbakkam</option>
            <option value="SCENARIO_B14_HOLD">🚌 B14 - Tech Park Stall Recovery</option>
          </select>
        </div>

        {/* Simulation Type Segmented Buttons */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
            Simulation Type
          </label>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <button
              type="button"
              onClick={() => setSimType('demand')}
              style={{
                flex: 1,
                padding: '0.45rem 0.25rem',
                backgroundColor: simType === 'demand' ? 'rgba(16, 185, 129, 0.15)' : '#0f172a',
                color: simType === 'demand' ? '#10b981' : '#94a3b8',
                border: simType === 'demand' ? '1px solid #10b981' : '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <span>📈</span> Increased Demand
            </button>
            <button
              type="button"
              onClick={() => setSimType('incident')}
              style={{
                flex: 1,
                padding: '0.45rem 0.25rem',
                backgroundColor: simType === 'incident' ? 'rgba(16, 185, 129, 0.15)' : '#0f172a',
                color: simType === 'incident' ? '#10b981' : '#94a3b8',
                border: simType === 'incident' ? '1px solid #10b981' : '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <span>⚠️</span> Incident Impact
            </button>
            <button
              type="button"
              onClick={() => setSimType('diversion')}
              style={{
                flex: 1,
                padding: '0.45rem 0.25rem',
                backgroundColor: simType === 'diversion' ? 'rgba(16, 185, 129, 0.15)' : '#0f172a',
                color: simType === 'diversion' ? '#10b981' : '#94a3b8',
                border: simType === 'diversion' ? '1px solid #10b981' : '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <span>🔀</span> Route Diversion
            </button>
          </div>
        </div>

        {/* Time Range */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
            Time Range
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b', fontSize: '0.8125rem', color: '#f8fafc' }}>
            <span>📅</span> 10:00 AM – 12:00 PM
          </div>
        </div>

        {/* Demand Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
            <span>Demand Increase</span>
            <span style={{ color: '#10b981', fontWeight: 800 }}>+{demandPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={demandPct}
            onChange={(e) => setDemandPct(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Additional Option Toggles matching reference screenshot 2 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
            Additional Options
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={includeIncidents} onChange={() => setIncludeIncidents(!includeIncidents)} style={{ accentColor: '#10b981' }} />
              Include Incidents
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={includeDiversion} onChange={() => setIncludeDiversion(!includeDiversion)} style={{ accentColor: '#10b981' }} />
              Include Diversion
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={weatherImpact} onChange={() => setWeatherImpact(!weatherImpact)} style={{ accentColor: '#10b981' }} />
              Weather Impact
            </label>
          </div>
        </div>

        {/* Run Simulation Main Button */}
        <button
          type="button"
          onClick={onToggleRun}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isRunning ? '#1e293b' : '#10b981',
            color: isRunning ? '#cbd5e1' : '#031019',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          {isRunning ? '⏸ Pause Simulation' : '▶ Run Simulation'}
        </button>
      </div>
    </Card>
  );
}

