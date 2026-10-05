import React, { useState } from 'react';
import Card from '../../../components/shared/Card';
import Button from '../../../components/shared/Button';

export default function LogIncidentModal({ isOpen, onClose, onSubmitIncident }) {
  const [busId, setBusId] = useState('B16');
  const [title, setTitle] = useState('Traffic Congestion Delay');
  const [location, setLocation] = useState('Civic Hub');
  const [severityStatus, setSeverityStatus] = useState('AT_RISK');
  const [description, setDescription] = useState('Heavy traffic queue causing minor schedule delay.');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Input Validations
    const cleanBusId = busId.trim().toUpperCase();
    const cleanTitle = title.trim();
    const cleanLocation = location.trim();
    const cleanDescription = description.trim();

    if (!cleanBusId) {
      setErrorMessage('Please enter an affected Vehicle ID (e.g. B16).');
      return;
    }
    if (!cleanTitle) {
      setErrorMessage('Please enter a brief Incident Title.');
      return;
    }
    if (!cleanLocation) {
      setErrorMessage('Please enter a Corridor Location.');
      return;
    }
    if (!cleanDescription) {
      setErrorMessage('Please enter Incident Notes.');
      return;
    }

    const newIncident = {
      id: `INC-DEMO-${Math.floor(100 + Math.random() * 900)}`,
      routeId: 'Route B14',
      busId: cleanBusId,
      title: cleanTitle,
      description: `${cleanDescription} [Simulated Data]`,
      location: cleanLocation,
      severityStatus: severityStatus,
      reportedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedController: 'Dispatcher Unit',
      timeline: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Manual incident report logged for Bus ${cleanBusId} [Simulated]`
        }
      ],
      recommendedActions: [
        {
          id: `ACT-NEW-${Math.floor(10 + Math.random() * 90)}`,
          title: `Schedule Speed Advisory — Bus ${cleanBusId}`,
          note: 'Maintain steady operational speed [Mock Action / Illustrative Only]',
          type: 'ADVISORY'
        }
      ],
      simulationReference: 'Demo dispatcher entry — refer to Simulation Control Room',
      isDemoResolved: false
    };

    onSubmitIncident(newIncident);
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <Card
          title="Log New Route Incident"
          subtitle="Demo Dispatcher Form — Local State Only [Simulated Data]"
          action={
            <Button size="sm" variant="ghost" onClick={onClose}>
              ✕
            </Button>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {errorMessage && (
              <div
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: 'var(--color-severe-delay)',
                  fontSize: '0.8125rem',
                  fontWeight: 600
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Affected Vehicle ID *
              </label>
              <input
                type="text"
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                placeholder="e.g. B16"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Incident Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Brief summary..."
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Corridor Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Stop or junction name..."
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Initial Severity Status
              </label>
              <select
                value={severityStatus}
                onChange={(e) => setSeverityStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="AT_RISK">AT RISK — Spacing / Traffic Delay</option>
                <option value="SEVERE_DELAY">SEVERE DELAY — Mechanical Stall / Breakdown</option>
                <option value="NORMAL">NORMAL — Operational Note</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Incident Notes *
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Detailed description..."
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              * Demo form only: Item will be appended to active local React state. No database mutation.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add to Demo Log →
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
