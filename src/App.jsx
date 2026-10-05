import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';
import Dashboard from './pages/dashboard/Dashboard';
import RoutesPage from './pages/RoutesPage';
import SettingsPage from './pages/settings/SettingsPage';
import LiveMapPage from './features/live-map/LiveMapPage';
import SimulationPage from './features/simulation/SimulationPage';
import IncidentsPage from './features/incidents/IncidentsPage';
import ControllersPage from './features/controller/ControllersPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Internal Operations Control Center Shell */}
          <Route element={<MainLayout />}>

            {/* Core Operations */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live-map" element={<LiveMapPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/routes" element={<RoutesPage />} />

            {/* BUSFLOW Control & Analytics */}
            <Route path="/controllers" element={<ControllersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* Settings & About */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/about"
              element={<ComingSoon pageTitle="About BUSFLOW" />}
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Home />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}