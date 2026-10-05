export const MOCK_DASHBOARD_DATA = {
  header: {
    title: 'Operations Dashboard',
    subtitle: 'Real-time overview of bus operations and service regularity',
    date: 'Wed, 24 Jul 2024',
    time: '10:24 AM',
    simulationStatus: 'Simulation Running'
  },
  kpis: [
    {
      id: 'buses-running',
      type: 'bus',
      value: '42',
      label: 'Buses Running',
      trend: '↑ 87% from last hour',
      trendColor: '#10b981',
      accentColor: '#10b981',
      bgTint: 'rgba(16, 185, 129, 0.12)'
    },
    {
      id: 'bunching-risks',
      type: 'bunching',
      value: '3',
      label: 'Bunching Risks',
      trend: '↑ 1 new',
      trendColor: '#f59e0b',
      accentColor: '#f59e0b',
      bgTint: 'rgba(245, 158, 11, 0.12)'
    },
    {
      id: 'major-incident',
      type: 'incident',
      value: '1',
      label: 'Major Incident',
      status: 'Ongoing',
      statusColor: '#ef4444',
      accentColor: '#ef4444',
      bgTint: 'rgba(239, 68, 68, 0.15)'
    },
    {
      id: 'route-regularity',
      type: 'regularity',
      value: '89%',
      label: 'Route Regularity',
      trend: '↑ 6% from yesterday',
      trendColor: '#10b981',
      accentColor: '#10b981',
      bgTint: 'rgba(16, 185, 129, 0.12)'
    }
  ],
  routeOverview: {
    routeName: 'Route 21G',
    routeSpan: 'Anna Nagar → T. Nagar',
    incident: {
      title: 'Traffic Congestion',
      delay: '+5 min delay',
      x: 485,
      y: 155
    },
    stops: [
      { id: 'AN', name: 'Anna Nagar', fullName: 'Anna Nagar (Terminal)', x: 95, y: 155, isTerminal: true },
      { id: 'TP', name: 'Tower Park', fullName: 'Tower Park', x: 190, y: 195 },
      { id: 'SN', name: 'Shenoy Nagar', fullName: 'Shenoy Nagar', x: 285, y: 235 },
      { id: 'CM', name: 'CMBT', fullName: 'CMBT', x: 375, y: 260 },
      { id: 'AR', name: 'Arumbakkam', fullName: 'Arumbakkam', x: 450, y: 275 },
      { id: 'VD', name: 'Vadapalani', fullName: 'Vadapalani', x: 520, y: 295 },
      { id: 'AN2', name: 'Ashok Nagar', fullName: 'Ashok Nagar', x: 600, y: 310 },
      { id: 'KK', name: 'KK Nagar', fullName: 'KK Nagar', x: 680, y: 290 },
      { id: 'TN', name: 'T. Nagar', fullName: 'T. Nagar (Terminal)', x: 780, y: 260, isTerminal: true }
    ],
    mapLabels: [
      { name: 'Kilpauk', x: 350, y: 185 },
      { name: 'Aminjikarai', x: 395, y: 228 },
      { name: 'Nungambakkam', x: 535, y: 235 },
      { name: 'KK Nagar', x: 708, y: 270 },
      { name: 'Chennai', x: 760, y: 135, isWatermark: true }
    ],
    buses: [
      { id: 'B1', status: 'NORMAL', color: '#38bdf8', stopId: 'TP', x: 190, y: 195 },
      { id: 'B14', status: 'AT_RISK', color: '#f59e0b', stopId: 'SN', x: 285, y: 235 },
      { id: 'B21', status: 'SEVERE_DELAY', color: '#ef4444', stopId: 'VD', x: 485, y: 285 },
      { id: 'B33', status: 'RECOVERED', color: '#10b981', stopId: 'AN2', x: 600, y: 310 },
      { id: 'B40', status: 'NORMAL', color: '#38bdf8', stopId: 'KK', x: 720, y: 275 }
    ]
  },
  controlActions: [
    {
      id: 'ca-1',
      busId: 'B14',
      status: 'AT_RISK',
      color: '#f59e0b',
      action: 'Hold at Shenoy Nagar',
      duration: '18 sec'
    },
    {
      id: 'ca-2',
      busId: 'B21',
      status: 'SEVERE_DELAY',
      color: '#ef4444',
      action: 'Monitor closely'
    },
    {
      id: 'ca-3',
      busId: 'B33',
      status: 'RECOVERED',
      color: '#10b981',
      action: 'Back on schedule'
    }
  ],
  serviceHealth: {
    targetHeadway: {
      label: 'Target Headway',
      value: '4.0 min'
    },
    averageHeadway: {
      label: 'Average Headway',
      value: '4.3 min',
      trend: '↓ 12%',
      trendColor: '#10b981'
    },
    onTimePerformance: {
      label: 'On-Time Performance',
      value: '89%',
      trend: '↑ 6%',
      trendColor: '#10b981'
    },
    routeRecoveryStatus: {
      label: 'Route Recovery Status',
      value: 'Good',
      valueColor: '#10b981',
      subtitle: 'Most delays under control'
    }
  },
  routeProgress: {
    routeName: 'Route Progress (21G)',
    distance: '12.5 km',
    stopsCount: '12 stops',
    headway: 'Target headway: 4.0 min',
    stops: [
      { id: 'p-1', name: 'Anna Nagar', isTerminal: true },
      { id: 'p-2', name: 'Tower Park', bus: { id: 'B1', status: 'NORMAL', color: '#38bdf8' } },
      { id: 'p-3', name: 'Shenoy Nagar', bus: { id: 'B14', status: 'AT_RISK', color: '#f59e0b' } },
      { id: 'p-4', name: 'CMBT' },
      { id: 'p-5', name: 'Arumbakkam' },
      { id: 'p-6', name: 'Vadapalani', bus: { id: 'B21', status: 'SEVERE_DELAY', color: '#ef4444' } },
      { id: 'p-7', name: 'Ashok Nagar', bus: { id: 'B33', status: 'RECOVERED', color: '#10b981' } },
      { id: 'p-8', name: 'KK Nagar', bus: { id: 'B40', status: 'NORMAL', color: '#38bdf8' } },
      { id: 'p-9', name: 'T. Nagar', isTerminal: true }
    ]
  }
};
