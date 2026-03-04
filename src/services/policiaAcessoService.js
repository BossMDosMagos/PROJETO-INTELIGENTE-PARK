/**
 * Serviço de Autenticação e Controle de Acesso (RBAC)
 * 
 * Responsável por:
 * - Gerenciar login/logout
 * - Verificar permissões do usuário
 * - Controlar acesso baseado em ROLE
 * - Sincronizar dados do perfil com Supabase
 */

import { supabaseService } from './supabaseService';

export class PoliciaAcessoService {
  constructor() {
    this.usuarioAtual = null;
    this.politicas = {};
    this.cachePermissoes = new Map();
  }

  /**
   * Inicializar serviço após autenticação
   */
  async inicializar(userId) {
    try {
      // Buscar perfil do usuário
      const { data: perfil } = await supabaseService.client
        .from('perfis')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!perfil) {
        throw new Error('Perfil de usuário não encontrado');
      }

      this.usuarioAtual = perfil;

      // Buscar políticas de acesso
      const { data: politicas } = await supabaseService.client
        .from('politicas_acesso')
        .select('*');

      // Normalizar para fácil acesso
      this.politicas = {};
      politicas.forEach(p => {
        this.politicas[p.nivel] = p;
      });

      console.log('🔐 Serviço de Acesso inicializado', {
        usuario: perfil.nome_completo,
        nivel: perfil.nivel_acesso,
        unidade: perfil.id_unidade_principal
      });

      return perfil;
    } catch (erro) {
      console.error('❌ Erro ao inicializar PoliciaAcessoService:', erro);
      throw erro;
    }
  }

  /**
   * ✅ Verificar se usuário tem permissão específica
   * 
   * @param {string} permissao - Nome da permissão (ex: 'pode_registrar_entrada')
   * @returns {boolean}
   */
  verificarPermissao(permissao) {
    if (!this.usuarioAtual) {
      console.warn('⚠️ Usuário não autenticado');
      return false;
    }

    // Cache de permissões para performance
    const cacheKey = `${this.usuarioAtual.nivel_acesso}:${permissao}`;
    if (this.cachePermissoes.has(cacheKey)) {
      return this.cachePermissoes.get(cacheKey);
    }

    const politica = this.politicas[this.usuarioAtual.nivel_acesso];
    if (!politica) {
      console.warn(`⚠️ Política não encontrada para nível: ${this.usuarioAtual.nivel_acesso}`);
      return false;
    }

    const temPermissao = politica[permissao] === true;
    this.cachePermissoes.set(cacheKey, temPermissao);

    return temPermissao;
  }

  /**
   * ✅ Verificar múltiplas permissões (AND)
   * 
   * @param {string[]} permissoes
   * @returns {boolean}
   */
  verificarPermissoes(permissoes) {
    return permissoes.every(p => this.verificarPermissao(p));
  }

  /**
   * ✅ Verificar se tem QUALQUER UMA das permissões (OR)
   * 
   * @param {string[]} permissoes
   * @returns {boolean}
   */
  verificarAlgumaPermissao(permissoes) {
    return permissoes.some(p => this.verificarPermissao(p));
  }

  /**
   * ✅ Verificar acesso a unidade específica
   * 
   * @param {string} unidadeId - UUID da unidade
   * @returns {boolean}
   */
  temAcessoUnidade(unidadeId) {
    if (!this.usuarioAtual) return false;

    // MASTER acessa tudo
    if (this.usuarioAtual.nivel_acesso === 'MASTER') {
      return true;
    }

    // Verifica unidade principal
    if (this.usuarioAtual.id_unidade_principal === unidadeId) {
      return true;
    }

    // Verifica unidades delegadas
    if (this.usuarioAtual.unidades_permissao?.includes(unidadeId)) {
      return true;
    }

    return false;
  }

  /**
   * ✅ Obter unidades que o usuário pode acessar
   * 
   * @returns {UUID[]}
   */
  obterUnidadesAcessiveis() {
    if (!this.usuarioAtual) return [];

    // MASTER vê todas
    if (this.usuarioAtual.nivel_acesso === 'MASTER') {
      return null; // Signal para buscar todas
    }

    const unidades = [];
    if (this.usuarioAtual.id_unidade_principal) {
      unidades.push(this.usuarioAtual.id_unidade_principal);
    }
    if (this.usuarioAtual.unidades_permissao?.length > 0) {
      unidades.push(...this.usuarioAtual.unidades_permissao);
    }

    return unidades;
  }

  /**
   * ✅ Obter nível de acesso do usuário
   * 
   * @returns {string}
   */
  obterNivelAcesso() {
    return this.usuarioAtual?.nivel_acesso || null;
  }

  /**
   * ✅ Obter dados do usuário autenticado
   * 
   * @returns {object}
   */
  obterUsuarioAtual() {
    return this.usuarioAtual;
  }

  /**
   * ✅ Verificar se é MASTER
   * 
   * @returns {boolean}
   */
  ehMaster() {
    return this.usuarioAtual?.nivel_acesso === 'MASTER';
  }

  /**
   * ✅ Verificar se é ADMIN
   * 
   * @returns {boolean}
   */
  ehAdmin() {
    return ['MASTER', 'ADMIN'].includes(this.usuarioAtual?.nivel_acesso);
  }

  /**
   * ✅ Verificar se é SUPERVISOR ou superior
   * 
   * @returns {boolean}
   */
  ehSupervisor() {
    return ['MASTER', 'ADMIN', 'SUPERVISOR'].includes(this.usuarioAtual?.nivel_acesso);
  }

  /**
   * ✅ Matriz de permissões para debug
   * 
   * @returns {object}
   */
  obterMatrizPermissoes() {
    if (!this.usuarioAtual) return null;

    const nivel = this.usuarioAtual.nivel_acesso;
    const politica = this.politicas[nivel];

    if (!politica) return null;

    // Filtrar apenas campos de permissão (começam com 'pode_')
    const permissoes = {};
    Object.keys(politica).forEach(chave => {
      if (chave.startsWith('pode_')) {
        permissoes[chave] = politica[chave];
      }
    });

    return {
      nivel,
      usuário: this.usuarioAtual.nome_completo,
      unidade_principal: this.usuarioAtual.id_unidade_principal,
      unidades_delegadas: this.usuarioAtual.unidades_permissao,
      permissoes
    };
  }

  /**
   * ✅ Registrar auditoria de ação do usuário
   * 
   * @param {string} tabela - Tabela afetada
   * @param {string} operacao - INSERT/UPDATE/DELETE
   * @param {string} id - ID do registro afetado
   * @param {object} dadosAntes - Dados anteriores
   * @param {object} dadosDepois - Dados novos
   * @param {string} descricao - Descrição amigável da ação
   */
  async registrarAuditoria(tabela, operacao, id, dadosAntes, dadosDepois, descricao) {
    try {
      const registro = {
        id_unidade: this.usuarioAtual?.id_unidade_principal,
        tabela_afetada: tabela,
        operacao,
        id_registro: id,
        dados_antes: dadosAntes,
        dados_depois: dadosDepois,
        usuario_id: this.usuarioAtual?.user_id,
        usuario_nome: this.usuarioAtual?.nome_completo,
        descricao,
        ip_address: await this.obterIPCliente(),
        user_agent: navigator.userAgent
      };

      const { error } = await supabaseService.client
        .from('auditoria')
        .insert([registro]);

      if (error) throw error;

      console.log('📝 Auditoria registrada:', descricao);
    } catch (erro) {
      console.error('❌ Erro ao registrar auditoria:', erro);
      // Não lança erro para não interromper fluxo
    }
  }

  /**
   * Obter IP do cliente
   */
  async obterIPCliente() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'DESCONHECIDO';
    }
  }

  /**
   * ✅ Limpar cache e fazer logout
   */
  sair() {
    this.usuarioAtual = null;
    this.cachePermissoes.clear();
  }
}

/**
 * Instância única do serviço
 */
export const policiaAcessoService = new PoliciaAcessoService();

/**
 * ✅ Hook React para usar no frontend
 * 
 * Exemplo:
 * const { temPermissao, usuario } = usePermissoes();
 * 
 * if (!temPermissao('pode_fechar_caixa')) {
 *   return <div>Acesso negado</div>;
 * }
 */
export function usePermissoes() {
  const [permissoes, setPermissoes] = React.useState(null);

  React.useEffect(() => {
    if (policiaAcessoService.usuarioAtual) {
      setPermissoes(policiaAcessoService.obterMatrizPermissoes());
    }
  }, []);

  return {
    temPermissao: (perm) => policiaAcessoService.verificarPermissao(perm),
    temAcesso: (unidadeId) => policiaAcessoService.temAcessoUnidade(unidadeId),
    usuario: policiaAcessoService.obterUsuarioAtual(),
    unidades: policiaAcessoService.obterUnidadesAcessiveis(),
    ehMaster: policiaAcessoService.ehMaster(),
    ehAdmin: policiaAcessoService.ehAdmin(),
    ehSupervisor: policiaAcessoService.ehSupervisor(),
    permissoes,
    nivelAcesso: policiaAcessoService.obterNivelAcesso()
  };
}
