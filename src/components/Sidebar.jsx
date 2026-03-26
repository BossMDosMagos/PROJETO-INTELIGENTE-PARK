import React from 'react';
import DESIGN from '../design-system';
import { 
  Home, 
  Car, 
  PlusCircle, 
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
  const menuItems = [
    { id: 'principal', icon: Home, label: 'Principal', badge: null },
    { id: 'entrada', icon: Car, label: '1 - Entrada', badge: { bg: '#10B981', icon: ArrowUpCircle } },
    { id: 'saida', icon: Car, label: '2 - Saída', badge: { bg: '#EF4444', icon: ArrowDownCircle } },
    { id: 'controle', icon: FileEdit, label: '3 - Controle', badge: null },
    { id: 'operador', icon: UserCheck, label: '4 - Operador', badge: { bg: '#10B981', icon: PlusCircle } },
    { id: 'relatorios', icon: FileText, label: '5 - Relatórios', badge: null },
    { id: 'caixa', icon: Banknote, label: '6 - Caixa', badge: { bg: '#10B981', icon: PlusCircle } },
  ];

  return (
    <aside
      className="w-64 bg-[#0B1120] flex flex-col border-r border-white/5"
      style={{ height: 'calc(100vh - 60px)' }}
    >
      {/* Header */}
      <div 
        className="border-b border-white/5"
        style={{ paddingTop: '20px', paddingBottom: '20px', display: 'flex', justifyContent: 'center' }}
      >
        <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Menu Principal</p>
      </div>

      {/* Menu Items */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Botões do Menu */}
        <div className="p-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selected === item.id;
            const BadgeIcon = item.badge?.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-xl font-semibold text-sm
                  transition-all duration-150 active:translate-y-1
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#064E3B] to-[#10B981] text-white shadow-lg shadow-[#10B981]/30 border border-[#10B981]/50' 
                    : 'bg-[#1E293B]/50 text-gray-300 hover:bg-[#1E293B] hover:text-white shadow-md shadow-black/20 border border-white/5'
                  }
                `}
                style={{
                  boxShadow: isActive 
                    ? '0 4px 15px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                <span
                  className={`
                    relative w-10 h-10 rounded-lg flex items-center justify-center mr-3
                    ${isActive 
                      ? 'bg-white/20 shadow-inner' 
                      : 'bg-[#0B1120]/50 shadow-inner'
                    }
                  `}
                  style={{
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0B1120] flex items-center justify-center"
                      style={{ backgroundColor: item.badge.bg }}
                    >
                      <BadgeIcon className="w-3 h-3 text-white" />
                    </span>
                  )}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Botão Sair - Destacado */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => onNavigate('logout')}
            className="w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm
              bg-red-900/40 text-red-400 hover:bg-red-900/60 hover:text-red-300
              border border-red-900/50 transition-all duration-150 active:translate-y-1"
            style={{
              boxShadow: '0 4px 10px rgba(127, 29, 29, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            <span
              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-red-900/60 shadow-inner"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
            >
              <DoorOpen className="w-5 h-5" />
            </span>
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="p-3 bg-[#050A14]/50 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_10px_#10B981]"></div>
          <span className="text-xs font-medium text-gray-400">Online</span>
        </div>
      </div>
    </aside>
  );
}
