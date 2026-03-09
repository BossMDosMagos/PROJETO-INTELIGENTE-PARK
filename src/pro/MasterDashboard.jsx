import React from 'react';
import DESIGN from '../design-system';
import { Skeleton, SkeletonBlock } from './Skeleton';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  // Fixar ícones padrão do Leaflet em build
  try {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });
  } catch {}

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
          <MapContainer
            center={[-14.235, -51.9253]}
            zoom={4}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {(unidades.length ? unidades : [
              { id: 1, nome: 'Unidade SP', lat: -23.55, lng: -46.63, ocupacao: 42, faturamento: 1200.5 },
              { id: 2, nome: 'Unidade RJ', lat: -22.90, lng: -43.20, ocupacao: 78, faturamento: 980.2 }
            ]).map(u => (
              <Marker key={u.id} position={[u.lat, u.lng]}>
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 700 }}>{u.nome}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      Ocupação: {u.ocupacao}%<br />
                      Faturamento: R$ {(u.faturamento || 0).toFixed(2)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
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
          <div style={{ color: 'rgba(255,255,255,0.8)' }}>Gráficos serão exibidos aqui (integrado com chart.js).</div>
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
