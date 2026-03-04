import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import BluetoothPrinter from './BluetoothPrinter';
import USBPrinter from './USBPrinter';
import { PaginaCadastroMensalista } from './components/PaginaCadastroMensalista';
import { PaginaCadastroPublico } from './PaginaCadastroPublico';
import { ModalConviteWhatsApp } from './components/ModalConviteWhatsApp';
import { AbaSolicitacoesMensalistas } from './components/AbaSolicitacoesMensalistas';
import { StatusConexao } from './components/StatusConexao';
import { StatusSupabase } from './components/StatusSupabase';
import { PaginaLogin } from './components/PaginaLogin';
import { mensalistaService } from './services/mensalistaService';
import { audioService } from './services/audioService';
import { syncService } from './services/syncService';
import { supabaseService } from './services/supabaseService';
import { 
  Car, 
  Clock, 
  DollarSign, 
  Settings, 
  LogOut, 
  Trash2,
  CheckCircle,
  Home,
  History,
  Lock,
  Printer,
  Bluetooth,
  AlertCircle,
  AlertTriangle,
  Users,
  MessageCircle,
  Volume2
} from 'lucide-react';

// Configurações padrão
const CONFIG_PADRAO = {
  nomeEmpresa: 'Inteligente Park',
  cnpj: '',
  endereco: '',
  telefone: '',
  imprimirCnpj: false,
  imprimirEndereco: false,
  imprimirTelefone: false,
  
  // CONFIGURAÇÕES DE IMPRESSÃO
  tamanhoQrCode: 150,
  linhaDivisoria: 24,
  larguraTicket: 32, // caracteres (máximo para 58mm)
  
  // Tamanhos de fontes (altura x largura)
  tamanhoFonteNome: { altura: 1, largura: 1 },
  tamanhoFonteDados: { altura: 1, largura: 1 },
  tamanhoFontePlaca: { altura: 2, largura: 2 },
  tamanhoFonteValor: { altura: 2, largura: 2 },
  
  // ALINHAMENTOS: 'left' | 'center' | 'right'
  alinhamentoNome: 'center',
  alinhamentoDados: 'center',
  alinhamentoDivisoria: 'center',
  alinhamentoPlaca: 'center',
  alinhamentoDatas: 'center',
  alinhamentoModeloCor: 'center',
  alinhamentoValor: 'center',
  
  // Visibilidade de campos
  mostrarModelo: true,
  mostrarCor: true,
  mostrarDatas: true,
  mostrarHoras: true,
  
  // Espaçamento
  linhasAntesDivisoria: 0,
  linhasDepoisDivisoria: 0,
  linhasAntesQR: 0,
  linhasDepoisQR: 1,
  
  // Padrão
  logoUrl: '',
  tempoFracao: 30, // minutos
  valorFracao: 9.00, // R$ - Carro
  valorFracaoMoto: 4.50, // R$ - Moto (50% do carro)
  valorTeto: 55.00, // R$ - Carro
  valorTetoMoto: 27.50, // R$ - Moto (50% do carro)
  cicloTeto: 12 * 60 // 12 horas em minutos
};

const SENHA_ADMIN = '1234';

function App() {
  const [tela, setTela] = useState('home'); // 'home', 'admin', 'login-admin', 'cadastro-mensalista'
  const [abaHome, setAbaHome] = useState('patio'); // 'patio', 'saidas', 'saida-placa', 'mensalistas'
  const [abaAdmin, setAbaAdmin] = useState('home'); // 'home', 'config', 'historico', 'mensalistas'
  const [modoCadastroPublico, setModoCadastroPublico] = useState(false); // True se acessado via link público
  const [config, setConfig] = useLocalStorage('park-config', CONFIG_PADRAO);
  const [veiculos, setVeiculos] = useLocalStorage('park-veiculos', []);
  const [historico, setHistorico] = useLocalStorage('park-historico', []);
  const [veiculosCadastrados, setVeiculosCadastrados] = useLocalStorage('park-veiculos-cadastrados', {});
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('carro'); // 'carro' ou 'moto'
  const [sugestoesPlacas, setSugestoesPlacas] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [senhaInput, setSenhaInput] = useState('');
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [tempoAtual, setTempoAtual] = useState(Date.now());
  const [placaSaida, setPlacaSaida] = useState('');

  // Estado da Impressora Bluetooth
  const [impressora, setImpressora] = useState(null);
  const [impressoraConectada, setImpressoraConectada] = useState(false);
  const [nomeImpressora, setNomeImpressora] = useState('');
  const [statusImpressora, setStatusImpressora] = useState('');

  // Estado da Impressora USB
  const [impressoraUSB, setImpressoraUSB] = useState(null);
  const [impressoraUSBConectada, setImpressoraUSBConectada] = useState(false);
  const [nomeImpressoraUSB, setNomeImpressoraUSB] = useState('');
  const [statusImpressoraUSB, setStatusImpressoraUSB] = useState('');
  const [tentarSerialNoProximoClique, setTentarSerialNoProximoClique] = useState(false);
  const [tipoConexao, setTipoConexao] = useState('bluetooth'); // 'bluetooth' ou 'usb'
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showModalConvite, setShowModalConvite] = useState(false);
  const [showAlertaMensalista, setShowAlertaMensalista] = useState(null);

  const showToast = (mensagem, tipo = 'info', duracao = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, mensagem, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duracao);
  };

  const removerToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const abrirConfirmacao = (mensagem, onConfirm, titulo = 'Confirmar ação') => {
    setConfirmDialog({ titulo, mensagem, onConfirm });
  };

  const confirmarDialogo = () => {
    if (confirmDialog?.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };

  const cancelarDialogo = () => {
    setConfirmDialog(null);
  };

  // Detectar se foi acessado via link de cadastro público
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('cadastro')) {
      setModoCadastroPublico(true);
    }
  }, []);

  // Inicializar Supabase
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          console.warn('⚠️ Variáveis de ambiente Supabase não configuradas');
          console.warn('Adicione ao .env.local:');
          console.warn('  VITE_SUPABASE_URL');
          console.warn('  VITE_SUPABASE_ANON_KEY');
          return false;
        }

        const inicializado = await supabaseService.initialize(supabaseUrl, supabaseAnonKey);
        
        if (inicializado) {
          showToast('✅ Conectado ao Supabase', 'success', 2000);
          
          // Testar conexão
          const conexao = await supabaseService.testarConexao();
          if (conexao.sucesso) {
            console.log('🎉 Banco de dados conectado com sucesso!');
          }
        } else {
          console.warn('⚠️ Supabase não inicializado. Sistema funcionando em modo offline.');
        }
      } catch (erro) {
        console.error('Erro ao inicializar Supabase:', erro);
      }
    };

    initSupabase();
  }, []);


  const renderToasts = () => (
    <div className="fixed top-4 right-4 z-[100] w-[min(92vw,360px)] space-y-2">
      {toasts.map((toast) => {
        const estilo = {
          success: 'bg-green-50 border-green-300 text-green-900',
          error: 'bg-red-50 border-red-300 text-red-900',
          warning: 'bg-amber-50 border-amber-300 text-amber-900',
          info: 'bg-blue-50 border-blue-300 text-blue-900'
        }[toast.tipo] || 'bg-blue-50 border-blue-300 text-blue-900';

        return (
          <div key={toast.id} className={`rounded-lg border px-3 py-2 shadow-lg flex items-start gap-2 ${estilo}`}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm font-medium leading-5 flex-1">{toast.mensagem}</p>
            <button onClick={() => removerToast(toast.id)} className="text-xs font-bold opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderConfirmModal = () => {
    if (!confirmDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[110]">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-6 h-6" />
            {confirmDialog.titulo}
          </h3>
          <p className="text-gray-700 mb-6 whitespace-pre-line">{confirmDialog.mensagem}</p>
          <div className="flex gap-3">
            <button
              onClick={confirmarDialogo}
              className="btn-danger flex-1"
            >
              Confirmar
            </button>
            <button
              onClick={cancelarDialogo}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Inicializar syncService e supabaseService
  useEffect(() => {
    // Carrega fila de sincronização do localStorage
    supabaseService.loadPendingQueueFromStorage();
    
    // Inicia sincronização periódica
    syncService.iniciarSincronizacaoPeriodica();
    
    // Listener para evento de beforeunload (fechar aba)
    const handleBeforeUnload = (e) => {
      if (supabaseService.temDadosPendentes()) {
        const pendingCount = supabaseService.obterContadorPendentes();
        e.preventDefault();
        e.returnValue = `Você tem ${pendingCount} operação(ões) não sincronizadas. Tem certeza que deseja sair?`;
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      syncService.pararSincronizacaoPeriodica();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Inicializar impressoras
  useEffect(() => {
    setImpressora(new BluetoothPrinter());
    setImpressoraUSB(new USBPrinter());
  }, []);

  useEffect(() => {
    let cancelado = false;

    const reconectarImpressoras = async () => {
      if (impressora?.reconectarAutomatico) {
        const resultadoBT = await impressora.reconectarAutomatico();
        if (!cancelado && resultadoBT?.sucesso) {
          setImpressoraConectada(true);
          setNomeImpressora(resultadoBT.mensagem);
          setStatusImpressora('Reconectado');
          showToast('Bluetooth reconectado automaticamente.', 'info', 2500);
          setTimeout(() => setStatusImpressora(''), 3000);
        }
      }

      if (impressoraUSB?.reconectarAutomatico) {
        const resultadoUSB = await impressoraUSB.reconectarAutomatico();
        if (!cancelado && resultadoUSB?.sucesso) {
          setImpressoraUSBConectada(true);
          setNomeImpressoraUSB(resultadoUSB.mensagem);
          setStatusImpressoraUSB('Reconectado');
          setTipoConexao('usb');
          setTentarSerialNoProximoClique(false);
          showToast('USB/Serial reconectado automaticamente.', 'info', 2500);
          setTimeout(() => setStatusImpressoraUSB(''), 3000);
        }
      }
    };

    if (impressora || impressoraUSB) {
      reconectarImpressoras();
    }

    return () => {
      cancelado = true;
    };
  }, [impressora, impressoraUSB]);

  // Atualiza tempo a cada segundo para os cronômetros
  useEffect(() => {
    const interval = setInterval(() => {
      setTempoAtual(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Função de cálculo de valor
  const calcularValor = (entrada, saida = Date.now(), tipo = 'carro') => {
    const diferencaMs = saida - entrada;
    const diferencaMinutos = Math.floor(diferencaMs / (1000 * 60));
    
    // Seleciona valores baseado no tipo
    let valorFracao, valorTeto;
    if (tipo === 'moto') {
      valorFracao = config.valorFracaoMoto;
      valorTeto = config.valorTetoMoto;
    } else {
      valorFracao = config.valorFracao;
      valorTeto = config.valorTeto;
    }
    
    const { tempoFracao, cicloTeto } = config;
    
    // Calcula quantos ciclos de 12h completou
    const ciclosCompletos = Math.floor(diferencaMinutos / cicloTeto);
    const minutosNoCicloAtual = diferencaMinutos % cicloTeto;
    
    // Calcula frações no ciclo atual
    // 0-30 minutos: ISENTO (R$ 0,00)
    // 31+ minutos: Começa a contar frações de 30 minutos
    let valorCicloAtual = 0;
    
    if (minutosNoCicloAtual > 30) {
      const minutosAcimaDoGratuito = minutosNoCicloAtual - 30;
      const fracoesNoCicloAtual = Math.ceil(minutosAcimaDoGratuito / tempoFracao);
      const valorFracoesAtual = fracoesNoCicloAtual * valorFracao;
      valorCicloAtual = Math.min(valorFracoesAtual, valorTeto);
    }
    
    // Valor total = (ciclos completos × teto) + valor do ciclo atual
    const valorTotal = (ciclosCompletos * valorTeto) + valorCicloAtual;
    
    return valorTotal;
  };

  // Formata tempo decorrido
  const formatarTempo = (ms) => {
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    
    const h = horas;
    const m = minutos % 60;
    const s = segundos % 60;
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Formata placa com máscara (Normal: ABC-1234 | Mercosul: ABC-1D23)
  const formatarPlaca = (valor) => {
    // Remove tudo que não é letra ou número
    let limpo = valor.replace(/[^A-Z0-9]/g, '');
    
    // Limita a 7 caracteres (3 letras + 4 caracteres)
    limpo = limpo.slice(0, 7);
    
    // Adiciona o traço após as 3 primeiras letras
    if (limpo.length > 3) {
      limpo = limpo.slice(0, 3) + '-' + limpo.slice(3);
    }
    
    return limpo;
  };

  // Busca veículo cadastrado pela placa
  const buscarVeiculo = (placaBuscada) => {
    const placaSemTraco = placaBuscada.replace('-', '').toUpperCase();
    return veiculosCadastrados[placaSemTraco] || null;
  };

  // Salva veículo na memória
  const salvarVeiculo = (placa, modelo, cor) => {
    const placaSemTraco = placa.replace('-', '').toUpperCase();
    setVeiculosCadastrados({
      ...veiculosCadastrados,
      [placaSemTraco]: { modelo, cor, dataCadastro: new Date().toISOString() }
    });
  };

  // Ao sair do campo de placa, busca dados do veículo
  const handlePlacaBlur = () => {
    const placaSemTraco = placa.replace('-', '').toUpperCase();
    const veiculoEncontrado = buscarVeiculo(placa);
    
    if (veiculoEncontrado) {
      setModelo(veiculoEncontrado.modelo);
      setCor(veiculoEncontrado.cor);
    }
  };

  // Filtra sugestões de placas conforme digita
  const handlePlacaChange = (valor) => {
    const placaFormatada = formatarPlaca(valor.toUpperCase());
    setPlaca(placaFormatada);
    
    // Se digitar algo, filtra sugestões
    if (placaFormatada.length > 0) {
      const placaSemTraco = placaFormatada.replace('-', '');
      const sugestoes = Object.keys(veiculosCadastrados).filter(p => 
        p.startsWith(placaSemTraco)
      );
      setSugestoesPlacas(sugestoes);
      setMostrarSugestoes(sugestoes.length > 0);
    } else {
      setSugestoesPlacas([]);
      setMostrarSugestoes(false);
    }
  };

  // Seleciona uma sugestão
  const selecionarSugestao = (placaSugerida) => {
    const placaSemTraco = placaSugerida.replace('-', '');
    const veiculoEncontrado = veiculosCadastrados[placaSemTraco];
    
    if (veiculoEncontrado) {
      // Formata a placa com traço
      const placaFormatada = formatarPlaca(placaSemTraco);
      setPlaca(placaFormatada);
      setModelo(veiculoEncontrado.modelo);
      setCor(veiculoEncontrado.cor);
      setSugestoesPlacas([]);
      setMostrarSugestoes(false);
    }
  };

  // Verificar se é um mensalista ativo
  const verificarMensalista = (placaVeiculo) => {
    const placaSemTraco = placaVeiculo.replace('-', '').toUpperCase();
    const mensalista = mensalistaService.obterPorPlaca(placaSemTraco);
    
    if (mensalista && mensalistaService.ehValido(mensalista)) {
      return mensalista;
    }
    return null;
  };

  // Registra entrada de veículo
  const registrarEntrada = () => {
    const placaFormatada = placa.trim().toUpperCase();
    
    if (!placaFormatada) {
      showToast('Digite uma placa válida!', 'error');
      return;
    }

    // Validação de formato de placa (Normal ou Mercosul)
    const placaSemTraco = placaFormatada.replace('-', '');
    const regexNormal = /^[A-Z]{3}[0-9]{4}$/; // ABC1234
    const regexMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/; // ABC1D23
    
    if (!regexNormal.test(placaSemTraco) && !regexMercosul.test(placaSemTraco)) {
      showToast('Formato inválido. Use ABC-1234 ou ABC-1D23.', 'error');
      return;
    }

    // Verifica se o veículo já está no pátio
    if (veiculos.some(v => v.placa === placaFormatada)) {
      showToast('Este veículo já está no pátio!', 'warning');
      return;
    }

    // VERIFICA SE É MENSALISTA ATIVO
    const mensalistaEncontrado = verificarMensalista(placaFormatada);

    // Validação de modelo e cor
    const modeloTrimmed = modelo.trim();
    const corTrimmed = cor.trim();

    if (!modeloTrimmed || !corTrimmed) {
      showToast('Preencha Modelo e Cor!', 'error');
      return;
    }

    // Salva na memória de veículos cadastrados
    salvarVeiculo(placaFormatada, modeloTrimmed, corTrimmed);

    const novoVeiculo = {
      id: Date.now(),
      placa: placaFormatada,
      modelo: modeloTrimmed,
      cor: corTrimmed,
      tipo: tipoVeiculo,
      entrada: Date.now(),
      isMensalista: !!mensalistaEncontrado,
      nomeMensalista: mensalistaEncontrado?.nome || null
    };

    setVeiculos([...veiculos, novoVeiculo]);
    setPlaca('');
    setModelo('');
    setCor('');
    setTipoVeiculo('carro');

    // ALERTA SE FOR MENSALISTA ATIVO
    if (mensalistaEncontrado) {
      audioService.alertaMensalista();
      setShowAlertaMensalista({
        nome: mensalistaEncontrado.nome,
        placa: mensalistaEncontrado.placa,
        vencimento: mensalistaEncontrado.dataVencimento
      });
      showToast(`✅ ACESSO LIBERADO - Mensalista: ${mensalistaEncontrado.nome}`, 'success', 5000);
    }

    // Sincronizar com Supabase (offline-first)
    supabaseService.registrarEntrada({
      placa: novoVeiculo.placa,
      modelo: novoVeiculo.modelo,
      cor: novoVeiculo.cor,
      tipo: novoVeiculo.tipo,
      entrada: new Date(novoVeiculo.entrada).toISOString(),
      isMensalista: novoVeiculo.isMensalista,
      nomeMensalista: novoVeiculo.nomeMensalista
    });

    // Imprime comprovante de entrada automaticamente
    if (impressoraConectada || impressoraUSBConectada) {
      setTimeout(() => imprimirEntrada(novoVeiculo), 500);
    }
  };

  // Finaliza saída de veículo
  const finalizarSaida = (veiculo) => {
    setVeiculoSelecionado(veiculo);
  };

  // Confirma saída e move para histórico
  const confirmarSaida = () => {
    if (!veiculoSelecionado) return;

    const saida = Date.now();
    const valor = calcularValor(veiculoSelecionado.entrada, saida, veiculoSelecionado.tipo);
    const permanencia = formatarTempo(saida - veiculoSelecionado.entrada);
    const registro = {
      ...veiculoSelecionado,
      saida,
      valor,
      permanencia: saida - veiculoSelecionado.entrada
    };
    
    // Imprime recibo de saída com valor antes de confirmar
    if (impressoraConectada || impressoraUSBConectada) {
      imprimirSaida(registro, permanencia, valor);
    }

    // Sincronizar saída com Supabase (offline-first)
    supabaseService.registrarSaida({
      placa: registro.placa,
      horaEntrada: new Date(registro.entrada).toISOString(),
      horaSaida: new Date(registro.saida).toISOString(),
      valor: registro.valor,
      tipo: registro.tipo,
      isMensalista: registro.isMensalista
    });

    setHistorico([registro, ...historico]);
    setVeiculos(veiculos.filter(v => v.id !== veiculoSelecionado.id));
    setVeiculoSelecionado(null);
  };

  const registrarSaidaPorPlaca = () => {
    const placaDigitada = formatarPlaca(placaSaida.trim().toUpperCase());

    if (!placaDigitada) {
      showToast('Digite a placa para registrar a saída.', 'error');
      return;
    }

    const placaSemTraco = placaDigitada.replace('-', '');
    const veiculoEncontrado = veiculos.find(
      (v) => v.placa.replace('-', '').toUpperCase() === placaSemTraco
    );

    if (!veiculoEncontrado) {
      showToast('Veículo não encontrado no pátio.', 'warning');
      return;
    }

    setPlacaSaida('');
    finalizarSaida(veiculoEncontrado);
  };

  // Login admin
  const fazerLogin = () => {
    if (senhaInput === SENHA_ADMIN) {
      setTela('admin');
      setSenhaInput('');
    } else {
      showToast('Senha incorreta!', 'error');
      setSenhaInput('');
    }
  };

  // Processa upload de logo em base64
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Valida se é imagem
      if (!file.type.startsWith('image/')) {
        showToast('Selecione apenas arquivos de imagem (PNG, JPG, etc).', 'error');
        return;
      }
      
      // Valida tamanho (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showToast('A imagem não pode ser maior que 2MB.', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result;
        if (base64String) {
          setConfig({...config, logoUrl: base64String});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove a logo
  const removerLogo = () => {
    setConfig({...config, logoUrl: ''});
  };

  // ================================
  // FUNÇÕES DE IMPRESSORA BLUETOOTH
  // ================================

  // Conectar a impressora
  const conectarImpressora = async () => {
    if (!impressora) return;
    
    setStatusImpressora('Conectando');
    const resultado = await impressora.conectar();
    
    if (resultado.sucesso) {
      setImpressoraConectada(true);
      setNomeImpressora(resultado.mensagem);
      setStatusImpressora('Conectado');
      showToast(resultado.mensagem, 'success');
      setTimeout(() => setStatusImpressora(''), 3000);
    } else {
      setImpressoraConectada(false);
      setStatusImpressora('Erro conexão');
      showToast(resultado.mensagem, 'error', 5000);
      setTimeout(() => setStatusImpressora(''), 5000);
    }
  };

  // Desconectar impressora
  const desconectarImpressora = async () => {
    if (!impressora) return;
    
    const resultado = await impressora.desconectar();
    setImpressoraConectada(false);
    setNomeImpressora('');
    setStatusImpressora('Desconectado');
    showToast('Bluetooth desconectado.', 'info');
    setTimeout(() => setStatusImpressora(''), 2000);
  };

  // Imprimir recibo de entrada
  const imprimirReciboEntrada = async (veiculo) => {
    if (!impressora || !impressoraConectada) {
      showToast('Impressora Bluetooth não conectada.', 'warning');
      return;
    }

    setStatusImpressora('Imp. entrada');
    const resultado = await impressora.imprimirEntrada(veiculo, config);
    
    if (resultado.sucesso) {
      setStatusImpressora('Entrada OK');
      setTimeout(() => setStatusImpressora(''), 3000);
    } else {
      setStatusImpressora('Erro impressão');
      showToast(resultado.mensagem || 'Falha ao imprimir entrada (Bluetooth).', 'error');
      setTimeout(() => setStatusImpressora(''), 3000);
    }
  };

  // Imprimir recibo de saída
  const imprimirReciboSaida = async (veiculo, permanencia, valor) => {
    if (!impressora || !impressoraConectada) {
      showToast('Impressora Bluetooth não conectada.', 'warning');
      return;
    }

    setStatusImpressora('Imp. saída');
    const resultado = await impressora.imprimirSaida(veiculo, config, permanencia, valor);
    
    if (resultado.sucesso) {
      setStatusImpressora('Saída OK');
      setTimeout(() => setStatusImpressora(''), 3000);
    } else {
      setStatusImpressora('Erro impressão');
      showToast(resultado.mensagem || 'Falha ao imprimir saída (Bluetooth).', 'error');
      setTimeout(() => setStatusImpressora(''), 3000);
    }
  };

  // Teste de alinhamento (imprime 3 linhas: esquerda, centro, direita)
  const testarAlinhamento = async () => {
    if (!impressora || !impressoraConectada) {
      showToast('Impressora Bluetooth não conectada.', 'warning');
      return;
    }

    setStatusImpressora('Testando...');
    const resultado = await impressora.testarAlinhamento();
    
    if (resultado.sucesso) {
      setStatusImpressora('Teste OK');
      showToast('Teste de alinhamento enviado! ✅', 'success');
      setTimeout(() => setStatusImpressora(''), 3000);
    } else {
      setStatusImpressora('Erro teste');
      showToast(resultado.mensagem || 'Falha no teste de alinhamento.', 'error');
      setTimeout(() => setStatusImpressora(''), 3000);
    }
  };

  // ================================
  // FUNÇÕES DE IMPRESSORA USB
  // ================================

  // Conectar impressora USB
  const conectarImpressoraUSB = async () => {
    if (!impressoraUSB) return;

    setStatusImpressoraUSB('Conectando');

    let resultado;
    try {
      // Se USB falhou no clique anterior, tenta Serial em clique explícito
      if (tentarSerialNoProximoClique && navigator.serial) {
        resultado = await impressoraUSB.conectarSerial();
        setTentarSerialNoProximoClique(false);
      } else {
        // Tentar Web USB primeiro
        if (navigator.usb) {
          resultado = await impressoraUSB.conectarUSB();
        } else if (navigator.serial) {
          // Sem Web USB, tenta Serial diretamente (ainda dentro do clique)
          resultado = await impressoraUSB.conectarSerial();
        } else {
          resultado = { sucesso: false, mensagem: 'Web USB/Serial não suportado neste navegador' };
        }
      }

      if (resultado.sucesso) {
        setImpressoraUSBConectada(true);
        setNomeImpressoraUSB(resultado.mensagem);
        setStatusImpressoraUSB('Conectado');
        showToast(resultado.mensagem, 'success');
        setTipoConexao('usb');
        setTentarSerialNoProximoClique(false);
        setTimeout(() => setStatusImpressoraUSB(''), 3000);
      } else {
        setImpressoraUSBConectada(false);
        if (navigator.serial && navigator.usb && !tentarSerialNoProximoClique) {
          setTentarSerialNoProximoClique(true);
          setStatusImpressoraUSB('Clique: Serial');
          showToast('USB falhou. Clique novamente em "Tentar Serial".', 'warning', 5000);
        } else {
          setStatusImpressoraUSB('Erro conexão');
          showToast(resultado.mensagem, 'error', 5000);
        }
        setTimeout(() => setStatusImpressoraUSB(''), 5000);
      }
    } catch (error) {
      console.error('Erro conectar USB:', error);
      setTentarSerialNoProximoClique(false);
      setStatusImpressoraUSB('Erro conexão');
      showToast(error.message, 'error', 5000);
      setTimeout(() => setStatusImpressoraUSB(''), 5000);
    }
  };

  // Desconectar impressora USB
  const desconectarImpressoraUSB = async () => {
    if (!impressoraUSB) return;

    const resultado = await impressoraUSB.desconectar();
    setImpressoraUSBConectada(false);
    setNomeImpressoraUSB('');
    setTentarSerialNoProximoClique(false);
    setStatusImpressoraUSB('Desconectado');
    showToast('USB/Serial desconectado.', 'info');
    setTipoConexao('bluetooth');
    setTimeout(() => setStatusImpressoraUSB(''), 2000);
  };

  // Imprimir recibo de entrada (USB)
  const imprimirReciboEntradaUSB = async (veiculo) => {
    if (!impressoraUSB || !impressoraUSBConectada) {
      showToast('Impressora USB/Serial não conectada.', 'warning');
      return;
    }

    setStatusImpressoraUSB('Imp. entrada');
    const resultado = await impressoraUSB.imprimirEntrada(veiculo, config);

    if (resultado.sucesso) {
      setStatusImpressoraUSB('Entrada OK');
      setTimeout(() => setStatusImpressoraUSB(''), 3000);
    } else {
      setStatusImpressoraUSB('Erro impressão');
      showToast(resultado.mensagem || 'Falha ao imprimir entrada (USB/Serial).', 'error');
      setTimeout(() => setStatusImpressoraUSB(''), 3000);
    }
  };

  // Imprimir recibo de saída (USB)
  const imprimirReciboSaidaUSB = async (veiculo, permanencia, valor) => {
    if (!impressoraUSB || !impressoraUSBConectada) {
      showToast('Impressora USB/Serial não conectada.', 'warning');
      return;
    }

    setStatusImpressoraUSB('Imp. saída');
    const resultado = await impressoraUSB.imprimirSaida(veiculo, config, permanencia, valor);

    if (resultado.sucesso) {
      setStatusImpressoraUSB('Saída OK');
      setTimeout(() => setStatusImpressoraUSB(''), 3000);
    } else {
      setStatusImpressoraUSB('Erro impressão');
      showToast(resultado.mensagem || 'Falha ao imprimir saída (USB/Serial).', 'error');
      setTimeout(() => setStatusImpressoraUSB(''), 3000);
    }
  };

  // Função unificada de impressão (escolhe Bluetooth ou USB)
  const imprimirEntrada = (veiculo) => {
    if (impressoraUSBConectada) {
      imprimirReciboEntradaUSB(veiculo);
    } else if (impressoraConectada) {
      imprimirReciboEntrada(veiculo);
    } else {
      showToast('Nenhuma impressora conectada. Conecte Bluetooth ou USB.', 'warning');
    }
  };

  const imprimirSaida = (veiculo, permanencia, valor) => {
    if (impressoraUSBConectada) {
      imprimirReciboSaidaUSB(veiculo, permanencia, valor);
    } else if (impressoraConectada) {
      imprimirReciboSaida(veiculo, permanencia, valor);
    } else {
      showToast('Nenhuma impressora conectada. Conecte Bluetooth ou USB.', 'warning');
    }
  };

  // Deleta um registro individual do histórico
  const deletarRegistro = (id) => {
    abrirConfirmacao('Tem certeza que quer deletar este registro?', () => {
      setHistorico(historico.filter(reg => reg.id !== id));
      showToast('Registro deletado com sucesso!', 'success');
    }, 'Deletar registro');
  };

  // Deleta registros de um dia específico
  const deletarPorDia = (data) => {
    const dataStr = new Date(data).toLocaleDateString('pt-BR');
    abrirConfirmacao(`Tem certeza que quer deletar TODOS os registros do dia ${dataStr}?\nEsta ação não pode ser desfeita!`, () => {
      const novoHistorico = historico.filter(reg => {
        const datareg = new Date(reg.saida).toLocaleDateString('pt-BR');
        return datareg !== dataStr;
      });
      setHistorico(novoHistorico);
      showToast(`${historico.length - novoHistorico.length} registro(s) deletado(s)!`, 'success');
    }, 'Deletar por dia');
  };

  // Deleta registros de um mês específico
  const deletarPorMes = (ano, mes) => {
    const mesStr = String(mes).padStart(2, '0');
    abrirConfirmacao(`Tem certeza que quer deletar TODOS os registros de ${mes}/${ano}?\nEsta ação não pode ser desfeita!`, () => {
      const novoHistorico = historico.filter(reg => {
        const data = new Date(reg.saida);
        const regAno = data.getFullYear();
        const regMes = String(data.getMonth() + 1).padStart(2, '0');
        return !(regAno === ano && regMes === mesStr);
      });
      setHistorico(novoHistorico);
      showToast(`${historico.length - novoHistorico.length} registro(s) deletado(s)!`, 'success');
    }, 'Deletar por mês');
  };

  // Obtém datas únicas do histórico
  const obterDatasUnicas = () => {
    const datas = new Set();
    historico.forEach(reg => {
      const data = new Date(reg.saida).toLocaleDateString('pt-BR');
      datas.add(data);
    });
    return Array.from(datas).sort((a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-')));
  };

  // Obtém meses únicos do histórico
  const obterMesesUnicos = () => {
    const meses = new Set();
    historico.forEach(reg => {
      const data = new Date(reg.saida);
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      meses.add(`${mes}/${ano}`);
    });
    return Array.from(meses).sort().reverse();
  };

  // Limpar todos os dados
  const limparTudo = () => {
    abrirConfirmacao('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita!', () => {
      setVeiculos([]);
      setHistorico([]);
      setConfig(CONFIG_PADRAO);
      showToast('Dados limpos com sucesso!', 'success');
    }, 'Limpar todos os dados');
  };

  // Calcula total em caixa
  const totalEmCaixa = historico.reduce((sum, reg) => sum + reg.valor, 0);

  // MODO CADASTRO PÚBLICO (Via link WhatsApp)
  if (modoCadastroPublico) {
    return (
      <PaginaCadastroPublico 
        onVoltar={() => {
          setModoCadastroPublico(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }}
      />
    );
  }

  // PÁGINA DE CADASTRO DE MENSALISTA
  if (tela === 'cadastro-mensalista') {
    return (
      <>
        <PaginaCadastroMensalista />
        {renderToasts()}
      </>
    );
  }

  // TELA DE LOGIN ADMIN
  if (tela === 'login-admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Área Administrativa</h2>
          <input
            type="password"
            value={senhaInput}
            onChange={(e) => setSenhaInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fazerLogin()}
            placeholder="Digite a senha"
            className="input-field mb-4"
            autoFocus
          />
          <div className="flex gap-3">
            <button onClick={fazerLogin} className="btn-primary flex-1">
              Entrar
            </button>
            <button onClick={() => setTela('home')} className="btn-secondary flex-1">
              Cancelar
            </button>
          </div>
        </div>
        {renderToasts()}
        {renderConfirmModal()}
      </div>
    );
  }

  // TELA ADMINISTRATIVA
  if (tela === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
              <Settings className="w-8 h-8" />
              Administração
            </h1>
            <button onClick={() => setTela('home')} className="btn-secondary flex items-center gap-2">
              <Home className="w-5 h-5" />
              Voltar
            </button>
          </div>

          {/* Configuração de Impressora Bluetooth */}
          <div className="card mb-6 bg-blue-50 border-2 border-blue-300">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Printer className="w-6 h-6 text-blue-600" />
              <Bluetooth className="w-6 h-6 text-blue-600" />
              Impressora Térmica Bluetooth (58mm)
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">Status da Conexão:</p>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${impressoraConectada ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="font-bold text-lg">
                    {impressoraConectada ? `✅ Conectado - ${nomeImpressora}` : '❌ Não conectado'}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 mb-1">📋 Instruções para Conectar:</p>
                <ol className="text-sm text-amber-900 space-y-1 list-decimal list-inside">
                  <li>Certifique-se que a impressora está ligada</li>
                  <li>Ative Bluetooth no seu computador/tablet</li>
                  <li>Clique em "Conectar Impressora" na tela principal</li>
                  <li>Selecione sua impressora térmica na caixa de diálogo</li>
                  <li>Após conectar, os botões de imprimir aparecerão automaticamente</li>
                </ol>
              </div>

              <div className="flex gap-2">
                {impressoraConectada ? (
                  <>
                    <button
                      onClick={desconectarImpressora}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Bluetooth className="w-5 h-5" />
                      Desconectar
                    </button>
                    <button
                      onClick={() => imprimirEntrada({ 
                        id: Date.now(), 
                        placa: 'TESTE-01', 
                        modelo: 'Teste Modelo',
                        cor: 'Preto',
                        entrada: Date.now()
                      })}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Printer className="w-5 h-5" />
                      Teste de Impressão
                    </button>
                    <button
                      onClick={testarAlinhamento}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Teste de Alinhamento
                    </button>
                  </>
                ) : (
                  <button
                    onClick={conectarImpressora}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Bluetooth className="w-5 h-5" />
                    Conectar Impressora
                  </button>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900 border border-blue-200">
                <p className="font-semibold mb-1">💡 Compatibilidade:</p>
                <p>Impressoras térmicas padrão ESC/POS com Bluetooth (58mm): Elgin, Sweda, Bematech, Zebra série ZQ, etc.</p>
              </div>
            </div>
          </div>

          {/* Configuração de Impressora USB / Serial */}
          <div className="card mb-6 bg-purple-50 border-2 border-purple-300">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Printer className="w-6 h-6 text-purple-600" />
              <AlertTriangle className="w-6 h-6 text-purple-600" />
              Impressora Térmica USB / Serial (58mm)
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="font-semibold text-purple-900 mb-2">Status da Conexão:</p>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${impressoraUSBConectada ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="font-bold text-lg">
                    {impressoraUSBConectada ? `✅ Conectado - ${nomeImpressoraUSB}` : '❌ Não conectado'}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 mb-1">📋 Instruções para Conectar:</p>
                <ol className="text-sm text-amber-900 space-y-1 list-decimal list-inside">
                  <li>Conecte a impressora no cabo USB</li>
                  <li>Clique em "Conectar" para tentar Web USB</li>
                  <li>Se USB falhar, clique novamente em "Tentar Serial"</li>
                  <li>Selecione a porta no diálogo do navegador</li>
                  <li>Após conectar, a impressão funciona automaticamente na entrada e saída</li>
                </ol>
              </div>

              <div className="flex gap-2">
                {impressoraUSBConectada ? (
                  <>
                    <button
                      onClick={desconectarImpressoraUSB}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Desconectar
                    </button>
                    <button
                      onClick={() => imprimirEntrada({
                        id: Date.now(),
                        placa: 'TESTE-01',
                        modelo: 'Teste Modelo',
                        cor: 'Preto',
                        entrada: Date.now()
                      })}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Printer className="w-5 h-5" />
                      Teste de Impressão
                    </button>
                  </>
                ) : (
                  <button
                    onClick={conectarImpressoraUSB}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    {tentarSerialNoProximoClique ? 'Tentar Serial' : 'Conectar'}
                  </button>
                )}
              </div>

              <div className="bg-purple-50 p-3 rounded-lg text-sm text-purple-900 border border-purple-200">
                <p className="font-semibold mb-1">💡 Compatibilidade:</p>
                <p>Impressoras térmicas ESC/POS por USB direto e adaptadores USB-Serial compatíveis com Web Serial.</p>
              </div>
            </div>
          </div>

          {/* Personalização da Empresa */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Car className="w-6 h-6 text-purple-600" />
              Personalização da Empresa
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nome da Empresa / Estacionamento
                </label>
                <input
                  type="text"
                  value={config.nomeEmpresa}
                  onChange={(e) => setConfig({...config, nomeEmpresa: e.target.value})}
                  className="input-field"
                  placeholder="ex: Inteligente Park, Estacionamento Central"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">CNPJ</label>
                <input
                  type="text"
                  value={config.cnpj || ''}
                  onChange={(e) => setConfig({...config, cnpj: e.target.value})}
                  className="input-field"
                  placeholder="00.000.000/0001-00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Endereço</label>
                <input
                  type="text"
                  value={config.endereco || ''}
                  onChange={(e) => setConfig({...config, endereco: e.target.value})}
                  className="input-field"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Telefone</label>
                <input
                  type="text"
                  value={config.telefone || ''}
                  onChange={(e) => setConfig({...config, telefone: e.target.value})}
                  className="input-field"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">
                  📸 Logo da Empresa
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    cursor-pointer mb-3"
                />
                <p className="text-sm text-gray-600 mb-3">
                  Formatos suportados: PNG, JPG, JPEG. Tamanho máximo: 2MB
                </p>
                
                {config.logoUrl && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-2 text-center">Prévia da Logo:</p>
                        <img 
                          src={config.logoUrl} 
                          alt="Logo Preview" 
                          className="max-w-32 max-h-32 object-contain rounded-lg shadow-md"
                        />
                      </div>
                      <button
                        onClick={removerLogo}
                        className="btn-danger w-full py-2 text-sm"
                      >
                        🗑️ Remover Logo
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
                <p className="font-semibold mb-1">💡 Dica:</p>
                <p>Selecione uma imagem do seu computador. Recomendado: Logo quadrada com até 500x500px, em PNG ou JPG</p>
              </div>
            </div>
          </div>

          {/* Configuração de Impressão - COMPLETA */}
          <div className="card mb-6 bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-300">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
              <Printer className="w-6 h-6 text-blue-600" />
              ⚙️ Configuração Completa de Impressão do Ticket
            </h2>

            <div className="space-y-6">
              {/* SEÇÃO 1: TAMANHO DO QR CODE */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-sm text-blue-900 mb-3">📋 TAMANHO DO QR CODE</h3>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tamanho ({config.tamanhoQrCode || 150}px)
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="200"
                    step="10"
                    value={config.tamanhoQrCode || 150}
                    onChange={(e) => setConfig({...config, tamanhoQrCode: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-500 mt-1">Intervalo: 80px a 200px</div>
                </div>
              </div>

              {/* SEÇÃO 2: DIMENSÕES DO TICKET */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-sm text-blue-900 mb-3">📐 DIMENSÕES DO TICKET</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Largura em caracteres ({config.larguraTicket || 32} chars)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="40"
                      value={config.larguraTicket || 32}
                      onChange={(e) => setConfig({...config, larguraTicket: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Linha divisória ({config.linhaDivisoria || 24} caracteres)
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="32"
                      value={config.linhaDivisoria || 24}
                      onChange={(e) => setConfig({...config, linhaDivisoria: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 3: TAMANHO DAS FONTES */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-sm text-blue-900 mb-3">🔤 TAMANHO DAS FONTES</h3>
                <div className="space-y-4">
                  {/* Nome da Empresa */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Nome da Empresa</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Altura: {config.tamanhoFonteNome?.altura || 1}x</label>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          value={config.tamanhoFonteNome?.altura || 1}
                          onChange={(e) => setConfig({
                            ...config,
                            tamanhoFonteNome: {...config.tamanhoFonteNome, altura: parseInt(e.target.value)}
                          })}
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Largura: {config.tamanhoFonteNome?.largura || 1}x</label>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          value={config.tamanhoFonteNome?.largura || 1}
                          onChange={(e) => setConfig({
                            ...config,
                            tamanhoFonteNome: {...config.tamanhoFonteNome, largura: parseInt(e.target.value)}
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dados */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Dados Gerais (CNPJ, Endereço, etc)</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Altura: {config.tamanhoFonteDados?.altura || 1}x</label>
                        <input
                          type="range"
                          min="1"
                          max="2"
                          value={config.tamanhoFonteDados?.altura || 1}
                          onChange={(e) => setConfig({
                            ...config,
                            tamanhoFonteDados: {...config.tamanhoFonteDados, altura: parseInt(e.target.value)}
                          })}
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Largura: {config.tamanhoFonteDados?.largura || 1}x</label>
                        <input
                          type="range"
                          min="1"
                          max="2"
                          value={config.tamanhoFonteDados?.largura || 1}
                          onChange={(e) => setConfig({
                            ...config,
                            tamanhoFonteDados: {...config.tamanhoFonteDados, largura: parseInt(e.target.value)}
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Placa */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Placa do Veículo</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Altura: {config.tamanhoFontePlaca?.altura || 2}x</label>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={config.tamanhoFontePlaca?.altura || 2}
                          onChange={(e) => setConfig({
                            ...config,
                            tamanhoFontePlaca: {...config.tamanhoFontePlaca, altura: parseInt(e.target.value)}
                          })}
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Largura: {config.tamanhoFontePlaca?.largura || 2}x</label>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={config.tamanhoFontePlaca?.largura || 2}
                          onChange={(e) => setConfig({
                            ...config,
                            tamanhoFontePlaca: {...config.tamanhoFontePlaca, largura: parseInt(e.target.value)}
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Valor */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Valor (R$)</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Altura: {config.tamanhoFonteValor?.altura || 2}x</label>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={config.tamanhoFonteValor?.altura || 2}
                          onChange={(e) => setConfig({
                            ...config,
                            tamanhoFonteValor: {...config.tamanhoFonteValor, altura: parseInt(e.target.value)}
                          })}
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Largura: {config.tamanhoFonteValor?.largura || 2}x</label>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={config.tamanhoFonteValor?.largura || 2}
                          onChange={(e) => setConfig({
                            ...config,
                            tamanhoFonteValor: {...config.tamanhoFonteValor, largura: parseInt(e.target.value)}
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 4: ESPAÇAMENTO */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-sm text-blue-900 mb-3">↔️ ESPAÇAMENTO (LINHAS VAZIAS)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Antes da Divisória ({config.linhasAntesDivisoria || 0} linhas)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={config.linhasAntesDivisoria || 0}
                      onChange={(e) => setConfig({...config, linhasAntesDivisoria: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Depois da Divisória ({config.linhasDepoisDivisoria || 0} linhas)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={config.linhasDepoisDivisoria || 0}
                      onChange={(e) => setConfig({...config, linhasDepoisDivisoria: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Antes do QR Code ({config.linhasAntesQR || 0} linhas)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={config.linhasAntesQR || 0}
                      onChange={(e) => setConfig({...config, linhasAntesQR: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Depois do QR Code ({config.linhasDepoisQR || 1} linhas)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={config.linhasDepoisQR || 1}
                      onChange={(e) => setConfig({...config, linhasDepoisQR: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 5: VISIBILIDADE DE CAMPOS */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-sm text-blue-900 mb-3">👁️ VISIBILIDADE DE CAMPOS</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(config.mostrarModelo)}
                      onChange={(e) => setConfig({...config, mostrarModelo: e.target.checked})}
                    />
                    Modelo do Veículo
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(config.mostrarCor)}
                      onChange={(e) => setConfig({...config, mostrarCor: e.target.checked})}
                    />
                    Cor do Veículo
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(config.mostrarDatas)}
                      onChange={(e) => setConfig({...config, mostrarDatas: e.target.checked})}
                    />
                    Data
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(config.mostrarHoras)}
                      onChange={(e) => setConfig({...config, mostrarHoras: e.target.checked})}
                    />
                    Horas
                  </label>
                  <div className="mt-3 border-t pt-3">
                    <label className="block text-sm font-semibold mb-3">Dados da Empresa no Recibo:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={Boolean(config.imprimirCnpj)}
                          onChange={(e) => setConfig({...config, imprimirCnpj: e.target.checked})}
                        />
                        CNPJ
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={Boolean(config.imprimirEndereco)}
                          onChange={(e) => setConfig({...config, imprimirEndereco: e.target.checked})}
                        />
                        Endereço
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={Boolean(config.imprimirTelefone)}
                          onChange={(e) => setConfig({...config, imprimirTelefone: e.target.checked})}
                        />
                        Telefone
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 6: ALINHAMENTOS */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-sm text-blue-900 mb-3">⬅️➡️ ALINHAMENTO DOS TEXTOS</h3>
                <div className="space-y-4">
                  {/* Nome da Empresa */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Nome da Empresa</label>
                    <select
                      value={config.alinhamentoNome || 'center'}
                      onChange={(e) => setConfig({...config, alinhamentoNome: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">⬅️ Esquerda</option>
                      <option value="center">⬆️⬇️ Centralizado</option>
                      <option value="right">➡️ Direita</option>
                    </select>
                  </div>

                  {/* CNPJ, Endereço, Telefone */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Dados da Empresa (CNPJ, Endereço, Telefone)</label>
                    <select
                      value={config.alinhamentoDados || 'center'}
                      onChange={(e) => setConfig({...config, alinhamentoDados: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">⬅️ Esquerda</option>
                      <option value="center">⬆️⬇️ Centralizado</option>
                      <option value="right">➡️ Direita</option>
                    </select>
                  </div>

                  {/* Linha Divisória */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Linha Divisória</label>
                    <select
                      value={config.alinhamentoDivisoria || 'center'}
                      onChange={(e) => setConfig({...config, alinhamentoDivisoria: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">⬅️ Esquerda</option>
                      <option value="center">⬆️⬇️ Centralizado</option>
                      <option value="right">➡️ Direita</option>
                    </select>
                  </div>

                  {/* Placa */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Placa do Veículo</label>
                    <select
                      value={config.alinhamentoPlaca || 'center'}
                      onChange={(e) => setConfig({...config, alinhamentoPlaca: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">⬅️ Esquerda</option>
                      <option value="center">⬆️⬇️ Centralizado</option>
                      <option value="right">➡️ Direita</option>
                    </select>
                  </div>

                  {/* Datas e Horas */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Data, Hora e Informações</label>
                    <select
                      value={config.alinhamentoDatas || 'center'}
                      onChange={(e) => setConfig({...config, alinhamentoDatas: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">⬅️ Esquerda</option>
                      <option value="center">⬆️⬇️ Centralizado</option>
                      <option value="right">➡️ Direita</option>
                    </select>
                  </div>

                  {/* Modelo e Cor */}
                  <div className="border-b pb-3">
                    <label className="block text-sm font-semibold mb-2">Modelo e Cor do Veículo</label>
                    <select
                      value={config.alinhamentoModeloCor || 'center'}
                      onChange={(e) => setConfig({...config, alinhamentoModeloCor: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">⬅️ Esquerda</option>
                      <option value="center">⬆️⬇️ Centralizado</option>
                      <option value="right">➡️ Direita</option>
                    </select>
                  </div>

                  {/* Valor e Tempo */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Valor (R$) e Tempo</label>
                    <select
                      value={config.alinhamentoValor || 'center'}
                      onChange={(e) => setConfig({...config, alinhamentoValor: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">⬅️ Esquerda</option>
                      <option value="center">⬆️⬇️ Centralizado</option>
                      <option value="right">➡️ Direita</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RESUMO */}
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                <p className="text-sm text-blue-900">
                  ✅ <strong>Todas as configurações são salvas automaticamente!</strong> Teste com um veículo na tela inicial para ver as mudanças.
                </p>
              </div>
            </div>
          </div>

          {/* Configurações de Preço */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Configurações de Preço
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tempo da Fração (minutos)
                </label>
                <input
                  type="number"
                  value={config.tempoFracao}
                  onChange={(e) => setConfig({...config, tempoFracao: parseInt(e.target.value)})}
                  className="input-field"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Valor da Fração (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={config.valorFracao}
                  onChange={(e) => setConfig({...config, valorFracao: parseFloat(e.target.value)})}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Valor do Teto/Diária (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={config.valorTeto}
                  onChange={(e) => setConfig({...config, valorTeto: parseFloat(e.target.value)})}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Ciclo do Teto (horas)
                </label>
                <input
                  type="number"
                  value={config.cicloTeto / 60}
                  onChange={(e) => setConfig({...config, cicloTeto: parseInt(e.target.value) * 60})}
                  className="input-field"
                  min="1"
                />
              </div>

              {/* Divisor */}
              <div className="border-t-2 border-gray-300 py-2">
                <p className="text-center font-bold text-gray-600">VALORES PARA MOTO (50% do carro)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Valor da Fração Moto (R$) 🏍️
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={config.valorFracaoMoto}
                  onChange={(e) => setConfig({...config, valorFracaoMoto: parseFloat(e.target.value)})}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Valor do Teto Moto (R$) 🏍️
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={config.valorTetoMoto}
                  onChange={(e) => setConfig({...config, valorTetoMoto: parseFloat(e.target.value)})}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Total em Caixa */}
          <div className="card mb-6 bg-green-50 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2 justify-center">
              <DollarSign className="w-8 h-8" />
              Total em Caixa: R$ {totalEmCaixa.toFixed(2)}
            </h2>
            <p className="text-center text-gray-600 mt-2">
              {historico.length} veículo(s) finalizados hoje
            </p>
          </div>

          {/* Sistema de Deleção */}
          <div className="card mb-6 bg-red-50 border-2 border-red-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-800">
              <Trash2 className="w-6 h-6" />
              Sistema de Deleção de Registros
            </h2>
            
            <div className="space-y-4">
              {/* Deletar por Dia */}
              <div className="bg-white p-4 rounded-lg border border-red-300">
                <h3 className="font-bold text-red-700 mb-3">🗑️ Deletar por Dia</h3>
                <div className="flex gap-2">
                  <input
                    type="date"
                    id="dataDeletar"
                    className="input-field flex-1"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('dataDeletar');
                      if (input.value) {
                        const data = new Date(input.value + 'T00:00:00');
                        deletarPorDia(data.getTime());
                        input.value = '';
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                  >
                    Deletar Dia
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Datas disponíveis: {obterDatasUnicas().length > 0 ? obterDatasUnicas().join(', ') : 'Nenhuma'}</p>
              </div>

              {/* Deletar por Mês */}
              <div className="bg-white p-4 rounded-lg border border-red-300">
                <h3 className="font-bold text-red-700 mb-3">🗑️ Deletar por Mês</h3>
                <div className="flex gap-2">
                  <select
                    id="mesDeletar"
                    className="input-field flex-1"
                  >
                    <option value="">Selecione um mês...</option>
                    {obterMesesUnicos().map((mesAno) => (
                      <option key={mesAno} value={mesAno}>
                        {mesAno}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const select = document.getElementById('mesDeletar');
                      if (select.value) {
                        const [mes, ano] = select.value.split('/').map(Number);
                        deletarPorMes(ano, mes);
                        select.value = '';
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
                  >
                    Deletar Mês
                  </button>
                </div>
              </div>

              {/* Deletar Individual */}
              <div className="bg-white p-4 rounded-lg border border-red-300">
                <h3 className="font-bold text-red-700 mb-3">🗑️ Deletar Registros Individuais</h3>
                {historico.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum registro para deletar</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {historico.map((reg) => {
                      const emoji = reg.tipo === 'moto' ? '🏍️' : '🚗';
                      return (
                        <div key={reg.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-bold text-lg">{emoji} {reg.placa}</p>
                            <p className="text-sm text-gray-600">
                              {reg.modelo} • {reg.cor}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(reg.saida).toLocaleString('pt-BR')} • Permanência: {formatarTempo(reg.permanencia)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-green-600">
                              R$ {reg.valor.toFixed(2)}
                            </p>
                            {(impressoraConectada || impressoraUSBConectada) && (
                              <button
                                onClick={() => imprimirSaida(reg, formatarTempo(reg.permanencia), reg.valor)}
                                className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-all active:scale-95"
                                title="Imprimir recibo"
                              >
                                🖨️
                              </button>
                            )}
                            <button
                              onClick={() => deletarRegistro(reg.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all active:scale-95"
                              title="Deletar este registro"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Histórico do Dia */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="w-6 h-6 text-purple-600" />
              Histórico Total ({historico.length} registros)
            </h2>
            {historico.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum registro ainda</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {historico.map((reg) => {
                  const emoji = reg.tipo === 'moto' ? '🏍️' : '🚗';
                  return (
                  <div key={reg.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">{emoji} {reg.placa}</p>
                      <p className="text-sm text-gray-600">
                        {reg.modelo} • {reg.cor}
                      </p>
                      <p className="text-sm text-gray-600">
                        Entrada: {new Date(reg.entrada).toLocaleTimeString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Saída: {new Date(reg.saida).toLocaleTimeString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Permanência: {formatarTempo(reg.permanencia)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {reg.valor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Veículos Cadastrados */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Car className="w-6 h-6 text-blue-600" />
              Veículos Cadastrados ({Object.keys(veiculosCadastrados).length})
            </h2>
            {Object.keys(veiculosCadastrados).length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum veículo cadastrado na memória</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(veiculosCadastrados).map(([placa, dados]) => (
                  <div key={placa} className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-blue-900">{placa}</p>
                      <p className="text-sm text-gray-600">
                        {dados.modelo} • {dados.cor}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const novosCadastrados = { ...veiculosCadastrados };
                        delete novosCadastrados[placa];
                        setVeiculosCadastrados(novosCadastrados);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all active:scale-95"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTROLE DE MENSALISTAS */}
          <div className="card mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Controle de Cadastros
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 text-sm">
                Gerencie mensalistas, ative cadastros pendentes e envie convites via WhatsApp.
              </p>

              <div className="bg-white p-4 rounded-lg">
                <AbaSolicitacoesMensalistas />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowModalConvite(true)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Convidar Mensalista
                </button>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg text-sm text-emerald-900 border border-emerald-200">
                <p className="font-semibold mb-1">💡 Como Funciona?</p>
                <ol className="space-y-1 list-decimal list-inside text-xs">
                  <li>Clique em "Convidar" e digite o número do cliente</li>
                  <li>Sistema envia link de cadastro pelo WhatsApp</li>
                  <li>Cliente preenche dados (nome, CPF, placa, etc)</li>
                  <li>Você ativa o cadastro com vigência de dias</li>
                  <li>Mensalista obtém acesso automático ao pátio!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Botão Limpar Tudo */}
          <button onClick={limparTudo} className="btn-danger w-full flex items-center justify-center gap-2">
            <Trash2 className="w-5 h-5" />
            Limpar Todos os Dados
          </button>
        </div>

        {/* Modal de Convite WhatsApp */}
        <ModalConviteWhatsApp
          isOpen={showModalConvite}
          onClose={() => setShowModalConvite(false)}
          onEnviar={(numero, sucesso) => {
            if (sucesso) {
              showToast(`Convite enviado para ${numero}!`, 'success');
            }
          }}
        />

        {renderToasts()}
        {renderConfirmModal()}
      </div>
    );
  }

  // TELA HOME (OPERACIONAL)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* ALERTA DE MENSALISTA ATIVO */}
        {showAlertaMensalista && (
          <div className="mb-6 bg-gradient-to-r from-emerald-400 to-green-500 border-4 border-white rounded-xl p-6 shadow-2xl animate-pulse">
            <div className="text-center text-white">
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-3xl font-black mb-2">ACESSO LIBERADO!</h2>
              <div className="bg-white text-emerald-700 rounded-lg p-4 mb-4 shadow-lg">
                <p className="font-bold text-lg">{showAlertaMensalista.nome}</p>
                <p className="text-2xl font-mono font-bold">{showAlertaMensalista.placa}</p>
              </div>
              <p className="text-sm font-semibold mb-3">Mensalista Ativo ✓</p>
              <button
                onClick={() => setShowAlertaMensalista(null)}
                className="bg-white text-emerald-700 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {config.logoUrl && (
              <img 
                src={config.logoUrl} 
                alt="Logo" 
                className="w-12 h-12 object-contain rounded-lg shadow-md"
              />
            )}
            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
              {!config.logoUrl && <Car className="w-8 h-8" />}
              {config.nomeEmpresa}
            </h1>
          </div>

          {/* Status Impressora + Conexão */}
          <div className="flex items-center gap-2">
            {/* Status de Conexão (Offline-First) */}
            <StatusConexao />

            {statusImpressora && (
              <div className="bg-white border-2 border-blue-300 text-blue-900 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium animate-pulse max-w-[130px] sm:max-w-[220px] truncate">
                {statusImpressora}
              </div>
            )}
            {statusImpressoraUSB && (
              <div className="bg-white border-2 border-purple-300 text-purple-900 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium animate-pulse max-w-[130px] sm:max-w-[220px] truncate">
                {statusImpressoraUSB}
              </div>
            )}

            {/* Menu Impressoras (Bluetooth + USB) */}
            <div className="relative group">
              <button 
                className={`p-3 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2 text-white ${
                  (impressoraConectada || impressoraUSBConectada)
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                title="Gerenciar Impressoras"
              >
                <Printer className="w-5 h-5" />
                <span className="text-lg">▼</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-0 w-80 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-40 hidden group-hover:block">
                <div className="p-4 space-y-4">
                  {/* Bluetooth */}
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bluetooth className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-gray-800">Bluetooth</span>
                      </div>
                      {impressoraConectada && (
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {impressoraConectada ? nomeImpressora : 'Desconectado'}
                    </p>
                    <button
                      onClick={impressoraConectada ? desconectarImpressora : conectarImpressora}
                      className={`w-full py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                        impressoraConectada
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {impressoraConectada ? 'Desconectar' : 'Conectar'}
                    </button>
                  </div>

                  {/* USB */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-gray-800">USB / Serial</span>
                      </div>
                      {impressoraUSBConectada && (
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {impressoraUSBConectada ? nomeImpressoraUSB : 'Desconectado'}
                    </p>
                    <button
                      onClick={impressoraUSBConectada ? desconectarImpressoraUSB : conectarImpressoraUSB}
                      className={`w-full py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                        impressoraUSBConectada
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      {impressoraUSBConectada ? 'Desconectar' : (tentarSerialNoProximoClique ? 'Tentar Serial' : 'Conectar')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setTela('login-admin')} 
              className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-lg shadow-md transition-all active:scale-95"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Abas: Patio, Saidas e Saida por Placa */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setAbaHome('patio')}
            className={`flex-1 py-4 rounded-lg font-bold text-lg shadow-md transition-all ${
              abaHome === 'patio'
                ? 'bg-blue-600 text-white scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            🅿️ PATIO ({veiculos.length})
          </button>
          <button
            onClick={() => setAbaHome('saidas')}
            className={`flex-1 py-4 rounded-lg font-bold text-lg shadow-md transition-all ${
              abaHome === 'saidas'
                ? 'bg-green-600 text-white scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            ✅ SAIDAS ({historico.length})
          </button>
          <button
            onClick={() => setAbaHome('saida-placa')}
            className={`flex-1 py-4 rounded-lg font-bold text-lg shadow-md transition-all ${
              abaHome === 'saida-placa'
                ? 'bg-amber-600 text-white scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            🔎 SAÍDA PLACA
          </button>
        </div>

        {/* Entrada de Veículo */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Registrar Entrada</h2>
          
          {/* Campo de Placa com Autocompletar */}
          <div className="relative mb-4">
            <input
              type="text"
              value={placa}
              onChange={(e) => handlePlacaChange(e.target.value)}
              onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)}
              onFocus={() => placa.length > 0 && setSugestoesPlacas(Object.keys(veiculosCadastrados).filter(p => 
                p.replace('-', '').startsWith(placa.replace('-', ''))
              ))}
              onKeyPress={(e) => e.key === 'Enter' && registrarEntrada()}
              placeholder="ABC-1234 ou ABC-1D23"
              className="input-field text-center font-bold text-2xl tracking-wider"
              maxLength="8"
              autoFocus
            />
            
            {/* Dropdown de Sugestões */}
            {mostrarSugestoes && sugestoesPlacas.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-blue-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {sugestoesPlacas.map((placaSug) => {
                  const dados = veiculosCadastrados[placaSug];
                  const placaFormatada = formatarPlaca(placaSug);
                  return (
                    <button
                      key={placaSug}
                      onClick={() => selecionarSugestao(placaSug)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-blue-900">{placaFormatada}</p>
                        <p className="text-sm text-gray-600">{dados.modelo} • {dados.cor}</p>
                      </div>
                      <span className="text-blue-500 font-semibold">Usar</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && registrarEntrada()}
            placeholder="Modelo (ex: Gol, Civic, Onix)"
            className="input-field mb-4 mt-4 text-center font-semibold"
          />
          <input
            type="text"
            value={cor}
            onChange={(e) => setCor(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && registrarEntrada()}
            placeholder="Cor (ex: Branco, Preto, Prata)"
            className="input-field mb-4 text-center font-semibold"
          />
          
          {/* Seleção de Tipo de Veículo */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setTipoVeiculo('carro')}
              className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all ${
                tipoVeiculo === 'carro'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              🚗 CARRO
            </button>
            <button
              onClick={() => setTipoVeiculo('moto')}
              className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all ${
                tipoVeiculo === 'moto'
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              🏍️ MOTO
            </button>
          </div>
          
          <button onClick={registrarEntrada} className="btn-primary w-full text-xl py-4">
            REGISTRAR ENTRADA
          </button>
        </div>

        {/* Veículos no Pátio */}
        {abaHome === 'patio' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Car className="w-6 h-6" />
            Veículos no Pátio ({veiculos.length})
          </h2>
          
          {veiculos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum veículo no pátio</p>
          ) : (
            <div className="space-y-3">
              {veiculos.map((veiculo) => {
                const tempoDecorrido = tempoAtual - veiculo.entrada;
                const valorAtual = calcularValor(veiculo.entrada, tempoAtual, veiculo.tipo);
                const emoji = veiculo.tipo === 'moto' ? '🏍️' : '🚗';
                
                return (
                  <div key={veiculo.id} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-2xl font-bold text-blue-900">
                          {emoji} {veiculo.placa}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {veiculo.modelo} • {veiculo.cor}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="w-4 h-4" />
                          Entrada: {new Date(veiculo.entrada).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">
                          R$ {valorAtual.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg mb-3">
                      <p className="text-center text-2xl font-mono font-bold text-blue-900">
                        {formatarTempo(tempoDecorrido)}
                      </p>
                      <p className="text-center text-xs text-gray-600 mt-1">Tempo decorrido</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {(impressoraConectada || impressoraUSBConectada) && (
                        <button 
                          onClick={() => imprimirEntrada(veiculo)}
                          className="btn-primary flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <Printer className="w-5 h-5" />
                          Imprimir
                        </button>
                      )}
                      <button 
                        onClick={() => finalizarSaida(veiculo)}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-5 h-5" />
                        FINALIZAR / SAÍDA
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {abaHome === 'saida-placa' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LogOut className="w-6 h-6 text-amber-600" />
            Registrar Saída por Placa
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Digite a placa e finalize rapidamente sem procurar na lista do pátio.
          </p>

          <input
            type="text"
            value={placaSaida}
            onChange={(e) => setPlacaSaida(formatarPlaca(e.target.value.toUpperCase()))}
            onKeyPress={(e) => e.key === 'Enter' && registrarSaidaPorPlaca()}
            placeholder="ABC-1234 ou ABC-1D23"
            className="input-field text-center font-bold text-2xl tracking-wider mb-4"
            maxLength="8"
          />

          <button
            onClick={registrarSaidaPorPlaca}
            className="btn-primary w-full text-xl py-4"
          >
            LOCALIZAR E FINALIZAR SAÍDA
          </button>
        </div>
        )}

        {/* Histórico de Saidas */}
        {abaHome === 'saidas' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <History className="w-6 h-6 text-green-600" />
            Veículos que Saíram ({historico.length})
          </h2>
          {historico.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum registro de saída</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {historico.map((reg) => {
                const emoji = reg.tipo === 'moto' ? '🏍️' : '🚗';
                return (
                  <div key={reg.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">{emoji} {reg.placa}</p>
                      <p className="text-sm text-gray-600">
                        {reg.modelo} • {reg.cor}
                      </p>
                      <p className="text-sm text-gray-600">
                        Entrada: {new Date(reg.entrada).toLocaleTimeString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Saída: {new Date(reg.saida).toLocaleTimeString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Permanência: {formatarTempo(reg.permanencia)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {reg.valor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}
      </div>

      {/* Modal de Confirmação de Saída */}
      {veiculoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Resumo da Saída
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Placa</p>
                <p className="text-3xl font-bold text-blue-900">{veiculoSelecionado.placa}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Veículo</p>
                <p className="text-lg font-semibold text-blue-900">
                  {veiculoSelecionado.tipo === 'moto' ? '🏍️' : '🚗'} {veiculoSelecionado.modelo} • {veiculoSelecionado.cor}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Entrada</p>
                <p className="text-lg font-semibold">
                  {new Date(veiculoSelecionado.entrada).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Saída</p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Permanência</p>
                <p className="text-lg font-semibold font-mono">
                  {formatarTempo(Date.now() - veiculoSelecionado.entrada)}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-4xl font-bold text-green-600">
                  R$ {calcularValor(veiculoSelecionado.entrada, Date.now(), veiculoSelecionado.tipo).toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {(impressoraConectada || impressoraUSBConectada) && (
                <button 
                  onClick={() => {
                    const permanencia = formatarTempo(Date.now() - veiculoSelecionado.entrada);
                    const valor = calcularValor(veiculoSelecionado.entrada, Date.now(), veiculoSelecionado.tipo);
                    imprimirSaida(veiculoSelecionado, permanencia, valor);
                  }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir
                </button>
              )}
              <button 
                onClick={confirmarSaida}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Confirmar
              </button>
              <button 
                onClick={() => setVeiculoSelecionado(null)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {renderToasts()}
      {renderConfirmModal()}
    </div>
  );
}

export default App;
