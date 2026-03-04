/**
 * Serviço de Mensalistas - Cadastro e Gerenciamento
 */

export class MensalistaService {
  constructor() {
    this.storageKey = 'park-mensalistas';
  }

  /**
   * Obter todos os mensalistas
   */
  getAll() {
    try {
      const dados = localStorage.getItem(this.storageKey);
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error('Erro ao buscar mensalistas', e);
      return [];
    }
  }

  /**
   * Criar novo mensalista (status: PENDENTE)
   */
  criar(dados) {
    try {
      const mensalistas = this.getAll();
      
      // Validar dados obrigatórios
      if (!dados.nome || !dados.cpf || !dados.placa) {
        throw new Error('Nome, CPF e placa são obrigatórios');
      }

      // Validar se placa já existe
      if (mensalistas.some(m => m.placa.toUpperCase() === dados.placa.toUpperCase())) {
        throw new Error('Placa já cadastrada');
      }

      const novoMensalista = {
        id: Date.now(),
        nome: dados.nome.trim().toUpperCase(),
        cpf: dados.cpf.replace(/\D/g, ''),
        whatsapp: dados.whatsapp.replace(/\D/g, ''),
        placa: dados.placa.toUpperCase(),
        modelo: dados.modelo?.trim().toUpperCase() || '',
        cor: dados.cor?.trim().toUpperCase() || '',
        status: 'PENDENTE', // PENDENTE, ATIVO, INATIVO
        dataCadastro: new Date().toISOString(),
        dataVencimento: null,
        dataAtivacao: null
      };

      mensalistas.push(novoMensalista);
      localStorage.setItem(this.storageKey, JSON.stringify(mensalistas));

      return { sucesso: true, mensalista: novoMensalista };
    } catch (e) {
      return { sucesso: false, erro: e.message };
    }
  }

  /**
   * Obter mensalista por placa
   */
  obterPorPlaca(placa) {
    const mensalistas = this.getAll();
    return mensalistas.find(m => m.placa.toUpperCase() === placa.toUpperCase());
  }

  /**
   * Ativar mensalista (status: ATIVO)
   */
  ativar(id, diasVigencia = 30) {
    try {
      const mensalistas = this.getAll();
      const index = mensalistas.findIndex(m => m.id === id);

      if (index === -1) {
        throw new Error('Mensalista não encontrado');
      }

      const vencimento = new Date();
      vencimento.setDate(vencimento.getDate() + diasVigencia);

      mensalistas[index].status = 'ATIVO';
      mensalistas[index].dataAtivacao = new Date().toISOString();
      mensalistas[index].dataVencimento = vencimento.toISOString();

      localStorage.setItem(this.storageKey, JSON.stringify(mensalistas));

      return { sucesso: true, mensalista: mensalistas[index] };
    } catch (e) {
      return { sucesso: false, erro: e.message };
    }
  }

  /**
   * Inativar mensalista
   */
  inativar(id) {
    try {
      const mensalistas = this.getAll();
      const index = mensalistas.findIndex(m => m.id === id);

      if (index === -1) {
        throw new Error('Mensalista não encontrado');
      }

      mensalistas[index].status = 'INATIVO';
      localStorage.setItem(this.storageKey, JSON.stringify(mensalistas));

      return { sucesso: true };
    } catch (e) {
      return { sucesso: false, erro: e.message };
    }
  }

  /**
   * Obter mensalistas por status
   */
  obterPorStatus(status) {
    const mensalistas = this.getAll();
    return mensalistas.filter(m => m.status === status);
  }

  /**
   * Verificar se mensal é válido (ativo e não vencido)
   */
  ehValido(mensalista) {
    if (!mensalista || mensalista.status !== 'ATIVO') {
      return false;
    }

    if (mensalista.dataVencimento) {
      const vencimento = new Date(mensalista.dataVencimento);
      return vencimento > new Date();
    }

    return true;
  }

  /**
   * Deletar mensalista
   */
  deletar(id) {
    try {
      const mensalistas = this.getAll();
      const filtrados = mensalistas.filter(m => m.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtrados));
      return { sucesso: true };
    } catch (e) {
      return { sucesso: false, erro: e.message };
    }
  }

  /**
   * Formatação de telefone
   */
  formatarTelefone(telefone) {
    const apenas = telefone.replace(/\D/g, '');
    if (apenas.length === 11) {
      return `${apenas.slice(0, 2)} ${apenas.slice(2, 7)}-${apenas.slice(7)}`;
    }
    return telefone;
  }

  /**
   * Formatação de CPF
   */
  formatarCPF(cpf) {
    const apenas = cpf.replace(/\D/g, '');
    if (apenas.length === 11) {
      return `${apenas.slice(0, 3)}.${apenas.slice(3, 6)}.${apenas.slice(6, 9)}-${apenas.slice(9)}`;
    }
    return cpf;
  }

  /**
   * Validar CPF
   */
  validarCPF(cpf) {
    const apenas = cpf.replace(/\D/g, '');

    if (apenas.length !== 11 || /^(\d)\1{10}$/.test(apenas)) {
      return false;
    }

    // Cálculo de validação
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(apenas.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(apenas.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(apenas.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(apenas.substring(10, 11))) return false;

    return true;
  }
}

export const mensalistaService = new MensalistaService();
