import React, { useState } from 'react';
import { 
  Bell, 
  Eye, 
  EyeOff, 
  LogOut, 
  Menu, 
  X,
  Signal,
  AlertCircle
} from 'lucide-react';
import DESIGN from '../design-system';

/**
 * HEADER REDESENHADO
 * Componente profissional e moderno para o cabeçalho do Inteligente Park
 * 
 * Integra:
 * - Logo e nome da empresa
 * - Status de sincronização (verde ou laranja piscante)
 * - Bell de notificações
 * - Controle de visibilidade de caixa
 * - Informações do usuário
 * - Menu mobile hamburger
 */
export function HeaderRedesenhado({
  usuarioAutenticado,
  pendenciasMensalistas,
  temDadosPendentes,
  statusSincronizacao,
  saldoCaixa,
  mostrarCaixa,
  onToggleCaixa,
  onNotificacoes,
  onLogout,
  onMenuToggle,
  isMobile = false
}) {
  const [showMenuMobile, setShowMenuMobile] = useState(false);

  const nivelAcesso = usuarioAutenticado?.nivelAcesso?.toUpperCase() || 'OPERADOR';
  const isAdmin = nivelAcesso === 'MASTER';

  // Status de sincronização
  const sincronizado = !temDadosPendentes;
  const statusColor = sincronizado 
    ? DESIGN.colors.success[400]
    : DESIGN.colors.warning[400];

  const statusLabel = sincronizado 
    ? 'Sincronizado'
    : 'Sincronizando...';

  return (
    <header 
      className="bg-white border-b transition-all"
      style={{
        borderColor: DESIGN.colors.neutral[200],
        boxShadow: DESIGN.shadow.xs,
        padding: `${DESIGN.spacing.md} ${DESIGN.spacing.lg}`
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo e Empresa */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          {/* Logo Circle */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
            style={{ backgroundColor: DESIGN.colors.primary[400] }}
          >
            P
          </div>

          {/* Texto Logo */}
          <div className="flex flex-col min-w-0">
            <span 
              className="font-bold truncate"
              style={{
                color: DESIGN.colors.primary[600],
                fontSize: DESIGN.typography.sizes.sm
              }}
            >
              Inteligente Park
            </span>
            <span 
              className="text-xs truncate"
              style={{ color: DESIGN.colors.neutral[500] }}
            >
              Estacionamentos
            </span>
          </div>
        </div>

        {/* Ações Globais e Status (Desktop) */}
        {!isMobile && (
          <div className="flex items-center gap-1">
            {/* Status de Sincronização */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ 
                backgroundColor: DESIGN.colors.neutral[100],
                transition: DESIGN.transition.fast
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${!sincronizado ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: statusColor }}
              />
              <span
                className="text-xs font-medium truncate"
                style={{ color: DESIGN.colors.neutral[600] }}
              >
                {statusLabel}
              </span>
            </div>

            {/* Notificação de Pendências */}
            {pendenciasMensalistas > 0 && (
              <button
                onClick={onNotificacoes}
                className="relative p-2 rounded-lg hover:bg-blue-50 transition-colors"
                style={{
                  minWidth: DESIGN.size.touch,
                  minHeight: DESIGN.size.touch,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={`${pendenciasMensalistas} mensalista(s) aguardando resposta`}
              >
                <Bell 
                  size={20}
                  color={DESIGN.colors.primary[400]}
                  className="animate-bounce"
                />
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: DESIGN.colors.danger[500] }}
                >
                  {pendenciasMensalistas}
                </span>
              </button>
            )}

            {/* Visibilidade de Caixa */}
            <button
              onClick={onToggleCaixa}
              className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
              style={{
                minWidth: DESIGN.size.touch,
                minHeight: DESIGN.size.touch,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={mostrarCaixa ? 'Ocultar saldo de caixa' : 'Mostrar saldo de caixa'}
            >
              {mostrarCaixa ? (
                <Eye size={20} color={DESIGN.colors.primary[400]} />
              ) : (
                <EyeOff size={20} color={DESIGN.colors.neutral[400]} />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              style={{
                minWidth: DESIGN.size.touch,
                minHeight: DESIGN.size.touch,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Sair da conta"
            >
              <LogOut size={20} color={DESIGN.colors.danger[500]} />
            </button>
          </div>
        )}

        {/* Menu Mobile Hamburger */}
        {isMobile && (
          <button
            onClick={() => setShowMenuMobile(!showMenuMobile)}
            className="p-2 rounded-lg"
            style={{
              minWidth: DESIGN.size.touch,
              minHeight: DESIGN.size.touch,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: DESIGN.colors.primary[400]
            }}
          >
            {showMenuMobile ? (
              <X size={24} color="white" />
            ) : (
              <Menu size={24} color="white" />
            )}
          </button>
        )}

        {/* Info do Usuário (sempre visível) */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex flex-col min-w-0">
            <span
              className="text-xs font-semibold truncate"
              style={{ color: DESIGN.colors.neutral[900] }}
            >
              {usuarioAutenticado?.nomeCompleto || usuarioAutenticado?.operador || 'Usuário'}
            </span>
            <span
              className="text-xs truncate"
              style={{ color: DESIGN.colors.neutral[500] }}
            >
              {isAdmin ? '👑 Master' : '👤 Operador'}
            </span>
          </div>

          {/* Avatar Circle */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ backgroundColor: DESIGN.colors.primary[500] }}
          >
            {(usuarioAutenticado?.nomeCompleto || usuarioAutenticado?.operador || 'U')[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Menu Mobile Expandido */}
      {isMobile && showMenuMobile && (
        <div
          className="mt-3 pt-3 border-t space-y-2"
          style={{ borderColor: DESIGN.colors.neutral[200] }}
        >
          {/* Status Mobile */}
          <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: DESIGN.colors.neutral[100] }}>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${!sincronizado ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: statusColor }}
              />
              <span style={{ color: DESIGN.colors.neutral[600], fontSize: DESIGN.typography.sizes.sm }}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Botões Mobile */}
          <div className="grid grid-cols-3 gap-2">
            {pendenciasMensalistas > 0 && (
              <button
                onClick={() => {
                  onNotificacoes();
                  setShowMenuMobile(false);
                }}
                className="flex flex-col items-center gap-1 p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: DESIGN.colors.neutral[100],
                  color: DESIGN.colors.primary[400]
                }}
              >
                <Bell size={20} />
                <span className="text-xs font-medium">{pendenciasMensalistas}</span>
              </button>
            )}

            <button
              onClick={() => {
                onToggleCaixa();
                setShowMenuMobile(false);
              }}
              className="flex flex-col items-center gap-1 p-3 rounded-lg transition-colors"
              style={{
                backgroundColor: DESIGN.colors.neutral[100],
                color: DESIGN.colors.primary[400]
              }}
            >
              {mostrarCaixa ? <Eye size={20} /> : <EyeOff size={20} />}
              <span className="text-xs font-medium">Caixa</span>
            </button>

            <button
              onClick={() => {
                onLogout();
                setShowMenuMobile(false);
              }}
              className="flex flex-col items-center gap-1 p-3 rounded-lg transition-colors"
              style={{
                backgroundColor: DESIGN.colors.neutral[100],
                color: DESIGN.colors.danger[500]
              }}
            >
              <LogOut size={20} />
              <span className="text-xs font-medium">Sair</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default HeaderRedesenhado;
