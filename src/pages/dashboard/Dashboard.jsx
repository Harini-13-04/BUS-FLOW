import React from 'react';
import { MOCK_DASHBOARD_DATA } from './mockDashboardData';
import DashboardKPI from './DashboardKPI';
import LiveRouteOverview from './LiveRouteOverview';
import ControlActions from './ControlActions';
import ServiceHealth from './ServiceHealth';
import RouteProgress from './RouteProgress';

export default function Dashboard() {
  const { header, kpis, routeOverview, controlActions, serviceHealth, routeProgress } = MOCK_DASHBOARD_DATA;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Dashboard Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '0.2rem'
        }}
      >
        {/* Left: Heading & Subtitle */}
        <div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            {header.title}
          </h1>
          <p
            style={{
              fontSize: '0.8rem',
              color: '#94a3b8',
              margin: '0.2rem 0 0 0',
              fontWeight: 400
            }}
          >
            {header.subtitle}
          </p>
        </div>

        {/* Right: Date | Time | Simulation Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}
        >
          <span>{header.date}</span>
          <span style={{ color: '#2d3748' }}>|</span>
          <span style={{ fontWeight: 700, color: '#ffffff' }}>{header.time}</span>
          <span style={{ color: '#2d3748' }}>|</span>

          {/* Simulation Running Status Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '9999px',
              padding: '0.3rem 0.75rem',
              color: '#34d399',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }}
            />
            <span>{header.simulationStatus}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (Strictly 4 equal columns in 1 row) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1rem'
        }}
        className="dashboard-kpi-row"
      >
        {kpis.map((kpi) => (
          <DashboardKPI key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Row: Left Map (~69%) vs Right Control & Health (~31%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '1rem',
          alignItems: 'stretch'
        }}
        className="dashboard-main-grid"
      >
        {/* Left: Live Route Overview */}
        <LiveRouteOverview routeData={routeOverview} />

        {/* Right: Current Control Actions & Service Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ControlActions actions={controlActions} />
          <ServiceHealth data={serviceHealth} />
        </div>
      </div>

      {/* Route Progress Section (Spanning full width) */}
      <RouteProgress data={routeProgress} />
    </div>
  );
}
