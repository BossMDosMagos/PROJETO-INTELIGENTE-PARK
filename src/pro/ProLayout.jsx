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

export default function ProLayout({ children, onAdmin, onLogout, onToggleMap, unidades = [], fullScreen = false, config = {} }) {
  // Estado Modal removido - Mapa agora é sempre parte do Dashboard principal

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: DESIGN.colors.deepMidnight.DEFAULT, // Deep Midnight Base
        backgroundImage: fullScreen ? 'none' : 
          `radial-gradient(circle at 50% 0%, ${DESIGN.colors.deepMidnight.light} 0%, ${DESIGN.colors.deepMidnight.DEFAULT} 80%)`, // Gradiente sutil
        color: 'white',
        paddingTop: fullScreen ? 0 : 16,
        paddingLeft: fullScreen ? 0 : 16,
        paddingRight: fullScreen ? 0 : 16,
        overflow: fullScreen ? 'hidden' : 'auto',
        fontFamily: DESIGN.typography.family.base
      }}
    >
      {/* Mapa Tático - Agora integrado como fundo ou componente principal */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-700 ease-in-out"
        style={{ 
          opacity: fullScreen ? 1 : 0.3,
          pointerEvents: fullScreen ? 'auto' : 'none',
          filter: fullScreen ? 'none' : 'grayscale(80%) contrast(120%) brightness(60%) blur(2px)'
        }}
      >
        <MapContainer
          center={[-23.550520, -46.633308]}
          zoom={13}
          style={{ height: '100%', width: '100%', background: '#02040A' }}
          zoomControl={false}
          attributionControl={false}
        >
          {/* Tile Layer Dark Matter (CartoDB) - Visual Cyberpunk/Tático */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
          {unidades.map(u => (
            <CircleMarker
              key={u.id}
              center={[u.lat, u.lng]}
              pathOptions={{
                color: getColor(u.ocupacao),
                fillColor: getColor(u.ocupacao),
                fillOpacity: 0.6,
                weight: 2
              }}
              radius={12 + (u.ocupacao / 10)}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px] bg-[#0F172A] text-white rounded-lg border border-slate-700">
                  <h3 className="font-bold text-lg mb-1">{u.nome}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Ocupação:</span>
                      <span className="font-mono font-bold text-cyan-400">{u.ocupacao}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${u.ocupacao}%`,
                          backgroundColor: getColor(u.ocupacao)
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                      <span className="text-xs text-slate-400">Faturamento:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(u.faturamento || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div
        style={{
          maxWidth: fullScreen ? '100%' : 1280,
          margin: fullScreen ? 0 : '0 auto',
          marginBottom: fullScreen ? 0 : 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          position: fullScreen ? 'fixed' : 'relative',
          top: fullScreen ? 16 : 0,
          right: fullScreen ? 16 : 0,
          left: fullScreen ? 'auto' : 0,
          zIndex: 1001, // Acima do Mapa
          pointerEvents: 'none', // Permite clicar no mapa atrás se não estiver em cima dos botões
          width: fullScreen ? 'auto' : '100%'
        }}
      >
        {!fullScreen && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            borderRadius: 14,
            background: DESIGN.colors.charcoal.surface, // Charcoal Glass
            border: `1px solid ${DESIGN.colors.charcoal.border}`,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)' // Sombra sofisticada
          }}
        >
          {config.logoUrl ? (
             <div style={{ width: 36, height: 36 }}>
                <img 
                 src={config.logoUrl} 
                 alt="Logo" 
                 style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
             </div>
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundImage: `linear-gradient(135deg, #164e63 0%, #06b6d4 100%)`, // Cyan Gradient
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                boxShadow: `0 0 15px #0891b2` // Cyan Glow
              }}
            >
              {config.nomeEmpresa ? config.nomeEmpresa.charAt(0).toUpperCase() : 'C'}
            </div>
          )}
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 800, letterSpacing: 0.5, color: 'white', textTransform: 'uppercase' }}>{config.nomeEmpresa || 'COMMAND PARK'}</div>
            <div style={{ fontSize: 11, opacity: 0.7, color: '#22d3ee', letterSpacing: 1 }}>SECURITY PROTOCOL V3.0</div>
          </div>
        </div>
        )}
        
        <div style={{ display: 'flex', gap: 10, pointerEvents: 'auto' }}>
            {/* Botão de Mapa (Alterna Full Screen) */}
            {onToggleMap && (
              <button
                onClick={onToggleMap}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  background: DESIGN.colors.charcoal.surface,
                  border: `1px solid ${DESIGN.colors.charcoal.border}`,
                  color: DESIGN.colors.richForest.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = DESIGN.colors.richForest.accent}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = DESIGN.colors.charcoal.border}
                title={fullScreen ? "Sair do Mapa" : "Abrir Mapa Tático"}
              >
                <MapIcon size={20} />
              </button>
            )}

            {onAdmin && (
              <button
                onClick={onAdmin}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  background: DESIGN.colors.charcoal.surface,
                  border: `1px solid ${DESIGN.colors.charcoal.border}`,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = DESIGN.colors.richForest.accent}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = DESIGN.colors.charcoal.border}
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
      
      {/* Container de conteúdo */}
      <div
        style={{
          maxWidth: fullScreen ? '100%' : 1280,
          margin: fullScreen ? 0 : '0 auto',
          display: fullScreen ? 'block' : 'grid',
          gap: fullScreen ? 0 : 16,
          height: fullScreen ? '100vh' : 'auto'
        }}
      >
        {children}
      </div>
    </div>
  );
}
