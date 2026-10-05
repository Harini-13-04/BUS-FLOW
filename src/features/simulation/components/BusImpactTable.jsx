import React from 'react';
import Card from '../../../components/shared/Card';

export default function BusImpactTable({ isApplied }) {
  const rows = [
    {
      id: 'B21-01',
      busIconColor: '#ef4444',
      currentHeadway: '4.0 min',
      simulatedHeadway: '5.8 min',
      currentLoad: '72',
      simulatedLoad: '108',
      status: 'Delayed',
      statusColor: '#ef4444',
      remarks: 'High demand at Vadapalani'
    },
    {
      id: 'B21-02',
      busIconColor: '#ef4444',
      currentHeadway: '4.2 min',
      simulatedHeadway: '5.6 min',
      currentLoad: '64',
      simulatedLoad: '96',
      status: 'Delayed',
      statusColor: '#ef4444',
      remarks: 'Bunching risk with B21-01'
    },
    {
      id: 'B21-03',
      busIconColor: '#10b981',
      currentHeadway: '4.1 min',
      simulatedHeadway: '5.4 min',
      currentLoad: '58',
      simulatedLoad: '87',
      status: 'At Risk',
      statusColor: '#f59e0b',
      remarks: 'Headway > 5 min'
    },
    {
      id: 'B21-04',
      busIconColor: '#10b981',
      currentHeadway: '4.3 min',
      simulatedHeadway: '5.1 min',
      currentLoad: '61',
      simulatedLoad: '85',
      status: 'At Risk',
      statusColor: '#f59e0b',
      remarks: 'Moderate demand increase'
    }
  ];

  return (
    <Card
      title="Bus-wise Impact (B21)"
      action={
        <button
          type="button"
          style={{
            padding: '0.4rem 0.75rem',
            backgroundColor: 'transparent',
            border: '1px solid #334155',
            color: '#cbd5e1',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          📥 Export Results
        </button>
      }
      style={{ backgroundColor: '#0b121e', border: '1px solid #1e293b', padding: '1.25rem' }}
    >
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.75rem' }}>
              <th style={{ padding: '0.625rem 0.5rem', fontWeight: 600 }}>Bus ID</th>
              <th style={{ padding: '0.625rem 0.5rem', fontWeight: 600 }}>Current Headway</th>
              <th style={{ padding: '0.625rem 0.5rem', fontWeight: 600 }}>Simulated Headway</th>
              <th style={{ padding: '0.625rem 0.5rem', fontWeight: 600 }}>Current Load</th>
              <th style={{ padding: '0.625rem 0.5rem', fontWeight: 600 }}>Simulated Load</th>
              <th style={{ padding: '0.625rem 0.5rem', fontWeight: 600 }}>Status (Simulated)</th>
              <th style={{ padding: '0.625rem 0.5rem', fontWeight: 600 }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: r.busIconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff' }}>
                    🚌
                  </div>
                  {r.id}
                </td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#cbd5e1' }}>{r.currentHeadway}</td>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#ef4444' }}>{r.simulatedHeadway}</td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#cbd5e1' }}>{r.currentLoad}</td>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: r.status === 'Delayed' ? '#ef4444' : '#f59e0b' }}>{r.simulatedLoad}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: r.statusColor, fontWeight: 700, fontSize: '0.75rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: r.statusColor }} />
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>{r.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

