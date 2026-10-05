// Simulated dataset for Simulation Control Room
// Note: All values are illustrative sample data for frontend demo purposes.

export const MOCK_SIMULATION_SCENARIOS = [
  {
    id: 'SCENARIO_B14_HOLD',
    name: 'Primary: Route B14 Stall Recovery via Bus B12 Hold',
    description: 'Simulates applying a 3.0-minute holding action on preceding Bus B12 to balance spacing following Bus B14 stall [Simulated]',
    recommendedAction: 'Mock Recommendation (Illustrative Only): Apply 3.0 min holding strategy on preceding Bus B12 at Stop 4 (Tech Park) to absorb the trailing headway gap [Simulated].',
    baselineMetrics: {
      headwayVarianceMin: 6.8,
      bunchingRisk: 'HIGH [Simulated]',
      excessPassengerWaitMin: 4.2,
      fleetRecoveryTimeMin: 22.0
    },
    simulatedMetrics: {
      headwayVarianceMin: 1.9,
      bunchingRisk: 'LOW [Simulated]',
      excessPassengerWaitMin: 1.1,
      fleetRecoveryTimeMin: 8.5
    },
    passengerLoads: [
      { busId: 'B10', loadPct: 45, status: 'NORMAL' },
      { busId: 'B12', loadPct: 62, status: 'NORMAL' },
      { busId: 'B14', loadPct: 88, status: 'SEVERE_DELAY' }, // Heavy load due to stall
      { busId: 'B15', loadPct: 84, status: 'AT_RISK' },      // Catching up behind stall
      { busId: 'B18', loadPct: 50, status: 'NORMAL' }
    ],
    bunchingRiskData: {
      gapB12_B14: { baseline: '14.5m Gap', simulated: '8.2m Gap [Balanced]' },
      gapB14_B15: { baseline: '3.1m Gap (Bunching)', simulated: '7.8m Gap [Normal]' }
    },
    busImpacts: [
      { id: 'B10', role: 'Ahead', beforeDelay: 0, afterDelay: 0, loadPct: 45, status: 'NORMAL', action: 'None' },
      { id: 'B12', role: 'Preceding (Target Hold)', beforeDelay: 1, afterDelay: 4, loadPct: 62, status: 'AT_RISK', action: 'Hold +3.0m [Mock]' },
      { id: 'B14', role: 'Stalled Vehicle', beforeDelay: 5, afterDelay: 5, loadPct: 88, status: 'SEVERE_DELAY', action: 'Engine Reset [Mock]' },
      { id: 'B15', role: 'Trailing (Bunching Risk)', beforeDelay: 3, afterDelay: 1, loadPct: 84, status: 'NORMAL', action: 'Speed Adjust [Mock]' },
      { id: 'B18', role: 'Following', beforeDelay: 0, afterDelay: 0, loadPct: 50, status: 'NORMAL', action: 'None' }
    ]
  },
  {
    id: 'SCENARIO_B14_SKIP',
    name: 'Alternate: Route B14 Express Skip Strategy',
    description: 'Simulates instructing Bus B14 to skip Stop 4 once restarted to recover schedule alignment [Simulated]',
    recommendedAction: 'Mock Recommendation (Illustrative Only): Instruct Bus B14 to perform express stop-skip at Stop 4 (Tech Park) once vehicle restarts [Simulated].',
    baselineMetrics: {
      headwayVarianceMin: 6.8,
      bunchingRisk: 'HIGH [Simulated]',
      excessPassengerWaitMin: 4.2,
      fleetRecoveryTimeMin: 22.0
    },
    simulatedMetrics: {
      headwayVarianceMin: 2.8,
      bunchingRisk: 'MODERATE [Simulated]',
      excessPassengerWaitMin: 2.0,
      fleetRecoveryTimeMin: 11.0
    },
    passengerLoads: [
      { busId: 'B10', loadPct: 45, status: 'NORMAL' },
      { busId: 'B12', loadPct: 62, status: 'NORMAL' },
      { busId: 'B14', loadPct: 78, status: 'AT_RISK' },
      { busId: 'B15', loadPct: 84, status: 'NORMAL' },
      { busId: 'B18', loadPct: 50, status: 'NORMAL' }
    ],
    bunchingRiskData: {
      gapB12_B14: { baseline: '14.5m Gap', simulated: '9.0m Gap' },
      gapB14_B15: { baseline: '3.1m Gap (Bunching)', simulated: '6.2m Gap' }
    },
    busImpacts: [
      { id: 'B10', role: 'Ahead', beforeDelay: 0, afterDelay: 0, loadPct: 45, status: 'NORMAL', action: 'None' },
      { id: 'B12', role: 'Preceding', beforeDelay: 1, afterDelay: 1, loadPct: 62, status: 'NORMAL', action: 'None' },
      { id: 'B14', role: 'Stalled Vehicle', beforeDelay: 5, afterDelay: 2, loadPct: 78, status: 'AT_RISK', action: 'Express Skip Stop 4 [Mock]' },
      { id: 'B15', role: 'Trailing', beforeDelay: 3, afterDelay: 1, loadPct: 84, status: 'NORMAL', action: 'Normal' },
      { id: 'B18', role: 'Following', beforeDelay: 0, afterDelay: 0, loadPct: 50, status: 'NORMAL', action: 'None' }
    ]
  }
];

export const SAVED_INTERVENTIONS = [
  {
    id: 'SAVED_01',
    title: 'Standard Peak Headway Hold',
    date: '2026-10-04',
    route: 'Route B14',
    type: 'Holding Intervention',
    status: 'Illustrative Template'
  },
  {
    id: 'SAVED_02',
    title: 'Express Skip Fallback',
    date: '2026-10-04',
    route: 'Route B14',
    type: 'Stop Skip Intervention',
    status: 'Illustrative Template'
  }
];
