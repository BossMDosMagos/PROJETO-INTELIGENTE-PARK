import React, { useEffect, useState } from 'react';
import DESIGN from '../design-system';
import {
  Car,
  CheckCircle,
  DollarSign,
  HelpCircle,
  Info,
  Calculator,
  LogOut
} from 'lucide-react';

export default function TopBarLegacy({
  tempoAtual,
  usuario,
  onNavigate = () => {},
  onLogout = () => {}
}) {
  const [now, setNow] = useState(tempoAtual || Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const btn = (Icon, label, action, color) => (
    <button
      onClick={action}
      className="h-12 px-4 rounded-lg font-bold text-sm flex items-center gap-2 transition-all hover:bg-white/5 active:scale-95"
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'white'
      }}
      title={label}
    >
      <Icon className="w-5 h-5" style={{ color: color || '#10B981' }} />
      <span>{label}</span>
    </button>
  );

  const formattedDate = new Date(now).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = new Date(now).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div
      className="w-full sticky top-0 z-20 backdrop-blur-md"
      style={{
        backgroundColor: DESIGN.colors.deepMidnight.light,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {btn(Car, 'F9 Pátio', () => onNavigate('patio'), '#3B82F6')}
          {btn(CheckCircle, 'F6 Saídas', () => onNavigate('saidas'), '#10B981')}
          {btn(Calculator, 'F3 Cálculo', () => {}, '#94A3B8')}
          {btn(Info, 'F12 Sobre', () => {}, '#94A3B8')}
          {btn(DollarSign, 'F2 Gaveta', () => onNavigate('caixa'), '#F59E0B')}
          {btn(HelpCircle, 'F1 Ajuda', () => {}, '#8B5CF6')}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="text-right hidden md:block"
            style={{ color: '#94A3B8' }}
          >
            <div className="text-xs font-bold uppercase tracking-widest">{formattedDate}</div>
          </div>
          <div
            className="px-3 py-2 rounded-lg font-black font-mono text-[#10B981]"
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)'
            }}
          >
            {formattedTime}
          </div>
          
        </div>
      </div>
    </div>
  );
}
