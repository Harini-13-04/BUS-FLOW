import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';

export default function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary, #080d19)',
      }}
    >
      {/* Full Width Top Header */}
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      {/* Body Area (Sidebar + Main Content) directly below Header */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          position: 'relative',
        }}
      >
        {/* Shared Sidebar underneath Header */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* Main Workspace Area to the right of Sidebar */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--bg-primary, #080d19)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}