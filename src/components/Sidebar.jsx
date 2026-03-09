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
  isDesktop = true,
  config = {}
}) {
  const itemClass = (active) =>
    `flex items-center p-4 rounded-xl font-semibold transition-all duration-300 mb-2 ${
      active 
        ? 'text-[#10B981] bg-[#064E3B]/30 border-l-4 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
        : 'text-gray-400 hover:text-white hover:bg-[#1E293B]'
    }`;

  const IconWithBadge = ({ Icon = Car, badge = null, color = '#334155', variant = 'neutral' }) => {
    return (
      <span
        className="relative mr-3 inline-flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Icon className="w-5 h-5 text-gray-200" />
        {badge && (
          <span
            className="absolute -bottom-1 -right-1 rounded-full border border-[#050A14] flex items-center justify-center shadow-lg"
            style={{ width: 16, height: 16, backgroundColor: badge.bg }}
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
      className={`w-64 bg-[#0B1120] shadow-2xl ${isDesktop ? 'hidden md:flex' : 'flex'} flex-col border-r border-white/5 backdrop-blur-xl h-full`}
    >
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
          {config.logoUrl ? (
             <div className="w-8 h-8 relative group">
                <img 
                 src={config.logoUrl} 
                 alt="Logo" 
                 className="w-full h-full object-contain"
                />
             </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-900 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold">{config.nomeEmpresa ? config.nomeEmpresa.charAt(0).toUpperCase() : 'C'}</span>
            </div>
          )}
          <span className="uppercase truncate max-w-[140px]">{config.nomeEmpresa || 'COMMAND PARK'}</span>
        </h1>
        <p className="text-[10px] text-cyan-400 mt-2 uppercase tracking-[0.2em] font-bold ml-1">Painel Tático v3.0</p>
      </div>

      <nav className="flex-1 mt-4 overflow-y-auto px-2">
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
          />
          2 - Saída
        </button>
        <button className={itemClass(selected === 'controle')} onClick={() => onNavigate('controle')}>
          <IconWithBadge Icon={FileEdit} />
          3 - Controle
        </button>
        <button className={itemClass(selected === 'operador')} onClick={() => onNavigate('operador')}>
          <IconWithBadge 
            Icon={UserCheck} 
            badge={{ bg: DESIGN.colors.success[500], title: 'Ativo', icon: <PlusCircle className="w-3 h-3" color="white" /> }}
          />
          4 - Operador
        </button>
        <button className={itemClass(selected === 'relatorios')} onClick={() => onNavigate('relatorios')}>
          <IconWithBadge Icon={FileText} />
          5 - Relatórios
        </button>
        <button className={itemClass(selected === 'caixa')} onClick={() => onNavigate('caixa')}>
          <IconWithBadge 
            Icon={Banknote} 
            badge={{ bg: DESIGN.colors.success[500], title: 'Adicionar', icon: <PlusCircle className="w-3 h-3" color="white" /> }}
          />
          6 - Caixa
        </button>
        <div className="mt-8 pt-4 border-t border-white/5">
          <button
            className="flex items-center w-full p-4 rounded-xl font-bold text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all uppercase tracking-wider text-sm"
            onClick={() => onNavigate('logout')}
          >
            <DoorOpen className="w-5 h-5 mr-3" /> Encerrar Turno
          </button>
        </div>
      </nav>

      <div className="p-4 bg-[#050A14]/50 border-t border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_10px_#10B981]"></div>
          <span className="text-xs font-medium text-gray-400">Sistema Online</span>
        </div>
        <p className="text-[10px] text-gray-500 font-mono">ID: 10007842 | Build: 2.0.4</p>
      </div>
    </aside>
  );
}
