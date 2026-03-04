/**
 * Service para integração com Supabase
 * Gerencia CRUD de veículos, entradas/saídas e sincronização com status offline
 * Com autenticação completa e suporte a RBAC
 */

import { createClient } from '@supabase/supabase-js';

class SupabaseService {
  constructor() {
    this.initialized = false;
    this.client = null;
    this.isOnline = navigator.onLine;
    this.usuarioAtual = null;
    this.sessaoAtual = null;
    this.listeners = [];
    
    // Tabelas Supabase esperadas
    this.TABLES = {
      veiculos: 'veiculos',
      entradas: 'entradas_saidas',
      mensalistas: 'mensalistas',
      unidades: 'unidades',
      perfis: 'perfis',
      politicas_acesso: 'politicas_acesso',
      tickets: 'tickets',
      auditoria: 'auditoria'
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
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase credentials não fornecidas!');
        console.error('Adicione ao .env.local:');
        console.error('  VITE_SUPABASE_URL=https://seu-projeto.supabase.co');
        console.error('  VITE_SUPABASE_ANON_KEY=sua-chave-anonima');
        this.initialized = false;
        return false;
      }

      this.supabaseUrl = supabaseUrl;
      this.supabaseAnonKey = supabaseAnonKey;
      
      this.client = createClient(supabaseUrl, supabaseAnonKey);
      
      // Restaurar sessão se existir
      const { data } = await this.client.auth.getSession();
      if (data.session) {
        this.usuarioAtual = data.session.user;
        this.sessaoAtual = data.session;
        console.log(`✅ Sessão restaurada: ${data.session.user.email}`);
      }
      
      // Escutar mudanças de autenticação
      this.client.auth.onAuthStateChange((event, session) => {
        console.log(`🔐 Evento auth: ${event}`, session?.user?.email);
        this.usuarioAtual = session?.user || null;
        this.sessaoAtual = session;
        this.notificarListeners('auth', { event, session });
      });
      
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
   * ✅ Login com email e senha
   */
  async login(email, senha) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      console.log(`🔑 Tentando login com ${email}...`);

      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password: senha
      });

      if (error) throw error;

      this.usuarioAtual = data.user;
      this.sessaoAtual = data.session;

      console.log(`✅ Login bem-sucedido: ${email}`);
      return { sucesso: true, usuario: data.user };

    } catch (erro) {
      console.error('❌ Erro ao fazer login:', erro.message);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * ✅ Logout
   */
  async logout() {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;

      this.usuarioAtual = null;
      this.sessaoAtual = null;

      console.log('✅ Logout bem-sucedido');
      return { sucesso: true };

    } catch (erro) {
      console.error('❌ Erro ao fazer logout:', erro.message);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * ✅ Verificar se está autenticado
   */
  estaAutenticado() {
    return !!this.usuarioAtual;
  }

  /**
   * ✅ Obter usuário atual
   */
  obterUsuarioAtual() {
    return this.usuarioAtual;
  }

  /**
   * ✅ Testar conexão com banco de dados
   */
  async testarConexao() {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      const { data, error } = await this.client
        .from('politicas_acesso')
        .select('*')
        .limit(1);

      if (error) throw error;

      console.log('✅ Conexão com banco de dados OK');
      return { sucesso: true, dados: data };

    } catch (erro) {
      console.error('❌ Erro ao conectar com banco de dados:', erro.message);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Notifica listeners de mudanças
   */
  notificarListeners(tipo, dados) {
    this.listeners.forEach(callback => {
      try {
        callback({ tipo, dados });
      } catch (erro) {
        console.error('❌ Erro em listener:', erro);
      }
    });
  }

  /**
   * Escuta mudanças
   */
  onMudanca(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }


  /**
   * Inicializa event listeners de conexão
   */
  initializeEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 Online detected. Iniciando sincronização...');
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

    this.salvarNoLocalStorage('park-entradas', dadosEntrada);
    
    if (this.isOnline && this.initialized) {
      try {
        const { data, error } = await this.client
          .from(this.TABLES.entradas)
          .insert([operation.data])
          .select()
          .single();

        if (error) throw error;
        
        console.log('✅ Entrada registrada em Supabase');
        return { success: true, synced: true, data };
      } catch (error) {
        console.error('⚠️ Erro ao sincronizar entrada:', error.message);
        this.addToPendingQueue(operation);
        return { success: true, synced: false };
      }
    } else {
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

    this.salvarNoLocalStorage('park-saidas', dadosSaida);
    
    if (this.isOnline && this.initialized) {
      try {
        const { data, error } = await this.client
          .from(this.TABLES.entradas)
          .update(operation.data)
          .eq('placa', dadosSaida.placa)
          .select()
          .single();

        if (error) throw error;
        
        console.log('✅ Saída registrada em Supabase');
        return { success: true, synced: true, data };
      } catch (error) {
        console.error('⚠️ Erro ao sincronizar saída:', error.message);
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
   * Busca dados com filtros
   */
  async obterDados(tabela, opcoes = {}) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado', dados: [] };
    }

    try {
      let query = this.client.from(tabela).select(opcoes.select || '*');

      if (opcoes.filtro) {
        query = query.eq(opcoes.filtro.coluna, opcoes.filtro.valor);
      }

      if (opcoes.ordem) {
        query = query.order(opcoes.ordem.coluna, {
          ascending: opcoes.ordem.asc !== false
        });
      }

      if (opcoes.limite) {
        query = query.limit(opcoes.limite);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { sucesso: true, dados: data || [] };

    } catch (erro) {
      console.error(`❌ Erro ao obter dados de ${tabela}:`, erro.message);
      return { sucesso: false, erro: erro.message, dados: [] };
    }
  }

  /**
   * Busca veículos do Supabase com fallback para localStorage
   */
  async obterVeiculos() {
    if (this.isOnline && this.initialized) {
      try {
        const { sucesso, dados } = await this.obterDados(this.TABLES.veiculos);
        if (sucesso) return dados || [];
        return this.obterVeiculosDoLocalStorage();
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
   * Inserir dados
   */
  async inserir(tabela, dados) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      const { data, error } = await this.client
        .from(tabela)
        .insert([dados])
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Inserido em ${tabela}:`, data.id || data);
      return { sucesso: true, dados: data };

    } catch (erro) {
      console.error(`❌ Erro ao inserir em ${tabela}:`, erro.message);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Atualizar dados
   */
  async atualizar(tabela, id, dados) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      const { data, error } = await this.client
        .from(tabela)
        .update(dados)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Atualizado em ${tabela}:`, id);
      return { sucesso: true, dados: data };

    } catch (erro) {
      console.error(`❌ Erro ao atualizar ${tabela}:`, erro.message);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Deletar dados
   */
  async deletar(tabela, id) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      const { error } = await this.client
        .from(tabela)
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log(`✅ Deletado de ${tabela}:`, id);
      return { sucesso: true };

    } catch (erro) {
      console.error(`❌ Erro ao deletar de ${tabela}:`, erro.message);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Sincroniza fila com Supabase
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
          await this.client
            .from(this.TABLES.entradas)
            .insert([operation.data]);
        } else if (operation.action === 'saida') {
          await this.client
            .from(this.TABLES.entradas)
            .update(operation.data)
            .eq('placa', operation.data.placa);
        }
        
        successCount++;
      } catch (error) {
        console.error(`❌ Erro ao sincronizar operação:`, error);
        failedOperations.push(operation);
      }
    }

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
      autenticado: this.estaAutenticado(),
      usuario: this.usuarioAtual?.email || null,
      pendingOperations: this.pendingQueue.length,
      statusText: this.isOnline ? '🟢 Online' : '🔴 Offline'
    };
  }
}


// Singleton
const supabaseService = new SupabaseService();

export { supabaseService, SupabaseService };

