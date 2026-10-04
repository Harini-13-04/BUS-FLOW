import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Internal Operations Control Center Shell */}
        <Route element={<MainLayout />}>
          {/* Jayasri Routes */}
          <Route path="/dashboard" element={<ComingSoon pageTitle="Operations Dashboard" />} />
          <Route path="/routes" element={<ComingSoon pageTitle="Routes Management" />} />
          <Route path="/settings" element={<ComingSoon pageTitle="System Settings" />} />
          <Route path="/about" element={<ComingSoon pageTitle="About BUSFLOW" />} />

          {/* JV Routes */}
          <Route path="/live-map" element={<ComingSoon pageTitle="Live Map" />} />
          <Route path="/simulation" element={<ComingSoon pageTitle="Simulation Control" />} />
          <Route path="/incidents" element={<ComingSoon pageTitle="Incident Center" />} />

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
