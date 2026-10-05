import React from 'react';
import { Link } from 'react-router-dom';
import BusLogoIcon from './BusLogoIcon';
import TNSTCEmblem from './TNSTCEmblem';

export default function HomeFooter() {
  return (
    <footer
      id="contact"
      style={{
        backgroundColor: '#04080a',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '3.5rem 2rem 2.5rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Col 1: Brand & TNSTC Context */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <BusLogoIcon size={30} color="#00e599" />
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              BUS<span style={{ color: '#00e599' }}>FLOW</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Tamil Nadu State Transport Corporation's Next-Generation Intelligent Headway Management & Anti-Bunching Control Platform.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TNSTCEmblem size={32} />
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              <strong>Government of Tamil Nadu</strong>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Transport Department</div>
            </div>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Explore BUSFLOW
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
            <li>
              <a href="#home" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00e599')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00e599')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                About Platform
              </a>
            </li>
            <li>
              <a href="#features" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00e599')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                Features & Capabilities
              </a>
            </li>
            <li>
              <Link to="/about" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00e599')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                System Architecture
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Operations Control Center */}
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Operations Suite
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
            <li>
              <Link to="/live-map" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00e599')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                Live Map & Fleet Radar
              </Link>
            </li>
            <li>
              <Link to="/simulation" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00e599')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                Headway Simulation Engine
              </Link>
            </li>
            <li>
              <Link to="/incidents" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00e599')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                Incident Management Log
              </Link>
            </li>
            <li>
              <Link to="/dashboard" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00e599')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                Control Center Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Mission */}
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Transit Mission
          </div>
          <div
            style={{
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 229, 153, 0.05)',
              border: '1px solid rgba(0, 229, 153, 0.15)',
              marginBottom: '1rem'
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00e599', marginBottom: '0.35rem' }}>
              Keep buses moving.
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Keep passengers waiting less across all major corridors in Tamil Nadu.
            </div>
          </div>
          <div style={{ fontStyle: 'italic', color: '#00e599', fontSize: '0.85rem' }}>
            "For a greener, better Tamil Nadu"
          </div>
        </div>

      </div>

      {/* Bottom Subfooter */}
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}
      >
        <div>
          © {new Date().getFullYear()} BUSFLOW • Tamil Nadu State Transport Corporation (TNSTC). All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>TNSTC Intelligent Mobility Initiative</span>
          <span>Chennai • Coimbatore • Madurai</span>
        </div>
      </div>
    </footer>
  );
}
