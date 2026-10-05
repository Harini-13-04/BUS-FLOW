import React from 'react';
import Card from '../../../components/shared/Card';

export default function IllustrativeImpactComparison({ scenario, isApplied }) {
  const stations = ['Vadapalani', 'Arumbakkam', 'Ashok Nagar', 'KK Nagar', 'T. Nagar'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Expected Impact 4 KPI Row */}
      <Card
        title="Expected Impact (vs Current)"
        style={{ backgroundColor: '#0b121e', border: '1px solid #1e293b', padding: '1.25rem' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {/* Card 1: Total Ridership */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem' }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Ridership</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>+28%</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>18,240 → 23,350</div>
            </div>
          </div>

          {/* Card 2: Average Headway */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem' }}>
              🕒
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Average Headway</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>+1.6 min</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>4.2 → 5.8 min</div>
            </div>
          </div>

          {/* Card 3: On-Time Rate */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem' }}>
              🎯
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>On-Time Rate</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>-12%</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>89% → 77%</div>
            </div>
          </div>

          {/* Card 4: Bunching Risk */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem' }}>
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Bunching Risk</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>+2 buses</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>1 → 3</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Headway Comparison SVG Line Chart */}
      <Card
        title="Headway Comparison"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Current
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Simulated
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
              - - - Target (4.0 min)
            </span>
          </div>
        }
        style={{ backgroundColor: '#0b121e', border: '1px solid #1e293b', padding: '1.25rem' }}
      >
        <div style={{ height: '140px', width: '100%', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 130" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="40" y1="10" x2="590" y2="10" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="40" y1="40" x2="590" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="40" y1="70" x2="590" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="40" y1="100" x2="590" y2="100" stroke="#1e293b" strokeDasharray="3 3" />

            {/* Target 4.0 min line */}
            <line x1="40" y1="70" x2="590" y2="70" stroke="#64748b" strokeDasharray="6 4" strokeWidth="1.5" />

            {/* Y-axis labels */}
            <text x="25" y="14" fill="#64748b" fontSize="9" textAnchor="end">12</text>
            <text x="25" y="44" fill="#64748b" fontSize="9" textAnchor="end">8</text>
            <text x="25" y="74" fill="#64748b" fontSize="9" textAnchor="end">4</text>
            <text x="25" y="104" fill="#64748b" fontSize="9" textAnchor="end">0</text>

            {/* Green Line (Current) */}
            <path
              d="M 50 72 Q 180 75 300 70 T 580 72"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            {/* Green Dots */}
            <circle cx="50" cy="72" r="4" fill="#10b981" />
            <circle cx="180" cy="74" r="4" fill="#10b981" />
            <circle cx="300" cy="70" r="4" fill="#10b981" />
            <circle cx="440" cy="71" r="4" fill="#10b981" />
            <circle cx="580" cy="72" r="4" fill="#10b981" />

            {/* Blue Line (Simulated) */}
            <path
              d="M 50 70 Q 140 45 230 35 Q 320 50 410 25 Q 500 30 580 40"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
            />
            {/* Blue Dots */}
            <circle cx="50" cy="70" r="4" fill="#3b82f6" />
            <circle cx="140" cy="48" r="4" fill="#3b82f6" />
            <circle cx="230" cy="36" r="4" fill="#3b82f6" />
            <circle cx="320" cy="52" r="4" fill="#3b82f6" />
            <circle cx="410" cy="27" r="4" fill="#3b82f6" />
            <circle cx="500" cy="32" r="4" fill="#3b82f6" />
            <circle cx="580" cy="41" r="4" fill="#3b82f6" />
          </svg>
        </div>

        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '40px', fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
          <span>10:00 AM</span>
          <span>10:30 AM</span>
          <span>11:00 AM</span>
          <span>11:30 AM</span>
          <span>12:00 PM</span>
        </div>
      </Card>

      {/* 3. Side-by-side Dual Bar Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Left Bar Chart: Passenger Load Distribution */}
        <Card
          title="Passenger Load Distribution"
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Current
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Simulated
              </span>
            </div>
          }
          style={{ backgroundColor: '#0b121e', border: '1px solid #1e293b', padding: '1.25rem' }}
        >
          <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '0.5rem', paddingTop: '1rem' }}>
            {stations.map((st, idx) => {
              const currentH = [50, 60, 75, 40, 55][idx];
              const simH = [75, 85, 100, 60, 70][idx];

              return (
                <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100px' }}>
                    <div style={{ width: '12px', height: `${currentH}%`, backgroundColor: '#10b981', borderRadius: '2px 2px 0 0' }} />
                    <div style={{ width: '12px', height: `${simH}%`, backgroundColor: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center', whiteSpace: 'nowrap' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} /> Current
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Simulated
              </span>
            </div>
          }
          style={{ backgroundColor: '#0b121e', border: '1px solid #1e293b', padding: '1.25rem' }}
        >
          <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '0.5rem', paddingTop: '1rem' }}>
            {stations.map((st, idx) => {
              const currentH = [20, 25, 30, 32, 30][idx];
              const simH = [40, 50, 55, 70, 65][idx];

              return (
                <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100px' }}>
                    <div style={{ width: '12px', height: `${currentH}%`, backgroundColor: '#f59e0b', borderRadius: '2px 2px 0 0' }} />
                    <div style={{ width: '12px', height: `${simH}%`, backgroundColor: '#ef4444', borderRadius: '2px 2px 0 0' }} />
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center', whiteSpace: 'nowrap' }}>
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

