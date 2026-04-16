import React from 'react';
import DESIGN from '../design-system';
import { Map, Settings, Globe } from 'lucide-react';

export default function TopBarSimplificada({
  onSettings = () => {},
  onMap = () => {},
  onLanguage = () => {},
  config = {}
}) {
  const btn = (Icon, label, action, color = '#10B981') => (
    <button
      onClick={action}
      className="h-10 px-4 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all hover:bg-white/10 active:scale-95"
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'white'
      }}
      title={label}
    >
      <Icon className="w-4 h-4" style={{ color }} />
      <span>{label}</span>
    </button>
  );

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        backgroundColor: DESIGN.colors.deepMidnight.light,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
      }}
    >
      {/* Logo e Nome da Empresa */}
      <div className="flex items-center gap-3">
        {config.logoUrl ? (
          <img src={config.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
        ) : (
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #164e63 0%, #06b6d4 100%)',
              boxShadow: '0 0 15px #0891b2'
            }}
          >
            {config.nomeEmpresa ? config.nomeEmpresa.charAt(0).toUpperCase() : 'C'}
          </div>
        )}
        <div>
          <div className="font-bold text-white uppercase text-sm tracking-wide">
            {config.nomeEmpresa || 'COMMAND PARK'}
          </div>
          <div className="text-[10px] text-cyan-400 uppercase tracking-widest">
            Parking System
          </div>
        </div>
      </div>

      {/* Botões à direita */}
      <div className="flex items-center gap-3">
        {btn(Map, 'Mapa', onMap, '#3B82F6')}
        {btn(Settings, 'Configurações', onSettings, '#94A3B8')}
        {btn(Globe, 'Idioma', onLanguage, '#8B5CF6')}
      </div>
    </div>
  );
}
