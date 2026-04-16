export const CONFIG_PADRAO = {
  nomeEmpresa: 'Command Park',
  cnpj: '',
  endereco: '',
  telefone: '',
  imprimirCnpj: false,
  imprimirEndereco: false,
  imprimirTelefone: false,
  
  tamanhoQrCode: 150,
  linhaDivisoria: 24,
  larguraTicket: 32,
  
  tamanhoFonteNome: { altura: 1, largura: 1 },
  tamanhoFonteDados: { altura: 1, largura: 1 },
  tamanhoFontePlaca: { altura: 2, largura: 2 },
  tamanhoFonteValor: { altura: 2, largura: 2 },
  
  alinhamentoNome: 'center',
  alinhamentoDados: 'center',
  alinhamentoDivisoria: 'center',
  alinhamentoPlaca: 'center',
  alinhamentoDatas: 'center',
  alinhamentoModeloCor: 'center',
  alinhamentoValor: 'center',
  
  mostrarModelo: true,
  mostrarCor: true,
  mostrarDatas: true,
  mostrarHoras: true,
  
  linhasAntesDivisoria: 0,
  linhasDepoisDivisoria: 0,
  linhasAntesQR: 0,
  linhasDepoisQR: 1,
  
  logoUrl: '',
  tempoFracao: 30,
  valorFracao: 9.00,
  valorFracaoMoto: 4.50,
  valorTeto: 55.00,
  valorTetoMoto: 27.50,
  cicloTeto: 12 * 60,
  
  valorCaixaInicial: 300.00,
  
  mensagemConvite: 'Olá! Gostaria de convidar você para ser mensalista no Command Park. Acesse o link para se cadastrar:',
  aceitaMoto: true,
  cobraMulta: false,
  valorMulta: 0.00,
  diasVencimento: 5,
};

export const SENHA_ADMIN = '1234';

export const TIPOS_ESTACIONAVEIS_PADRAO = [
  { id: 1, nome: 'Carro', descricao: 'Automóvel comum', ativo: true },
  { id: 2, nome: 'Moto', descricao: 'Motocicleta', ativo: true }
];

export const TELAS = {
  HOME: 'home',
  ADMIN: 'admin',
  LOGIN_ADMIN: 'login-admin',
  CADASTRAR_MENSALISTA: 'cadastro-mensalista'
};

export const ABAS_HOME = {
  PATIO: 'patio',
  SAIDAS: 'saidas',
  SAIDA_PLACA: 'saida-placa',
  MENSALISTAS: 'mensalistas'
};

export const ABAS_ADMIN = {
  HOME: 'home',
  CONFIG: 'config',
  HISTORICO: 'historico',
  MENSALISTAS: 'mensalistas'
};

export const PERFIS = {
  MASTER: 'master',
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  OPERADOR: 'operador'
};
