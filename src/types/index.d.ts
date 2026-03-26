/**
 * @typedef {Object} Veiculo
 * @property {string} id
 * @property {string} placa
 * @property {string} modelo
 * @property {string} cor
 * @property {number} horaEntrada
 * @property {number} horaSaida
 * @property {number} valor
 * @property {string} status - 'ativo' | 'pago' | 'excluido'
 * @property {string} patioId
 * @property {string} operadorId
 */

/**
 * @typedef {Object} Mensalista
 * @property {string} id
 * @property {string} nome
 * @property {string} cpf
 * @property {string} email
 * @property {string} telefone
 * @property {string} placa
 * @property {string} modelo
 * @property {string} cor
 * @property {string} plano - 'mensal' | 'trimestral' | 'anual'
 * @property {number} valor
 * @property {number} dataInicio
 * @property {number} dataFim
 * @property {string} status - 'ativo' | 'inativo' | 'vencido'
 */

/**
 * @typedef {Object} Patio
 * @property {string} id
 * @property {string} nome
 * @property {number} capacidade
 * @property {number} vagasOcupadas
 * @property {boolean} ativo
 */

/**
 * @typedef {Object} Operador
 * @property {string} id
 * @property {string} nome
 * @property {string} login
 * @property {string} perfil - 'master' | 'admin' | 'supervisor' | 'operador'
 * @property {boolean} ativo
 */

/**
 * @typedef {Object} Configuracao
 * @property {number} fracaoMinutos
 * @property {number} valorFracao
 * @property {number} valorMaximoDia
 * @property {number} cicloHoras
 * @property {string} nomeEstacionamento
 */

/**
 * @typedef {Object} Usuario
 * @property {string} id
 * @property {string} email
 * @property {string} perfil
 * @property {string} unidadeId
 */

export {};
