import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';
import LiveMapPage from './features/live-map/LiveMapPage';
import SimulationPage from './features/simulation/SimulationPage';
import IncidentsPage from './features/incidents/IncidentsPage';
import ControllersPage from './features/controller/ControllersPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';

import { ThemeProvider } from './context/ThemeContext';
import RoutesPage from './pages/RoutesPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Internal Operations Control Center Shell */}
        <Route element={<MainLayout />}>
          {/* Operations Routes */}
          <Route path="/dashboard" element={<ComingSoon pageTitle="Operations Dashboard" />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/settings" element={<ComingSoon pageTitle="System Settings" />} />
          <Route path="/about" element={<ComingSoon pageTitle="About BUSFLOW" />} />

          {/* JV Routes */}
          <Route path="/live-map" element={<LiveMapPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />

          {/* Jaisha Routes */}
          <Route path="/controllers" element={<ControllersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
}


