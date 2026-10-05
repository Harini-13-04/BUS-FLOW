import React, { useState, useEffect } from 'react';
import AnalyticsHeader from './components/AnalyticsHeader';
import AnalyticsKPICards from './components/AnalyticsKPICards';
import AnalyticsFilterBar from './components/AnalyticsFilterBar';
import TripTrendsChart from './components/TripTrendsChart';
import PassengerLoadChart from './components/PassengerLoadChart';
import RoutePerformanceTable from './components/RoutePerformanceTable';
import DelayCausesChart from './components/DelayCausesChart';
import GeographicalHeatmap from './components/GeographicalHeatmap';
import TopBusiestRoutes from './components/TopBusiestRoutes';
import { initialAnalyticsData, getFilteredAnalyticsData } from './data/mockAnalyticsData';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [filters, setFilters] = useState({
    route: 'All Routes',
    timePeriod: 'Last 7 Days',
    metric: 'All Metrics',
    region: 'All Regions'
  });

  const [analyticsData, setAnalyticsData] = useState(initialAnalyticsData);
  const [toastMessage, setToastMessage] = useState(null);

  // Optional backend API integration
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/analytics/summary')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Backend offline');
      })
      .then((backendSummary) => {
        if (backendSummary && backendSummary.total_trips) {
          setAnalyticsData((prev) => ({
            ...prev,
            kpis: {
              ...prev.kpis,
              totalTrips: { ...prev.kpis.totalTrips, value: backendSummary.total_trips.toLocaleString() },
              passengersServed: { ...prev.kpis.passengersServed, value: `${(backendSummary.total_passengers / 100000).toFixed(1)} L` },
              onTimePerformance: { ...prev.kpis.onTimePerformance, value: `${backendSummary.on_time_pct}%` }
            }
          }));
        }
      })
      .catch(() => {
        // Quietly fallback to mock analytics data
      });
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const updated = getFilteredAnalyticsData(filters);
    setAnalyticsData(updated);

    setToastMessage(`Filters Applied: ${filters.route} | ${filters.timePeriod} | ${filters.region}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div style={{ paddingBottom: '2.5rem', minWidth: 0 }}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100,
            backgroundColor: '#00E5A3',
            color: '#070C18',
            padding: '0.875rem 1.5rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.875rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem'
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <AnalyticsHeader dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* KPI Cards */}
      <AnalyticsKPICards kpis={analyticsData.kpis} />

      {/* Filter Bar */}
      <AnalyticsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
      />

      {/* Main Grid Section 1: Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1rem'
        }}
      >
        <TripTrendsChart data={analyticsData.tripTrends} />
        <PassengerLoadChart data={analyticsData.passengerLoadDistribution} />
      </div>

      {/* Main Grid Section 2: Performance, Delay Causes & Busiest Routes (Compact Row) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1rem',
          alignItems: 'start'
        }}
      >
        <RoutePerformanceTable data={analyticsData.routePerformance} />
        <DelayCausesChart data={analyticsData.delayCauses} totalIncidents={analyticsData.kpis.incidents.raw} />
        <TopBusiestRoutes data={analyticsData.topBusiestRoutes} />
      </div>

      {/* Main Grid Section 3: Geographical Heatmap (Positioned Immediately Below Section 2) */}
      <GeographicalHeatmap heatmapPoints={analyticsData.heatmapPoints} />
    </div>
  );
}
