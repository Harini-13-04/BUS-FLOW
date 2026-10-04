import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import KPICard from '../components/shared/KPICard';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Public Navbar */}
      <header
        style={{
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          padding: '1rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Logo & TNSTC Context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-recovered)',
                color: '#0b0f17',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.125rem'
              }}
            >
              BF
            </div>
            <div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                BUSFLOW
                <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-recovered)', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>
                  TNSTC
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Tamil Nadu State Transport Corporation
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontSize: '0.9375rem', fontWeight: 500 }}>
            <a href="#home" style={{ color: 'var(--text-primary)' }}>Home</a>
            <Link to="/about" style={{ color: 'var(--text-secondary)' }}>About</Link>
            <a href="#features" style={{ color: 'var(--text-secondary)' }}>Features</a>
            <a href="#contact" style={{ color: 'var(--text-secondary)' }}>Contact</a>
          </nav>

          {/* Action CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button variant="secondary" size="md" onClick={() => navigate('/dashboard')}>
              Control Center Login
            </Button>
            <Button variant="primary" size="md" onClick={() => navigate('/dashboard')} style={{ backgroundColor: 'var(--color-recovered)', color: '#0b0f17', fontWeight: 700 }}>
              Launch System →
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', flex: 1, width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Hero Text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-surface-secondary)', border: '1px solid var(--border-light)', padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', color: 'var(--color-recovered)', fontWeight: 600, marginBottom: '1.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-recovered)', animation: 'pulse 2s infinite' }}></span>
              Tamil Nadu Intelligent Transit System
            </div>

            <h1 style={{ fontSize: '3.25rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Keep buses moving.<br />
              <span style={{ color: 'var(--color-recovered)' }}>Keep passengers waiting less.</span>
            </h1>

            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '540px' }}>
              An intelligent headway management platform that detects bus bunching, predicts disruptions, and dynamically balances bus spacing across urban & intercity transit routes.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/dashboard')}
                style={{ backgroundColor: 'var(--color-recovered)', color: '#0b0f17', fontWeight: 700, padding: '0.875rem 1.75rem' }}
              >
                Launch Control Center 🚀
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/simulation')}
                style={{ padding: '0.875rem 1.5rem' }}
              >
                Explore Simulation 🔄
              </Button>
            </div>

            {/* Demo KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>12</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Routes</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-normal)' }}>47</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Buses</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-severe-delay)' }}>3</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Incidents</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-at-risk)' }}>8</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Bunching Risks</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Graphic */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Graphic Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>🚌</span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Route 21G • Broadway ↔ Tambaram</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-Time Headway Monitor</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-at-risk-bg)', color: 'var(--color-at-risk)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                  STABILIZING
                </span>
              </div>

              {/* Headway Visualization Graphic */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Bus 1 */}
                <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-recovered)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Bus #TN01-N-2481 (Lead)</span>
                    <span style={{ color: 'var(--color-recovered)', fontWeight: 600 }}>Headway: 10 min (Normal)</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--color-recovered)' }}></div>
                  </div>
                </div>

                {/* Bus 2 (Bunching Risk) */}
                <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-at-risk)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Bus #TN01-N-2495 (Following)</span>
                    <span style={{ color: 'var(--color-at-risk)', fontWeight: 600 }}>Headway: 3 min (Bunching Risk)</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '30%', height: '100%', backgroundColor: 'var(--color-at-risk)' }}></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Recommended Holding Action:</span>
                    <span style={{ color: 'var(--color-at-risk)', fontWeight: 700 }}>HOLD +90s at Guindy Stop</span>
                  </div>
                </div>

                {/* Bus 3 */}
                <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-normal)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Bus #TN01-N-2510 (Trailing)</span>
                    <span style={{ color: 'var(--color-normal)', fontWeight: 600 }}>Headway: 9 min (On Schedule)</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '75%', height: '100%', backgroundColor: 'var(--color-normal)' }}></div>
                  </div>
                </div>

              </div>

              {/* Graphic Footer badge */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ⚡ Automatic Headway Regularity Score: <strong style={{ color: 'var(--color-recovered)' }}>94% Target Maintained</strong>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Workflow Section */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderVertical: '1px solid var(--border-color)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-recovered)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Core Operational Story
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
            Closed-Loop Transit Control Engine
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              { step: '01', title: 'Detect', desc: 'Real-time GPS & headway gap tracking' },
              { step: '02', title: 'Predict', desc: 'AI bunching & delay risk forecasting' },
              { step: '03', title: 'Decide', desc: 'Passenger-aware holding recommendation' },
              { step: '04', title: 'Control', desc: 'Human controller dispatch & approval' },
              { step: '05', title: 'Recover', desc: 'Disruption mitigation & gap recovery' },
              { step: '06', title: 'Measure', desc: 'Headway regularity & EWT metrics' }
            ].map((s) => (
              <div key={s.step} style={{ backgroundColor: 'var(--bg-primary)', padding: '1.25rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-recovered)', fontWeight: 800 }}>{s.step}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, margin: '0.25rem 0' }}>{s.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Feature Cards */}
      <section id="features" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Built for Modern Transport Operations
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Empowering Tamil Nadu State Transport Corporation with real-time headway intelligence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          
          <Card title="Prevent Bus Bunching" subtitle="Real-time Spacing Control">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Detect and eliminate uneven bus spacing before bunching cascade occurs, maintaining equal intervals between consecutive vehicles.
            </p>
          </Card>

          <Card title="Passenger-Aware Control" subtitle="Demand-Weighted Decisions">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Evaluate passenger load and waiting stop density to generate holding and dispatch recommendations that minimize total passenger wait times.
            </p>
          </Card>

          <Card title="Data-Driven Decisions" subtitle="Simulation Insights">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Leverage real-time telemetry combined with simulation engines to predict future headway degradation across high-frequency corridors.
            </p>
          </Card>

          <Card title="More Reliable Service" subtitle="Public Transit Regularity">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Transform schedule-adherence operations into headway-regularity control, providing dependable arrival times for urban commuters.
            </p>
          </Card>

        </div>
      </section>

      {/* Public Footer */}
      <footer id="contact" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '2rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>BUSFLOW</strong> — Tamil Nadu State Transport Corporation Headway Control Platform
          </div>
          <div>
            Keep buses moving. Keep passengers waiting less.
          </div>
        </div>
      </footer>

    </div>
  );
}
