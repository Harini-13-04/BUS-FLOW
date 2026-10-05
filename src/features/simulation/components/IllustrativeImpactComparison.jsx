import React from 'react';
import Card from '../../../components/shared/Card';

export default function IllustrativeImpactComparison({ scenario, isApplied, demandPct = 30 }) {
  const stations = ['Vadapalani', 'Arumbakkam', 'Ashok Nagar', 'KK Nagar', 'T. Nagar'];

  const base = scenario?.baselineMetrics || {
    headwayVarianceMin: 6.8,
    bunchingRisk: 'HIGH',
    excessPassengerWaitMin: 4.2,
    fleetRecoveryTimeMin: 22.0
  };

  const sim = scenario?.simulatedMetrics || {
    headwayVarianceMin: 1.9,
    bunchingRisk: 'LOW',
    excessPassengerWaitMin: 1.1,
    fleetRecoveryTimeMin: 8.5
  };

  const passengerLoads = scenario?.passengerLoads || [
    { busId: 'B10', loadPct: 45 },
    { busId: 'B12', loadPct: 62 },
    { busId: 'B14', loadPct: 88 },
    { busId: 'B15', loadPct: 84 },
    { busId: 'B18', loadPct: 50 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* 1. Expected Impact 4 KPI Row */}
      <Card
        title="Expected Impact (vs Current)"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem', boxShadow: 'var(--shadow-card)' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {/* Card 1: Total Ridership */}
          <div style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
              👥
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Ridership</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>
                +{demandPct}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem', whiteSpace: 'nowrap' }}>
                18,240 → 23,350
              </div>
            </div>
          </div>

          {/* Card 2: Average Headway */}
          <div style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
              ⏱️
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Average Headway</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: isApplied ? '#10b981' : '#f59e0b', lineHeight: 1.2 }}>
                {isApplied ? `-${(base.headwayVarianceMin - sim.headwayVarianceMin).toFixed(1)} min` : `+1.6 min`}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem', whiteSpace: 'nowrap' }}>
                {isApplied ? `${base.headwayVarianceMin} → ${sim.headwayVarianceMin} min` : '4.2 → 5.8 min'}
              </div>
            </div>
          </div>

          {/* Card 3: On-Time Rate */}
          <div style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
              🎯
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>On-Time Rate</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: isApplied ? '#10b981' : '#ef4444', lineHeight: 1.2 }}>
                {isApplied ? '+12%' : '-12%'}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem', whiteSpace: 'nowrap' }}>
                {isApplied ? '77% → 89%' : '89% → 77%'}
              </div>
            </div>
          </div>

          {/* Card 4: Bunching Risk */}
          <div style={{ backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
              ⚠️
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Bunching Risk</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: isApplied ? '#10b981' : '#ef4444', lineHeight: 1.2 }}>
                {isApplied ? '-2 buses' : '+2 buses'}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem', whiteSpace: 'nowrap' }}>
                {isApplied ? '3 → 1' : '1 → 3'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Headway Comparison SVG Line Chart */}
      <Card
        title="Headway Comparison"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Current
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Simulated
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
              - - - Target (4.0 min)
            </span>
          </div>
        }
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem', boxShadow: 'var(--shadow-card)' }}
      >
        <div style={{ height: '120px', width: '100%', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 110" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="35" y1="10" x2="590" y2="10" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1="35" y1="35" x2="590" y2="35" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1="35" y1="60" x2="590" y2="60" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1="35" y1="85" x2="590" y2="85" stroke="var(--border-subtle)" strokeDasharray="3 3" />

            {/* Target 4.0 min line */}
            <line x1="35" y1="60" x2="590" y2="60" stroke="var(--text-muted)" strokeDasharray="6 4" strokeWidth="1.5" />

            {/* Y-axis labels */}
            <text x="22" y="14" fill="var(--text-muted)" fontSize="8.5" textAnchor="end">12</text>
            <text x="22" y="39" fill="var(--text-muted)" fontSize="8.5" textAnchor="end">8</text>
            <text x="22" y="64" fill="var(--text-muted)" fontSize="8.5" textAnchor="end">4</text>
            <text x="22" y="89" fill="var(--text-muted)" fontSize="8.5" textAnchor="end">0</text>

            {/* Green Line (Current Baseline) */}
            <path
              d="M 45 62 Q 180 65 300 60 T 580 62"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.2"
            />
            {/* Green Dots */}
            <circle cx="45" cy="62" r="3.5" fill="#10b981" />
            <circle cx="180" cy="64" r="3.5" fill="#10b981" />
            <circle cx="300" cy="60" r="3.5" fill="#10b981" />
            <circle cx="440" cy="61" r="3.5" fill="#10b981" />
            <circle cx="580" cy="62" r="3.5" fill="#10b981" />

            {/* Blue Line (Simulated Line matching reference screenshot 3) */}
            <path
              d="M 45 60 Q 140 38 230 28 Q 320 42 410 20 Q 500 24 580 32"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.2"
            />
            {/* Blue Dots */}
            <circle cx="45" cy="60" r="3.5" fill="#3b82f6" />
            <circle cx="140" cy="40" r="3.5" fill="#3b82f6" />
            <circle cx="230" cy="28" r="3.5" fill="#3b82f6" />
            <circle cx="320" cy="42" r="3.5" fill="#3b82f6" />
            <circle cx="410" cy="20" r="3.5" fill="#3b82f6" />
            <circle cx="500" cy="25" r="3.5" fill="#3b82f6" />
            <circle cx="580" cy="33" r="3.5" fill="#3b82f6" />
          </svg>
        </div>

        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '35px', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          <span>10:00 AM</span>
          <span>10:30 AM</span>
          <span>11:00 AM</span>
          <span>11:30 AM</span>
          <span>12:00 PM</span>
        </div>
      </Card>

      {/* 3. Side-by-side Dual Bar Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Left Bar Chart: Passenger Load Distribution */}
        <Card
          title="Passenger Load Distribution"
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Current
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Simulated
              </span>
            </div>
          }
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem', boxShadow: 'var(--shadow-card)' }}
        >
          <div style={{ height: '110px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '0.35rem', paddingTop: '0.5rem' }}>
            {stations.map((st, idx) => {
              const currentH = [50, 60, 75, 40, 45][idx];
              const simH = [72, 76, 88, 55, 60][idx];

              return (
                <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '80px' }}>
                    <div style={{ width: '10px', height: `${currentH}%`, backgroundColor: '#10b981', borderRadius: '2px 2px 0 0' }} title={`Current: ${currentH}`} />
                    <div style={{ width: '10px', height: `${simH}%`, backgroundColor: '#3b82f6', borderRadius: '2px 2px 0 0' }} title={`Simulated: ${simH}`} />
                  </div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {st.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Bar Chart: Bus Bunching Risk */}
        <Card
          title="Bus Bunching Risk"
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }} /> Current
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Simulated
              </span>
            </div>
          }
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem', boxShadow: 'var(--shadow-card)' }}
        >
          <div style={{ height: '110px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '0.35rem', paddingTop: '0.5rem' }}>
            {stations.map((st, idx) => {
              const currentH = [20, 25, 30, 25, 25][idx];
              const simH = [40, 50, 55, 70, 70][idx];

              return (
                <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '80px' }}>
                    <div style={{ width: '10px', height: `${currentH}%`, backgroundColor: '#f59e0b', borderRadius: '2px 2px 0 0' }} title={`Current Risk: ${currentH}%`} />
                    <div style={{ width: '10px', height: `${simH}%`, backgroundColor: '#ef4444', borderRadius: '2px 2px 0 0' }} title={`Simulated Risk: ${simH}%`} />
                  </div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {st.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}


