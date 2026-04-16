/**
 * Serviço de Sincronização Offline-First
 * 
 * Responsável por:
 * - Manter fila de operações quando offline
 * - Sincronizar automaticamente quando online
 * - Resolver conflitos de sincronização
 * - Gerenciar cache local
 * - Detectar mudanças em tempo real
 */

import { supabaseService } from './supabaseService';

export class OfflineSyncService {
  constructor() {
    this.storageKey = 'park-offline-queue';
    this.cacheKey = 'park-cache';
    this.metadataKey = 'park-sync-metadata';
    
    this.isOnline = navigator.onLine;
    this.isSyncing = false;
    this.syncQueue = [];
    this.listeners = [];

    // Escutar mudanças de conectividade
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Sincronizar a cada 30 segundos quando online
    setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.sincronizar();
      }
    }, 30000);
  }

  /**
   * ✅ Adicionar operação à fila (quando offline)
   * 
   * @param {string} tabela - Nome da tabela (tickets, mensalistas, etc)
   * @param {string} tipo - INSERT, UPDATE, DELETE
   * @param {object} registro - Dados para sincronizar
   * @param {UUID} opId - ID único da operação
   */
  async adicionarOperacao(tabela, tipo, registro, opId = null) {
    const operacao = {
      id: opId || crypto.randomUUID(),
      tabela,
      tipo,
      registro,
      timestamp: new Date().toISOString(),
      synced: false,
      retryCount: 0,
      lastError: null
    };

    this.syncQueue.push(operacao);
    this.salvarFila();

    console.log(`📤 Operação adicionada à fila (${this.isOnline ? 'online' : 'offline'})`, {
      tabela,
      tipo,
      id: operacao.id
    });

    // Se estamos online, sincronizar imediatamente
    if (this.isOnline) {
      await this.sincronizar();
    }

    return operacao.id;
  }

  /**
   * ✅ Sincronizar fila com Supabase
   */
  async sincronizar() {
    if (this.isSyncing || !this.isOnline) {
      return;
    }

    this.isSyncing = true;
    const syncId = crypto.randomUUID();
    let operacoesSincronizadas = 0;
    let erros = [];

    console.log('🔄 Iniciando sincronização...', syncId);
    this.notificarListeners('sync_start', { syncId });

    try {
      for (const operacao of this.syncQueue) {
        if (operacao.synced) continue;

        try {
          await this.sincronizarOperacao(operacao);
          operacao.synced = true;
          operacoesSincronizadas++;
        } catch (erro) {
          operacao.retryCount++;
          operacao.lastError = erro.message;

          // Remover após 3 tentativas falhadas
          if (operacao.retryCount >= 3) {
            console.error('❌ Operação descartada após 3 tentativas:', operacao);
            this.syncQueue = this.syncQueue.filter(o => o.id !== operacao.id);
          }

          erros.push({
            operacao: operacao.id,
            erro: erro.message
          });
        }
      }

      // Limpar fila de operações sincronizadas
      this.syncQueue = this.syncQueue.filter(o => !o.synced);
      this.salvarFila();

      // Registrar log de sincronização
      await this.registrarSyncLog(syncId, operacoesSincronizadas, erros);

      console.log(`✅ Sincronização concluída: ${operacoesSincronizadas} operações sincronizadas`, syncId);
      this.notificarListeners('sync_complete', {
        syncId,
        operacoesSincronizadas,
        erros
      });
    } catch (erro) {
      console.error('❌ Erro geral na sincronização:', erro);
      this.notificarListeners('sync_error', { erro: erro.message });
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sincronizar uma operação específica
   */
  async sincronizarOperacao(operacao) {
    const { tabela, tipo, registro } = operacao;

    try {
      let resultado;

      if (tipo === 'INSERT') {
        const { error } = await supabaseService.client
          .from(tabela)
          .insert([registro]);
        if (error) throw error;

      } else if (tipo === 'UPDATE') {
        const { error } = await supabaseService.client
          .from(tabela)
          .update(registro)
          .eq('id', registro.id);
        if (error) throw error;

      } else if (tipo === 'DELETE') {
        const { error } = await supabaseService.client
          .from(tabela)
          .delete()
          .eq('id', registro.id);
        if (error) throw error;
      }

      console.log(`✅ Operação sincronizada: ${tabela}.${tipo}`, operacao.id);
    } catch (erro) {
      throw new Error(`Erro ao sincronizar ${tabela}: ${erro.message}`);
    }
  }

  /**
   * ✅ Registrar log de sincronização no Supabase
   */
  async registrarSyncLog(syncId, operacoesSincronizadas, erros) {
    try {
      const { error } = await supabaseService.client
        .from('sync_log')
        .insert([{
          sync_id: syncId,
          device_id: this.obterDeviceId(),
          user_id: supabaseService.usuarioAtual?.id,
          unidade_id: null,
          status: erros.length === 0 ? 'SYNCED' : 'FAILED',
          operacoes_count: this.syncQueue.length,
          operacoes_sincronizadas: operacoesSincronizadas,
          erro_mensagem: erros.length > 0 ? JSON.stringify(erros) : null,
          completed_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (erro) {
      console.warn('⚠️ Erro ao registrar sync_log:', erro);
    }
  }

  /**
   * ✅ Carregar fila do localStorage
   */
  carregarFila() {
    try {
      const dados = localStorage.getItem(this.storageKey);
      if (dados) {
        this.syncQueue = JSON.parse(dados);
        console.log(`📥 Fila carregada: ${this.syncQueue.length} operações pendentes`);
      }
    } catch (erro) {
      console.error('❌ Erro ao carregar fila:', erro);
      this.syncQueue = [];
    }
  }

  /**
   * ✅ Salvar fila no localStorage
   */
  salvarFila() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.syncQueue));
    } catch (erro) {
      console.error('❌ Erro ao salvar fila:', erro);
    }
  }

  /**
   * ✅ Atualizar cache local
   */
  async atualizarCache(tabela, chave, valor) {
    try {
      let cache = this.obterCache();
      
      if (!cache[tabela]) {
        cache[tabela] = {};
      }

      cache[tabela][chave] = valor;
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));

      console.log(`💾 Cache atualizado: ${tabela}.${chave}`);
    } catch (erro) {
      console.error('❌ Erro ao atualizar cache:', erro);
    }
  }

  /**
   * ✅ Obter cache local
   */
  obterCache() {
    try {
      const dados = localStorage.getItem(this.cacheKey);
      return dados ? JSON.parse(dados) : {};
    } catch {
      return {};
    }
  }

  /**
   * ✅ Limpar cache
   */
  limparCache() {
    localStorage.removeItem(this.cacheKey);
    console.log('🗑️ Cache limpo');
  }

  /**
   * ✅ Obter ID do dispositivo (único por navegador)
   */
  obterDeviceId() {
    let deviceId = localStorage.getItem('device-id');
    
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('device-id', deviceId);
    }

    return deviceId;
  }

  /**
   * ✅ Obter status de sincronização
   */
  obterStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      filaCount: this.syncQueue.length,
      fila: this.syncQueue.map(o => ({
        id: o.id,
        tabela: o.tabela,
        tipo: o.tipo,
        synced: o.synced,
        retryCount: o.retryCount,
        erro: o.lastError
      }))
    };
  }

  /**
   * ✅ Escutar mudanças de status
   */
  onMudancaStatus(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notificar listeners
   */
  notificarListeners(evento, dados) {
    this.listeners.forEach(callback => {
      try {
        callback({ evento, dados, status: this.obterStatus() });
      } catch (erro) {
        console.error('❌ Erro em listener:', erro);
      }
    });
  }

  /**
   * Evento: conectou
   */
  private handleOnline() {
    console.log('🟢 Online detectado');
    this.isOnline = true;
    this.notificarListeners('online', {});
    this.sincronizar();
  }

  /**
   * Evento: desconectou
   */
  private handleOffline() {
    console.log('🔴 Offline detectado');
    this.isOnline = false;
    this.notificarListeners('offline', {});
  }

  /**
   * ✅ Exportar dados para backup
   */
  exportarDados() {
    return {
      fila: this.syncQueue,
      cache: this.obterCache(),
      metadata: {
        deviceId: this.obterDeviceId(),
        exportadoEm: new Date().toISOString()
      }
    };
  }

  /**
   * ✅ Importar dados de backup
   */
  importarDados(dados) {
    try {
      if (dados.fila) {
        this.syncQueue = dados.fila;
        this.salvarFila();
      }

      if (dados.cache) {
        localStorage.setItem(this.cacheKey, JSON.stringify(dados.cache));
      }

      console.log('📥 Dados importados com sucesso');
    } catch (erro) {
      console.error('❌ Erro ao importar dados:', erro);
      throw erro;
    }
  }
}

/**
 * Instância única
 */
export const offlineSyncService = new OfflineSyncService();

// Carregar fila ao inicializar
offlineSyncService.carregarFila();

/**
 * ✅ Hook React para usar no frontend
 * 
 * Exemplo:
 * const { isOnline, filaCount } = useSyncStatus();
 * 
 * if (!isOnline) {
 *   return <div>Offline - Dados serão sincronizados quando conectar</div>;
 * }
 */
export function useSyncStatus() {
  const [status, setStatus] = React.useState(() => offlineSyncService.obterStatus());

  React.useEffect(() => {
    const unsubscribe = offlineSyncService.onMudancaStatus((dados) => {
      setStatus(dados.status);
    });

    return unsubscribe;
  }, []);

  return status;
}
