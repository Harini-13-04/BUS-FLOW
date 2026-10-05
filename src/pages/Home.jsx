import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/home/HomeNavbar';
import HeroBadge from '../components/home/HeroBadge';
import HeroKPICards from '../components/home/HeroKPICards';
import HeroFeatureStrip from '../components/home/HeroFeatureStrip';
import TamilNaduSkyline from '../components/home/TamilNaduSkyline';
import HomeAboutSection from '../components/home/HomeAboutSection';
import HomeFeaturesSection from '../components/home/HomeFeaturesSection';
import HomeFooter from '../components/home/HomeFooter';
import { ArrowRightIcon } from '../components/home/HomeIcons';

export default function Home() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');

  const handleNavClick = (sectionId) => {
    setActiveNav(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050b0d',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* 1. Header / Navigation */}
      <HomeNavbar activeSection={activeNav} onNavClick={handleNavClick} />

      {/* 2. Hero Section - Unified Master Left Alignment Grid */}
      <section
        id="home"
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'right 20%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#050b0d',
          paddingTop: '5.5rem',
          paddingBottom: 0,
          boxSizing: 'border-box'
        }}
      >
        {/* Cinematic Horizontal Gradient Mask: Dark Left for Text Legibility, Vibrant Photographic Right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #050b0d 0%, rgba(5, 11, 13, 0.96) 28%, rgba(5, 11, 13, 0.82) 44%, rgba(5, 11, 13, 0.3) 68%, transparent 88%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Top Vignette for Navbar Readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(180deg, rgba(5, 11, 13, 0.7) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Master Hero Content Container - Single Consistent Left Content Alignment */}
        <div
          className="hero-content-container"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 'none',
            paddingLeft: 'clamp(24px, 7vw, 115px)',
            paddingRight: 'clamp(24px, 7vw, 115px)',
            paddingTop: '1.25rem',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Left-Aligned Hero Content */}
          <div style={{ maxWidth: '640px', width: '100%', margin: 0, padding: 0 }}>
            
            {/* Top Tagline Badge */}
            <HeroBadge text="Smarter Buses  •  Smoother Cities  •  Better Journeys" />

            {/* Primary BUSFLOW Heading */}
            <h1
              style={{
                fontSize: 'clamp(3rem, 5.2vw, 4.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1,
                margin: '0 0 0.85rem 0',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.9)'
              }}
            >
              <span style={{ color: '#ffffff' }}>BUS</span>
              <span
                style={{
                  color: '#00e599',
                  textShadow: '0 0 30px rgba(0, 229, 153, 0.45)'
                }}
              >
                FLOW
              </span>
            </h1>

            {/* Main Tagline */}
            <h2
              style={{
                fontSize: 'clamp(1.65rem, 2.7vw, 2.45rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.18,
                letterSpacing: '-0.025em',
                margin: '0 0 1rem 0',
                padding: 0,
                textShadow: '0 2px 16px rgba(0, 0, 0, 0.8)'
              }}
            >
              Keep buses moving.
              <br />
              Keep passengers waiting less.
            </h2>

            {/* Supporting Description */}
            <p
              style={{
                fontSize: 'clamp(0.92rem, 1.15vw, 1.02rem)',
                color: '#cbd5e1',
                lineHeight: 1.55,
                maxWidth: '520px',
                margin: '0 0 1.25rem 0',
                padding: 0,
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.8)'
              }}
            >
              An intelligent headway management platform that detects bus bunching, predicts disruptions, and dynamically balances bus spacing.
            </p>

            {/* 4 KPI Cards in ONE Single Horizontal Row */}
            <HeroKPICards />

            {/* CTA Action Buttons in ONE Horizontal Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
                margin: '0 0 1.75rem 0',
                padding: 0
              }}
            >
              {/* Primary CTA */}
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: '#00e599',
                  color: '#051417',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.85rem 1.6rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 4px 20px rgba(0, 229, 153, 0.35)',
                  letterSpacing: '-0.01em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00ffaa';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 229, 153, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00e599';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 229, 153, 0.35)';
                }}
              >
                <span>Launch Control Center</span>
                <ArrowRightIcon size={16} />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => navigate('/simulation')}
                style={{
                  backgroundColor: 'rgba(9, 24, 28, 0.65)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '8px',
                  padding: '0.85rem 1.6rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  letterSpacing: '-0.01em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 38, 44, 0.85)';
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 153, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(9, 24, 28, 0.65)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Explore Simulation</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>

          </div>

          {/* Feature Strip Layer: Respects the exact same Master Left Alignment */}
          <div
            style={{
              width: '100%',
              maxWidth: '1240px',
              margin: '0 0 0.5rem 0',
              padding: 0
            }}
          >
            <HeroFeatureStrip />
          </div>
        </div>

        {/* Full-Bleed Tamil Nadu Landmark Line-Art Artwork Layer & Motto */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 'none',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            lineHeight: 0
          }}
        >
          <TamilNaduSkyline />
        </div>
      </section>

      {/* 3. Operational Story Section (About Anchor Target) */}
      <HomeAboutSection />

      {/* 4. Core Features Section (Features Anchor Target) */}
      <HomeFeaturesSection />

      {/* 5. Government Transport Identity Footer (Contact Anchor Target) */}
      <HomeFooter />
    </div>
  );
}
