import React, { useState } from 'react';
import Card from '../../../components/shared/Card';

export default function BusStatusPanel({ buses, selectedBusId, onSelectBus }) {
  const [activeTab, setActiveTab] = useState('buses');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBuses = buses.filter((bus) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return bus.id.toLowerCase().includes(q) || bus.locationName.toLowerCase().includes(q) || bus.nextStop.toLowerCase().includes(q);
  });

  return (
    <Card style={{ padding: '1.25rem', backgroundColor: '#0b121e', border: '1px solid #1e293b' }}>
      {/* Top Tab Bar: Buses vs Incidents */}
      <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('buses')}
          style={{
            flex: 1,
            padding: '0.45rem 0',
            backgroundColor: activeTab === 'buses' ? '#059669' : 'transparent',
            color: activeTab === 'buses' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem'
          }}
        >
          <span>🚌</span> Buses
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('incidents')}
          style={{
            flex: 1,
            padding: '0.45rem 0',
            backgroundColor: activeTab === 'incidents' ? '#059669' : 'transparent',
            color: activeTab === 'incidents' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem'
          }}
        >
          <span>⚠️</span> Incidents
        </button>
      </div>

      {/* Fleet Count & Status Overview Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Buses
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
            42
          </span>

          <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.6875rem', fontWeight: 700 }}>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              ● 38 On Time
            </span>
            <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.2rem 0.5rem', borderRadius: '9999px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              ● 3 At Risk
            </span>
            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '9999px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              ● 1 Delayed
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by Bus ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem 0.5rem 2rem',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            outline: 'none'
          }}
        />
        <span style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.8125rem' }}>
          🔍
        </span>
      </div>

      {/* Bus Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '380px', overflowY: 'auto' }}>
        {filteredBuses.map((bus) => {
          const isSelected = bus.id === selectedBusId;

          let badgeColor = '#10b981';
          let badgeBg = 'rgba(16, 185, 129, 0.15)';
          let statusText = 'On Time';
          if (bus.status === 'SEVERE_DELAY') {
            badgeColor = '#ef4444';
            badgeBg = 'rgba(239, 68, 68, 0.15)';
            statusText = 'Delayed';
          } else if (bus.status === 'AT_RISK' || bus.id === 'B14') {
            badgeColor = '#f59e0b';
            badgeBg = 'rgba(245, 158, 11, 0.15)';
            statusText = 'At Risk';
          }

          return (
            <div
              key={bus.id}
              onClick={() => onSelectBus(bus.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.875rem',
                backgroundColor: isSelected ? '#1e293b' : '#0f172a',
                border: isSelected ? '1px solid #059669' : '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Colored Bus Icon Box */}
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: bus.iconColor || badgeColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}
                >
                  🚌
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#f8fafc' }}>
                    {bus.id}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                    {bus.locationName}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                    Next: {bus.nextStop}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px',
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: badgeColor }} />
                    {statusText}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600, marginTop: '0.15rem' }}>
                    {bus.etaText}
                  </div>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 'bold' }}>›</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer matching reference image 2 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
        <span style={{ cursor: 'pointer' }}>‹</span>
        <span style={{ backgroundColor: '#059669', color: '#ffffff', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }}>1</span>
        <span style={{ cursor: 'pointer', padding: '0.2rem 0.4rem' }}>2</span>
        <span style={{ cursor: 'pointer', padding: '0.2rem 0.4rem' }}>3</span>
        <span style={{ cursor: 'pointer', padding: '0.2rem 0.4rem' }}>4</span>
        <span style={{ cursor: 'pointer', padding: '0.2rem 0.4rem' }}>5</span>
        <span style={{ cursor: 'pointer' }}>›</span>
      </div>
    </Card>
  );
}

