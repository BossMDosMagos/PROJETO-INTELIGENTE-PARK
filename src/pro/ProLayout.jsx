import React from 'react';
import DESIGN from '../design-system';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';

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
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #007AFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900
            }}
          >
            P
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Inteligente Park Pro</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Luxury UI • Glass • Bento</div>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
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
