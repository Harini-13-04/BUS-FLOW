import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RouteMapCanvas from './components/RouteMapCanvas';
import BusStatusPanel from './components/BusStatusPanel';
import BusTelemetryDrawer from './components/BusTelemetryDrawer';

import { MOCK_BUSES_B14, MOCK_STOPS_B14 } from './data/mockLiveMapData';

export default function LiveMapPage() {
  const [searchParams] = useSearchParams();
  const queryBusId = searchParams.get('busId');
  const [buses] = useState(MOCK_BUSES_B14);
  const [stops] = useState(MOCK_STOPS_B14);
  const [selectedBusId, setSelectedBusId] = useState(queryBusId || 'B14');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (queryBusId) {
      setSelectedBusId(queryBusId);
    }
  }, [queryBusId]);

  const selectedBus = buses.find((b) => b.id === selectedBusId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Header Bar matching reference screenshot 2 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
            Live Map
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '0.15rem 0 0 0' }}>
            Real-time tracking of buses across Tamil Nadu
          </p>
        </div>

        {/* Search & Filter Inputs matching reference image 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search for bus, route or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.875rem 0.5rem 2.2rem',
                backgroundColor: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.875rem' }}>
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
            <option value="ALL">🚌 All Routes</option>
            <option value="B14">Route B14</option>
          </select>

          <button
            type="button"
            title="Filter Settings"
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#0f172a',
              color: '#94a3b8',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ⚙️
          </button>

          <button
            type="button"
            title="Maximize View"
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#0f172a',
              color: '#94a3b8',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ⛶
          </button>

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

      {/* Main Responsive OCC Grid: Dominant Map Left (~68%) vs Fleet Right (~32%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 6.8fr) minmax(320px, 3.2fr)',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Dark Geographic Chennai Satellite Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <RouteMapCanvas
            buses={buses}
            stops={stops}
            selectedBusId={selectedBusId}
            onSelectBus={(id) => setSelectedBusId(id)}
          />
        </div>

        {/* Right Column: Telemetry Drawer (if open) + Fleet Panel */}
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

