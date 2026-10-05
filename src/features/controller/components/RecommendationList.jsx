import React from 'react';
import RecommendationCard from './RecommendationCard';

export default function RecommendationList({
  recommendations = [],
  selectedRecommendation,
  onSelectRecommendation,
  onApprove,
  onReject,
  sortBy,
  onSortChange
}) {
  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '12px',
        padding: '1.25rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            AI Recommendations ({recommendations.length})
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '0.2rem', margin: 0 }}>
            Suggested control actions based on real-time data and predictions
          </p>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            backgroundColor: '#111C2E',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '6px',
            color: '#F8FAFC',
            fontSize: '0.8125rem',
            fontWeight: 500,
            padding: '0.375rem 1.75rem 0.375rem 0.75rem',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394A3B8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.375rem center',
            backgroundSize: '1rem'
          }}
        >
          <option value="priority">Priority First</option>
          <option value="route">Route</option>
          <option value="time">Impact Time</option>
        </select>
      </div>

      {/* Cards List */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              isSelected={selectedRecommendation && selectedRecommendation.id === rec.id}
              onSelect={onSelectRecommendation}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))
        ) : (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              backgroundColor: '#111C2E',
              borderRadius: '10px',
              border: '1px dashed rgba(148, 163, 184, 0.2)',
              marginTop: '1rem'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              No Pending Recommendations
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '0.25rem' }}>
              All suggested control actions have been processed. Headways are currently optimal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
