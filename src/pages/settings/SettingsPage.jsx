import React, { useState } from 'react';
import './SettingsPage.css';

export default function SettingsPage() {
  // Card 1: User & Access State
  const [operatorName, setOperatorName] = useState('R. Karthik');
  const [email, setEmail] = useState('karthik.r@tnstc.gov.in');
  const [isEditing, setIsEditing] = useState(false);

  // Card 2: System Preferences State
  const [theme, setTheme] = useState('dark');
  const [defaultView, setDefaultView] = useState('Live Map');
  const [autoRefresh, setAutoRefresh] = useState('1 minute');
  const [distanceUnit, setDistanceUnit] = useState('km');

  // Dropdown open states
  const [isDefaultViewOpen, setIsDefaultViewOpen] = useState(false);
  const [isAutoRefreshOpen, setIsAutoRefreshOpen] = useState(false);
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [isMapViewOpen, setIsMapViewOpen] = useState(false);

  // Card 3: Notifications State
  const [notifications, setNotifications] = useState({
    majorIncidents: true,
    routeDelays: true,
    controllerRecommendations: true,
    simulationResults: false,
    systemUpdates: true
  });

  // Card 4: Data & Display State
  const [defaultTimeRange, setDefaultTimeRange] = useState('Last 24 Hours');
  const [mapView, setMapView] = useState('Tamil Nadu (State)');
  const [showRouteLabels, setShowRouteLabels] = useState(true);
  const [showBusIDs, setShowBusIDs] = useState(true);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="settings-page-container">
      {/* Settings Page Heading */}
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage system preferences and operational settings</p>
      </div>

      {/* TOP ROW: 3 Cards */}
      <div className="settings-grid-top">
        {/* CARD 1: User & Access */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              {/* User Avatar Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="settings-card-title-group">
              <h2 className="settings-card-title">User & Access</h2>
              <p className="settings-card-subtitle">Manage your profile and access preferences</p>
            </div>
          </div>

          <div className="user-field-group">
            <div className="user-field">
              <label className="user-field-label">Operator Name</label>
              <input
                type="text"
                className="user-field-input"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
              />
            </div>

            <div className="user-field">
              <label className="user-field-label">Role</label>
              <input
                type="text"
                className="user-field-input read-only"
                value="Control Operator"
                readOnly
              />
            </div>

            <div className="user-field">
              <label className="user-field-label">Email</label>
              <input
                type="email"
                className="user-field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="edit-profile-btn"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* CARD 2: System Preferences */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              {/* Gear Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </div>
            <div className="settings-card-title-group">
              <h2 className="settings-card-title">System Preferences</h2>
              <p className="settings-card-subtitle">Customize your dashboard experience</p>
            </div>
          </div>

          <div className="pref-rows">
            {/* Theme Row */}
            <div className="pref-row">
              <span className="pref-label">Theme</span>
              <div className="pref-theme-group">
                <button
                  type="button"
                  className={`theme-toggle-btn ${theme === 'dark' ? 'active-dark' : 'inactive'}`}
                  onClick={() => setTheme('dark')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  className={`theme-toggle-btn ${theme === 'light' ? 'active-dark' : 'inactive'}`}
                  onClick={() => setTheme('light')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span>Light</span>
                </button>
              </div>
            </div>

            {/* Default View Row */}
            <div className="pref-row">
              <span className="pref-label">Default View</span>
              <div className={`custom-select-wrapper ${isDefaultViewOpen ? 'open' : ''}`}>
                <div
                  className="custom-select-trigger"
                  onClick={() => {
                    setIsDefaultViewOpen(!isDefaultViewOpen);
                    setIsAutoRefreshOpen(false);
                  }}
                >
                  <span>{defaultView}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {isDefaultViewOpen && (
                  <div className="custom-select-menu">
                    {['Live Map', 'Dashboard', 'Simulation', 'Incidents', 'Routes', 'Controllers'].map((opt) => (
                      <div
                        key={opt}
                        className={`custom-select-option ${defaultView === opt ? 'selected' : ''}`}
                        onClick={() => {
                          setDefaultView(opt);
                          setIsDefaultViewOpen(false);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Auto Refresh Row */}
            <div className="pref-row">
              <span className="pref-label">Auto Refresh</span>
              <div className={`custom-select-wrapper ${isAutoRefreshOpen ? 'open' : ''}`}>
                <div
                  className="custom-select-trigger"
                  onClick={() => {
                    setIsAutoRefreshOpen(!isAutoRefreshOpen);
                    setIsDefaultViewOpen(false);
                  }}
                >
                  <span>{autoRefresh}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {isAutoRefreshOpen && (
                  <div className="custom-select-menu">
                    {['30 seconds', '1 minute', '2 minutes', '5 minutes', 'Manual'].map((opt) => (
                      <div
                        key={opt}
                        className={`custom-select-option ${autoRefresh === opt ? 'selected' : ''}`}
                        onClick={() => {
                          setAutoRefresh(opt);
                          setIsAutoRefreshOpen(false);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Distance Unit Row */}
            <div className="pref-row">
              <span className="pref-label">Distance Unit</span>
              <div className="distance-unit-group">
                <button
                  type="button"
                  className={`distance-unit-btn ${distanceUnit === 'km' ? 'active' : 'inactive'}`}
                  onClick={() => setDistanceUnit('km')}
                >
                  km
                </button>
                <button
                  type="button"
                  className={`distance-unit-btn ${distanceUnit === 'miles' ? 'active' : 'inactive'}`}
                  onClick={() => setDistanceUnit('miles')}
                >
                  miles
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Notifications */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              {/* Bell Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </div>
            <div className="settings-card-title-group">
              <h2 className="settings-card-title">Notifications</h2>
              <p className="settings-card-subtitle">Choose what alerts you want to receive</p>
            </div>
          </div>

          <div className="notif-rows">
            <div className="notif-row">
              <span className="notif-label">Major Incidents</span>
              <button
                type="button"
                className={`toggle-switch ${notifications.majorIncidents ? 'on' : 'off'}`}
                onClick={() => toggleNotification('majorIncidents')}
                aria-label="Toggle Major Incidents"
              >
                <div className="toggle-knob" />
              </button>
            </div>

            <div className="notif-row">
              <span className="notif-label">Route Delays</span>
              <button
                type="button"
                className={`toggle-switch ${notifications.routeDelays ? 'on' : 'off'}`}
                onClick={() => toggleNotification('routeDelays')}
                aria-label="Toggle Route Delays"
              >
                <div className="toggle-knob" />
              </button>
            </div>

            <div className="notif-row">
              <span className="notif-label">Controller Recommendations</span>
              <button
                type="button"
                className={`toggle-switch ${notifications.controllerRecommendations ? 'on' : 'off'}`}
                onClick={() => toggleNotification('controllerRecommendations')}
                aria-label="Toggle Controller Recommendations"
              >
                <div className="toggle-knob" />
              </button>
            </div>

            <div className="notif-row">
              <span className="notif-label">Simulation Results</span>
              <button
                type="button"
                className={`toggle-switch ${notifications.simulationResults ? 'on' : 'off'}`}
                onClick={() => toggleNotification('simulationResults')}
                aria-label="Toggle Simulation Results"
              >
                <div className="toggle-knob" />
              </button>
            </div>

            <div className="notif-row">
              <span className="notif-label">System Updates</span>
              <button
                type="button"
                className={`toggle-switch ${notifications.systemUpdates ? 'on' : 'off'}`}
                onClick={() => toggleNotification('systemUpdates')}
                aria-label="Toggle System Updates"
              >
                <div className="toggle-knob" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW: 2 Cards */}
      <div className="settings-grid-bottom">
        {/* CARD 4: Data & Display */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              {/* Database / Disk Stack Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3V8c1.78 1.42 5.09 2 9 2s7.22-.58 9-2v4z" />
                <path d="M21 19c0 1.66-4 3-9 3s-9-1.34-9-3v-4c1.78 1.42 5.09 2 9 2s7.22-.58 9-2v4z" />
              </svg>
            </div>
            <div className="settings-card-title-group">
              <h2 className="settings-card-title">Data & Display</h2>
              <p className="settings-card-subtitle">Configure data display settings</p>
            </div>
          </div>

          <div className="data-display-rows">
            {/* Default Time Range */}
            <div className="data-display-row">
              <span className="data-display-label">Default Time Range</span>
              <div className={`custom-select-wrapper ${isTimeRangeOpen ? 'open' : ''}`}>
                <div
                  className="custom-select-trigger"
                  onClick={() => {
                    setIsTimeRangeOpen(!isTimeRangeOpen);
                    setIsMapViewOpen(false);
                  }}
                >
                  <span>{defaultTimeRange}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {isTimeRangeOpen && (
                  <div className="custom-select-menu">
                    {['Last 6 Hours', 'Last 12 Hours', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'].map((opt) => (
                      <div
                        key={opt}
                        className={`custom-select-option ${defaultTimeRange === opt ? 'selected' : ''}`}
                        onClick={() => {
                          setDefaultTimeRange(opt);
                          setIsTimeRangeOpen(false);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Map View */}
            <div className="data-display-row">
              <span className="data-display-label">Map View</span>
              <div className={`custom-select-wrapper ${isMapViewOpen ? 'open' : ''}`}>
                <div
                  className="custom-select-trigger"
                  onClick={() => {
                    setIsMapViewOpen(!isMapViewOpen);
                    setIsTimeRangeOpen(false);
                  }}
                >
                  <span>{mapView}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {isMapViewOpen && (
                  <div className="custom-select-menu">
                    {['Tamil Nadu (State)', 'Chennai Metropolitan', 'Coimbatore Region', 'Madurai Region', 'Trichy Region'].map((opt) => (
                      <div
                        key={opt}
                        className={`custom-select-option ${mapView === opt ? 'selected' : ''}`}
                        onClick={() => {
                          setMapView(opt);
                          setIsMapViewOpen(false);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Show Route Labels */}
            <div className="data-display-row">
              <span className="data-display-label">Show Route Labels</span>
              <button
                type="button"
                className={`toggle-switch ${showRouteLabels ? 'on' : 'off'}`}
                onClick={() => setShowRouteLabels(!showRouteLabels)}
                aria-label="Toggle Show Route Labels"
              >
                <div className="toggle-knob" />
              </button>
            </div>

            {/* Show Bus IDs */}
            <div className="data-display-row">
              <span className="data-display-label">Show Bus IDs</span>
              <button
                type="button"
                className={`toggle-switch ${showBusIDs ? 'on' : 'off'}`}
                onClick={() => setShowBusIDs(!showBusIDs)}
                aria-label="Toggle Show Bus IDs"
              >
                <div className="toggle-knob" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 5: System Information */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              {/* Info Circle Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <div className="settings-card-title-group">
              <h2 className="settings-card-title">System Information</h2>
              <p className="settings-card-subtitle">Version and data details</p>
            </div>
          </div>

          <div className="sys-info-rows">
            <div className="sys-info-row">
              <span className="sys-info-label">Application Version</span>
              <span className="sys-info-value">v1.0.0</span>
            </div>

            <div className="sys-info-row">
              <span className="sys-info-label">Last Data Update</span>
              <span className="sys-info-value">24 Jul 2024, 10:24 AM</span>
            </div>

            <div className="sys-info-row">
              <span className="sys-info-label">Data Source</span>
              <span className="sys-info-value">TNSTC Live Feed</span>
            </div>

            <div className="sys-info-row">
              <span className="sys-info-label">System Status</span>
              <div className="sys-status-badge">
                <span className="sys-status-dot" />
                <span className="sys-info-value">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
