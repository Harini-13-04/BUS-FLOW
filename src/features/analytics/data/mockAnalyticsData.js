// Mock Analytics Data Module for BUSFLOW Operations Control Center

export const initialAnalyticsData = {
  kpis: {
    totalTrips: { value: '1,248', raw: 1248, label: 'Total Trips', trend: '↑ 12% vs last week', type: 'cyan' },
    passengersServed: { value: '3.2 L', raw: 320000, label: 'Passengers Served', trend: '↑ 8% vs last week', type: 'blue' },
    onTimePerformance: { value: '92%', raw: 92, label: 'On-Time Performance', trend: '↑ 5% vs last week', type: 'purple' },
    avgTravelTime: { value: '35 min', raw: 35, label: 'Avg. Travel Time', trend: '↓ 8% vs last week', type: 'orange' },
    incidents: { value: '18', raw: 18, label: 'Incidents', trend: '↓ 25% vs last week', type: 'red' }
  },

  tripTrends: [
    { date: '18 Jul', totalTrips: 165, onTimeTrips: 152 },
    { date: '19 Jul', totalTrips: 172, onTimeTrips: 158 },
    { date: '20 Jul', totalTrips: 180, onTimeTrips: 166 },
    { date: '21 Jul', totalTrips: 175, onTimeTrips: 161 },
    { date: '22 Jul', totalTrips: 188, onTimeTrips: 173 },
    { date: '23 Jul', totalTrips: 182, onTimeTrips: 169 },
    { date: '24 Jul', totalTrips: 186, onTimeTrips: 174 }
  ],

  passengerLoadDistribution: [
    { timeSlot: '6–8 AM', passengers: 42000, percentage: 85 },
    { timeSlot: '8–10 AM', passengers: 68000, percentage: 98 },
    { timeSlot: '10 AM–12 PM', passengers: 35000, percentage: 65 },
    { timeSlot: '12–4 PM', passengers: 48000, percentage: 72 },
    { timeSlot: '4–6 PM', passengers: 62000, percentage: 92 },
    { timeSlot: '6–8 PM', passengers: 51000, percentage: 80 },
    { timeSlot: '8–10 PM', passengers: 24000, percentage: 45 }
  ],

  routePerformance: [
    { route: 'B21', onTime: '95%', delay: '2 min', trips: 142, trend: 'Improving ↑', isImproving: true, color: '#EF4444' },
    { route: 'B14', onTime: '88%', delay: '5 min', trips: 128, trend: 'Declining ↓', isImproving: false, color: '#F59E0B' },
    { route: 'B33', onTime: '92%', delay: '3 min', trips: 116, trend: 'Improving ↑', isImproving: true, color: '#00E5A3' },
    { route: 'B40', onTime: '90%', delay: '4 min', trips: 98, trend: 'Stable →', isImproving: null, color: '#3B82F6' },
    { route: 'B12', onTime: '96%', delay: '2 min', trips: 134, trend: 'Improving ↑', isImproving: true, color: '#00E5A3' },
    { route: 'B15', onTime: '91%', delay: '3 min', trips: 110, trend: 'Improving ↑', isImproving: true, color: '#06B6D4' },
    { route: 'B18', onTime: '86%', delay: '6 min', trips: 105, trend: 'Declining ↓', isImproving: false, color: '#8B5CF6' }
  ],

  delayCauses: [
    { cause: 'Traffic Congestion', percentage: 44, count: 8, color: '#EF4444' },
    { cause: 'Vehicle Breakdown', percentage: 22, count: 4, color: '#F59E0B' },
    { cause: 'High Passenger Load', percentage: 17, count: 3, color: '#06B6D4' },
    { cause: 'Weather Conditions', percentage: 11, count: 2, color: '#3B82F6' },
    { cause: 'Others', percentage: 6, count: 1, color: '#8B5CF6' }
  ],

  topBusiestRoutes: [
    { route: 'B21', name: 'Vadapalani - Broadway', passengers: 4320, color: '#EF4444' },
    { route: 'B14', name: 'NGO Colony - CMBT', passengers: 3980, color: '#F59E0B' },
    { route: 'B12', name: 'Anna Nagar - T. Nagar', passengers: 3450, color: '#00E5A3' },
    { route: 'B33', name: 'Ashok Nagar - Central', passengers: 3120, color: '#06B6D4' },
    { route: 'B40', name: 'Tambaram - Guindy', passengers: 2980, color: '#3B82F6' }
  ],

  heatmapPoints: [
    { id: 'h1', name: 'CMBT Koyambedu', x: 28, y: 35, delayLevel: 'HIGH', delayMin: '12 min', busCount: 24, statusColor: '#EF4444' },
    { id: 'h2', name: 'Vadapalani Junction', x: 42, y: 48, delayLevel: 'HIGH', delayMin: '9 min', busCount: 18, statusColor: '#EF4444' },
    { id: 'h3', name: 'T. Nagar Bus Terminus', x: 55, y: 60, delayLevel: 'MEDIUM', delayMin: '6 min', busCount: 22, statusColor: '#F59E0B' },
    { id: 'h4', name: 'Anna Nagar West', x: 32, y: 22, delayLevel: 'LOW', delayMin: '2 min', busCount: 16, statusColor: '#00E5A3' },
    { id: 'h5', name: 'Ashok Nagar Signal', x: 48, y: 68, delayLevel: 'MEDIUM', delayMin: '5 min', busCount: 14, statusColor: '#F59E0B' },
    { id: 'h6', name: 'Adyar Depot', x: 75, y: 78, delayLevel: 'LOW', delayMin: '1 min', busCount: 12, statusColor: '#00E5A3' },
    { id: 'h7', name: 'Chennai Central', x: 82, y: 38, delayLevel: 'HIGH', delayMin: '10 min', busCount: 30, statusColor: '#EF4444' }
  ]
};

// Helper function to dynamically calculate filtered data
export function getFilteredAnalyticsData(filters) {
  const { route, timePeriod, metric, region } = filters;
  let multiplier = 1.0;

  if (route !== 'All Routes') multiplier *= 0.85;
  if (timePeriod === 'Today') multiplier *= 0.15;
  if (timePeriod === 'Yesterday') multiplier *= 0.16;
  if (timePeriod === 'Last 30 Days') multiplier *= 4.2;

  const totalTripsRaw = Math.round(1248 * multiplier);
  const totalPassengers = (3.2 * multiplier).toFixed(1);

  return {
    ...initialAnalyticsData,
    kpis: {
      totalTrips: {
        ...initialAnalyticsData.kpis.totalTrips,
        value: totalTripsRaw.toLocaleString()
      },
      passengersServed: {
        ...initialAnalyticsData.kpis.passengersServed,
        value: `${totalPassengers} L`
      },
      onTimePerformance: {
        ...initialAnalyticsData.kpis.onTimePerformance,
        value: route === 'B21' ? '95%' : route === 'B14' ? '88%' : '92%'
      },
      avgTravelTime: {
        ...initialAnalyticsData.kpis.avgTravelTime,
        value: route === 'B21' ? '32 min' : route === 'B14' ? '38 min' : '35 min'
      },
      incidents: {
        ...initialAnalyticsData.kpis.incidents,
        value: route !== 'All Routes' ? '4' : '18'
      }
    }
  };
}
