/**
 * @typedef {Object} CalculoValor
 * @property {number} valor
 * @property {number} totalCiclos
 * @property {number} valorPrimeiroCiclo
 * @property {number} valorCiclosAdicionais
 */

/**
 * Calcula o valor do estacionamento baseado no tempo
 * @param {number} tempoMinutos - Tempo em minutos
 * @param {number} fracaoMinutos - Minutos por fração (ex: 30)
 * @param {number} valorFracao - Valor por fração
 * @param {number} valorTeto - Valor máximo diário
 * @param {number} cicloTetoMinutos - Minutos do ciclo do teto (ex: 720 = 12h)
 * @returns {CalculoValor}
 */
export function calcularValor(tempoMinutos, fracaoMinutos, valorFracao, valorTeto, cicloTetoMinutos) {
  if (tempoMinutos <= 0) {
    return { valor: 0, totalCiclos: 0, valorPrimeiroCiclo: 0, valorCiclosAdicionais: 0 };
  }

  const ciclosCompletos = Math.floor(tempoMinutos / cicloTetoMinutos);
  const tempoRestante = tempoMinutos % cicloTetoMinutos;
  
  const fracoesNoTempo = Math.ceil(tempoRestante / fracaoMinutos);
  let valorPrimeiroCiclo = Math.min(fracoesNoTempo * valorFracao, valorTeto);
  
  const valorCiclosAdicionais = ciclosCompletos * valorTeto;
  const valor = valorPrimeiroCiclo + valorCiclosAdicionais;

  return {
    valor,
    totalCiclos: ciclosCompletos + 1,
    valorPrimeiroCiclo,
    valorCiclosAdicionais
  };
}

/**
 * Formata valor em reais
 * @param {number} valor
 * @returns {string}
 */
export function formatarValor(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

/**
 * Formata tempo em formato legível
 * @param {number} minutos
 * @returns {string}
 */
export function formatarTempo(minutos) {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (horas < 24) {
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  }
  
  const dias = Math.floor(horas / 24);
  const horasRestantes = horas % 24;
  
  if (horasRestantes > 0) {
    return `${dias}d ${horasRestantes}h`;
  }
  
  return `${dias}d`;
}

/**
 * Formata data para exibição
 * @param {number|Date} data
 * @returns {string}
 */
export function formatarData(data) {
  const d = typeof data === 'number' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
}

/**
 * Formata hora para exibição
 * @param {number|Date} data
 * @returns {string}
 */
export function formatarHora(data) {
  const d = typeof data === 'number' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

/**
 * Formata data e hora
 * @param {number|Date} data
 * @returns {string}
 */
export function formatarDataHora(data) {
  return `${formatarData(data)} ${formatarHora(data)}`;
}

/**
 * Normaliza placa para formato padrão
 * @param {string} placa
 * @returns {string}
 */
export function normalizarPlaca(placa) {
  return placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Valida placa brasileira
 * @param {string} placa
 * @returns {boolean}
 */
export function validarPlaca(placa) {
  const normalizada = normalizarPlaca(placa);
  const regexAntigo = /^[A-Z]{3}[0-9]{4}$/;
  const regexMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;
  return regexAntigo.test(normalizada) || regexMercosul.test(normalizada);
}

/**
 * Gera ID único
 * @returns {string}
 */
export function gerarId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calcula diferença em minutos entre duas datas
 * @param {number|Date} dataInicial
 * @param {number|Date} dataFinal
 * @returns {number}
 */
export function calcularMinutos(dataInicial, dataFinal) {
  const inicio = typeof dataInicial === 'number' ? dataInicial : dataInicial.getTime();
  const fim = typeof dataFinal === 'number' ? dataFinal : dataFinal.getTime();
  return Math.floor((fim - inicio) / (1000 * 60));
}
