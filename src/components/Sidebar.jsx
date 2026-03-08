import React from 'react';
import DESIGN from '../design-system';
import { 
  Home, 
  Car, 
  PlusCircle, 
  MinusCircle, 
  ArrowUpCircle,
  ArrowDownCircle,
  FileEdit,
  UserCheck, 
  FileText, 
  Banknote, 
  DoorOpen 
} from 'lucide-react';

export default function Sidebar({
  selected = 'principal',
  onNavigate = () => {},
  isDesktop = true
}) {
  const itemClass = (active) =>
    `flex items-center p-4 rounded-xl font-semibold transition ${
      active ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-500' : 'hover:text-blue-600'
    }`;

  const IconWithBadge = ({ Icon = Car, badge = null, color = '#334155', variant = 'neutral' }) => {
    const bgGradient = DESIGN.gradients?.[variant] || DESIGN.gradients?.neutral;
    return (
      <span
        className="relative mr-3 inline-flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundImage: bgGradient,
          boxShadow: DESIGN.shadow.sm,
          border: '2px solid rgba(255,255,255,0.7)'
        }}
      >
        <Icon className="w-8 h-8" color="white" />
        {badge && (
          <span
            className="absolute -bottom-1 -right-1 rounded-full border border-white flex items-center justify-center"
            style={{ width: 18, height: 18, backgroundColor: badge.bg }}
            title={badge.title}
          >
            {badge.icon}
          </span>
        )}
      </span>
    );
  };

  return (
    <aside
      className={`w-64 bg-white shadow-xl ${isDesktop ? 'hidden md:flex' : 'flex'} flex-col border-r`}
      style={{ borderColor: DESIGN.colors.neutral[200] }}
    >
      <div className="p-6 border-b" style={{ borderColor: DESIGN.colors.neutral[200] }}>
        <h1 className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <Home className="w-5 h-5" /> Inteligente Park
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Painel Master</p>
      </div>

      <nav className="flex-1 mt-4 overflow-y-auto">
        <button className={itemClass(selected === 'principal')} onClick={() => onNavigate('principal')}>
          <Home className="w-5 h-5 mr-3" /> Principal
        </button>
        <button className={itemClass(selected === 'entrada')} onClick={() => onNavigate('entrada')}>
          <IconWithBadge 
            Icon={Car} 
            badge={{ 
              bg: DESIGN.colors.success[500], 
              title: 'Entrada', 
              icon: <ArrowUpCircle className="w-3 h-3" color="white" /> 
            }} 
            color={DESIGN.colors.neutral[700]}
            variant="primary"
          />
          1 - Entrada
        </button>
        <button className={itemClass(selected === 'saida')} onClick={() => onNavigate('saida')}>
          <IconWithBadge 
            Icon={Car} 
            badge={{ 
              bg: DESIGN.colors.danger[500], 
              title: 'Saída', 
              icon: <ArrowDownCircle className="w-3 h-3" color="white" /> 
            }} 
            color={DESIGN.colors.neutral[700]}
            variant="danger"
          />
          2 - Saída
        </button>
        <button className={itemClass(selected === 'controle')} onClick={() => onNavigate('controle')}>
          <IconWithBadge Icon={FileEdit} color={DESIGN.colors.neutral[700]} variant="warning" />
          3 - Controle
        </button>
        <button className={itemClass(selected === 'operador')} onClick={() => onNavigate('operador')}>
          <IconWithBadge 
            Icon={UserCheck} 
            badge={{ bg: DESIGN.colors.success[500], title: 'Ativo', icon: <PlusCircle className="w-3 h-3" color="white" /> }}
            color={DESIGN.colors.neutral[700]}
            variant="success"
          />
          4 - Operador
        </button>
        <button className={itemClass(selected === 'relatorios')} onClick={() => onNavigate('relatorios')}>
          <IconWithBadge Icon={FileText} color={DESIGN.colors.neutral[700]} variant="primary" />
          5 - Relatórios
        </button>
        <button className={itemClass(selected === 'caixa')} onClick={() => onNavigate('caixa')}>
          <IconWithBadge 
            Icon={Banknote} 
            badge={{ bg: DESIGN.colors.success[500], title: 'Adicionar', icon: <PlusCircle className="w-3 h-3" color="white" /> }}
            color={DESIGN.colors.neutral[700]}
            variant="success"
          />
          6 - Caixa
        </button>
        <button
          className={itemClass(selected === 'logout')}
          onClick={() => onNavigate('logout')}
          style={{ color: '#ffffff', backgroundColor: DESIGN.colors.danger[500] }}
        >
          <DoorOpen className="w-5 h-5 mr-3" color="white" /> 7 - Saída
        </button>
      </nav>

      <div className="p-4 bg-slate-50 border-t" style={{ borderColor: DESIGN.colors.neutral[200] }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-600">Sincronizado</span>
        </div>
        <p className="text-[10px] text-slate-400">Série: 10007842 | Versão 2.0</p>
      </div>
    </aside>
  );
}
