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
      className="h-12 px-4 rounded-lg font-bold text-sm flex items-center gap-2"
      style={{
        backgroundColor: DESIGN.colors.neutral[200],
        border: `2px solid ${DESIGN.colors.neutral[300]}`,
        color: DESIGN.colors.neutral[800]
      }}
      title={label}
    >
      <Icon className="w-5 h-5" color={color} />
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
      className="w-full sticky top-0 z-20"
      style={{
        backgroundColor: DESIGN.colors.primary[100],
        borderBottom: `2px solid ${DESIGN.colors.primary[300]}`,
        padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
        boxShadow: DESIGN.shadow.sm
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {btn(Car, 'F9 Pátio', () => onNavigate('patio'), DESIGN.colors.primary[600])}
          {btn(CheckCircle, 'F6 Saídas', () => onNavigate('saidas'), DESIGN.colors.success[600])}
          {btn(Calculator, 'F3 Cálculo', () => {}, DESIGN.colors.neutral[600])}
          {btn(Info, 'F12 Sobre', () => {}, DESIGN.colors.neutral[600])}
          {btn(DollarSign, 'F2 Gaveta', () => onNavigate('caixa'), DESIGN.colors.warning[600])}
          {btn(HelpCircle, 'F1 Ajuda', () => {}, DESIGN.colors.primary[600])}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="text-right hidden md:block"
            style={{ color: DESIGN.colors.neutral[700] }}
          >
            <div className="text-xs font-bold uppercase">{formattedDate}</div>
          </div>
          <div
            className="px-3 py-2 rounded-lg font-black"
            style={{
              backgroundColor: DESIGN.colors.neutral[50],
              border: `2px solid ${DESIGN.colors.neutral[300]}`,
              color: DESIGN.colors.neutral[900]
            }}
          >
            {formattedTime}
          </div>
          
        </div>
      </div>
    </div>
  );
}
