import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/shared/Card';
import Button from '../../../components/shared/Button';

export default function IncidentDetailDrawer({ incident, onClose, onToggleResolve }) {
  const navigate = useNavigate();
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Incident Summary Header with Thumbnail */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Left Metadata */}
          <div style={{ flex: 1, minWidth: '200px' }}>
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
                  fontSize: '1.125rem',
                  flexShrink: 0
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>📍</span>
                <span>{incident.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>🔀</span>
                <span>{incident.affectsText}</span>
              </div>
            </div>
          </div>

          {/* Right Traffic Image Thumbnail */}
          <div
            style={{
              width: '180px',
              height: '90px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid #1e293b',
              backgroundColor: '#0f172a',
              flexShrink: 0
            }}
          >
            <img
              src="/media_1791173589999.jpg"
              alt="Traffic Congestion Visual"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                padding: '2px 5px',
                borderRadius: '3px',
                fontSize: '0.65rem',
                color: '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.1)'
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
            gridTemplateColumns: 'minmax(220px, 1.2fr) minmax(180px, 1fr)',
            gap: '1rem',
            paddingTop: '0.875rem',
            borderTop: '1px solid #1e293b'
          }}
        >
          {/* Left Column: Properties */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '95px 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Cause</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{incident.cause}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '95px 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Impact</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{incident.impact}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '95px 1fr', gap: '0.5rem', alignItems: 'center' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '95px 1fr', gap: '0.5rem', alignItems: 'center' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '95px 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Detected At</span>
              <span style={{ color: '#94a3b8' }}>{incident.detectedAt}</span>
            </div>
          </div>

          {/* Right Column: Event Timeline Tracker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', paddingLeft: '0.25rem' }}>
            {incident.timeline.map((t, idx) => {
              const isLast = idx === incident.timeline.length - 1;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '12px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: t.isDone ? '#ef4444' : 'transparent',
                          border: t.isDone ? 'none' : '1.5px solid #64748b',
                          zIndex: 1
                        }}
                      />
                      {!isLast && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            width: '1px',
                            height: '18px',
                            backgroundColor: t.isDone ? 'rgba(239, 68, 68, 0.4)' : '#334155',
                            zIndex: 0
                          }}
                        />
                      )}
                    </div>
                    <span style={{ color: t.isDone ? '#f8fafc' : '#64748b', fontWeight: t.isDone ? 600 : 400 }}>
                      {t.event.replace(' [Simulated]', '')}
                    </span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                    {t.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo Action Button Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #1e293b', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            [Simulated Incident Console — Local State]
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/live-map?busId=${incident.busId}`)}
            >
              📍 Locate Bus on Live Map ➔
            </Button>
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
      </div>
    </Card>
  );
}

