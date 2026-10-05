import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';
import Dashboard from './pages/dashboard/Dashboard';
import LiveMapPage from './features/live-map/LiveMapPage';
import SimulationPage from './features/simulation/SimulationPage';
import IncidentsPage from './features/incidents/IncidentsPage';

import SettingsPage from './pages/settings/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Internal Operations Control Center Shell */}
        <Route element={<MainLayout />}>
          {/* Jayasri Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/routes" element={<ComingSoon pageTitle="Routes Management" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<ComingSoon pageTitle="About BUSFLOW" />} />

          {/* JV Routes */}
          <Route path="/live-map" element={<LiveMapPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />

          {/* Jaisha Routes */}
          <Route path="/controllers" element={<ComingSoon pageTitle="Controller Management" />} />
          <Route path="/analytics" element={<ComingSoon pageTitle="Performance Analytics" />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
