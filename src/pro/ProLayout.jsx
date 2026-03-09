import React, { useState } from 'react';
import DESIGN from '../design-system';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { Settings, LogOut, Map as MapIcon, X } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

export default function ProLayout({ children, onAdmin, onLogout, unidades = [] }) {
  const [showMap, setShowMap] = useState(false);

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
        
        <div style={{ display: 'flex', gap: 10 }}>
            {/* Botão Mapa */}
            <button
              onClick={() => setShowMap(true)}
              style={{
                padding: 10,
                borderRadius: 12,
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Abrir Mapa"
            >
              <MapIcon size={20} />
            </button>

            {onAdmin && (
              <button
                onClick={onAdmin}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Administrativo"
              >
                <Settings size={20} />
              </button>
            )}
            
            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Sair / Logout"
              >
                <LogOut size={20} />
              </button>
            )}

            <LanguageSwitcher />
        </div>
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

      {/* Modal Mapa */}
      {showMap && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            width: '100%',
            maxWidth: 1000,
            height: '80vh',
            background: '#1e293b',
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              padding: 16,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>Mapa de Unidades em Tempo Real</h2>
              <button 
                onClick={() => setShowMap(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
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
                    { id: 2, nome: 'Unidade RJ', lat: -22.90, lng: -43.20, ocupacao: 78, faturamento: 980.2 },
                    { id: 3, nome: 'Unidade MG', lat: -19.91, lng: -43.93, ocupacao: 25, faturamento: 540.0 },
                    { id: 4, nome: 'Unidade RS', lat: -30.03, lng: -51.22, ocupacao: 95, faturamento: 2100.0 }
                  ]).map(u => (
                    <CircleMarker
                      key={u.id}
                      center={[u.lat, u.lng]}
                      radius={10}
                      pathOptions={{ color: getColor(u.ocupacao || 0), fillColor: getColor(u.ocupacao || 0), fillOpacity: 0.9 }}
                    >
                      <Popup>
                        <strong>{u.nome}</strong><br/>
                        Ocupação: {u.ocupacao || 0}%<br/>
                        Fat: R$ {u.faturamento || 0}
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
