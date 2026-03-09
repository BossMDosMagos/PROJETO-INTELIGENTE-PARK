import React from 'react';
import DESIGN from '../design-system';
import { Skeleton, SkeletonBlock } from './Skeleton';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

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

  const getColor = (pct) => {
    if (pct <= 50) return '#22c55e';
    if (pct <= 90) return '#f59e0b';
    return '#ef4444';
  };

  const trend = bi?.trend || {
    labels: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Hoje'],
    data: [0, 0, 0, 0, 0, 0, 0]
  };

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
            center={unidades.length > 0 ? [unidades[0].lat, unidades[0].lng] : [-23.550520, -46.633308]}
            zoom={unidades.length > 0 ? 15 : 12}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {unidades.map(u => (
              <CircleMarker
                key={u.id}
                center={[u.lat, u.lng]}
                radius={10}
                pathOptions={{ color: getColor(u.ocupacao || 0), fillColor: getColor(u.ocupacao || 0), fillOpacity: 0.9 }}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 700 }}>{u.nome}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      Ocupação: {u.ocupacao}%<br />
                      Faturamento: R$ {(u.faturamento || 0).toFixed(2)}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
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
          <Line
            data={{
              labels: trend.labels,
              datasets: [
                {
                  label: 'Faturamento',
                  data: trend.data,
                  tension: 0.35,
                  borderColor: '#007AFF',
                  backgroundColor: 'rgba(0,122,255,0.25)',
                  pointRadius: 3,
                  fill: true
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: 'rgba(255,255,255,0.85)' } },
                tooltip: { mode: 'index', intersect: false }
              },
              scales: {
                x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.08)' } },
                y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.08)' } }
              }
            }}
          />
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
