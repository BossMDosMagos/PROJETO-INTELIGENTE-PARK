import React from 'react';
import DESIGN from '../design-system';

/**
 * INDICADOR DE STATUS SINCRONIZAÇÃO
 * Pequeno indicador que mostra se o sistema está sincronizado
 * Fica no header de forma discreta mas clara
 */
export function StatusSincronizacao({ 
  sincronizado = true, 
  offline = false,
  RLSDisabled = false,
  compact = false 
}) {
  // Determina cores e ícone
  let bgColor, dotColor, label, icon;

  if (RLSDisabled) {
    // RLS Desabilitado - Vermelho (perigo)
    dotColor = DESIGN.colors.danger[500];
    label = 'RLS Disabled';
    icon = '⚠️';
  } else if (!sincronizado) {
    // Sincronizando - Laranja piscante
    dotColor = DESIGN.colors.warning[400];
    label = 'Sincronizando...';
    icon = '🔄';
  } else if (offline) {
    // Offline - Laranja
    dotColor = DESIGN.colors.warning[400];
    label = 'Offline';
    icon = '📡';
  } else {
    // Sincronizado - Verde
    dotColor = DESIGN.colors.success[400];
    label = 'Sincronizado';
    icon = '✓';
  }

  if (compact) {
    // Modo compacto: apenas um dot piscante
    return (
      <div 
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: dotColor,
          animation: !sincronizado ? 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
          boxShadow: `0 0 8px ${dotColor}40`
        }}
        title={label}
      />
    );
  }

  // Modo padrão: dot + label
  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${dotColor}15`,
        color: dotColor,
        border: `1px solid ${dotColor}30`
      }}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: dotColor,
          animation: !sincronizado ? 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
          boxShadow: `0 0 6px ${dotColor}80`
        }}
      />
      <span>{label}</span>
    </div>
  );
}

/**
 * CARD DE STATUS COM DETALHES
 * Usado nas telas de admin para mostrar status detalhado
 */
export function StatusCard({ 
  titulo, 
  status,
  detalhes,
  valor,
  icon: Icon
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return DESIGN.colors.success[400];
      case 'warning':
        return DESIGN.colors.warning[400];
      case 'danger':
        return DESIGN.colors.danger[400];
      case 'info':
      default:
        return DESIGN.colors.primary[400];
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <div
      className="rounded-lg p-4 border"
      style={{
        backgroundColor: `${statusColor}08`,
        borderColor: `${statusColor}30`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: DESIGN.colors.neutral[600] }}
          >
            {titulo}
          </p>
          <p
            className="text-lg font-bold"
            style={{ color: statusColor }}
          >
            {valor}
          </p>
          {detalhes && (
            <p
              className="text-xs mt-2 line-clamp-2"
              style={{ color: DESIGN.colors.neutral[500] }}
            >
              {detalhes}
            </p>
          )}
        </div>
        
        {Icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${statusColor}20` }}
          >
            <Icon size={20} color={statusColor} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ALERTA DE SINCRONIZAÇÃO
 * Banner que aparece quando há problemas de sincronização
 */
export function SincronizacaoAlert({ 
  tipo = 'warning',
  mensagem,
  acao,
  labelAcao
}) {
  const colors = {
    warning: {
      bg: `${DESIGN.colors.warning[400]}15`,
      border: `${DESIGN.colors.warning[400]}40`,
      text: DESIGN.colors.warning[600],
      icon: '⚠️'
    },
    danger: {
      bg: `${DESIGN.colors.danger[400]}15`,
      border: `${DESIGN.colors.danger[400]}40`,
      text: DESIGN.colors.danger[600],
      icon: '🚨'
    },
    info: {
      bg: `${DESIGN.colors.primary[400]}15`,
      border: `${DESIGN.colors.primary[400]}40`,
      text: DESIGN.colors.primary[600],
      icon: 'ℹ️'
    }
  };

  const estilo = colors[tipo] || colors.info;

  return (
    <div
      className="rounded-lg p-4 border flex items-start gap-3 animate-slideIn"
      style={{
        backgroundColor: estilo.bg,
        borderColor: estilo.border,
        color: estilo.text
      }}
    >
      <span className="text-xl flex-shrink-0">{estilo.icon}</span>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{mensagem}</p>
      </div>

      {acao && labelAcao && (
        <button
          onClick={acao}
          className="px-3 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex-shrink-0"
          style={{
            backgroundColor: `${estilo.text}20`,
            color: estilo.text,
            border: `1px solid ${estilo.text}40`
          }}
        >
          {labelAcao}
        </button>
      )}
    </div>
  );
}

export default StatusSincronizacao;
