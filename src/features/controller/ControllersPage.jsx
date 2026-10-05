import React, { useState } from 'react';
import ControllerHeader from './components/ControllerHeader';
import ControllerKPICards from './components/ControllerKPICards';
import ControllerToolbar from './components/ControllerToolbar';
import RecommendationList from './components/RecommendationList';
import SelectedRecommendation from './components/SelectedRecommendation';
import ImpactPreviewChart from './components/ImpactPreviewChart';

const INITIAL_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    priority: 'High',
    route: 'B21',
    routeBg: '#EF4444',
    title: 'Hold at Vadapalani',
    description: 'Stabilize headway and reduce bunching',
    timeDelta: '+4 min',
    busesAffected: '3 buses affected',
    impact: 'High impact',
    impactMetrics: {
      headwayImprovement: '-4 min',
      busesAffected: 3,
      onTimePerformance: '+18%'
    },
    rationales: [
      'Ahead bus is 5 min early, next bus is 8 min behind schedule.',
      'High passenger load between Vadapalani - Ashok Nagar.',
      'Holding for 4 minutes will stabilize headway and reduce bunching risk.'
    ]
  },
  {
    id: 'rec-2',
    priority: 'Medium',
    route: 'B14',
    routeBg: '#F59E0B',
    title: 'Short Turn at CMBT',
    description: 'Manage increased demand towards Anna Nagar',
    timeDelta: '+3 min',
    busesAffected: '2 buses affected',
    impact: 'Moderate impact',
    impactMetrics: {
      headwayImprovement: '-3 min',
      busesAffected: 2,
      onTimePerformance: '+12%'
    },
    rationales: [
      'Heavy crowd accumulation at Koyambedu (CMBT) hub.',
      'Turning B14 early preserves schedule stability towards Anna Nagar corridor.',
      'Prevents trailing bus overload during peak rush.'
    ]
  },
  {
    id: 'rec-3',
    priority: 'Medium',
    route: 'B33',
    routeBg: '#00E5A3',
    title: 'Dispatch Additional Bus',
    description: 'Fill gap due to incident near Ashok Nagar',
    timeDelta: '-6 min',
    busesAffected: 'High demand',
    impact: 'Moderate impact',
    impactMetrics: {
      headwayImprovement: '-6 min',
      busesAffected: 4,
      onTimePerformance: '+15%'
    },
    rationales: [
      'Incident near Ashok Nagar caused 12-minute gap on Route B33.',
      'Additional standby bus dispatch restores 6-min target headway.',
      'Improves passenger satisfaction during morning rush hour.'
    ]
  },
  {
    id: 'rec-4',
    priority: 'Low',
    route: 'B40',
    routeBg: '#3B82F6',
    title: 'Adjust Departure Time',
    description: 'Align with actual traffic conditions',
    timeDelta: '+1 min',
    busesAffected: 'No current impact',
    impact: 'Low impact',
    impactMetrics: {
      headwayImprovement: '-1 min',
      busesAffected: 1,
      onTimePerformance: '+5%'
    },
    rationales: [
      'Minor speed decay detected along Mount Road segment.',
      'Adjusting departure time by 1 minute prevents downstream bottleneck.',
      'Proactive schedule alignment.'
    ]
  },
  {
    id: 'rec-5',
    priority: 'Low',
    route: 'B12',
    routeBg: '#00E5A3',
    title: 'Reroute via 100 Feet Road',
    description: 'Avoid congestion near T. Nagar',
    timeDelta: '-5 min',
    busesAffected: '1 bus affected',
    impact: 'Low impact',
    impactMetrics: {
      headwayImprovement: '-5 min',
      busesAffected: 1,
      onTimePerformance: '+8%'
    },
    rationales: [
      'Severe traffic bottleneck near T. Nagar Bus Terminus.',
      'Rerouting via 100 Feet Road bypasses signal delay by 5 minutes.',
      'Ensures on-time arrival at Kodambakkam junction.'
    ]
  }
];

const INITIAL_ACTIVE_CONTROLS = [
  { id: 'act-1', busId: 'B14', route: 'B14', action: 'Hold', stop: 'S04 (Anna Nagar)', remaining: '28s', appliedAt: '10:20 AM', status: 'APPLIED' },
  { id: 'act-2', busId: 'B18', route: 'B21', action: 'Hold', stop: 'S08 (Vadapalani)', remaining: '45s', appliedAt: '10:22 AM', status: 'APPLIED' },
  { id: 'act-3', busId: 'B15', route: 'B33', action: 'Speed Adjust', stop: 'S02 (T. Nagar)', remaining: '12s', appliedAt: '10:23 AM', status: 'APPLIED' }
];

export default function ControllersPage() {
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const [activeControlsList, setActiveControlsList] = useState(INITIAL_ACTIVE_CONTROLS);
  const [historyList, setHistoryList] = useState([
    { id: 'h-1', time: '10:15 AM', bus: 'B16', action: 'Hold 45s at Vadapalani', status: 'COMPLETED', result: 'Recovered headway to 5.2m' },
    { id: 'h-2', time: '10:10 AM', bus: 'B14', action: 'Short Turn at CMBT', status: 'COMPLETED', result: 'Prevented 14m bunching gap' }
  ]);

  const [selectedRecommendation, setSelectedRecommendation] = useState(INITIAL_RECOMMENDATIONS[0]);
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' | 'active' | 'history'
  const [selectedRoute, setSelectedRoute] = useState('All Routes');
  const [autoMode, setAutoMode] = useState(false);
  const [sortBy, setSortBy] = useState('priority');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filter recommendations by selected route
  const filteredRecommendations = recommendations.filter((rec) => {
    if (selectedRoute === 'All Routes') return true;
    return rec.route === selectedRoute;
  });

  // Sort recommendations
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { High: 1, Medium: 2, Low: 3 };
      return (order[a.priority] || 4) - (order[b.priority] || 4);
    }
    if (sortBy === 'route') {
      return a.route.localeCompare(b.route);
    }
    return 0;
  });

  // Handle Approve action
  const handleApprove = (recToApprove) => {
    const target = recToApprove || selectedRecommendation;
    if (!target) return;

    // Remove from pending recommendations
    const updated = recommendations.filter((r) => r.id !== target.id);
    setRecommendations(updated);

    // Add to Active Controls
    const newActive = {
      id: `act-${Date.now()}`,
      busId: target.route,
      route: target.route,
      action: target.title,
      stop: 'Vadapalani Terminus',
      remaining: '60s',
      appliedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'APPLIED'
    };
    setActiveControlsList((prev) => [newActive, ...prev]);

    // Add to History
    setHistoryList((prev) => [
      {
        id: `hist-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        bus: target.route,
        action: `${target.title} (${target.route})`,
        status: 'APPROVED',
        result: 'Hold applied successfully'
      },
      ...prev
    ]);

    // Select next available recommendation
    if (updated.length > 0) {
      setSelectedRecommendation(updated[0]);
    } else {
      setSelectedRecommendation(null);
    }

    showToast(`Approved: ${target.title} (${target.route})`, 'success');
  };

  // Handle Reject action
  const handleReject = (recToReject) => {
    const target = recToReject || selectedRecommendation;
    if (!target) return;

    // Remove from pending
    const updated = recommendations.filter((r) => r.id !== target.id);
    setRecommendations(updated);

    // Add to History
    setHistoryList((prev) => [
      {
        id: `hist-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        bus: target.route,
        action: `${target.title} (${target.route})`,
        status: 'REJECTED',
        result: 'No simulation effect'
      },
      ...prev
    ]);

    // Select next available
    if (updated.length > 0) {
      setSelectedRecommendation(updated[0]);
    } else {
      setSelectedRecommendation(null);
    }

    showToast(`Rejected: ${target.title} (${target.route})`, 'error');
  };

  const handleAutoModeToggle = () => {
    const nextVal = !autoMode;
    setAutoMode(nextVal);
    showToast(nextVal ? 'Auto Mode ENABLED — Controller actions auto-applied.' : 'Auto Mode DISABLED — Operator manual approval required.', 'info');
  };

  return (
    <div style={{ paddingBottom: '2rem', minWidth: 0, position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100,
            backgroundColor:
              toastMessage.type === 'error'
                ? '#EF4444'
                : toastMessage.type === 'info'
                ? '#06B6D4'
                : '#00E5A3',
            color: '#070C18',
            padding: '0.875rem 1.5rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.875rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          <span>{toastMessage.type === 'error' ? '✖' : toastMessage.type === 'info' ? 'ℹ️' : '✔'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <ControllerHeader />

      {/* KPI Cards */}
      <ControllerKPICards
        activeControls={12 + activeControlsList.length - INITIAL_ACTIVE_CONTROLS.length}
        pendingDecisions={recommendations.length}
      />

      {/* Toolbar & Tabs */}
      <ControllerToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={recommendations.length}
        activeCount={12 + activeControlsList.length - INITIAL_ACTIVE_CONTROLS.length}
        selectedRoute={selectedRoute}
        onRouteFilterChange={setSelectedRoute}
        autoMode={autoMode}
        onAutoModeToggle={handleAutoModeToggle}
      />

      {/* Main Content Area */}
      {activeTab === 'recommendations' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
            gap: '1.25rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Recommendations List */}
          <RecommendationList
            recommendations={sortedRecommendations}
            selectedRecommendation={selectedRecommendation}
            onSelectRecommendation={setSelectedRecommendation}
            onApprove={handleApprove}
            onReject={handleReject}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Right Column: Selected Recommendation Details & Impact Preview Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <SelectedRecommendation
              recommendation={selectedRecommendation}
              onApprove={handleApprove}
              onReject={handleReject}
            />

            <ImpactPreviewChart recommendation={selectedRecommendation} />
          </div>
        </div>
      )}

      {/* Active Controls Tab View */}
      {activeTab === 'active' && (
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Active Control Actions ({activeControlsList.length})
            </h2>
            <span style={{ fontSize: '0.8125rem', color: '#00E5A3', fontWeight: 600 }}>● Live Kinematic Enforcement</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#94A3B8' }}>
                  <th style={{ padding: '0.75rem' }}>Bus ID</th>
                  <th style={{ padding: '0.75rem' }}>Route</th>
                  <th style={{ padding: '0.75rem' }}>Control Action</th>
                  <th style={{ padding: '0.75rem' }}>Location / Stop</th>
                  <th style={{ padding: '0.75rem' }}>Applied At</th>
                  <th style={{ padding: '0.75rem' }}>Hold Timer</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeControlsList.map((ctrl) => (
                  <tr key={ctrl.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', color: '#F8FAFC' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#00E5A3' }}>{ctrl.busId}</td>
                    <td style={{ padding: '0.75rem' }}>{ctrl.route}</td>
                    <td style={{ padding: '0.75rem' }}>{ctrl.action}</td>
                    <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{ctrl.stop}</td>
                    <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{ctrl.appliedAt}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>{ctrl.remaining}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ backgroundColor: 'rgba(0, 229, 163, 0.15)', color: '#00E5A3', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {ctrl.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Control History Tab View */}
      {activeTab === 'history' && (
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 1rem 0' }}>
            Control Action History Log
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#94A3B8' }}>
                  <th style={{ padding: '0.75rem' }}>Timestamp</th>
                  <th style={{ padding: '0.75rem' }}>Target Bus</th>
                  <th style={{ padding: '0.75rem' }}>Action Executed</th>
                  <th style={{ padding: '0.75rem' }}>Operator Action</th>
                  <th style={{ padding: '0.75rem' }}>Observed Result</th>
                </tr>
              </thead>
              <tbody>
                {historyList.map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', color: '#F8FAFC' }}>
                    <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{h.time}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>{h.bus}</td>
                    <td style={{ padding: '0.75rem' }}>{h.action}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        style={{
                          backgroundColor: h.status === 'APPROVED' ? 'rgba(0, 229, 163, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: h.status === 'APPROVED' ? '#00E5A3' : '#EF4444',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#CBD5E1' }}>{h.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
