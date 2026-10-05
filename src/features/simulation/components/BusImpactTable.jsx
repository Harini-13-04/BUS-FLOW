import React from 'react';
import Card from '../../../components/shared/Card';

export default function BusImpactTable({ scenario, isApplied }) {
  const isB21 = scenario?.id === 'SCENARIO_B21_DEMAND';

  const b21Impacts = [
    { id: 'B21-01', currentHeadway: '4.0 min', simHeadway: '5.8 min', currentLoad: 72, simLoad: 108, status: 'SEVERE_DELAY', statusText: 'Delayed', remark: 'High demand at Vadapalani' },
    { id: 'B21-02', currentHeadway: '4.2 min', simHeadway: '5.6 min', currentLoad: 64, simLoad: 96, status: 'SEVERE_DELAY', statusText: 'Delayed', remark: 'Bunching risk with B21-01' },
    { id: 'B21-03', currentHeadway: '4.1 min', simHeadway: '5.4 min', currentLoad: 58, simLoad: 87, status: 'AT_RISK', statusText: 'At Risk', remark: 'Headway > 5 min' },
    { id: 'B21-04', currentHeadway: '4.3 min', simHeadway: '5.1 min', currentLoad: 61, simLoad: 85, status: 'AT_RISK', statusText: 'At Risk', remark: 'Moderate demand increase' }
  ];

  const b14Impacts = scenario?.busImpacts || [
    { id: 'B10', role: 'Ahead', beforeDelay: 0, afterDelay: 0, loadPct: 45, status: 'NORMAL', action: 'None' },
    { id: 'B12', role: 'Preceding (Target Hold)', beforeDelay: 1, afterDelay: 4, loadPct: 62, status: 'AT_RISK', action: 'Hold +3.0m [Mock]' },
    { id: 'B14', role: 'Stalled Vehicle', beforeDelay: 5, afterDelay: 5, loadPct: 88, status: 'SEVERE_DELAY', action: 'Engine Reset [Mock]' },
    { id: 'B15', role: 'Trailing (Bunching Risk)', beforeDelay: 3, afterDelay: 1, loadPct: 84, status: 'NORMAL', action: 'Speed Adjust [Mock]' },
    { id: 'B18', role: 'Following', beforeDelay: 0, afterDelay: 0, loadPct: 50, status: 'NORMAL', action: 'None' }
  ];

  return (
    <Card
      title={isB21 ? "Bus-wise Impact (B21)" : `Bus-wise Impact (${scenario?.name ? scenario.name.split(':')[0] : 'Route B14'})`}
      action={
        <button
          type="button"
          style={{
            padding: '0.35rem 0.65rem',
            backgroundColor: 'transparent',
            border: '1px solid #334155',
            color: '#cbd5e1',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          📥 Export Results
        </button>
      }
      style={{ backgroundColor: '#0b121e', border: '1px solid #1e293b', padding: '1rem' }}
    >
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', fontSize: '0.78125rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.72rem' }}>
              <th style={{ padding: '0.5rem 0.4rem', fontWeight: 600 }}>Bus ID</th>
              <th style={{ padding: '0.5rem 0.4rem', fontWeight: 600 }}>Current Headway</th>
              <th style={{ padding: '0.5rem 0.4rem', fontWeight: 600 }}>Simulated Headway</th>
              <th style={{ padding: '0.5rem 0.4rem', fontWeight: 600 }}>Current Load</th>
              <th style={{ padding: '0.5rem 0.4rem', fontWeight: 600 }}>Simulated Load</th>
              <th style={{ padding: '0.5rem 0.4rem', fontWeight: 600 }}>Status (Simulated)</th>
              <th style={{ padding: '0.5rem 0.4rem', fontWeight: 600 }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {isB21 ? (
              b21Impacts.map((row) => {
                let badgeColor = '#10b981';
                if (row.status === 'SEVERE_DELAY') badgeColor = '#ef4444';
                if (row.status === 'AT_RISK') badgeColor = '#f59e0b';

                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '0.55rem 0.4rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', flexShrink: 0 }}>
                        🚌
                      </div>
                      <span>{row.id}</span>
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: '#cbd5e1' }}>{row.currentHeadway}</td>
                    <td style={{ padding: '0.55rem 0.4rem', fontWeight: 700, color: '#ef4444' }}>{row.simHeadway}</td>
                    <td style={{ padding: '0.55rem 0.4rem', color: '#cbd5e1' }}>{row.currentLoad}</td>
                    <td style={{ padding: '0.55rem 0.4rem', fontWeight: 700, color: row.simLoad > 90 ? '#ef4444' : '#f59e0b' }}>{row.simLoad}</td>
                    <td style={{ padding: '0.55rem 0.4rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: badgeColor, fontWeight: 700, fontSize: '0.72rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badgeColor }} />
                        {row.statusText}
                      </span>
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: '#cbd5e1', fontSize: '0.72rem' }}>
                      {row.remark}
                    </td>
                  </tr>
                );
              })
            ) : (
              b14Impacts.map((r) => {
                let badgeColor = '#10b981';
                if (r.status === 'SEVERE_DELAY') badgeColor = '#ef4444';
                if (r.status === 'AT_RISK') badgeColor = '#f59e0b';

                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '0.55rem 0.4rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', flexShrink: 0 }}>
                        🚌
                      </div>
                      <div>
                        <div>{r.id}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 400 }}>{r.role}</div>
                      </div>
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: '#cbd5e1' }}>+{r.beforeDelay} min</td>
                    <td style={{ padding: '0.55rem 0.4rem', fontWeight: 700, color: isApplied ? (r.afterDelay < r.beforeDelay ? '#10b981' : '#f59e0b') : '#64748b' }}>
                      {isApplied ? `+${r.afterDelay} min` : '—'}
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: '#cbd5e1' }}>{r.loadPct}%</td>
                    <td style={{ padding: '0.55rem 0.4rem', fontWeight: 700, color: isApplied ? '#10b981' : '#64748b' }}>
                      {isApplied ? `${r.loadPct}%` : '—'}
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: badgeColor, fontWeight: 700, fontSize: '0.72rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badgeColor }} />
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: isApplied ? '#f8fafc' : '#cbd5e1', fontSize: '0.72rem', fontWeight: isApplied ? 600 : 400 }}>
                      {isApplied ? r.action : r.role}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


