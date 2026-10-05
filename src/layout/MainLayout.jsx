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
<<<<<<< HEAD
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#001621'
      }}
    >
      {/* Full-width Top OCC Header */}
      <Header isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={toggleSidebar} />
=======
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Shared Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
>>>>>>> 3b4e75566151e08388df1df77bb4eaef9469c0da

      {/* Main Workspace: Left Sidebar + Page Workspace */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        {/* Left Navigation Sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Dynamic Route Content */}
        <main
          style={{
            flex: 1,
            padding: '1.25rem 1.5rem',
            overflowY: 'auto',
            backgroundColor: '#001621'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
