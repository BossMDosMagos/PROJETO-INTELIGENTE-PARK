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

export default function ProLayout({ children, onAdmin, onLogout, onToggleMap, unidades = [], fullScreen = false }) {
  // Estado Modal removido - Mapa agora é sempre parte do Dashboard principal

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        backgroundImage: fullScreen ? 'none' : 
          'radial-gradient(1000px 500px at 10% 0%, rgba(0,122,255,0.08) 0%, transparent 60%), radial-gradient(800px 400px at 90% 20%, rgba(0,122,255,0.06) 0%, transparent 60%)',
        color: 'white',
        paddingTop: fullScreen ? 0 : 16,
        paddingLeft: fullScreen ? 0 : 16,
        paddingRight: fullScreen ? 0 : 16,
        overflow: fullScreen ? 'hidden' : 'auto'
      }}
    >
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
        )}
        
        <div style={{ display: 'flex', gap: 10, pointerEvents: 'auto' }}>
            {/* Botão de Mapa (Alterna Full Screen) */}
            {onToggleMap && (
              <button
                onClick={onToggleMap}
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
