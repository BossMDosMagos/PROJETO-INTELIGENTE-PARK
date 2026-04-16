import React from 'react';
import DESIGN from '../design-system';

export default function OperatorDashboard({ children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 16
      }}
    >
      <div
        style={{
          borderRadius: 16,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          padding: 16
        }}
      >
        {children}
      </div>
    </div>
  );
}
