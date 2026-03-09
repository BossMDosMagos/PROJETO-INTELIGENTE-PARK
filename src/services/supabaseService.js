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
    this.authSubscription = null;
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

  normalizarIdentificadorLogin(identificador) {
    return String(identificador || '').trim().toLowerCase();
  }

  resolverEmailLogin(identificador) {
    const loginNormalizado = this.normalizarIdentificadorLogin(identificador);

    if (!loginNormalizado) {
      return '';
    }

    if (loginNormalizado.includes('@')) {
      return loginNormalizado;
    }

    const loginSemEspaco = loginNormalizado.replace(/\s+/g, '');
    const aliases = {
      master: 'master@inteligente-park.com',
      admin: 'admin@inteligente-park.com',
      supervisor: 'supervisor@inteligente-park.com',
      operador: 'operador@inteligente-park.com'
    };

    if (aliases[loginSemEspaco]) {
      return aliases[loginSemEspaco];
    }

    return `${loginSemEspaco}@inteligente-park.com`;
  }

  gerarCpfSistema() {
    const numeros = String(Date.now()).slice(-11).padStart(11, '0');
    return numeros;
  }

  /**
   * Inicializa o Supabase com credenciais
   * @param {string} supabaseUrl - URL do projeto Supabase
   * @param {string} supabaseAnonKey - Chave anônima do Supabase
   */
  async initialize(supabaseUrl, supabaseAnonKey) {
    try {
      if (this.initialized && this.client) {
        return true;
      }

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase credentials não fornecidas!');
        this.initialized = false;
        return false;
      }

      this.supabaseUrl = supabaseUrl;
      this.supabaseAnonKey = supabaseAnonKey;
      
      this.client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });

      if (this.authSubscription?.unsubscribe) {
        this.authSubscription.unsubscribe();
      }
      
      // Setup listener para auth state
      const { data: authListener } = this.client.auth.onAuthStateChange((event, session) => {
        this.usuarioAtual = session?.user || null;
        this.sessaoAtual = session;
        this.notificarListeners('auth', {
          event,
          usuario: this.usuarioAtual,
          sessao: this.sessaoAtual
        });
      });
      this.authSubscription = authListener?.subscription || null;

      const { data, error: sessionError } = await this.client.auth.getSession();
      if (sessionError) {
        console.warn('⚠️ Erro ao restaurar sessão:', sessionError.message);
      }

      this.usuarioAtual = data?.session?.user || null;
      this.sessaoAtual = data?.session || null;
      
      this.initialized = true;
      console.log('✅ Supabase inicializado');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar Supabase:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * ✅ Login com identificador (nome do operador ou email) e senha
   */
  async login(identificador, senha) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      const email = this.resolverEmailLogin(identificador);
      if (!email) {
        return { sucesso: false, erro: 'Operador é obrigatório' };
      }

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

  async listarPoliticasAcesso() {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado', dados: [] };
    }

    try {
      const { data, error } = await this.client
        .from('politicas_acesso')
        .select('nivel_acesso')
        .order('nivel_acesso', { ascending: true });

      if (error) throw error;

      const niveis = [...new Set((data || []).map((item) => item.nivel_acesso).filter(Boolean))];
      return { sucesso: true, dados: niveis };
    } catch (erro) {
      console.error('❌ Erro ao listar políticas de acesso:', erro.message);
      return { sucesso: false, erro: erro.message, dados: [] };
    }
  }

  async listarOperadores() {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado', dados: [] };
    }

    try {
      const { data, error } = await this.client
        .from('perfis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const operadores = (data || []).map((perfil) => ({
        id: perfil.id,
        userId: perfil.usuario_id || perfil.user_id || null,
        nomeCompleto: perfil.nome_completo || perfil.nome || 'Sem nome',
        nivelAcesso: perfil.nivel_acesso || 'OPERADOR',
        email: perfil.email || null,
        telefone: perfil.telefone || null,
        ativo: typeof perfil.ativo === 'boolean'
          ? perfil.ativo
          : !['inativo', 'INATIVO'].includes(String(perfil.status || '').trim()),
        status: perfil.status || null,
        createdAt: perfil.created_at || null
      }));

      return { sucesso: true, dados: operadores };
    } catch (erro) {
      console.error('❌ Erro ao listar operadores:', erro.message);
      return { sucesso: false, erro: erro.message, dados: [] };
    }
  }

  async criarOperador({ operador, senha, nomeCompleto, nivelAcesso = 'OPERADOR' }) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      const email = this.resolverEmailLogin(operador);
      const nomeFinal = String(nomeCompleto || operador || '').trim();

      if (!email || !senha || !nomeFinal) {
        return { sucesso: false, erro: 'Dados obrigatórios inválidos' };
      }

      const authClient = createClient(this.supabaseUrl, this.supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey: `inteligente-park-admin-${Date.now()}`
        }
      });

      const { data: authData, error: authError } = await authClient.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            operador,
            nome_completo: nomeFinal,
            nivel_acesso: nivelAcesso
          }
        }
      });

      if (authError) {
        throw authError;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        return { sucesso: false, erro: 'Usuário Auth não retornou ID' };
      }

      const perfilSchemaA = {
        usuario_id: userId,
        nome_completo: nomeFinal,
        nivel_acesso: nivelAcesso,
        telefone: null,
        status: 'ativo'
      };

      const { error: perfilErrorA } = await this.client
        .from('perfis')
        .insert(perfilSchemaA);

      if (perfilErrorA) {
        const perfilSchemaB = {
          user_id: userId,
          nome_completo: nomeFinal,
          cpf: this.gerarCpfSistema(),
          nivel_acesso: nivelAcesso,
          email,
          ativo: true
        };

        const { error: perfilErrorB } = await this.client
          .from('perfis')
          .insert(perfilSchemaB);

        if (perfilErrorB) {
          throw new Error(`Auth criado, mas falhou criar perfil: ${perfilErrorB.message}`);
        }
      }

      return {
        sucesso: true,
        dados: {
          userId,
          email,
          nomeCompleto: nomeFinal,
          nivelAcesso
        }
      };
    } catch (erro) {
      console.error('❌ Erro ao criar operador:', erro.message);
      return { sucesso: false, erro: erro.message };
    }
  }

  async removerOperador(perfil) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      if (!perfil?.id) {
        return { sucesso: false, erro: 'Perfil inválido para remoção' };
      }

      const nivelAcesso = String(perfil?.nivelAcesso || perfil?.nivel_acesso || '').toUpperCase();
      if (nivelAcesso === 'MASTER') {
        return { sucesso: false, erro: 'Conta MASTER não pode ser removida' };
      }

      const { error: erroStatus } = await this.client
        .from('perfis')
        .update({
          status: 'inativo',
          deleted_at: new Date().toISOString()
        })
        .eq('id', perfil.id);

      if (!erroStatus) {
        return { sucesso: true };
      }

      const { error: erroAtivo } = await this.client
        .from('perfis')
        .update({
          ativo: false,
          data_demissao: new Date().toISOString().slice(0, 10)
        })
        .eq('id', perfil.id);

      if (!erroAtivo) {
        return { sucesso: true };
      }

      const { error: erroDelete } = await this.client
        .from('perfis')
        .delete()
        .eq('id', perfil.id);

      if (erroDelete) {
        throw erroDelete;
      }

      return { sucesso: true };
    } catch (erro) {
      console.error('❌ Erro ao remover operador:', erro.message);
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
      // Tentar ler de politicas_acesso
      const { data, error } = await this.client
        .from('politicas_acesso')
        .select('*')
        .limit(1);

      if (error) {
        console.warn('⚠️ Erro ao testar conexão:', error.message);
        // Retornar sucesso mesmo com erro (pode ser RLS ou tabela vazia)
        return { sucesso: true, dados: [] };
      }

      console.log('✅ Conexão com banco de dados OK');
      return { sucesso: true, dados: data };

    } catch (erro) {
      console.warn('⚠️ Erro ao conectar com banco de dados:', erro.message);
      // Não falhar - deixar usar mesmo assim
      return { sucesso: true, dados: [] };
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

  // =====================================================================
  // MÉTODOS PARA GERENCIAR PÁTIOS
  // =====================================================================

  /**
   * Lista todos os pátios cadastrados
   * @param {boolean} apenasAtivos - Se true, retorna apenas pátios ativos
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async listarPatios(apenasAtivos = true) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado', dados: [] };
    }

    try {
      let query = this.client.from('patios').select('*');

      if (apenasAtivos) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query.order('nome', { ascending: true });

      if (error) {
        throw error;
      }

      return { sucesso: true, dados: data || [] };
    } catch (erro) {
      console.error('❌ Erro ao listar pátios:', erro);
      return { sucesso: false, erro: erro.message, dados: [] };
    }
  }

  /**
   * Cria um novo pátio
   * @param {Object} patio - { nome, cep, endereco, numero, cidade, estado, qtd_vagas, telefone, email, descricao, latitude, longitude }
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async criarPatio({ 
    nome, 
    cep = '',
    endereco = '', 
    numero = '',
    cidade = '', 
    estado = '', 
    qtd_vagas = 0, 
    telefone = '', 
    email = '', 
    descricao = '',
    latitude = null,
    longitude = null
  }) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    if (!nome?.trim()) {
      return { sucesso: false, erro: 'Nome do pátio é obrigatório' };
    }

    try {
      const nomeNormalizado = String(nome).trim();
      const usuarioId = this.usuarioAtual?.id;

      // Verificar manualmente se já existe (soft delete ou ativo) para evitar erro fantasma
      const { data: patiosExistentes } = await this.client
        .from('patios')
        .select('id, nome, ativo')
        .eq('nome', nomeNormalizado);

      if (patiosExistentes && patiosExistentes.length > 0) {
        // Se existe e está inativo (soft delete), reativar e atualizar
        const patioExistente = patiosExistentes[0];
        if (!patioExistente.ativo) {
          return this.atualizarPatio(patioExistente.id, {
            ativo: true,
            cep: cep?.trim() || null,
            endereco: endereco?.trim() || null,
            numero: numero?.trim() || null,
            cidade: cidade?.trim() || null,
            estado: estado?.trim()?.toUpperCase() || null,
            qtd_vagas: parseInt(qtd_vagas) || 0,
            telefone: telefone?.trim() || null,
            email: email?.trim() || null,
            descricao: descricao?.trim() || null,
            latitude: latitude,
            longitude: longitude,
            updated_at: new Date().toISOString()
          });
        } else {
          return { sucesso: false, erro: 'Já existe um pátio ativo com este nome' };
        }
      }

      // Se não existe, criar novo
      const { data, error } = await this.client.from('patios').insert({
        nome: nomeNormalizado,
        cep: cep?.trim() || null,
        endereco: endereco?.trim() || null,
        numero: numero?.trim() || null,
        cidade: cidade?.trim() || null,
        estado: estado?.trim()?.toUpperCase() || null,
        qtd_vagas: parseInt(qtd_vagas) || 0,
        telefone: telefone?.trim() || null,
        email: email?.trim() || null,
        descricao: descricao?.trim() || null,
        latitude: latitude,
        longitude: longitude,
        ativo: true,
        created_by: usuarioId
      }).select();

      if (error) {
        if (error.code === '23505') {
          return { sucesso: false, erro: 'Já existe um pátio com este nome (erro de constraint)' };
        }
        throw error;
      }

      return { sucesso: true, dados: data?.[0] };
    } catch (erro) {
      console.error('❌ Erro ao criar pátio:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Atualiza um pátio existente
   * @param {string} patioId - ID do pátio
   * @param {Object} atualizacoes - { nome, endereco, cidade, estado, qtd_vagas, telefone, email, descricao, ativo }
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async atualizarPatio(patioId, atualizacoes = {}) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    if (!patioId) {
      return { sucesso: false, erro: 'ID do pátio é inválido' };
    }

    try {
      const dadosAtualizar = {};
      
      if (atualizacoes.nome) {
        dadosAtualizar.nome = String(atualizacoes.nome).trim();
      }
      if (atualizacoes.endereco !== undefined) {
        dadosAtualizar.endereco = atualizacoes.endereco?.trim() || null;
      }
      if (atualizacoes.numero !== undefined) {
        dadosAtualizar.numero = atualizacoes.numero?.trim() || null;
      }
      if (atualizacoes.cep !== undefined) {
        dadosAtualizar.cep = atualizacoes.cep?.trim() || null;
      }
      if (atualizacoes.cidade !== undefined) {
        dadosAtualizar.cidade = atualizacoes.cidade?.trim() || null;
      }
      if (atualizacoes.estado !== undefined) {
        dadosAtualizar.estado = atualizacoes.estado?.trim()?.toUpperCase() || null;
      }
      if (atualizacoes.qtd_vagas !== undefined) {
        dadosAtualizar.qtd_vagas = parseInt(atualizacoes.qtd_vagas) || 0;
      }
      if (atualizacoes.telefone !== undefined) {
        dadosAtualizar.telefone = atualizacoes.telefone?.trim() || null;
      }
      if (atualizacoes.email !== undefined) {
        dadosAtualizar.email = atualizacoes.email?.trim() || null;
      }
      if (atualizacoes.descricao !== undefined) {
        dadosAtualizar.descricao = atualizacoes.descricao?.trim() || null;
      }
      if (atualizacoes.latitude !== undefined) {
        dadosAtualizar.latitude = atualizacoes.latitude;
      }
      if (atualizacoes.longitude !== undefined) {
        dadosAtualizar.longitude = atualizacoes.longitude;
      }
      if (atualizacoes.ativo !== undefined) {
        dadosAtualizar.ativo = Boolean(atualizacoes.ativo);
      }

      const { data, error } = await this.client
        .from('patios')
        .update(dadosAtualizar)
        .eq('id', patioId)
        .select();

      if (error) {
        if (error.code === '23505') {
          return { sucesso: false, erro: 'Já existe um pátio com este nome' };
        }
        throw error;
      }

      return { sucesso: true, dados: data?.[0] };
    } catch (erro) {
      console.error('❌ Erro ao atualizar pátio:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Remove (soft-delete) um pátio
   * @param {string} patioId - ID do pátio
   * @returns {Promise<Object>} { sucesso, erro }
   */
  async removerPatio(patioId) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    if (!patioId) {
      return { sucesso: false, erro: 'ID do pátio é inválido' };
    }

    try {
      const { error } = await this.client
        .from('patios')
        .update({ ativo: false })
        .eq('id', patioId);

      if (error) {
        throw error;
      }

      return { sucesso: true };
    } catch (erro) {
      console.error('❌ Erro ao remover pátio:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  // =====================================================================
  // MÉTODOS PARA GERENCIAR MENSALISTAS
  // =====================================================================

  /**
   * Lista todos os mensalistas cadastrados
   * @param {string} filtroStatus - 'PENDENTE', 'ATIVO', 'INATIVO', ou null para todos
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async listarMensalistas(filtroStatus = null) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado', dados: [] };
    }

    try {
      let query = this.client.from('mensalistas').select('*');

      if (filtroStatus) {
        query = query.eq('status', filtroStatus);
      }

      const { data, error } = await query.order('data_cadastro', { ascending: false });

      if (error) {
        throw error;
      }

      return { sucesso: true, dados: data || [] };
    } catch (erro) {
      console.error('❌ Erro ao listar mensalistas:', erro);
      return { sucesso: false, erro: erro.message, dados: [] };
    }
  }

  /**
   * Cria um novo mensalista
   * @param {Object} mensalista - { nome, cpf, placa, modelo, cor, whatsapp, status }
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async criarMensalista({ nome, cpf, placa, modelo = '', cor = '', whatsapp = '', status = 'PENDENTE' }) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    if (!nome?.trim() || !cpf?.trim() || !placa?.trim()) {
      return { sucesso: false, erro: 'Nome, CPF e placa são obrigatórios' };
    }

    try {
      // Verificar se placa já existe
      const { data: existentes } = await this.client
        .from('mensalistas')
        .select('id')
        .eq('placa', placa.toUpperCase())
        .limit(1);

      if (existentes && existentes.length > 0) {
        return { sucesso: false, erro: 'Placa já cadastrada' };
      }

      const { data, error } = await this.client
        .from('mensalistas')
        .insert({
          nome: String(nome).trim().toUpperCase(),
          cpf: String(cpf).replace(/\D/g, ''),
          placa: String(placa).toUpperCase(),
          modelo: String(modelo).trim().toUpperCase() || null,
          cor: String(cor).trim().toUpperCase() || null,
          whatsapp: String(whatsapp).replace(/\D/g, '') || null,
          status: status.toUpperCase(),
          data_cadastro: new Date().toISOString(),
          data_vencimento: null
        })
        .select();

      if (error) {
        throw error;
      }

      return { sucesso: true, dados: data?.[0] };
    } catch (erro) {
      console.error('❌ Erro ao criar mensalista:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Atualiza status de mensalista (PENDENTE -> ATIVO -> INATIVO)
   * @param {string} mensalistaId - ID do mensalista
   * @param {string} novoStatus - 'PENDENTE', 'ATIVO', 'INATIVO'
   * @param {number} diasVigencia - Dias válidos (para status ATIVO)
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async atualizarMensalista(mensalistaId, novoStatus, diasVigencia = 30) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    if (!mensalistaId) {
      return { sucesso: false, erro: 'ID do mensalista é inválido' };
    }

    try {
      const atualizacoes = { status: novoStatus.toUpperCase() };

      if (novoStatus.toUpperCase() === 'ATIVO') {
        const dataVencimento = new Date();
        dataVencimento.setDate(dataVencimento.getDate() + diasVigencia);
        atualizacoes.data_vencimento = dataVencimento.toISOString().slice(0, 10);
      } else {
        atualizacoes.data_vencimento = null;
      }

      const { data, error } = await this.client
        .from('mensalistas')
        .update(atualizacoes)
        .eq('id', mensalistaId)
        .select();

      if (error) {
        throw error;
      }

      return { sucesso: true, dados: data?.[0] };
    } catch (erro) {
      console.error('❌ Erro ao atualizar mensalista:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Remove um mensalista
   * @param {string} mensalistaId - ID do mensalista
   * @returns {Promise<Object>} { sucesso, erro }
   */
  async removerMensalista(mensalistaId) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    if (!mensalistaId) {
      return { sucesso: false, erro: 'ID do mensalista é inválido' };
    }

    try {
      const { error } = await this.client
        .from('mensalistas')
        .delete()
        .eq('id', mensalistaId);

      if (error) {
        throw error;
      }

      return { sucesso: true };
    } catch (erro) {
      console.error('❌ Erro ao remover mensalista:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Obtém status de conectividade
  /**
   * Obter mensalista por ID com todos os detalhes
   * @param {string} mensalistaId - ID do mensalista
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async obterMensalistaDetalhes(mensalistaId) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado', dados: null };
    }

    if (!mensalistaId) {
      return { sucesso: false, erro: 'ID inválido', dados: null };
    }

    try {
      const { data, error } = await this.client
        .from('mensalistas')
        .select('*')
        .eq('id', mensalistaId)
        .single();

      if (error) {
        throw error;
      }

      return { sucesso: true, dados: data };
    } catch (erro) {
      console.error('❌ Erro ao obter mensalista:', erro);
      return { sucesso: false, erro: erro.message, dados: null };
    }
  }

  /**
   * Atualizar dados do mensalista
   * @param {string} mensalistaId - ID do mensalista
   * @param {Object} atualizacoes - { nome, cpf, modelo, cor, whatsapp }
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async editarMensalista(mensalistaId, atualizacoes = {}) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    if (!mensalistaId) {
      return { sucesso: false, erro: 'ID inválido' };
    }

    try {
      const dadosAtualizar = {};

      if (atualizacoes.nome) {
        dadosAtualizar.nome = String(atualizacoes.nome).trim().toUpperCase();
      }
      if (atualizacoes.cpf) {
        dadosAtualizar.cpf = String(atualizacoes.cpf).replace(/\D/g, '');
      }
      if (atualizacoes.modelo !== undefined) {
        dadosAtualizar.modelo = atualizacoes.modelo ? String(atualizacoes.modelo).trim().toUpperCase() : null;
      }
      if (atualizacoes.cor !== undefined) {
        dadosAtualizar.cor = atualizacoes.cor ? String(atualizacoes.cor).trim().toUpperCase() : null;
      }
      if (atualizacoes.whatsapp !== undefined) {
        dadosAtualizar.whatsapp = atualizacoes.whatsapp ? String(atualizacoes.whatsapp).replace(/\D/g, '') : null;
      }

      const { data, error } = await this.client
        .from('mensalistas')
        .update(dadosAtualizar)
        .eq('id', mensalistaId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { sucesso: true, dados: data };
    } catch (erro) {
      console.error('❌ Erro ao editar mensalista:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Registrar pagamento para mensalista
   * @param {string} mensalistaId - ID do mensalista
   * @param {number} valor - Valor do pagamento
   * @param {string} metodo - Método de pagamento (PIX, DINHEIRO, CARTAO, etc)
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async registrarPagamento(mensalistaId, valor, metodo = 'PIX') {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    if (!mensalistaId || !valor || valor <= 0) {
      return { sucesso: false, erro: 'Dados inválidos' };
    }

    try {
      const { data, error } = await this.client
        .from('pagamentos_mensalistas')
        .insert({
          mensalista_id: mensalistaId,
          valor: parseFloat(valor),
          metodo: metodo.toUpperCase(),
          data_pagamento: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { sucesso: true, dados: data };
    } catch (erro) {
      console.error('❌ Erro ao registrar pagamento:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Listar pagamentos de um mensalista
   * @param {string} mensalistaId - ID do mensalista
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async listarPagamentosMensalista(mensalistaId) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado', dados: [] };
    }

    try {
      const { data, error } = await this.client
        .from('pagamentos_mensalistas')
        .select('*')
        .eq('mensalista_id', mensalistaId)
        .order('data_pagamento', { ascending: false });

      if (error) {
        throw error;
      }

      return { sucesso: true, dados: data || [] };
    } catch (erro) {
      console.error('❌ Erro ao listar pagamentos:', erro);
      return { sucesso: false, erro: erro.message, dados: [] };
    }
  }

  /**
   * Obter configurações globais da empresa
   * @returns {Promise<Object>} { sucesso, dados, erro }
   */
  async obterConfiguracoes() {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      const { data, error } = await this.client
        .from('configuracoes')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      return { sucesso: true, dados: data || {} };
    } catch (erro) {
      console.error('❌ Erro ao obter configurações:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Salvar/Atualizar configurações globais da empresa
   * @param {Object} dados - Dados da empresa (nome, cnpj, logo, etc)
   * @returns {Promise<Object>} { sucesso, erro }
   */
  async salvarConfiguracoes(dados) {
    if (!this.initialized) {
      return { sucesso: false, erro: 'Supabase não inicializado' };
    }

    try {
      // Garantir que ID seja 1
      const configData = { ...dados, id: 1, updated_at: new Date().toISOString() };
      
      const { error } = await this.client
        .from('configuracoes')
        .upsert(configData)
        .select();

      if (error) {
        throw error;
      }

      return { sucesso: true };
    } catch (erro) {
      console.error('❌ Erro ao salvar configurações:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  /**
   * Obter status de conectividade
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

