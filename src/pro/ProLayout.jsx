import React from 'react';
import DESIGN from '../design-system';

export default function ProLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        backgroundImage:
          'radial-gradient(1000px 500px at 10% 0%, rgba(0,122,255,0.08) 0%, transparent 60%), radial-gradient(800px 400px at 90% 20%, rgba(0,122,255,0.06) 0%, transparent 60%)',
        color: 'white',
        padding: 16
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gap: 16
        }}
      >
        {children}
      </div>
    </div>
  );
}
