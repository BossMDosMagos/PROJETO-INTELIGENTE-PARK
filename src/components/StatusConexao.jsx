import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader } from 'lucide-react';
import { syncService } from '../services/syncService';

/**
 * Componente de Status de Conexão
 * Exibe LED 3D indicando se está online/offline
 * Mostra contador de operações pendentes de sincronização
 */
export function StatusConexao() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Carrega estado inicial
    const status = syncService.obterStatus();
    setIsOnline(status.isOnline);
    setPendingCount(status.pendingItems);

    // Listener para mudanças de status
    const unsubscribe = syncService.onStatusChange((status, data) => {
      switch (status) {
        case 'online':
          setIsOnline(true);
          break;
        case 'offline':
          setIsOnline(false);
          break;
        case 'syncing':
          setIsSyncing(true);
          break;
        case 'synced':
          setIsSyncing(false);
          setPendingCount(0);
          setLastSyncTime(new Date());
          break;
        case 'partial-sync':
          setIsSyncing(false);
          const newStatus = syncService.obterStatus();
          setPendingCount(newStatus.pendingItems);
          setLastSyncTime(new Date());
          break;
        case 'sync-error':
          setIsSyncing(false);
          console.error('Erro de sincronização:', data);
          break;
        default:
          break;
      }

      // Atualiza contador
      setPendingCount(syncService.obterContagemPendentes());
    });

    return () => unsubscribe();
  }, []);

  // Para efeito visual, update contador periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingCount(syncService.obterContagemPendentes());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncNow = async (e) => {
    e.stopPropagation();
    setIsSyncing(true);
    try {
      await syncService.sincronizarAgora();
    } finally {
      setIsSyncing(false);
    }
  };

  // Formata tempo desde última sincronização
  const formatLastSyncTime = () => {
    if (!lastSyncTime) return 'Nunca sincronizado';
    
    const now = new Date();
    const diff = now - lastSyncTime;
    const minutes = Math.floor(diff / 60000);

    if (minutes === 0) return 'Agora mesmo';
    if (minutes < 60) return `há ${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    
    return lastSyncTime.toLocaleString('pt-BR');
  };

  return (
    <div className="relative">
      {/* Botão principal */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
          transition-all duration-300
          ${isOnline
            ? 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200'
            : 'bg-red-100 text-red-800 border-2 border-red-300 hover:bg-red-200'
          }
          shadow-lg hover:shadow-xl
          relative
        `}
        title={isOnline ? 'Online - Clique para detalhes' : 'Offline - Clique para detalhes'}
      >
        {/* LED 3D com animação */}
        <div className="relative">
          <div
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${isOnline
                ? 'bg-green-500 shadow-lg shadow-green-500'
                : 'bg-red-500 shadow-lg shadow-red-500'
              }
              ${isOnline ? 'animate-pulse' : ''}
            `}
            style={
              isOnline
                ? {
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                  }
                : {
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.4), inset 0 1px 2px rgba(0, 0, 0, 0.3)'
                  }
            }
          />
          {/* Brilho do LED */}
          {isOnline && (
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
                width: '12px',
                height: '12px',
                left: '-4.5px',
                top: '-4.5px'
              }}
            />
          )}
        </div>

        {/* Texto de status */}
        <span className="font-bold">
          {isOnline ? '🟢 Sincronizado' : '🔴 Offline'}
        </span>

        {/* Contador de pendências */}
        {pendingCount > 0 && (
          <span className={`
            ml-2 px-2 py-0.5 rounded-full text-xs font-bold
            ${isOnline
              ? 'bg-yellow-300 text-yellow-900'
              : 'bg-red-300 text-red-900'
            }
          `}>
            {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
          </span>
        )}

        {/* Ícone de sincronização */}
        {isSyncing && (
          <Loader className="w-4 h-4 animate-spin" />
        )}
      </button>

      {/* Painel de detalhes (dropdown) */}
      {showDetails && (
        <div
          className="
            absolute top-full right-0 mt-2 z-50
            bg-white border-2 border-gray-300 rounded-lg shadow-2xl
            min-w-80 overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
          "
          style={{
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
          }}
        >
          {/* Header */}
          <div
            className={`
              px-4 py-3 font-bold text-white
              ${isOnline ? 'bg-green-500' : 'bg-red-500'}
            `}
          >
            Status de Conexão
          </div>

          {/* Corpo */}
          <div className="p-4 space-y-3">
            {/* Status Online/Offline */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Status:</span>
              <span className={`font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? (
                  <span className="flex items-center gap-1">
                    <Wifi className="w-4 h-4" /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <WifiOff className="w-4 h-4" /> Offline
                  </span>
                )}
              </span>
            </div>

            {/* Itens Pendentes */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-gray-700 font-semibold">Pendentes:</span>
              <span className="font-bold text-lg">
                {pendingCount > 0 ? (
                  <span className="text-yellow-600">{pendingCount}</span>
                ) : (
                  <span className="text-green-600">0</span>
                )}
              </span>
            </div>

            {/* Última Sincronização */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-gray-700 font-semibold text-sm">Última sync:</span>
              <span className="text-gray-600 text-sm">{formatLastSyncTime()}</span>
            </div>

            {/* Modo de Funcionamento */}
            <div className="border-t pt-3 mt-3">
              <span className="text-xs text-gray-600">
                {isOnline
                  ? '💾 Offline-first: Dados salvos localmente e sincronizados com Supabase'
                  : '📱 Modo offline: Dados salvos no localStorage até conexão ser restaurada'}
              </span>
            </div>

            {/* Botão de Sincronizar Agora */}
            {isOnline && pendingCount > 0 && (
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className={`
                  w-full mt-4 px-4 py-2 rounded-lg font-bold text-white
                  transition-all duration-300
                  ${isSyncing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                  }
                  flex items-center justify-center gap-2
                `}
              >
                {isSyncing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    🔄 Sincronizar Agora
                  </>
                )}
              </button>
            )}

            {/* Info de offline */}
            {!isOnline && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                ⚠️ Modo offline ativado. Todos os registros serão sincronizados quando a conexão voltar.
              </div>
            )}

            {/* Info de sucesso */}
            {isOnline && pendingCount === 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                ✅ Tudo sincronizado! Seu sistema está atualizado.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t text-center">
            <span className="text-xs text-gray-500">Clique fora para fechar</span>
          </div>
        </div>
      )}

      {/* Overlay para fechar dropdown */}
      {showDetails && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDetails(false)}
        />
      )}

      {/* Estilos inline para animação pulse customizada */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3);
          }
          50% {
            opacity: 0.7;
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
