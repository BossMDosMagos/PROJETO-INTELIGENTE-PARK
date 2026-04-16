/**
 * Service de Sincronização Automática
 * Gerencia sincronização entre localStorage e Supabase
 * Detecta reconexão e sincroniza automaticamente
 */

import { supabaseService } from './supabaseService';

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.syncInterval = null;
    this.listeners = [];
    
    // Configurações
    this.config = {
      syncIntervalMs: 30000, // 30 segundos - sincronizar periodicamente
      retryAttempts: 3,
      retryDelayMs: 5000,
      maxPendingItems: 1000
    };

    this.initializeListeners();
  }

  /**
   * Inicializa listeners de sincronização
   */
  initializeListeners() {
    // Evento online nativo
    window.addEventListener('online', () => this.handleOnline());
    
    // Evento offline nativo
    window.addEventListener('offline', () => this.handleOffline());

    // Evento customizado do app
    window.addEventListener('app:online', () => this.handleOnline());
    window.addEventListener('app:offline', () => this.handleOffline());
  }

  /**
   * Handler para quando volta online
   */
  handleOnline() {
    this.isOnline = true;
    console.log('🟢 SyncService: Online detectado!');
    this.notifyListeners('online');
    
    // Sincroniza imediatamente
    this.sincronizarAgora();
  }

  /**
   * Handler para quando fica offline
   */
  handleOffline() {
    this.isOnline = false;
    console.log('🔴 SyncService: Offline detectado!');
    this.notifyListeners('offline');
  }

  /**
   * Sincroniza dados pendentes AGORA
   */
  async sincronizarAgora() {
    if (this.syncInProgress) {
      console.log('⏳ Sincronização já em progresso');
      return false;
    }

    if (!this.isOnline) {
      console.log('🔴 Sistema offline. Fila será sincronizada quando conectar.');
      return false;
    }

    this.syncInProgress = true;
    this.notifyListeners('syncing');

    try {
      console.log('🔄 Iniciando sincronização...');
      const resultado = await supabaseService.sincronizarFila();
      
      if (resultado) {
        console.log('✅ Sincronização completa!');
        this.notifyListeners('synced');
      } else {
        console.warn('⚠️ Sincronização parcial. Ainda há itens pendentes.');
        this.notifyListeners('partial-sync');
      }

      return resultado;
    } catch (error) {
      console.error('❌ Erro durante sincronização:', error);
      this.notifyListeners('sync-error', error);
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Inicia sincronização periódica
   */
  iniciarSincronizacaoPeriodica() {
    if (this.syncInterval) {
      console.log('⚠️ Sincronização periódica já está ativa');
      return;
    }

    console.log(`⏱️ Iniciando sincronização periódica (a cada ${this.config.syncIntervalMs / 1000}s)`);

    this.syncInterval = setInterval(() => {
      if (this.isOnline && supabaseService.temDadosPendentes()) {
        console.log('📡 Sincronização periódica acionada');
        this.sincronizarAgora();
      }
    }, this.config.syncIntervalMs);
  }

  /**
   * Para sincronização periódica
   */
  pararSincronizacaoPeriodica() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏸️ Sincronização periódica parada');
    }
  }

  /**
   * Sincroniza com retry automático
   */
  async sincronizarComRetry(tentativa = 1) {
    try {
      const resultado = await this.sincronizarAgora();
      return resultado;
    } catch (error) {
      if (tentativa < this.config.retryAttempts) {
        console.log(`🔄 Tentativa ${tentativa} falhou. Retentando em ${this.config.retryDelayMs}ms...`);
        await this.delay(this.config.retryDelayMs);
        return this.sincronizarComRetry(tentativa + 1);
      } else {
        console.error(`❌ Falha após ${this.config.retryAttempts} tentativas`);
        throw error;
      }
    }
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Registra listener para eventos de sincronização
   * @param {function} callback - Função chamada quando estado muda
   */
  onStatusChange(callback) {
    this.listeners.push(callback);
    
    // Retorna função para desregistrar
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notifica listeners sobre mudança de status
   */
  notifyListeners(status, data = null) {
    this.listeners.forEach(listener => {
      try {
        listener(status, data);
      } catch (error) {
        console.error('Erro em listener de sincronização:', error);
      }
    });
  }

  /**
   * Obtém status atual do sync
   */
  obterStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      pendingItems: supabaseService.obterContadorPendentes(),
      statusText: this.isOnline ? '🟢 Sincronizado' : '🔴 Modo Offline'
    };
  }

  /**
   * Obtém detalhes completos
   */
  obterDetalhes() {
    return {
      ...this.obterStatus(),
      config: this.config,
      supabaseStatus: supabaseService.obterStatus()
    };
  }

  /**
   * Configura intervalo de sincronização periódica
   */
  configurarIntervaloSync(ms) {
    this.config.syncIntervalMs = ms;
    
    if (this.syncInterval) {
      this.pararSincronizacaoPeriodica();
      this.iniciarSincronizacaoPeriodica();
    }
  }

  /**
   * Força sincronização urgente
   */
  async sincronizarUrgente() {
    console.log('🚨 Sincronização urgente acionada');
    return await this.sincronizarComRetry();
  }

  /**
   * Obtém número de itens pendentes
   */
  obterContagemPendentes() {
    return supabaseService.obterContadorPendentes();
  }

  /**
   * Verifica conectividade real (ping ao servidor)
   */
  async verificarConectividade(url = 'https://api.supabase.com/health') {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        no_cors: true
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Debug: mostra fila de sincronização
   */
  debugShowQueue() {
    const queue = supabaseService.pendingQueue;
    console.group('📋 Fila de Sincronização');
    console.log(`Total de itens: ${queue.length}`);
    queue.forEach((item, index) => {
      console.log(`${index + 1}. [${item.action}] - ${item.table} - ${new Date(item.timestamp).toLocaleString()}`);
    });
    console.groupEnd();
    return queue;
  }

  /**
   * Limpa fila (CUIDADO!)
   */
  limparFilaSemConfirmacao() {
    supabaseService.limparFila();
    console.log('🧹 Fila de sincronização limpa');
  }
}

// Singleton
const syncService = new SyncService();

export { syncService };
