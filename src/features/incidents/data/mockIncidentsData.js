// Simulated dataset for Incidents Module matching reference image 1
// Note: All values are illustrative sample data for frontend demo purposes.

export const INITIAL_MOCK_INCIDENTS = [
  {
    id: 'INC-B14-STALL',
    routeId: 'Route B14',
    busId: 'B14',
    title: 'Traffic Congestion',
    severityBadge: 'Major',
    severityStatus: 'SEVERE_DELAY',
    reportedTime: '10:18 AM',
    location: 'Vadapalani - Ashok Nagar',
    affectsText: 'Affects B21, B23, B24',
    affectedBusBadges: [
      { id: 'B21', color: '#ef4444' },
      { id: 'B23', color: '#2563eb' },
      { id: 'B24', color: '#f59e0b' }
    ],
    cause: 'Heavy traffic due to road work',
    impact: 'Average delay: 5-8 min',
    currentStatus: 'Ongoing',
    detectedAt: '10:18 AM (AI Detection)',
    description: 'Bus B14 reported a temporary 5.0-minute vehicle stall near Tech Park / Vadapalani. Creates trailing headway gap and bunching risk [Simulated].',
    iconType: 'warning',
    borderAccent: '#ef4444',
    timeline: [
      { time: '10:18 AM', event: 'Incident Detected [Simulated]', isDone: true },
      { time: '10:19 AM', event: 'Impact Analyzed [Simulated]', isDone: true },
      { time: '10:20 AM', event: 'Recommendations Generated [Simulated]', isDone: true },
      { time: '---', event: 'Under Resolution', isDone: false },
      { time: '---', event: 'Resolved', isDone: false }
    ],
    recommendedActions: [
      {
        id: 'ACT-01',
        icon: '🚌',
        title: 'Hold B21 at Vadapalani',
        subtitle: 'Stabilize headway, avoid bunching',
        note: 'Mock Recommendation [Illustrative Only]',
        buttonText: 'Apply'
      },
      {
        id: 'ACT-02',
        icon: '🛣️',
        title: 'Divert B23 via 100 Feet Road',
        subtitle: 'Estimated saving: 6 min',
        note: 'Mock Recommendation [Illustrative Only]',
        buttonText: 'Apply'
      },
      {
        id: 'ACT-03',
        icon: 'ℹ️',
        title: 'Notify Passengers',
        subtitle: 'Send delay alert for B21, B23, B24',
        note: 'Mock Recommendation [Illustrative Only]',
        buttonText: 'Apply'
      }
    ],
    isDemoResolved: false
  },
  {
    id: 'INC-B14-BUNCHING',
    routeId: 'Route B14',
    busId: 'B14',
    title: 'Bunching Risk',
    severityBadge: 'Moderate',
    severityStatus: 'AT_RISK',
    reportedTime: '10:20 AM',
    location: 'Shenoy Nagar',
    affectsText: 'Bus B14 (Headway: 41 sec)',
    affectedBusBadges: [
      { id: 'B14', color: '#f59e0b' }
    ],
    cause: 'Stall recovery headway compression',
    impact: 'Headway reduction < 1 min',
    currentStatus: 'Under Resolution',
    detectedAt: '10:20 AM (AI Detection)',
    description: 'Trailing gap compression behind B14 stall event [Simulated].',
    iconType: 'bunching',
    borderAccent: '#f59e0b',
    timeline: [
      { time: '10:20 AM', event: 'Bunching Risk Detected [Simulated]', isDone: true },
      { time: '10:21 AM', event: 'Strategy Recommended [Simulated]', isDone: true }
    ],
    recommendedActions: [
      {
        id: 'ACT-04',
        icon: '🚌',
        title: 'Hold B12 (+3 min)',
        subtitle: 'Absorb trailing gap',
        note: 'Mock Action [Simulated]',
        buttonText: 'Apply'
      }
    ],
    isDemoResolved: false
  },
  {
    id: 'INC-B21-DELAY',
    routeId: 'Route B14',
    busId: 'B21',
    title: 'Bus Delay',
    severityBadge: 'Moderate',
    severityStatus: 'SEVERE_DELAY',
    reportedTime: '10:15 AM',
    location: 'Anna Nagar',
    affectsText: 'Bus B21 (+4 min)',
    affectedBusBadges: [
      { id: 'B21', color: '#ef4444' }
    ],
    cause: 'Corridor traffic bottleneck',
    impact: 'Delay: 4 min',
    currentStatus: 'Ongoing',
    detectedAt: '10:15 AM (AI Detection)',
    description: 'Minor schedule delay due to corridor congestion [Simulated].',
    iconType: 'delay',
    borderAccent: '#ef4444',
    timeline: [
      { time: '10:15 AM', event: 'Delay Detected [Simulated]', isDone: true }
    ],
    recommendedActions: [],
    isDemoResolved: false
  }
];
