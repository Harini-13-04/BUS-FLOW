// Simulated dataset for Live Map operational view
// Note: All values are illustrative sample data for frontend demo purposes.

export const MOCK_ROUTE_B14_METRICS = {
  routeId: 'Route B14',
  routeName: 'Tamil Nadu Transit Corridor',
  totalBuses: 42,
  onTimeBuses: 38,
  atRiskBuses: 3,
  delayedBuses: 1,
  bunchingRiskLevel: 'ELEVATED [Simulated]',
  stalledBusId: 'B14',
  averageHeadwayMinutes: 8.5,
  dataMode: 'Simulated Demo Data'
};

export const MOCK_STOPS_B14 = [
  { id: 'S1', name: 'Anna Nagar', x: 260, y: 120, labelPos: 'top' },
  { id: 'S2', name: 'Koyambedu Bus Terminus', x: 210, y: 170, labelPos: 'bottom' },
  { id: 'S3', name: 'Vadapalani (Tech Park)', x: 170, y: 140, labelPos: 'top' },
  { id: 'S4', name: 'Guindy', x: 380, y: 220, labelPos: 'bottom' },
  { id: 'S5', name: 'Chennai Airport', x: 290, y: 240, labelPos: 'bottom' }
];

export const MOCK_BUSES_B14 = [
  {
    id: 'B1',
    routeId: 'Route B14',
    status: 'NORMAL',
    speedKmh: 36,
    occupancyPct: 42,
    currentLocation: { x: 440, y: 130 },
    locationName: 'Anna Nagar',
    nextStop: 'Tower Park',
    etaText: '2.1 min',
    headwayGapMinutes: 8.0,
    delayMinutes: 0,
    iconColor: '#2563eb',
    note: 'Operating on schedule [Simulated]'
  },
  {
    id: 'B14',
    routeId: 'Route B14',
    status: 'AT_RISK',
    speedKmh: 0,
    occupancyPct: 78,
    currentLocation: { x: 270, y: 155 },
    locationName: 'Shenoy Nagar',
    nextStop: 'CMBT',
    etaText: '41 sec',
    headwayGapMinutes: 14.5,
    delayMinutes: +5,
    isStalled: true,
    iconColor: '#f59e0b',
    note: 'SIMULATED INCIDENT: 5-minute vehicle stall at Tech Park. Creating trailing headway gap and bunching risk [Illustrative Demo].'
  },
  {
    id: 'B21',
    routeId: 'Route B14',
    status: 'SEVERE_DELAY',
    speedKmh: 12,
    occupancyPct: 88,
    currentLocation: { x: 190, y: 130 },
    locationName: 'Vadapalani',
    nextStop: 'Arumbakkam',
    etaText: '68 sec',
    headwayGapMinutes: 3.1,
    delayMinutes: +4,
    iconColor: '#ef4444',
    note: 'Trailing behind B14 stall — High bunching risk [Simulated]'
  },
  {
    id: 'B33',
    routeId: 'Route B14',
    status: 'NORMAL',
    speedKmh: 32,
    occupancyPct: 54,
    currentLocation: { x: 370, y: 100 },
    locationName: 'Ashok Nagar',
    nextStop: 'KK Nagar',
    etaText: '3.2 min',
    headwayGapMinutes: 8.2,
    delayMinutes: 0,
    iconColor: '#10b981',
    note: 'Operating on schedule [Simulated]'
  },
  {
    id: 'B40',
    routeId: 'Route B14',
    status: 'NORMAL',
    speedKmh: 28,
    occupancyPct: 52,
    currentLocation: { x: 360, y: 220 },
    locationName: 'KK Nagar',
    nextStop: 'T. Nagar',
    etaText: '2.8 min',
    headwayGapMinutes: 9.0,
    delayMinutes: 0,
    iconColor: '#10b981',
    note: 'Operating on schedule [Simulated]'
  },
  {
    id: 'B12',
    routeId: 'Route B14',
    status: 'NORMAL',
    speedKmh: 35,
    occupancyPct: 48,
    currentLocation: { x: 410, y: 270 },
    locationName: 'Velachery',
    nextStop: 'Guindy',
    etaText: '4.5 min',
    headwayGapMinutes: 7.5,
    delayMinutes: 0,
    iconColor: '#10b981',
    note: 'Operating on schedule [Simulated]'
  },
  {
    id: 'B18',
    routeId: 'Route B14',
    status: 'NORMAL',
    speedKmh: 38,
    occupancyPct: 40,
    currentLocation: { x: 120, y: 280 },
    locationName: 'Tambaram',
    nextStop: 'Chromepet',
    etaText: '6.1 min',
    headwayGapMinutes: 8.0,
    delayMinutes: 0,
    iconColor: '#10b981',
    note: 'Operating on schedule [Simulated]'
  },
  {
    id: 'B25',
    routeId: 'Route B14',
    status: 'AT_RISK',
    speedKmh: 22,
    occupancyPct: 62,
    currentLocation: { x: 100, y: 110 },
    locationName: 'Avadi',
    nextStop: 'Ambattur',
    etaText: '2.9 min',
    headwayGapMinutes: 5.2,
    delayMinutes: +2,
    iconColor: '#f59e0b',
    note: 'Minor corridor delay [Simulated]'
  }
];


