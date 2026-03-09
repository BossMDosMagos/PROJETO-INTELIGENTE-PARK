import React from 'react';

export function Skeleton({ width = '100%', height = 16, rounded = 12, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: rounded,
        background:
          'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skel 1.2s ease-in-out infinite',
        ...style
      }}
    />
  );
}

export function SkeletonBlock({ children, padding = 16 }) {
  return (
    <div
      style={{
        padding,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)'
      }}
    >
      {children}
    </div>
  );
}

const key = `
@keyframes skel {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`;

if (typeof document !== 'undefined' && !document.getElementById('skel-anim')) {
  const style = document.createElement('style');
  style.id = 'skel-anim';
  style.innerHTML = key;
  document.head.appendChild(style);
}
