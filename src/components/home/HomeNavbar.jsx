import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BusLogoIcon from './BusLogoIcon';
import { UserLoginIcon } from './HomeIcons';

export default function HomeNavbar({ activeSection = 'home', onNavClick }) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className="home-navbar-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: isScrolled
          ? 'rgba(5, 11, 13, 0.94)'
          : 'rgba(5, 11, 13, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isScrolled
          ? '1px solid rgba(0, 229, 153, 0.15)'
          : '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Left: Brand Identity */}
      <a
        href="#home"
        onClick={(e) => handleLinkClick(e, 'home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          textDecoration: 'none',
          cursor: 'pointer'
        }}
      >
        <BusLogoIcon size={34} color="#00e599" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ color: '#ffffff' }}>BUS</span>
            <span style={{ color: '#00e599' }}>FLOW</span>
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 500,
              color: '#94a3b8',
              letterSpacing: '0.01em',
              marginTop: '1px'
            }}
          >
            Tamil Nadu State Transport
          </div>
        </div>
      </a>

      {/* Center: Navigation Links */}
      <nav
        className="home-nav-links"
        style={{
          fontSize: '0.95rem',
          fontWeight: 500
        }}
      >
        {[
          { id: 'home', label: 'Home' },
          { id: 'about', label: 'About' },
          { id: 'features', label: 'Features' },
          { id: 'contact', label: 'Contact' }
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              style={{
                color: isActive ? '#ffffff' : '#cbd5e1',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.4rem 0.2rem',
                transition: 'color 0.2s ease',
                fontWeight: isActive ? 600 : 500
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              {item.label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    right: 0,
                    height: '2.5px',
                    backgroundColor: '#00e599',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px rgba(0, 229, 153, 0.8)'
                  }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right: Official Government of Tamil Nadu Emblem & Login Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Official Tamil Nadu Identity Block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src="/tn-emblem.png"
            alt="Government of Tamil Nadu"
            style={{
              width: '38px',
              height: '38px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 0 4px rgba(0, 229, 153, 0.2))'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.15
              }}
            >
              Tamil Nadu
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#94a3b8',
                lineHeight: 1.15
              }}
            >
              State Transport Corporation
            </span>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: '#00e599',
            color: '#051417',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1.15rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 2px 10px rgba(0, 229, 153, 0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00ffaa';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 229, 153, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#00e599';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 229, 153, 0.25)';
          }}
        >
          <UserLoginIcon size={16} color="#051417" />
          <span>Login</span>
        </button>
      </div>
    </header>
  );
}
