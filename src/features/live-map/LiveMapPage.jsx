import React, { useState } from 'react';
import RouteMapCanvas from './components/RouteMapCanvas';
import BusStatusPanel from './components/BusStatusPanel';
import BusTelemetryDrawer from './components/BusTelemetryDrawer';
import HeadwaySpacingBar from './components/HeadwaySpacingBar';

import { MOCK_BUSES_B14, MOCK_STOPS_B14 } from './data/mockLiveMapData';

export default function LiveMapPage() {
  const [buses] = useState(MOCK_BUSES_B14);
  const [stops] = useState(MOCK_STOPS_B14);
  const [selectedBusId, setSelectedBusId] = useState('B14');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedBus = buses.find((b) => b.id === selectedBusId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Bar: Title & Search/Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
            Live Map
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Real-time tracking of buses across Tamil Nadu [Simulated Vehicle Tracking]
          </p>
        </div>

        {/* Search & Filter Inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              placeholder="Search for bus, route or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.875rem 0.5rem 2rem',
                backgroundColor: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.875rem' }}>
              🔍
            </span>
          </div>

          <select
            style={{
              padding: '0.5rem 0.875rem',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Routes</option>
            <option value="B14">Route B14</option>
          </select>

          <button
            type="button"
            onClick={() => setSelectedBusId('B14')}
            style={{
              padding: '0.5rem 0.875rem',
              backgroundColor: selectedBusId === 'B14' ? '#ef4444' : '#0f172a',
              color: '#ffffff',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {selectedBusId === 'B14' ? '★ Bus B14 Focused' : 'Focus Bus B14'}
          </button>
        </div>
      </div>

      {/* Main Responsive Grid: Dominant Map Left (~68%) vs Fleet Right (~32%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 6.8fr) minmax(280px, 3.2fr)',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Dominant Map Canvas + Linear Headway Strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <RouteMapCanvas
            buses={buses}
            stops={stops}
            selectedBusId={selectedBusId}
            onSelectBus={(id) => setSelectedBusId(id)}
          />

          <HeadwaySpacingBar
            buses={buses}
            selectedBusId={selectedBusId}
            onSelectBus={(id) => setSelectedBusId(id)}
          />
        </div>

        {/* Right Column: Telemetry Drawer (if open) + Bus Status Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {selectedBus && (
            <BusTelemetryDrawer
              bus={selectedBus}
              onClose={() => setSelectedBusId(null)}
            />
          )}

          <BusStatusPanel
            buses={buses}
            selectedBusId={selectedBusId}
            onSelectBus={(id) => setSelectedBusId(id)}
          />
        </div>
      </div>
    </div>
  );
}

