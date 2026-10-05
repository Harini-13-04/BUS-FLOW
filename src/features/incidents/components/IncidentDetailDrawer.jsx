import React, { useState } from 'react';
import Card from '../../../components/shared/Card';
import Button from '../../../components/shared/Button';

export default function IncidentDetailDrawer({ incident, onClose, onToggleResolve }) {
  if (!incident) return null;

  const isStall = incident.busId === 'B14';
  const affectedBuses = incident.affectedBusBadges || [
    { id: 'B21', color: '#ef4444' },
    { id: 'B23', color: '#2563eb' },
    { id: 'B24', color: '#f59e0b' }
  ];

  return (
    <Card
      title="Incident Details"
      action={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              backgroundColor: 'rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              padding: '0.15rem 0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}
          >
            {incident.severityBadge || 'Major'}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.1rem',
              cursor: 'pointer',
              padding: '0 0.25rem'
            }}
          >
            ✕
          </button>
        </div>
      }
      style={{
        backgroundColor: '#0b121e',
        border: '1px solid #1e293b',
        padding: '1.25rem'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Incident Summary Header with Thumbnail */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Left Metadata */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.125rem'
                }}
              >
                ⚠️
              </div>
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                  {incident.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                  {incident.reportedTime}, 24 Jul 2024
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.75rem', fontSize: '0.8125rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>📍</span>
                <span>{incident.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>🔀</span>
                <span>{incident.affectsText}</span>
              </div>
            </div>
          </div>

          {/* Right Traffic Image Thumbnail */}
          <div
            style={{
              width: '180px',
              height: '95px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid #1e293b',
              backgroundColor: '#0f172a',
              flexShrink: 0
            }}
          >
            {/* SVG Traffic Simulation Graphic */}
            <svg width="100%" height="100%" viewBox="0 0 180 95" preserveAspectRatio="none">
              <rect width="180" height="95" fill="#0f172a" />
              {/* Road lines */}
              <rect x="0" y="30" width="180" height="35" fill="#1e293b" />
              <line x1="0" y1="47.5" x2="180" y2="47.5" stroke="#334155" strokeDasharray="6 4" strokeWidth="1.5" />
              {/* Red traffic jam cars & buses */}
              <rect x="15" y="33" width="22" height="11" rx="2" fill="#ef4444" opacity="0.9" />
              <rect x="42" y="33" width="16" height="11" rx="2" fill="#f59e0b" opacity="0.9" />
              <rect x="63" y="33" width="28" height="12" rx="2" fill="#ef4444" />
              <rect x="96" y="33" width="18" height="11" rx="2" fill="#ef4444" opacity="0.8" />
              <rect x="120" y="33" width="24" height="12" rx="2" fill="#2563eb" opacity="0.9" />
              <rect x="149" y="33" width="18" height="11" rx="2" fill="#ef4444" />

              <rect x="25" y="51" width="26" height="11" rx="2" fill="#ef4444" />
              <rect x="56" y="51" width="18" height="11" rx="2" fill="#f59e0b" opacity="0.8" />
              <rect x="80" y="51" width="24" height="12" rx="2" fill="#ef4444" />
              <rect x="110" y="51" width="16" height="11" rx="2" fill="#64748b" opacity="0.8" />
              <rect x="132" y="51" width="22" height="11" rx="2" fill="#ef4444" opacity="0.9" />
              
              {/* Headlight glows */}
              <circle cx="91" cy="39" r="3" fill="#fef08a" opacity="0.6" />
              <circle cx="104" cy="57" r="3" fill="#fef08a" opacity="0.6" />
            </svg>
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '0.65rem',
                color: '#94a3b8'
              }}
            >
              ⛶
            </div>
          </div>
        </div>

        {/* 2-Column Details & Timeline Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #1e293b'
          }}
        >
          {/* Left Column: Properties */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Cause</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{incident.cause}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Impact</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{incident.impact}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Affected Buses</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                {affectedBuses.map((b) => (
                  <span
                    key={b.id}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: b.color,
                      color: '#ffffff',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '0.25rem'
                    }}
                  >
                    {b.id}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Current Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: incident.isDemoResolved ? '#10b981' : '#ef4444'
                  }}
                />
                <span style={{ color: incident.isDemoResolved ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                  {incident.isDemoResolved ? 'Resolved' : incident.currentStatus || 'Ongoing'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Detected At</span>
              <span style={{ color: '#94a3b8' }}>{incident.detectedAt}</span>
            </div>
          </div>

          {/* Right Column: Event Timeline Tracker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {incident.timeline.map((t, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  fontSize: '0.8125rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: t.isDone ? 'none' : '2px solid #64748b',
                      backgroundColor: t.isDone ? '#ef4444' : 'transparent',
                      flexShrink: 0
                    }}
                  />
                  <span style={{ color: t.isDone ? '#f8fafc' : '#64748b', fontWeight: t.isDone ? 600 : 400 }}>
                    {t.event.replace(' [Simulated]', '')}
                  </span>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                  {t.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #1e293b', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            [Simulated Incident Console — Local State]
          </div>
          <Button
            size="sm"
            variant={incident.isDemoResolved ? 'secondary' : 'primary'}
            onClick={() => onToggleResolve(incident.id)}
            style={{
              backgroundColor: incident.isDemoResolved ? '#1e293b' : '#ef4444',
              borderColor: incident.isDemoResolved ? '#334155' : '#ef4444',
              color: '#ffffff'
            }}
          >
            {incident.isDemoResolved ? '↩ Re-open Incident (Demo)' : '✓ Resolve Incident (Demo)'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

