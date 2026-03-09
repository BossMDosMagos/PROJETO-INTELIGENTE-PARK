import React from 'react';
import DESIGN from '../design-system';
import { Skeleton, SkeletonBlock } from './Skeleton';

function StatCard({ title, value, accent = '#007AFF' }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 16,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent }}>{value}</div>
    </div>
  );
}

export default function MasterDashboard({ unidades = [], ocupacao = {}, bi = {} }) {

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
    gap: 16
  };

  return (
    <div style={grid}>
      <div style={{ gridColumn: 'span 8' }}>
        <div
          style={{
            height: 420,
            borderRadius: 16,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ padding: 16, color: 'rgba(255,255,255,0.8)' }}>
            Mapa interativo placeholder. Ative com react-leaflet/leaflet.
          </div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 4', display: 'grid', gap: 16 }}>
        <StatCard title="Faturamento Total" value={`R$ ${(bi.faturamento || 0).toFixed?.(2) || '0,00'}`} />
        <StatCard title="Ocupação Global" value={`${bi.ocupacaoGlobal || 0}%`} accent="#22c55e" />
        <div
          style={{
            borderRadius: 16,
            padding: 16,
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.8)' }}>Gráfico placeholder. Ative com react-chartjs-2/chart.js.</div>
        </div>
      </div>
      <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <SkeletonBlock>
          <Skeleton width="60%" height={14} />
          <div style={{ height: 8 }} />
          <Skeleton width="100%" height={56} />
        </SkeletonBlock>
        <SkeletonBlock>
          <Skeleton width="40%" height={14} />
          <div style={{ height: 8 }} />
          <Skeleton width="100%" height={56} />
        </SkeletonBlock>
        <SkeletonBlock>
          <Skeleton width="50%" height={14} />
          <div style={{ height: 8 }} />
          <Skeleton width="100%" height={56} />
        </SkeletonBlock>
      </div>
    </div>
  );
}
