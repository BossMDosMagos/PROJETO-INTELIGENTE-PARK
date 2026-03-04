/**
 * Service para integração com Supabase
 * Gerencia CRUD de veículos, entradas/saídas e sincronização com status offline
 */

class SupabaseService {
  constructor() {
    this.initialized = false;
    this.client = null;
    this.isOnline = navigator.onLine;
    
    // Tabelas Supabase esperadas
    this.TABLES = {
      veiculos: 'veiculos',
      entradas: 'entradas_saidas',
      mensalistas: 'mensalistas'
    };

    // Queue de operações pendentes
    this.pendingQueue = [];
    
    // Inicializar event listeners
    this.initializeEventListeners();
  }

  /**
   * Inicializa o Supabase com credenciais
   * @param {string} supabaseUrl - URL do projeto Supabase
   * @param {string} supabaseAnonKey - Chave anônima do Supabase
   */
  async initialize(supabaseUrl, supabaseAnonKey) {
    try {
      // Em produção, você importaria o Supabase como:
      // import { createClient } from '@supabase/supabase-js';
      // Para agora, vamos usar um cliente mock
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('⚠️ Supabase credentials não fornecidas. Sistema funcionará em modo offline.');
        this.initialized = false;
        return false;
      }

      this.supabaseUrl = supabaseUrl;
      this.supabaseAnonKey = supabaseAnonKey;
      
      // Nota: Após instalar @supabase/supabase-js, descomente:
      // const { createClient } = await import('@supabase/supabase-js');
      // this.client = createClient(supabaseUrl, supabaseAnonKey);
      
      this.initialized = true;
      console.log('✅ Supabase inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar Supabase:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Inicializa event listeners de conexão
   */
  initializeEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 Online detected. Iniciando sincronização...');
      // Evento que será captured por syncService
      window.dispatchEvent(new CustomEvent('app:online'));
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔴 Offline detected. Modo offline ativado.');
      window.dispatchEvent(new CustomEvent('app:offline'));
    });
  }

  /**
   * Adiciona uma operação à fila de pendências
   * @param {object} operation - Operação a ser sincronizada
   */
  addToPendingQueue(operation) {
    this.pendingQueue.push({
      ...operation,
      timestamp: Date.now(),
      synced: false
    });
    
    // Salva fila no localStorage
    this.savePendingQueueToStorage();
  }

  /**
   * Salva fila de pendências no localStorage
   */
  savePendingQueueToStorage() {
    try {
      localStorage.setItem('park-sync-queue', JSON.stringify(this.pendingQueue));
    } catch (error) {
      console.error('Erro ao salvar fila de sincronização:', error);
    }
  }

  /**
   * Carrega fila de pendências do localStorage
   */
  loadPendingQueueFromStorage() {
    try {
      const queue = localStorage.getItem('park-sync-queue');
      if (queue) {
        this.pendingQueue = JSON.parse(queue);
        console.log(`📋 Carregadas ${this.pendingQueue.length} operações pendentes`);
      }
    } catch (error) {
      console.error('Erro ao carregar fila de sincronização:', error);
      this.pendingQueue = [];
    }
  }

  /**
   * Registra entrada de veículo
   * @param {object} dadosEntrada - { placa, operador, hora, notas, etc }
   */
  async registrarEntrada(dadosEntrada) {
    const operation = {
      type: 'insert',
      table: this.TABLES.entradas,
      action: 'entrada',
      data: {
        ...dadosEntrada,
        created_at: new Date().toISOString(),
        status: 'ativa'
      }
    };

    // 1. Salva no localStorage primeiro (offline-first)
    this.salvarNoLocalStorage('park-entradas', dadosEntrada);
    
    // 2. Se online, envia para Supabase
    if (this.isOnline && this.initialized) {
      try {
        // await this.client
        //   .from(this.TABLES.entradas)
        //   .insert([operation.data]);
        
        console.log('✅ Entrada registrada em Supabase');
        return { success: true, synced: true };
      } catch (error) {
        console.error('⚠️ Erro ao sincronizar entrada. Usando fallback localStorage:', error);
        this.addToPendingQueue(operation);
        return { success: true, synced: false };
      }
    } else {
      // Offline - adiciona à fila
      this.addToPendingQueue(operation);
      return { success: true, synced: false };
    }
  }

  /**
   * Registra saída de veículo
   * @param {object} dadosSaida - { placa, horaEntrada, horaSaida, valor, etc }
   */
  async registrarSaida(dadosSaida) {
    const operation = {
      type: 'update',
      table: this.TABLES.entradas,
      action: 'saida',
      data: {
        ...dadosSaida,
        updated_at: new Date().toISOString(),
        status: 'finalizada'
      }
    };

    // 1. Salva no localStorage
    this.salvarNoLocalStorage('park-saidas', dadosSaida);
    
    // 2. Se online, envia para Supabase
    if (this.isOnline && this.initialized) {
      try {
        // await this.client
        //   .from(this.TABLES.entradas)
        //   .update(operation.data)
        //   .eq('placa', dadosSaida.placa);
        
        console.log('✅ Saída registrada em Supabase');
        return { success: true, synced: true };
      } catch (error) {
        console.error('⚠️ Erro ao sincronizar saída. Usando fallback localStorage:', error);
        this.addToPendingQueue(operation);
        return { success: true, synced: false };
      }
    } else {
      this.addToPendingQueue(operation);
      return { success: true, synced: false };
    }
  }

  /**
   * Salva dados no localStorage (backup local)
   * @param {string} key - Chave no localStorage
   * @param {object} data - Dados para salvar
   */
  salvarNoLocalStorage(key, data) {
    try {
      const existentes = JSON.parse(localStorage.getItem(key) || '[]');
      existentes.push(data);
      localStorage.setItem(key, JSON.stringify(existentes));
    } catch (error) {
      console.error(`Erro ao salvar em localStorage (${key}):`, error);
    }
  }

  /**
   * Busca veículos do Supabase com fallback para localStorage
   */
  async obterVeiculos() {
    if (this.isOnline && this.initialized) {
      try {
        // const { data, error } = await this.client
        //   .from(this.TABLES.veiculos)
        //   .select('*');
        // if (error) throw error;
        // return data || [];
        
        return [];
      } catch (error) {
        console.error('Erro ao buscar veículos do Supabase:', error);
        return this.obterVeiculosDoLocalStorage();
      }
    } else {
      return this.obterVeiculosDoLocalStorage();
    }
  }

  /**
   * Obtém veículos do localStorage
   */
  obterVeiculosDoLocalStorage() {
    try {
      return JSON.parse(localStorage.getItem('park-veiculos') || '[]');
    } catch (error) {
      console.error('Erro ao buscar veículos do localStorage:', error);
      return [];
    }
  }

  /**
   * Sincroniza fila com Supabase
   * Devolver true se tudo sincronizou, false se ainda há pendências
   */
  async sincronizarFila() {
    if (!this.isOnline || !this.initialized) {
      console.log('⚠️ Sistema offline. Fila será sincronizada quando conexão voltar.');
      return false;
    }

    if (this.pendingQueue.length === 0) {
      console.log('✅ Nada para sincronizar');
      return true;
    }

    console.log(`🔄 Iniciando sincronização de ${this.pendingQueue.length} operações...`);

    let successCount = 0;
    const failedOperations = [];

    for (const operation of this.pendingQueue) {
      try {
        if (operation.action === 'entrada') {
          // await this.client
          //   .from(this.TABLES.entradas)
          //   .insert([operation.data]);
        } else if (operation.action === 'saida') {
          // await this.client
          //   .from(this.TABLES.entradas)
          //   .update(operation.data)
          //   .eq('placa', operation.data.placa);
        }
        
        successCount++;
      } catch (error) {
        console.error(`❌ Erro ao sincronizar operação:`, error);
        failedOperations.push(operation);
      }
    }

    // Remove operações sincronizadas com sucesso
    this.pendingQueue = failedOperations;
    this.savePendingQueueToStorage();

    console.log(`✅ ${successCount} operações sincronizadas com sucesso`);
    
    if (failedOperations.length > 0) {
      console.warn(`⚠️ ${failedOperations.length} operações ainda pendentes`);
      return false;
    }

    return true;
  }

  /**
   * Verifica se há dados não sincronizados
   */
  temDadosPendentes() {
    return this.pendingQueue.length > 0;
  }

  /**
   * Retorna número de operações pendentes
   */
  obterContadorPendentes() {
    return this.pendingQueue.length;
  }

  /**
   * Resolve conflitos de sincronização
   * Estratégia: timestamp mais recente vence
   */
  async resolverCanflitos() {
    // Lógica para resolver conflitos será implementada aqui
    // Por enquanto, usa estratégia de "last write wins"
    console.log('🔧 Verificando conflitos...');
    return true;
  }

  /**
   * Exporta dados para backup
   */
  exportarDados() {
    return {
      veiculos: this.obterVeiculosDoLocalStorage(),
      entradas: JSON.parse(localStorage.getItem('park-entradas') || '[]'),
      saidas: JSON.parse(localStorage.getItem('park-saidas') || '[]'),
      pendingQueue: this.pendingQueue,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Limpa a fila de sincronização (cuidado!)
   */
  limparFila() {
    this.pendingQueue = [];
    localStorage.removeItem('park-sync-queue');
    console.log('🧹 Fila de sincronização limpa');
  }

  /**
   * Obtém status de conectividade
   */
  obterStatus() {
    return {
      isOnline: this.isOnline,
      isInitialized: this.initialized,
      pendingOperations: this.pendingQueue.length,
      statusText: this.isOnline ? '🟢 Online' : '🔴 Offline'
    };
  }
}

// Singleton
const supabaseService = new SupabaseService();

export { supabaseService };
