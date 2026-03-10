import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import BluetoothPrinter from './BluetoothPrinter';
import USBPrinter from './USBPrinter';
import { ModalConviteWhatsApp } from './components/ModalConviteWhatsApp';
import { StatusConexao } from './components/StatusConexao';
// Accessibility styles
import './accessibility.css';
// Lazy-loaded pages for code splitting
import { 
  PaginaCadastroPublicoLazy,
  PaginaCadastroMensalistaLazy,
  PaginaLoginLazy,
  AbaSolicitacoesMensalistasLazy,
  LazyPage,
  prefetchPages
} from './pages/index.jsx';
import DESIGN from './design-system';
import TopBarLegacy from './components/TopBarLegacy.jsx';
import Sidebar from './components/Sidebar';
import { Button } from './components/Button';
import { StatusSincronizacao } from './components/StatusSincronizacao';
import { Input, TextArea, Select } from './components/Input';
import { Card, CardGrid, Alert, Badge } from './components/Card';
import { Modal, ConfirmDialog, Drawer } from './components/Modal';
import { Table, DataGrid } from './components/Table';
import { VirtualizedList } from './components/VirtualizedList';
import { mensalistaService } from './services/mensalistaService';
import { audioService } from './services/audioService';
import { syncService } from './services/syncService';
import { supabaseService } from './services/supabaseService';
import ProLayout from './pro/ProLayout.jsx';
import MasterDashboard from './pro/MasterDashboard.jsx';
import OperatorDashboard from './pro/OperatorDashboard.jsx';
import CaixaPro from './pro/CaixaPro.jsx';
import GestaoOperadores from './components/admin/GestaoOperadores';
import GestaoPatios from './components/admin/GestaoPatios';
import GestaoImpressoras from './components/admin/GestaoImpressoras';
import IdentidadeVisual from './components/admin/IdentidadeVisual';
import LayoutTicket from './components/admin/LayoutTicket';
import TabelaPrecos from './components/admin/TabelaPrecos';
import LimpezaDados from './components/admin/LimpezaDados';
import GestaoMensalistas from './components/admin/GestaoMensalistas';

import { 
  LogIn,
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
  Mail,
  Printer,
  Bluetooth,
  AlertCircle,
  AlertTriangle,
  Users,
  User,
  MessageCircle,
  Volume2,
  Bell,
  Eye,
  EyeOff,
  Ticket,
  ArrowLeft
} from 'lucide-react';

// Componente AdminCard (Extraído para evitar re-renderização)
const AdminCard = ({ icon: Icon, title, desc, color, onClick, badge }) => (
  <button 
    onClick={(e) => {
      e.preventDefault();
      if (onClick) onClick();
    }}
    className="group relative bg-[#1E293B]/40 backdrop-blur-md border border-slate-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-[#1E293B]/60 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1 overflow-hidden z-20 text-left w-full h-full flex flex-col"
    style={{ pointerEvents: 'auto' }}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon className="w-24 h-24" style={{ color: color }} />
    </div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors bg-slate-800/50 group-hover:bg-slate-800 shrink-0`}>
        <Icon className="w-6 h-6" style={{ color: color }} />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-50">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed flex-grow">{desc}</p>
      
      {badge && (
        <div className="mt-4 inline-flex">
          {badge}
        </div>
      )}
    </div>
  </button>
);

// Configurações padrão
const CONFIG_PADRAO = {
  nomeEmpresa: 'Command Park',
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
  cicloTeto: 12 * 60, // 12 horas em minutos
  
  // CONTROL DE CAIXA
  valorCaixaInicial: 300.00, // Saldo inicial do caixa (geralmente R$ 300,00)
  
  // CONFIGURAÇÕES DE NEGÓCIO E MENSAGENS
  mensagemConvite: 'Olá! Gostaria de convidar você para ser mensalista no Command Park. Acesse o link para se cadastrar:',
  aceitaMoto: true,
  cobraMulta: false,
  valorMulta: 0.00,
  diasVencimento: 5,
};

const SENHA_ADMIN = '1234';

function App() {
  const [tela, setTela] = useState('home'); // 'home', 'admin', 'login-admin', 'cadastro-mensalista'
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [authCarregando, setAuthCarregando] = useState(true);
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
  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [lembrarLogin, setLembrarLogin] = useLocalStorage('park-lembrar-login', false);
  const [emailSalvo, setEmailSalvo] = useLocalStorage('park-email-salvo', '');
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
  const [niveisAcessoDisponiveis, setNiveisAcessoDisponiveis] = useState(['OPERADOR']);
  const [operadoresAdmin, setOperadoresAdmin] = useState([]);
  const [carregandoOperadores, setCarregandoOperadores] = useState(false);
  const [salvandoOperador, setSalvandoOperador] = useState(false);
  const [formOperador, setFormOperador] = useState({
    operador: '',
    nomeCompleto: '',
    senha: '',
    nivelAcesso: 'OPERADOR'
  });

  // Estados para Pátios
  const [patiosAdmin, setPatiosAdmin] = useState([]);
  const [carregandoPatios, setCarregandoPatios] = useState(false);
  const [salvandoPatio, setSalvandoPatio] = useState(false);
  const [formPatio, setFormPatio] = useState({
    nome: '',
    cep: '',
    endereco: '',
    numero: '',
    cidade: '',
    estado: '',
    qtd_vagas: '',
    telefone: '',
    email: '',
    descricao: '',
    latitude: '',
    longitude: ''
  });
  
  // Estado para tipo de localização (endereco ou coordenadas)
  const [tipoLocalizacao, setTipoLocalizacao] = useState('endereco'); // 'endereco' | 'coordenadas'




  // Estados para navegação do Admin
  const [secaoAdmin, setSecaoAdmin] = useState(null); // null = menu, ou nome da seção

  // Estados para Tipos de Estacionáveis e Preços Mensalistas
  const [tiposEstacionaveis, setTiposEstacionaveis] = useLocalStorage('park-tipos-estacionaveis', [
    { id: 1, nome: 'Carro', descricao: 'Automóvel comum', ativo: true },
    { id: 2, nome: 'Moto', descricao: 'Motocicleta', ativo: true }
  ]);
  const [precosMensalistas, setPrecosMensalistas] = useLocalStorage('park-precos-mensalistas', []);
  const [formTipoEstacionavel, setFormTipoEstacionavel] = useState({ nome: '', descricao: '' });
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [salvandoTipo, setSalvandoTipo] = useState(false);
  const [editandoTipo, setEditandoTipo] = useState(null);
  const [formPrecoMensalista, setFormPrecoMensalista] = useState({ tipoEstacionavelId: '', valorMensal: '' });
  const [carregandoPrecos, setCarregandoPrecos] = useState(false);
  const [salvandoPreco, setSalvandoPreco] = useState(false);
  const [editandoPreco, setEditandoPreco] = useState(null);

  // Estados para notificações
  const [mostrarTotalCaixa, setMostrarTotalCaixa] = useState(true);
  const [pendenciasMensalistas, setPendenciasMensalistas] = useState(0);
  const [ultimaVerificacaoPendencias, setUltimaVerificacaoPendencias] = useState(0);

  // Estados para Controle de Caixa
  const [caixaAberto, setCaixaAberto] = useLocalStorage('park-caixa-aberto', false);
  const [dataAberturaCaixa, setDataAberturaCaixa] = useLocalStorage('park-data-abertura-caixa', null);
  const [dataFechamentoCaixa, setDataFechamentoCaixa] = useLocalStorage('park-data-fechamento-caixa', null);
  const [showModalControleCaixa, setShowModalControleCaixa] = useState(false);
  const [showRelatorioFechamento, setShowRelatorioFechamento] = useState(false);
  const [valorCaixaAbreConfig, setValorCaixaAbreConfig] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Carregar configurações globais do Supabase ao iniciar
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      // Pequeno delay para garantir que supabaseService inicializou
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (supabaseService.isOnline) {
        const { sucesso, dados } = await supabaseService.obterConfiguracoes();
        if (sucesso && dados) {
          console.log('Configurações carregadas do Supabase:', dados);
          setConfig(prev => ({
            ...prev,
            nomeEmpresa: dados.nome_empresa || prev.nomeEmpresa,
            cnpj: dados.cnpj || prev.cnpj,
            endereco: dados.endereco || prev.endereco,
            telefone: dados.telefone || prev.telefone,
            logoUrl: dados.logo_url || prev.logoUrl,
            valorHora: Number(dados.valor_hora) || prev.valorHora,
            toleranciaMinutos: Number(dados.tolerancia_minutos) || prev.toleranciaMinutos,
            valorCaixaInicial: Number(dados.valor_caixa_inicial) || prev.valorCaixaInicial,
            mensagemConvite: dados.mensagem_convite || prev.mensagemConvite,
            aceitaMoto: dados.aceita_moto !== undefined ? dados.aceita_moto : prev.aceitaMoto,
            cobraMulta: dados.cobra_multa !== undefined ? dados.cobra_multa : prev.cobraMulta,
            valorMulta: Number(dados.valor_multa) || prev.valorMulta,
            diasVencimento: Number(dados.dias_vencimento) || prev.diasVencimento
          }));
        }
      }
    };
    
    carregarConfiguracoes();
  }, []);

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

  useEffect(() => {
    let timeout;
    if (authCarregando) {
      timeout = setTimeout(() => {
        setAuthCarregando(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [authCarregando]);

  // Detectar se foi acessado via link de cadastro público
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('cadastro')) {
      setModoCadastroPublico(true);
    }
    
    // Restaurar email se "Lembrar de mim" estiver ativo
    if (lembrarLogin && emailSalvo) {
      setEmailInput(emailSalvo);
    }
  }, []);

  // Preload lazy pages when browser is idle
  useEffect(() => {
    prefetchPages();
  }, []);

  // Inicializar Supabase e restaurar sessão ao recarregar
  useEffect(() => {
    let ativo = true;

    const inicializarAuth = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          console.warn('⚠️ Variáveis do Supabase não encontradas');
          return;
        }

        const inicializado = await supabaseService.initialize(supabaseUrl, supabaseAnonKey);
        if (!inicializado) return;

        const usuarioSessao = supabaseService.obterUsuarioAtual();
        if (ativo && usuarioSessao) {
          setUsuarioAutenticado(usuarioSessao);
        }
      } catch (erro) {
        console.error('❌ Erro ao inicializar autenticação:', erro);
      } finally {
        if (ativo) {
          setAuthCarregando(false);
        }
      }
    };

    inicializarAuth();

    const unsubscribe = supabaseService.onMudanca(({ tipo, dados }) => {
      if (tipo === 'auth' && ativo) {
        setUsuarioAutenticado(dados?.usuario || null);
      }
    });

    return () => {
      ativo = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);


  const renderToasts = () => (
    <div style={{
      position: 'fixed',
      top: DESIGN.spacing.lg,
      right: DESIGN.spacing.lg,
      zIndex: 1000,
      width: 'min(92vw, 360px)',
      display: 'flex',
      flexDirection: 'column',
      gap: DESIGN.spacing.md,
      pointerEvents: 'auto'
    }}>
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          type={toast.tipo}
          dismissible
          onDismiss={() => removerToast(toast.id)}
        >
          {toast.mensagem}
        </Alert>
      ))}
    </div>
  );



  const renderModalControleCaixa = () => {
    return (
      <Modal
        isOpen={showModalControleCaixa}
        onClose={() => setShowModalControleCaixa(false)}
        title="Controle de Caixa"
        size="md"
      >
        {!caixaAberto ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN.spacing.md }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: DESIGN.spacing.sm
              }}>
                Valor Inicial do Caixa (R$)
              </label>
              <Input
                type="number"
                step="0.01"
                value={valorCaixaAbreConfig}
                onChange={(e) => setValorCaixaAbreConfig(e.target.value)}
                placeholder="300.00"
                min="0"
                autoFocus
              />
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: DESIGN.colors.neutral[600],
              textAlign: 'center'
            }}>
              Este é o fundo de troco inicial.
            </p>
            <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
              <Button
                variant="primary"
                fullWidth
                onClick={abrirCaixa}
              >
                ✓ Abrir Caixa
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowModalControleCaixa(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN.spacing.md }}>
            <div style={{
              backgroundColor: DESIGN.colors.success[50],
              border: `1px solid ${DESIGN.colors.success[300]}`,
              borderRadius: DESIGN.border.md,
              padding: DESIGN.spacing.md
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: DESIGN.colors.success[700],
                fontWeight: 600
              }}>
                ✅ Caixa Aberto
              </p>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: DESIGN.colors.success[900],
                marginTop: DESIGN.spacing.sm
              }}>
                Aberto há: {dataAberturaCaixa && new Date(dataAberturaCaixa).toLocaleString('pt-BR')}
              </p>
            </div>
            <Button
              variant="danger"
              fullWidth
              onClick={fecharCaixa}
            >
              🔐 Fechar Caixa
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowModalControleCaixa(false)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </Modal>
    );
  };

  const renderRelatorioFechamento = () => {
    if (!showRelatorioFechamento) return null;

    const {
      dataAbertura,
      dataFechamento,
      caixaInicial,
      registrosDoDia,
      totalArrecadado,
      valorDeposito,
      totalCaixa
    } = showRelatorioFechamento;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 my-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
            📋 PRESTAÇÃO DE CONTAS - FECHAMENTO
          </h2>

          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-4">
              <p className="text-lg font-bold">{config.nomeEmpresa}</p>
              <p className="text-sm text-gray-600">Abertura: {new Date(dataAbertura).toLocaleString('pt-BR')}</p>
              <p className="text-sm text-gray-600">Fechamento: {new Date(dataFechamento).toLocaleString('pt-BR')}</p>
            </div>

            {/* Caixa Inicial */}
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
              <p className="text-sm text-gray-600">Caixa Inicial (Fundo de Troco)</p>
              <p className="text-2xl font-bold text-blue-900">R$ {caixaInicial.toFixed(2)}</p>
            </div>

            {/* Movimentação do Dia */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Movimentação do Dia ({registrosDoDia.length} entradas)</h3>
              <div className="max-h-48 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg">
                {registrosDoDia.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">Nenhum registro no dia de hoje.</p>
                ) : (
                  registrosDoDia.map((reg, idx) => {
                    const entrada = new Date(reg.entrada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const saida = new Date(reg.saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={idx} className="flex justify-between text-sm border-b border-gray-200 pb-2">
                        <span>{idx + 1}. {reg.placa} ({entrada}→{saida})</span>
                        <span className="font-bold">R$ {reg.valor.toFixed(2)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Resumo Final - DESTACADO */}
            <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
              <h3 className="font-bold text-green-900 mb-4 text-center">RESUMO FINAL</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Total de Pagamentos:</span>
                  <span className="font-bold">R$ {totalArrecadado.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Menos Caixa Inicial:</span>
                  <span className="font-bold">-R$ {caixaInicial.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-green-300 pt-3 flex justify-between">
                  <span className="font-bold text-green-900">VALOR PARA DEPOSITAR:</span>
                  <span className="text-2xl font-bold text-green-600">R$ {valorDeposito.toFixed(2)}</span>
                </div>
                <div className="bg-white p-3 rounded border border-green-300 flex justify-between mt-4">
                  <span className="font-bold text-gray-800">Total em Caixa:</span>
                  <span className="text-xl font-bold text-blue-900">R$ {totalCaixa.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
              <Button
                variant="primary"
                fullWidth
                onClick={imprimirRelatorioFechamento}
              >
                <Printer className="w-5 h-5" style={{ marginRight: DESIGN.spacing.xs }} />
                Imprimir Relatório
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowRelatorioFechamento(false)}
              >
                Fechar
              </Button>
            </div>
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

  useEffect(() => {
    if (tela === 'admin' && supabaseService.initialized) {
      carregarDadosOperadores();
      carregarPatios();
      setSecaoAdmin(null); // Reset para menu ao entrar no admin
    }
  }, [tela]);

  // Verificar pendências de mensalistas (SEMPRE ATIVO)
  useEffect(() => {
    let intervalo;

    const verificarPendencias = async () => {
      if (supabaseService.initialized) {
        try {
          const resultado = await supabaseService.listarMensalistas('PENDENTE');
          if (resultado.sucesso) {
            const qtd = resultado.dados?.length || 0;
            const qtdAnterior = pendenciasMensalistas;
            
            setPendenciasMensalistas(qtd);
            
            // Tocar som APENAS se:
            // 1. Aumentou a quantidade (novo cadastro)
            // 2. Está na tela principal (home)
            // 3. Não é a primeira verificação
            if (qtd > qtdAnterior && qtdAnterior >= 0 && ultimaVerificacaoPendencias > 0 && tela === 'home') {
              audioService.alerta();
            }
            
            setUltimaVerificacaoPendencias(Date.now());
          }
        } catch (erro) {
          console.error('Erro ao verificar pendências:', erro);
        }
      }
    };

    // Verificar imediatamente
    verificarPendencias();

    // Verificar a cada 15 segundos (silencioso, exceto se novo cadastro na tela home)
    intervalo = setInterval(verificarPendencias, 15000);

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [tela, pendenciasMensalistas, ultimaVerificacaoPendencias]);

  // Carregar operadores automaticamente quando entrar na seção
  useEffect(() => {
    if (secaoAdmin === 'operadores' && supabaseService.initialized) {
      carregarDadosOperadores();
    }
  }, [secaoAdmin]);

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

  // Detectar mudanças de tamanho de tela para mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

    // =====================================================================
    // SISTEMA DE PERMUTA: Se mensalista tem 2+ veículos, faz saída do mais antigo
    // =====================================================================
    let veiculoRemovido = null;
    if (mensalistaEncontrado) {
      // Conta quantos veículos deste mensalista estão no pátio
      const veiculosMensalista = veiculos.filter(v => {
        const mensalistaVeiculo = verificarMensalista(v.placa);
        return mensalistaVeiculo && mensalistaVeiculo.nome === mensalistaEncontrado.nome;
      });

      // Se já tem 2 ou mais veículos, remove o mais antigo (permuta automática)
      if (veiculosMensalista.length >= 2) {
        const veiculoMaisAntigo = veiculosMensalista.reduce((mais, atual) =>
          atual.entrada < mais.entrada ? atual : mais
        );

        veiculoRemovido = veiculoMaisAntigo;
        
        // Remove o veículo mais antigo
        setVeiculos((prevVeiculos) =>
          prevVeiculos.filter(v => v.id !== veiculoMaisAntigo.id)
        );

        // Registra saída automática no histórico
        const saida = Date.now();
        // MENSALISTAS SEMPRE TEM VALOR 0,00 (isento)
        const valor = veiculoMaisAntigo.isMensalista ? 0 : calcularValor(veiculoMaisAntigo.entrada, saida, veiculoMaisAntigo.tipo);
        const permanencia = saida - veiculoMaisAntigo.entrada;

        const registro = {
          id: Date.now() + Math.random(),
          placa: veiculoMaisAntigo.placa,
          modelo: veiculoMaisAntigo.modelo,
          cor: veiculoMaisAntigo.cor,
          tipo: veiculoMaisAntigo.tipo,
          entrada: veiculoMaisAntigo.entrada,
          saida,
          permanencia,
          valor,
          isMensalista: veiculoMaisAntigo.isMensalista,
          nomeMensalista: veiculoMaisAntigo.nomeMensalista
        };

        setHistorico((prev) => [registro, ...prev]);

        // Sincroniza saída automática com Supabase
        supabaseService.registrarSaida({
          placa: registro.placa,
          modelo: registro.modelo,
          cor: registro.cor,
          tipo: registro.tipo,
          horaSaida: new Date(saida).toISOString(),
          valor: registro.valor,
          isMensalista: registro.isMensalista
        });
      }
    }

    setVeiculos((prev) => [...prev, novoVeiculo]);
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

      // Mostra mensagem de permuta se removeu um veículo
      if (veiculoRemovido) {
        showToast(
          `🔄 PERMUTA AUTOMÁTICA\n${veiculoRemovido.placa} (${veiculoRemovido.modelo}) saiu para liberar vaga.\n✅ ${novoVeiculo.placa} (${novoVeiculo.modelo}) agora no pátio.`,
          'info',
          6000
        );
      } else {
        showToast(`✅ ACESSO LIBERADO - Mensalista: ${mensalistaEncontrado.nome}`, 'success', 5000);
      }
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

  // =====================================================================
  // FUNÇÕES PARA CONTROLE DE CAIXA
  // =====================================================================

  const abrirCaixa = () => {
    if (!valorCaixaAbreConfig || parseFloat(valorCaixaAbreConfig) <= 0) {
      showToast('Informe um valor inicial válido para o caixa.', 'error');
      return;
    }

    const novoValor = parseFloat(valorCaixaAbreConfig);
    setConfig({ ...config, valorCaixaInicial: novoValor });
    setCaixaAberto(true);
    setDataAberturaCaixa(new Date().toISOString());
    setDataFechamentoCaixa(null);
    setShowModalControleCaixa(false);
    setValorCaixaAbreConfig('');
    showToast(`✅ Caixa aberto com valor inicial: R$ ${novoValor.toFixed(2)}`, 'success');
  };

  const fecharCaixa = () => {
    // Calcula os valores do dia
    const dataAtualISO = new Date().toISOString().split('T')[0];
    const registrosDoDia = historico.filter((reg) => {
      const dataSaida = new Date(reg.saida).toISOString().split('T')[0];
      return dataSaida === dataAtualISO;
    });

    const totalArrecadado = registrosDoDia.reduce((soma, reg) => soma + (reg.valor || 0), 0);
    const caixaInicial = config.valorCaixaInicial;
    const valorDeposito = totalArrecadado;
    const totalCaixa = caixaInicial + valorDeposito;

    setCaixaAberto(false);
    setDataFechamentoCaixa(new Date().toISOString());
    setShowModalControleCaixa(false);

    // Abre o relatório
    setShowRelatorioFechamento({
      dataAbertura: dataAberturaCaixa,
      dataFechamento: new Date().toISOString(),
      caixaInicial,
      registrosDoDia,
      totalArrecadado,
      valorDeposito,
      totalCaixa
    });
  };

  const imprimirRelatorioFechamento = () => {
    if (!showRelatorioFechamento) return;

    const {
      dataAbertura,
      dataFechamento,
      caixaInicial,
      registrosDoDia,
      totalArrecadado,
      valorDeposito,
      totalCaixa
    } = showRelatorioFechamento;

    const dataAberturaFormatada = new Date(dataAbertura).toLocaleString('pt-BR');
    const dataFechamentoFormatada = new Date(dataFechamento).toLocaleString('pt-BR');

    let conteudoRelatorio = `
${'='.repeat(50)}
PRESTAÇÃO DE CONTAS - FECHAMENTO DE CAIXA
${'='.repeat(50)}

${config.nomeEmpresa}
Abertura: ${dataAberturaFormatada}
Fechamento: ${dataFechamentoFormatada}

${'='.repeat(50)}
RESUMO FINANCEIRO
${'='.repeat(50)}

Caixa Inicial (Fundo de Troco): R$ ${caixaInicial.toFixed(2)}

${'='.repeat(50)}
MOVIMENTAÇÃO DO DIA
${'='.repeat(50)}

Total de Entradas: ${registrosDoDia.length}

    `;

    registrosDoDia.forEach((reg, idx) => {
      const entrada = new Date(reg.entrada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const saida = new Date(reg.saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      conteudoRelatorio += `${idx + 1}. ${reg.placa} - ${entrada} > ${saida} - R$ ${reg.valor.toFixed(2)}\n    `;
    });

    conteudoRelatorio += `
${'='.repeat(50)}
RESUMO FINAL
${'='.repeat(50)}

Total de Pagamentos do Dia: R$ ${totalArrecadado.toFixed(2)}
Menos Caixa Inicial: -R$ ${caixaInicial.toFixed(2)}
VALOR PARA DEPOSITAR: R$ ${valorDeposito.toFixed(2)}

Total em Caixa: R$ ${totalCaixa.toFixed(2)}

${'='.repeat(50)}
Gerado em: ${new Date().toLocaleString('pt-BR')}
${'='.repeat(50)}
    `;

    // Imprime se tiver impressora
    if (impressoraConectada || impressoraUSBConectada) {
      const impressoraSelecionada = impressoraConectada ? impressora : impressoraUSB;
      if (impressoraSelecionada?.imprimirTexto) {
        impressoraSelecionada.imprimirTexto(conteudoRelatorio);
      }
    } else {
      // Copia para clipboard se não tiver impressora
      navigator.clipboard.writeText(conteudoRelatorio);
      showToast('Relatório copiado para clipboard! ✓', 'info');
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
    // MENSALISTAS SEMPRE TEM VALOR 0,00 (isento)
    const valor = veiculoSelecionado.isMensalista ? 0 : calcularValor(veiculoSelecionado.entrada, saida, veiculoSelecionado.tipo);
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

  const carregarDadosOperadores = async () => {
    if (!supabaseService.initialized) return;

    setCarregandoOperadores(true);

    try {
      const [resPoliticas, resOperadores] = await Promise.all([
        supabaseService.listarPoliticasAcesso(),
        supabaseService.listarOperadores()
      ]);

      if (resPoliticas.sucesso && resPoliticas.dados.length > 0) {
        setNiveisAcessoDisponiveis(resPoliticas.dados);
        setFormOperador((anterior) => ({
          ...anterior,
          nivelAcesso: resPoliticas.dados.includes(anterior.nivelAcesso)
            ? anterior.nivelAcesso
            : resPoliticas.dados[0]
        }));
      }

      if (resOperadores.sucesso) {
        const apenasOperadoresAtivos = resOperadores.dados.filter((item) => {
          // Mostra TODOS os operadores ativos, incluindo MASTER
          return item.ativo !== false;
        });
        setOperadoresAdmin(apenasOperadoresAtivos);
      } else {
        showToast(`Erro ao carregar operadores: ${resOperadores.erro}`, 'error');
      }
    } catch (erro) {
      showToast(`Erro ao carregar operadores: ${erro.message}`, 'error');
    } finally {
      setCarregandoOperadores(false);
    }
  };

  const limparFormularioOperador = () => {
    setFormOperador((anterior) => ({
      operador: '',
      nomeCompleto: '',
      senha: '',
      nivelAcesso: anterior.nivelAcesso || 'OPERADOR'
    }));
  };

  const criarOperadorAdmin = async () => {
    const operador = formOperador.operador.trim();
    const nomeCompleto = formOperador.nomeCompleto.trim();
    const senha = formOperador.senha.trim();

    if (!operador) {
      showToast('Informe o nome do operador.', 'error');
      return;
    }

    if (!nomeCompleto) {
      showToast('Informe o nome completo.', 'error');
      return;
    }

    if (senha.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres.', 'error');
      return;
    }

    setSalvandoOperador(true);

    try {
      const resultado = await supabaseService.criarOperador({
        operador,
        senha,
        nomeCompleto,
        nivelAcesso: formOperador.nivelAcesso
      });

      if (!resultado.sucesso) {
        showToast(`Erro ao criar operador: ${resultado.erro}`, 'error', 5000);
        return;
      }

      showToast('Operador criado com sucesso!', 'success');
      limparFormularioOperador();
      await carregarDadosOperadores();
    } finally {
      setSalvandoOperador(false);
    }
  };

  const removerOperadorAdmin = async (operador) => {
    const nivelOperador = String(operador?.nivelAcesso || '').toUpperCase();
    const nivelAutenticado = String(usuarioAutenticado?.nivelAcesso || '').toUpperCase();
    
    // Se for MASTER, apenas outro MASTER pode deletar
    if (nivelOperador === 'MASTER') {
      if (nivelAutenticado !== 'MASTER') {
        showToast('Apenas MASTER pode remover outro MASTER.', 'warning');
        return;
      }
      
      // Verifica se está tentando se deletar a si mesmo
      if (usuarioAutenticado?.id === operador?.id) {
        showToast('Você não pode se deletar a si mesmo.', 'warning');
        return;
      }
    }

    const resultado = await supabaseService.removerOperador(operador);

    if (!resultado.sucesso) {
      showToast(`Erro ao remover operador: ${resultado.erro}`, 'error', 5000);
      return;
    }

    showToast('Operador removido com sucesso.', 'success');
    await carregarDadosOperadores();
  };

  // =====================================================================
  // FUNÇÕES PARA GERENCIAR TIPOS DE ESTACIONÁVEIS E PREÇOS MENSALISTAS
  // =====================================================================

  const adicionarTipoEstacionavel = () => {
    if (!formTipoEstacionavel.nome.trim()) {
      showToast('Informe o nome do tipo de estacionável.', 'error');
      return;
    }

    setSalvandoTipo(true);
    try {
      if (editandoTipo) {
        // Atualizar tipo existente
        setTiposEstacionaveis((prev) =>
          prev.map((tipo) =>
            tipo.id === editandoTipo.id
              ? { ...tipo, nome: formTipoEstacionavel.nome, descricao: formTipoEstacionavel.descricao }
              : tipo
          )
        );
        showToast('Tipo de estacionável atualizado com sucesso!', 'success');
        setEditandoTipo(null);
      } else {
        // Criar novo tipo
        const novoTipo = {
          id: Date.now(),
          nome: formTipoEstacionavel.nome,
          descricao: formTipoEstacionavel.descricao,
          ativo: true
        };
        setTiposEstacionaveis((prev) => [...prev, novoTipo]);
        showToast('Tipo de estacionável criado com sucesso!', 'success');
      }
      setFormTipoEstacionavel({ nome: '', descricao: '' });
    } finally {
      setSalvandoTipo(false);
    }
  };

  const ativarDesativarTipo = (tipoId) => {
    setTiposEstacionaveis((prev) =>
      prev.map((tipo) =>
        tipo.id === tipoId ? { ...tipo, ativo: !tipo.ativo } : tipo
      )
    );
  };

  const removerTipoEstacionavel = (tipoId) => {
    // Verifica se existem preços vinculados a este tipo
    const temPrecos = precosMensalistas.some((preco) => preco.tipoEstacionavelId === tipoId);
    if (temPrecos) {
      showToast('Não é possível remover este tipo, pois existem preços vinculados.', 'warning');
      return;
    }
    
    setTiposEstacionaveis((prev) => prev.filter((tipo) => tipo.id !== tipoId));
    showToast('Tipo de estacionável removido com sucesso!', 'success');
  };

  const adicionarPrecoMensalista = () => {
    if (!formPrecoMensalista.tipoEstacionavelId) {
      showToast('Selecione um tipo de estacionável.', 'error');
      return;
    }

    if (!formPrecoMensalista.valorMensal || parseFloat(formPrecoMensalista.valorMensal) <= 0) {
      showToast('Informe um valor mensal válido.', 'error');
      return;
    }

    setSalvandoPreco(true);
    try {
      if (editandoPreco) {
        // Atualizar preço existente
        setPrecosMensalistas((prev) =>
          prev.map((preco) =>
            preco.id === editandoPreco.id
              ? {
                  ...preco,
                  tipoEstacionavelId: parseInt(formPrecoMensalista.tipoEstacionavelId),
                  valorMensal: parseFloat(formPrecoMensalista.valorMensal)
                }
              : preco
          )
        );
        showToast('Preço de mensalista atualizado com sucesso!', 'success');
        setEditandoPreco(null);
      } else {
        // Criar novo preço
        const novoPreco = {
          id: Date.now(),
          tipoEstacionavelId: parseInt(formPrecoMensalista.tipoEstacionavelId),
          valorMensal: parseFloat(formPrecoMensalista.valorMensal)
        };
        setPrecosMensalistas((prev) => [...prev, novoPreco]);
        showToast('Preço de mensalista criado com sucesso!', 'success');
      }
      setFormPrecoMensalista({ tipoEstacionavelId: '', valorMensal: '' });
    } finally {
      setSalvandoPreco(false);
    }
  };

  const removerPrecoMensalista = (precoId) => {
    setPrecosMensalistas((prev) => prev.filter((preco) => preco.id !== precoId));
    showToast('Preço de mensalista removido com sucesso!', 'success');
  };

  const obterNomeTipo = (tipoId) => {
    return tiposEstacionaveis.find((tipo) => tipo.id === tipoId)?.nome || 'Desconhecido';
  };

  // =====================================================================
  // FUNÇÕES PARA GERENCIAR PÁTIOS
  // =====================================================================

  const carregarPatios = async () => {
    if (!supabaseService.initialized) return;

    setCarregandoPatios(true);

    try {
      const resultado = await supabaseService.listarPatios();

      if (resultado.sucesso) {
        setPatiosAdmin(resultado.dados || []);
      } else {
        showToast(`Erro ao carregar pátios: ${resultado.erro}`, 'error');
      }
    } catch (erro) {
      showToast(`Erro ao carregar pátios: ${erro.message}`, 'error');
    } finally {
      setCarregandoPatios(false);
    }
  };

  const buscarCepAutomatico = async (valorCep) => {
    const cep = valorCep.replace(/\D/g, '');
    
    // Atualiza o estado primeiro
    setFormPatio(prev => ({ ...prev, cep: valorCep }));

    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        showToast('CEP não encontrado.', 'error');
        return;
      }

      setFormPatio(prev => ({
        ...prev,
        cep: valorCep,
        endereco: data.logradouro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        // Preserva outros campos
      }));
      showToast('Endereço encontrado!', 'success');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      // Não mostra erro intrusivo no onChange, apenas loga
    }
  };

  const editarPatioAdmin = (patio) => {
    setFormPatio({
      id: patio.id, // Importante para identificar que é edição
      nome: patio.nome,
      cep: patio.cep || '',
      endereco: patio.endereco || '',
      numero: patio.numero || '',
      cidade: patio.cidade || '',
      estado: patio.estado || '',
      qtd_vagas: patio.qtd_vagas || '',
      telefone: patio.telefone || '',
      email: patio.email || '',
      descricao: patio.descricao || '',
      latitude: patio.latitude || '',
      longitude: patio.longitude || ''
    });
    
    // Define o tipo de localização com base nos dados
    if (patio.latitude && patio.longitude) {
      setTipoLocalizacao('coordenadas');
    } else {
      setTipoLocalizacao('endereco');
    }
    
    // Rola para o topo do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const criarPatioAdmin = async () => {
    const nome = formPatio.nome.trim();

    if (!nome) {
      showToast('Informe o nome do pátio.', 'error');
      return;
    }

    setSalvandoPatio(true);

    try {
      const dadosPatio = {
        nome,
        qtd_vagas: formPatio.qtd_vagas,
        telefone: formPatio.telefone.trim(),
        email: formPatio.email.trim(),
        descricao: formPatio.descricao.trim()
      };

      // Adiciona campos baseados no tipo de localização
      if (tipoLocalizacao === 'endereco') {
        dadosPatio.cep = formPatio.cep.trim();
        dadosPatio.endereco = formPatio.endereco.trim();
        dadosPatio.numero = formPatio.numero.trim();
        dadosPatio.cidade = formPatio.cidade.trim();
        dadosPatio.estado = formPatio.estado.trim();
        // Limpa lat/lng se estiver usando endereço (será calculado pelo mapa)
        dadosPatio.latitude = null;
        dadosPatio.longitude = null;
      } else {
        // Modo Coordenadas
        dadosPatio.latitude = parseFloat(formPatio.latitude);
        dadosPatio.longitude = parseFloat(formPatio.longitude);
        // Pode manter endereço vazio ou tentar preencher reverso (opcional, aqui deixaremos vazio para não confundir)
        dadosPatio.cep = '';
        dadosPatio.endereco = 'Localização via GPS';
        dadosPatio.numero = 'S/N';
        dadosPatio.cidade = '';
        dadosPatio.estado = '';
      }

      let resultado;
      if (formPatio.id) {
        // Modo Edição
        resultado = await supabaseService.atualizarPatio(formPatio.id, dadosPatio);
      } else {
        // Modo Criação
        resultado = await supabaseService.criarPatio(dadosPatio);
      }

      if (!resultado.sucesso) {
        showToast(`Erro ao salvar pátio: ${resultado.erro}`, 'error', 5000);
        return;
      }

      showToast(formPatio.id ? 'Pátio atualizado com sucesso!' : 'Pátio criado com sucesso!', 'success');
      limparFormularioPatio();
      await carregarPatios();
    } finally {
      setSalvandoPatio(false);
    }
  };

  const removerPatioAdmin = async (patio) => {
    const resultado = await supabaseService.removerPatio(patio.id);

    if (!resultado.sucesso) {
      showToast(`Erro ao remover pátio: ${resultado.erro}`, 'error', 5000);
      return;
    }

    showToast('Pátio removido com sucesso.', 'success');
    await carregarPatios();
  };

  const limparFormularioPatio = () => {
    setFormPatio({
      id: null,
      nome: '',
      cep: '',
      endereco: '',
      numero: '',
      cidade: '',
      estado: '',
      qtd_vagas: '',
      telefone: '',
      email: '',
      descricao: '',
      latitude: '',
      longitude: ''
    });
    setTipoLocalizacao('endereco');
  };

  // Função para formatar CNPJ
  const formatarCNPJ = (valor) => {
    if (!valor) return '';
    return valor
      .replace(/\D/g, '') // Remove não dígitos
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1'); // Limita o tamanho
  };

  // Login admin
  const fazerLogin = async () => {
    // 1. Tentar login via Supabase (Prioritário)
    if (emailInput && senhaInput) {
      setAuthCarregando(true);
      try {
        const { user, error } = await supabaseService.login(emailInput, senhaInput);
        if (error) {
          throw error;
        }
        // Sucesso: atualiza estado imediatamente e para carregamento
        if (user) {
          if (lembrarLogin) {
            setEmailSalvo(emailInput);
          } else {
            setEmailSalvo('');
          }
          setUsuarioAutenticado(user);
          setAuthCarregando(false);
          setTela('home');
          showToast('Bem-vindo de volta!', 'success');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        showToast('Falha no login: ' + (error.message || 'Erro desconhecido'), 'error');
      } finally {
        setAuthCarregando(false);
      }
      return;
    }

    // 2. Fallback para senha local (Legado)
    if (senhaInput === SENHA_ADMIN) {
      // Cria um usuário fake para admin local
      const adminUser = { id: 'admin-local', email: 'admin@local', nivelAcesso: 'MASTER' };
      setUsuarioAutenticado(adminUser);
      setTela('admin');
      setSenhaInput('');
      showToast('Acesso Admin Local concedido', 'warning');
    } else {
      showToast('Preencha email e senha ou a senha de admin local!', 'error');
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

  // Obtém datas únicas do histórico (memoizado)
  const datasUnicasHistorico = useMemo(() => {
    const datas = new Set();
    historico.forEach(reg => {
      const data = new Date(reg.saida).toLocaleDateString('pt-BR');
      datas.add(data);
    });
    return Array.from(datas).sort((a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-')));
  }, [historico]);

  // Obtém meses únicos do histórico (memoizado)
  const mesesUnicosHistorico = useMemo(() => {
    const meses = new Set();
    historico.forEach(reg => {
      const data = new Date(reg.saida);
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      meses.add(`${mes}/${ano}`);
    });
    return Array.from(meses).sort().reverse();
  }, [historico]);

  const opcoesMesesDelecao = useMemo(() => ([
    { value: '', label: 'Selecione um mês...' },
    ...mesesUnicosHistorico.map((mesAno) => ({ value: mesAno, label: mesAno }))
  ]), [mesesUnicosHistorico]);

  // Limpar todos os dados
  const limparTudo = () => {
    abrirConfirmacao('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita!', () => {
      setVeiculos([]);
      setHistorico([]);
      setConfig(CONFIG_PADRAO);
      showToast('Dados limpos com sucesso!', 'success');
    }, 'Limpar todos os dados');
  };

  // Calcula total em caixa (memoizado)
  const totalEmCaixa = useMemo(
    () => historico.reduce((sum, reg) => sum + reg.valor, 0),
    [historico]
  );

  const biTrend = useMemo(() => {
    const today = new Date();
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });
    const fmt = (d) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const labels = days.map(fmt);
    const sums = days.map((d) => {
      const key = d.toISOString().split('T')[0];
      return historico
        .filter((h) => new Date(h.saida).toISOString().startsWith(key))
        .reduce((s, h) => s + (h.valor || 0), 0);
    });
    return { labels, data: sums };
  }, [historico]);
  const totalArrecadadoDia = useMemo(() => {
    const dataAtualISO = new Date().toISOString().split('T')[0];
    const registrosDoDia = historico.filter((reg) => {
      const dataSaida = new Date(reg.saida).toISOString().split('T')[0];
      return dataSaida === dataAtualISO;
    });
    return registrosDoDia.reduce((soma, reg) => soma + (reg.valor || 0), 0);
  }, [historico]);

  const caixaInicialAtual = useMemo(() => Number(config?.valorCaixaInicial || 0), [config]);
  const totalCaixaAtual = useMemo(
    () => caixaInicialAtual + totalArrecadadoDia,
    [caixaInicialAtual, totalArrecadadoDia]
  );

  // Mapa de unidades baseado nos pátios cadastrados
  const unidadesMapa = useMemo(() => {
    return patiosAdmin.map(patio => ({
      id: patio.id,
      nome: patio.nome,
      lat: -23.55, // Placeholder - ideal seria ter lat/lng no cadastro de pátio
      lng: -46.63, // Placeholder
      cep: patio.cep,
      endereco: patio.endereco,
      numero: patio.numero,
      cidade: patio.cidade,
      estado: patio.estado,
      ocupacao: Math.round((veiculos.length / (patio.qtd_vagas || 100)) * 100),
      faturamento: totalArrecadadoDia
    }));
  }, [patiosAdmin, veiculos, totalArrecadadoDia]);

  const historicoGridData = useMemo(() => (
    historico.map((reg) => ({
      id: reg.id,
      placa: reg.placa,
      modelo: reg.modelo,
      tipo: reg.tipo === 'moto' ? '🏍️ Moto' : '🚗 Carro',
      entrada: new Date(reg.entrada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      saida: new Date(reg.saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      permanencia: formatarTempo(reg.permanencia),
      valor: `R$ ${reg.valor.toFixed(2)}`
    }))
  ), [historico]);

  const usarVirtualizacaoHistorico = historicoGridData.length > 500;
 
 // Memoizar colunas do histórico
 const colunasHistorico = useMemo(() => [
   { key: 'placa', label: 'Placa', width: '80px' },
   { key: 'modelo', label: 'Modelo', width: '100px' },
   { key: 'tipo', label: 'Tipo', width: '80px' },
   { key: 'entrada', label: 'Entrada', width: '120px' },
   { key: 'saida', label: 'Saída', width: '120px' },
   { key: 'permanencia', label: 'Permanência', width: '100px' },
   { key: 'valor', label: 'Valor (R$)', width: '90px', align: 'right' }
 ], []);

  const niveisAcessoOptions = useMemo(
    () => niveisAcessoDisponiveis.map((nivel) => ({ value: nivel, label: nivel })),
    [niveisAcessoDisponiveis]
  );

  const operadoresAdminTableData = useMemo(
    () => operadoresAdmin.map((operador) => {
      const nivelOperador = String(operador?.nivelAcesso || '').toUpperCase();
      const nivelAutenticado = String(usuarioAutenticado?.nivelAcesso || '').toUpperCase();
      const ehMaster = nivelOperador === 'MASTER';
      const ehVoceMesmo = usuarioAutenticado?.id === operador?.id;
      const podeDeleter = !ehMaster || (nivelAutenticado === 'MASTER' && !ehVoceMesmo);

      return {
        id: operador.id,
        nomeCompleto: (
          <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN.spacing.sm }}>
            <span style={{ fontWeight: '600' }}>{operador.nomeCompleto}</span>
            {ehMaster && <Badge variant="danger" size="sm">MASTER</Badge>}
            {ehVoceMesmo && <Badge variant="primary" size="sm">VOCÊ</Badge>}
          </div>
        ),
        email: operador.email || <span style={{ color: DESIGN.colors.neutral[400] }}>n/a</span>,
        nivelAcesso: operador.nivelAcesso,
        status: ehVoceMesmo ? (
          <Badge variant="primary" size="sm">Você</Badge>
        ) : ehMaster ? (
          <Badge variant="danger" size="sm">Master</Badge>
        ) : (
          <Badge variant="success" size="sm">Ativo</Badge>
        ),
        acao: (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmDialog({
              titulo: 'Remover operador',
              mensagem: `Confirma remover o operador ${operador.nomeCompleto}?`,
              onConfirm: () => removerOperadorAdmin(operador)
            })}
            disabled={!podeDeleter}
            title={
              !podeDeleter
                ? ehVoceMesmo
                  ? 'Você não pode se deletar'
                  : 'Apenas MASTER pode deletar MASTER'
                : 'Deletar operador'
            }
          >
            <Trash2 className="w-4 h-4" style={{ marginRight: DESIGN.spacing.xs }} />
            Deletar
          </Button>
        )
      };
    }),
    [operadoresAdmin, usuarioAutenticado]
  );

  const patiosAdminTableData = useMemo(
    () => patiosAdmin.map((patio) => ({
      id: patio.id,
      nome: <span style={{ fontWeight: '600' }}>{patio.nome}</span>,
      localizacao: (
        <div style={{ fontSize: DESIGN.typography.sizes.sm, color: DESIGN.colors.neutral[600] }}>
          {patio.endereco && <div>{patio.endereco}</div>}
          {(patio.cidade || patio.estado) && (
            <div>{patio.cidade && `${patio.cidade}, `}{patio.estado}</div>
          )}
        </div>
      ),
      vagas: patio.qtd_vagas > 0 ? (
        <Badge variant="primary" size="sm">{patio.qtd_vagas}</Badge>
      ) : (
        <span style={{ color: DESIGN.colors.neutral[400] }}>-</span>
      ),
      telefone: patio.telefone || <span style={{ color: DESIGN.colors.neutral[400] }}>n/a</span>,
      acao: (
        <div className="flex gap-2 justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => editarPatioAdmin(patio)}
            title="Editar Pátio"
          >
            ✏️
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmDialog({
              titulo: 'Remover pátio',
              mensagem: `Confirma remover o pátio "${patio.nome}"?`,
              onConfirm: () => removerPatioAdmin(patio)
            })}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    })),
    [patiosAdmin]
  );

  const [mostrarMapaFullScreen, setMostrarMapaFullScreen] = useState(false);

  // MODO CADASTRO PÚBLICO (Via link WhatsApp)
  if (modoCadastroPublico) {
    return (
      <LazyPage 
        component={PaginaCadastroPublicoLazy}
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
        <LazyPage component={PaginaCadastroMensalistaLazy} />
        {renderToasts()}
      </>
    );
  }

  // TELA DE LOGIN ADMIN
  if (tela === 'login-admin') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-md w-full relative z-10 bg-[#1E293B]/40 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20">
              <Lock className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 text-white">Área Administrativa</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Digite sua senha de acesso restrito</p>
          
          <div className="mb-6">
            <Input
              type="password"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fazerLogin()}
              placeholder="Digite a senha"
              autoFocus
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="primary" 
              fullWidth
              onClick={fazerLogin}
            >
              Entrar
            </Button>
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => setTela('home')}
            >
              Cancelar
            </Button>
          </div>
        </div>
        {renderToasts()}
        <ConfirmDialog
          isOpen={!!confirmDialog}
          title={confirmDialog?.titulo || ''}
          message={confirmDialog?.mensagem || ''}
          variant="danger"
          confirmText="Confirmar"
          cancelText="Cancelar"
          onConfirm={confirmarDialogo}
          onCancel={cancelarDialogo}
        />
        {renderModalControleCaixa()}
        {renderRelatorioFechamento()}
      </div>
    );
  }

  // TELA ADMINISTRATIVA
  if (tela === 'admin') {
    // Menu Principal do Admin
    if (!secaoAdmin) {
      return (
        <div className="min-h-screen bg-[#020617] text-slate-100 p-4 font-sans relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-4">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                  <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                    <Settings className="w-8 h-8 text-cyan-400" />
                  </div>
                  Painel de Comando
                </h1>
                <p className="text-slate-400 mt-1 ml-14">Configurações globais do sistema Command Park</p>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => setTela('home')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderColor: 'rgba(51, 65, 85, 0.5)',
                  color: '#94a3b8',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Home className="w-5 h-5" />
                Voltar ao Dashboard
              </Button>
            </div>

            {/* Grade de Botões */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-50">
              <AdminCard 
                icon={Users}
                title="Gestão de Operadores"
                desc="Gerencie contas de acesso, redefina senhas e configure níveis de permissão da equipe."
                color="#22d3ee"
                onClick={() => setSecaoAdmin('operadores')}
              />

              <AdminCard 
                icon={Home}
                title="Gestão de Pátios"
                desc="Cadastre novas unidades, configure endereços, coordenadas GPS e capacidade de vagas."
                color="#34d399"
                onClick={() => setSecaoAdmin('patios')}
              />

              <AdminCard 
                icon={Printer}
                title="Impressoras & Hardware"
                desc="Conecte impressoras térmicas via Bluetooth/USB e configure dispositivos de entrada."
                color="#fbbf24"
                onClick={() => setSecaoAdmin('impressoras')}
              />

              <AdminCard 
                icon={Car}
                title="Identidade Visual"
                desc="Personalize o sistema com a marca da sua empresa: Logo, Nome, CNPJ e cores."
                color="#818cf8"
                onClick={() => setSecaoAdmin('empresa')}
              />

              <AdminCard 
                icon={Ticket}
                title="Layout do Ticket"
                desc="Customize o comprovante impresso: cabeçalho, rodapé, fontes e mensagens."
                color="#f472b6"
                onClick={() => setSecaoAdmin('ticket')}
              />

              <AdminCard 
                icon={DollarSign}
                title="Tabela de Preços"
                desc="Defina valores por hora, frações, tolerâncias e diárias para cada categoria."
                color="#fbbf24"
                onClick={() => setSecaoAdmin('precos')}
              />

              <AdminCard 
                icon={Trash2}
                title="Limpeza de Dados"
                desc="Ferramentas avançadas para exclusão de registros antigos e manutenção do banco."
                color="#ef4444"
                onClick={() => setSecaoAdmin('registros')}
              />

              <AdminCard 
                icon={Users}
                title="Mensalistas"
                desc="Aprovação de cadastros, gestão de contratos e controle de acesso de mensalistas."
                color="#a78bfa"
                onClick={() => setSecaoAdmin('mensalistas')}
                badge={(pendenciasMensalistas || 0) > 0 ? (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-bold animate-pulse">
                    {pendenciasMensalistas} PENDENTE(S)
                  </span>
                ) : null}
              />

              <AdminCard 
                icon={DollarSign}
                title="Controle de Caixa"
                desc={caixaAberto ? "Caixa atualmente ABERTO. Clique para fechar ou ver parciais." : "Caixa FECHADO. Clique para iniciar turno."}
                color={caixaAberto ? "#34d399" : "#fbbf24"}
                onClick={() => setShowModalControleCaixa(true)}
                badge={caixaAberto ? (
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold">
                    CAIXA ABERTO
                  </span>
                ) : (
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-bold">
                    CAIXA FECHADO
                  </span>
                )}
              />
            </div>
          </div>
          {renderModalControleCaixa()}
          {renderRelatorioFechamento()}
          {renderToasts()}
          <ConfirmDialog
            isOpen={!!confirmDialog}
            title={confirmDialog?.titulo || ''}
            message={confirmDialog?.mensagem || ''}
            variant="danger"
            confirmText="Confirmar"
            cancelText="Cancelar"
            onConfirm={confirmarDialogo}
            onCancel={cancelarDialogo}
          />
        </div>
      );
    }

    // Renderizar seção específica
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 p-4 font-sans relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header da Seção */}
          <div className="flex items-center justify-between mb-8 pt-4">
             <div className="flex items-center gap-4">
                <Button 
                  variant="secondary"
                  onClick={() => setSecaoAdmin(null)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '40px', 
                    height: '40px', 
                    padding: 0,
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.5)', 
                    color: 'white', 
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      {secaoAdmin === 'operadores' && <><Users className="text-cyan-400"/> Gestão de Operadores</>}
                      {secaoAdmin === 'patios' && <><Home className="text-emerald-400"/> Gestão de Pátios</>}
                      {secaoAdmin === 'impressoras' && <><Printer className="text-amber-400"/> Hardware & Impressão</>}
                      {secaoAdmin === 'empresa' && <><Car className="text-indigo-400"/> Identidade Visual</>}
                      {secaoAdmin === 'ticket' && <><Ticket className="text-pink-400"/> Layout do Ticket</>}
                      {secaoAdmin === 'precos' && <><DollarSign className="text-amber-400"/> Tabela de Preços</>}
                      {secaoAdmin === 'registros' && <><Trash2 className="text-red-400"/> Manutenção de Dados</>}
                      {secaoAdmin === 'mensalistas' && <><Users className="text-violet-400"/> Mensalistas</>}
                   </h2>
                </div>
             </div>

            <Button 
              variant="secondary"
              onClick={() => setTela('home')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#fca5a5', 
                border: '1px solid rgba(239, 68, 68, 0.2)' 
              }}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>

          {/* Conteúdo da Seção Selecionada */}
          <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
             
          {secaoAdmin === 'operadores' && (
            <GestaoOperadores 
              carregarDadosOperadores={carregarDadosOperadores}
              carregandoOperadores={carregandoOperadores}
              formOperador={formOperador}
              setFormOperador={setFormOperador}
              niveisAcessoOptions={niveisAcessoOptions}
              criarOperadorAdmin={criarOperadorAdmin}
              salvandoOperador={salvandoOperador}
              limparFormularioOperador={limparFormularioOperador}
              operadoresAdminTableData={operadoresAdminTableData}
            />
          )}

          {secaoAdmin === 'patios' && (
            <GestaoPatios 
              carregarPatios={carregarPatios}
              carregandoPatios={carregandoPatios}
              formPatio={formPatio}
              setFormPatio={setFormPatio}
              tipoLocalizacao={tipoLocalizacao}
              setTipoLocalizacao={setTipoLocalizacao}
              buscarCepAutomatico={buscarCepAutomatico}
              criarPatioAdmin={criarPatioAdmin}
              salvandoPatio={salvandoPatio}
              limparFormularioPatio={limparFormularioPatio}
              patiosAdminTableData={patiosAdminTableData}
            />
          )}

          {secaoAdmin === 'impressoras' && (
            <GestaoImpressoras 
              impressoraConectada={impressoraConectada}
              nomeImpressora={nomeImpressora}
              desconectarImpressora={desconectarImpressora}
              conectarImpressora={conectarImpressora}
              imprimirEntrada={imprimirEntrada}
              testarAlinhamento={testarAlinhamento}
              impressoraUSBConectada={impressoraUSBConectada}
              nomeImpressoraUSB={nomeImpressoraUSB}
              desconectarImpressoraUSB={desconectarImpressoraUSB}
              conectarImpressoraUSB={conectarImpressoraUSB}
              tentarSerialNoProximoClique={tentarSerialNoProximoClique}
            />
          )}

          {secaoAdmin === 'empresa' && (
            <IdentidadeVisual 
              config={config}
              setConfig={setConfig}
              formatarCNPJ={formatarCNPJ}
              handleLogoUpload={handleLogoUpload}
              removerLogo={removerLogo}
              salvarConfiguracoes={async () => {
                if (supabaseService.isOnline) {
                  const { sucesso, erro } = await supabaseService.salvarConfiguracoes(config);
                  if (sucesso) {
                    showToast('Configurações salvas na nuvem!', 'success');
                  } else {
                    showToast('Erro ao salvar na nuvem: ' + erro, 'error');
                  }
                } else {
                  showToast('Offline: Configurações salvas apenas localmente.', 'warning');
                }
              }}
            />
          )}

          {secaoAdmin === 'ticket' && (
            <LayoutTicket 
              config={config}
              setConfig={setConfig}
            />
          )}

          {secaoAdmin === 'precos' && (
            <TabelaPrecos 
              config={config}
              setConfig={setConfig}
              formTipoEstacionavel={formTipoEstacionavel}
              setFormTipoEstacionavel={setFormTipoEstacionavel}
              adicionarTipoEstacionavel={adicionarTipoEstacionavel}
              salvandoTipo={salvandoTipo}
              editandoTipo={editandoTipo}
              setEditandoTipo={setEditandoTipo}
              tiposEstacionaveis={tiposEstacionaveis}
              ativarDesativarTipo={ativarDesativarTipo}
              removerTipoEstacionavel={removerTipoEstacionavel}
              formPrecoMensalista={formPrecoMensalista}
              setFormPrecoMensalista={setFormPrecoMensalista}
              adicionarPrecoMensalista={adicionarPrecoMensalista}
              salvandoPreco={salvandoPreco}
              editandoPreco={editandoPreco}
              setEditandoPreco={setEditandoPreco}
              precosMensalistas={precosMensalistas}
              obterNomeTipo={obterNomeTipo}
              removerPrecoMensalista={removerPrecoMensalista}
            />
          )}

          {secaoAdmin === 'registros' && (
            <LimpezaDados 
              datasUnicasHistorico={datasUnicasHistorico}
              deletarPorDia={deletarPorDia}
              opcoesMesesDelecao={opcoesMesesDelecao}
              deletarPorMes={deletarPorMes}
              historico={historico}
              impressoraConectada={impressoraConectada}
              impressoraUSBConectada={impressoraUSBConectada}
              imprimirSaida={imprimirSaida}
              formatarTempo={formatarTempo}
              deletarRegistro={deletarRegistro}
              veiculosCadastrados={veiculosCadastrados}
              setVeiculosCadastrados={setVeiculosCadastrados}
            />
          )}

          {secaoAdmin === 'mensalistas' && (
            <GestaoMensalistas 
              config={config}
              AbaSolicitacoesMensalistasLazy={AbaSolicitacoesMensalistasLazy}
              showModalConvite={showModalConvite}
              setShowModalConvite={setShowModalConvite}
              showToast={showToast}
              limparTudo={limparTudo}
            />
          )}
        </div>

        {renderToasts()}
        <ConfirmDialog
          isOpen={!!confirmDialog}
          title={confirmDialog?.titulo || ''}
          message={confirmDialog?.mensagem || ''}
          variant="danger"
          confirmText="Confirmar"
          cancelText="Cancelar"
          onConfirm={confirmarDialogo}
          onCancel={cancelarDialogo}
        />
      </div>
    </div>
    );
  }

  // Se não está autenticado, mostrar tela de login
  if (authCarregando) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-8 text-center max-w-sm w-full animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-900 to-cyan-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="text-2xl font-black text-white">C</span>
          </div>
          <p className="text-gray-300 font-bold text-lg">Carregando sessão...</p>
          <p className="text-cyan-400 text-xs mt-2 font-mono tracking-widest">COMMAND PARK SECURITY</p>
        </div>
      </div>
    );
  }

  if (!usuarioAutenticado) {
    return (
      <div className="min-h-screen bg-[#020617] text-gray-100 font-sans transition-colors duration-300">
        <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[#020617]"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]"></div>
          
          <div className="w-full max-w-md bg-[#0F172A]/40 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 p-8 relative z-10 animate-fade-in-up">
            <div className="text-center mb-8">
              {config.logoUrl ? (
                <div className="w-24 h-24 mx-auto mb-4 relative group">
                   <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                   <img 
                    src={config.logoUrl} 
                    alt="Logo Empresa" 
                    className="w-full h-full object-contain relative z-10 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                   />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-900 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] mb-4 transform rotate-3 hover:rotate-6 transition-transform duration-500">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {config.nomeEmpresa ? config.nomeEmpresa.charAt(0).toUpperCase() : 'C'}
                  </span>
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight uppercase">
                {config.nomeEmpresa || 'COMMAND PARK'}
              </h1>
              
              {config.cnpj && (
                <p className="text-gray-400 text-xs font-mono mb-1 tracking-wider">
                  CNPJ: {formatarCNPJ(config.cnpj)}
                </p>
              )}
              
              <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mt-2">
                Security Protocol v3.0
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Usuário</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-[#0F172A]/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-lg"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Senha de Acesso</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={senhaInput}
                    onChange={(e) => setSenhaInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fazerLogin()}
                    className="block w-full pl-12 pr-4 py-4 bg-[#0F172A]/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-lg"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="lembrar-login"
                  type="checkbox"
                  checked={lembrarLogin}
                  onChange={(e) => setLembrarLogin(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-[#0F172A] text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                />
                <label htmlFor="lembrar-login" className="ml-2 text-sm text-gray-400 cursor-pointer select-none">
                  Lembrar de mim
                </label>
              </div>

              <button
                onClick={fazerLogin}
                className="w-full bg-gradient-to-r from-cyan-700 to-blue-600 hover:from-cyan-600 hover:to-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Acessar Sistema
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">© 2026 Command Park Solutions. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
        {renderToasts()}
      </div>
    );
  }

  // TELA HOME (OPERACIONAL)
  return (
    <div className="min-h-screen bg-[#050A14] text-gray-100 pb-20 transition-colors duration-300">
      <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '16rem', zIndex: 5 }}>
        <Sidebar selected="principal" onNavigate={(item) => {
          if (item === 'operador') { setTela('admin'); setSecaoAdmin('operadores'); }
          if (item === 'caixa') { setShowModalControleCaixa(true); }
          if (item === 'entrada') { setAbaHome('patio'); }
          if (item === 'saida') { setAbaHome('saidas'); }
          if (item === 'logout') { 
            supabaseService.logout(); 
            setUsuarioAutenticado(null);
            setSenhaInput('');
            if (!lembrarLogin) {
              setEmailInput('');
            }
            setSenhaInput('');
          }
        }} isDesktop config={config} />
      </div>
      <div className="ml-0 md:ml-64 max-w-6xl mx-auto px-4" style={String(usuarioAutenticado?.nivelAcesso || '').toUpperCase() === 'MASTER' ? { maxWidth: '100%', margin: 0, padding: 0 } : {}}>
        <ProLayout
          unidades={unidadesMapa.length > 0 ? unidadesMapa : [{
            id: 'default',
            nome: config.nomeEmpresa || 'Pátio Principal',
            lat: -23.550520,
            lng: -46.633308,
            ocupacao: Math.min(100, Math.round((veiculos.length / 100) * 100)),
            faturamento: totalArrecadadoDia
          }]}
          config={config}
          onAdmin={() => setTela('admin')}
          onLogout={() => {
            supabaseService.logout();
            setUsuarioAutenticado(null);
            if (!lembrarLogin) {
              setEmailInput('');
            }
            setSenhaInput('');
          }}
          onToggleMap={() => setMostrarMapaFullScreen(!mostrarMapaFullScreen)}
          fullScreen={String(usuarioAutenticado?.nivelAcesso || '').toUpperCase() === 'MASTER' || mostrarMapaFullScreen}
        >
          {(String(usuarioAutenticado?.nivelAcesso || '').toUpperCase() === 'MASTER' || mostrarMapaFullScreen) ? (
            <MasterDashboard
              unidades={unidadesMapa.length > 0 ? unidadesMapa : [{
                id: 'default',
                nome: config.nomeEmpresa || 'Pátio Principal',
                lat: -23.550520,
                lng: -46.633308,
                ocupacao: Math.min(100, Math.round((veiculos.length / 100) * 100)),
                faturamento: totalArrecadadoDia
              }]}
              ocupacao={{}}
              bi={{
                faturamento: historico.reduce((sum, r) => sum + (Number(r.valor) || 0), 0),
                ocupacaoGlobal: Math.min(100, Math.round((veiculos.length / 100) * 100)),
                trend: biTrend
              }}
            />
          ) : (
            <OperatorDashboard>
              <div className="mb-8">
                <CaixaPro 
                  isOpen={caixaAberto}
                  balance={totalCaixaAtual}
                  onOpen={(valor) => {
                    setConfig({ ...config, valorCaixaInicial: valor });
                    setCaixaAberto(true);
                    setDataAberturaCaixa(new Date().toISOString());
                    setDataFechamentoCaixa(null);
                    showToast(`✅ Caixa aberto: R$ ${valor.toFixed(2)}`, 'success');
                  }}
                  onClose={fecharCaixa}
                  onBleed={(valor, motivo) => {
                    showToast(`Sangria de R$ ${valor} registrada: ${motivo}`, 'info');
                  }}
                  history={historico.slice(0, 10).map(h => ({
                    description: `${h.placa} - ${h.modelo}`,
                    amount: h.valor,
                    date: h.saida,
                    type: 'in'
                  }))}
                />
              </div>
            </OperatorDashboard>
          )}
        </ProLayout>
        {/* ALERTA DE MENSALISTA ATIVO */}
        {showAlertaMensalista && (
          <div className="mb-6 bg-gradient-to-r from-[#064E3B] to-[#10B981] border-2 border-[#10B981] rounded-xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse">
            <div className="text-center text-white">
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-3xl font-black mb-2 tracking-tighter">ACESSO LIBERADO!</h2>
              <div className="bg-[#050A14]/50 backdrop-blur-md text-white rounded-lg p-4 mb-4 shadow-lg border border-white/10">
                <p className="font-bold text-lg uppercase tracking-wider">{showAlertaMensalista.nome}</p>
                <p className="text-2xl font-mono font-bold text-[#10B981]">{showAlertaMensalista.placa}</p>
              </div>
              <p className="text-sm font-semibold mb-3 text-emerald-100">Mensalista Ativo ✓</p>
              <button
                onClick={() => setShowAlertaMensalista(null)}
                className="bg-white text-[#064E3B] font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <TopBarLegacy
          tempoAtual={tempoAtual}
          usuario={usuarioAutenticado}
          onNavigate={(item) => {
            if (item === 'patio') setAbaHome('patio');
            if (item === 'saidas') setAbaHome('saidas');
            if (item === 'caixa') setShowModalControleCaixa(true);
          }}
          onLogout={() => {
            supabaseService.logout();
            setUsuarioAutenticado(null);
            if (!lembrarLogin) {
              setEmailInput('');
            }
            setSenhaInput('');
          }}
        />

        {/* Controles Adicionais - Caixa + Impressoras */}
        <div className="flex gap-2 mb-6 flex-wrap justify-end">
          {/* Botão Controle de Caixa */}
          <button
            onClick={() => setShowModalControleCaixa(true)}
            className={`text-white p-3 rounded-lg shadow-md transition-all active:scale-95 ${
              caixaAberto
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
            title={caixaAberto ? 'Caixa aberto - Clique para fechar' : 'Clique para abrir o caixa'}
          >
            <DollarSign className="w-6 h-6" />
          </button>

          {/* Status Impressora + Conexão */}
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
        </div>

        {/* Ações rápidas estilo index2 */}
        <section className="p-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            className="flex flex-col items-center justify-center p-4 bg-[#1E293B]/70 rounded-xl border border-white/10 shadow-sm hover:shadow-lg hover:border-blue-400/50 transition group backdrop-blur-sm"
            onClick={() => setAbaHome('patio')}
            title="Pátio"
          >
            <Car className="text-blue-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold uppercase text-gray-300 group-hover:text-white">Pátio ({veiculos.length})</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-4 bg-[#1E293B]/70 rounded-xl border border-white/10 shadow-sm hover:shadow-lg hover:border-emerald-400/50 transition group backdrop-blur-sm"
            onClick={() => setAbaHome('saidas')}
            title="Saídas"
          >
            <CheckCircle className="text-emerald-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold uppercase text-gray-300 group-hover:text-white">Saídas ({historico.length})</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-4 bg-[#1E293B]/70 rounded-xl border border-white/10 shadow-sm hover:shadow-lg hover:border-amber-400/50 transition group backdrop-blur-sm"
            onClick={() => setShowModalControleCaixa(true)}
            title="Caixa"
          >
            <DollarSign className="text-amber-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold uppercase text-gray-300 group-hover:text-white">Caixa</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-4 bg-[#1E293B]/70 rounded-xl border border-white/10 shadow-sm hover:shadow-lg hover:border-purple-400/50 transition group backdrop-blur-sm"
            onClick={() => {
              setTela('admin');
              setSecaoAdmin('mensalistas');
            }}
            title="Mensalistas"
          >
            <Users className="text-purple-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold uppercase text-gray-300 group-hover:text-white">Mensalistas</span>
          </button>
        </section>

        {/* Dashboard Stats - Métricas do Dia */}
        <CardGrid columns={4} gap="lg" style={{ marginBottom: DESIGN.spacing.lg }}>
          <Card variant="primary" padding="lg">
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: DESIGN.typography.sizes.sm, 
                color: DESIGN.colors.primary[600],
                fontWeight: '600',
                textTransform: 'uppercase',
                marginBottom: DESIGN.spacing.sm
              }}>
                Entradas
              </p>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: DESIGN.colors.primary[900],
                margin: 0
              }}>
                {veiculos.length}
              </p>
              <p style={{
                fontSize: DESIGN.typography.sizes.xs,
                color: DESIGN.colors.primary[700],
                marginTop: DESIGN.spacing.xs
              }}>
                veículos no pátio
              </p>
            </div>
          </Card>

          <Card variant="success" padding="lg">
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: DESIGN.typography.sizes.sm, 
                color: DESIGN.colors.success[600],
                fontWeight: '600',
                textTransform: 'uppercase',
                marginBottom: DESIGN.spacing.sm
              }}>
                Arrecadado
              </p>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: DESIGN.colors.success[900],
                margin: 0
              }}>
                R$ {totalArrecadadoDia.toFixed(2)}
              </p>
              <p style={{
                fontSize: DESIGN.typography.sizes.xs,
                color: DESIGN.colors.success[700],
                marginTop: DESIGN.spacing.xs
              }}>
                total do dia
              </p>
            </div>
          </Card>

          <Card variant="warning" padding="lg">
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: DESIGN.typography.sizes.sm, 
                color: DESIGN.colors.warning[600],
                fontWeight: '600',
                textTransform: 'uppercase',
                marginBottom: DESIGN.spacing.sm
              }}>
                Caixa Inicial
              </p>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: DESIGN.colors.warning[900],
                margin: 0
              }}>
                R$ {caixaInicialAtual.toFixed(2)}
              </p>
              <p style={{
                fontSize: DESIGN.typography.sizes.xs,
                color: DESIGN.colors.warning[700],
                marginTop: DESIGN.spacing.xs
              }}>
                fundo de troco
              </p>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: DESIGN.typography.sizes.sm, 
                color: DESIGN.colors.neutral[600],
                fontWeight: '600',
                textTransform: 'uppercase',
                marginBottom: DESIGN.spacing.sm
              }}>
                Total em Caixa
              </p>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: DESIGN.colors.neutral[900],
                margin: 0
              }}>
                R$ {totalCaixaAtual.toFixed(2)}
              </p>
              <p style={{
                fontSize: DESIGN.typography.sizes.xs,
                color: DESIGN.colors.neutral[700],
                marginTop: DESIGN.spacing.xs
              }}>
                saldo atual
              </p>
            </div>
          </Card>
        </CardGrid>

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
        <div className="bg-[#1E293B]/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/10 mb-6">
          <h2 className="text-xl font-bold mb-4 text-white">Registrar Entrada</h2>
          
          {/* Campo de Placa com Autocompletar */}
          <div className="relative mb-4">
            <Input
              type="text"
              value={placa}
              onChange={(e) => handlePlacaChange(e.target.value)}
              onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)}
              onFocus={() => placa.length > 0 && setSugestoesPlacas(Object.keys(veiculosCadastrados).filter(p => 
                p.replace('-', '').startsWith(placa.replace('-', ''))
              ))}
              onKeyPress={(e) => e.key === 'Enter' && registrarEntrada()}
              placeholder="ABC-1234 ou ABC-1D23"
              style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.1em' }}
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
          
          <Input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && registrarEntrada()}
            placeholder="Modelo (ex: Gol, Civic, Onix)"
            style={{ textAlign: 'center', fontWeight: 600, marginTop: DESIGN.spacing.md, marginBottom: DESIGN.spacing.md }}
          />
          <Input
            type="text"
            value={cor}
            onChange={(e) => setCor(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && registrarEntrada()}
            placeholder="Cor (ex: Branco, Preto, Prata)"
            style={{ textAlign: 'center', fontWeight: 600, marginBottom: DESIGN.spacing.md }}
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
          
          <button
            onClick={registrarEntrada}
            className="w-full p-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 uppercase"
            style={{ marginTop: DESIGN.spacing.md }}
          >
            Registrar Entrada
          </button>
        </div>

        {/* Veículos no Pátio */}
        {abaHome === 'patio' && (
        <div className="bg-[#1E293B]/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
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
                  <div key={veiculo.id} className="bg-gradient-to-r from-[#0B1120] to-[#1E293B] p-4 rounded-lg border border-white/10 shadow-lg mb-3">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-2xl font-bold text-blue-300">
                          {emoji} {veiculo.placa}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {veiculo.modelo} • {veiculo.cor}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                          <Clock className="w-4 h-4" />
                          Entrada: {new Date(veiculo.entrada).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-400">
                          R$ {valorAtual.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-[#050A14] p-3 rounded-lg mb-3 border border-white/5">
                      <p className="text-center text-2xl font-mono font-bold text-blue-200">
                        {formatarTempo(tempoDecorrido)}
                      </p>
                      <p className="text-center text-xs text-gray-500 mt-1">Tempo decorrido</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
                      {(impressoraConectada || impressoraUSBConectada) && (
                        <Button 
                          onClick={() => imprimirEntrada(veiculo)}
                          variant="primary"
                          fullWidth
                          style={{ backgroundColor: DESIGN.colors.primary[600] }}
                        >
                          <Printer className="w-5 h-5" style={{ marginRight: DESIGN.spacing.xs }} />
                          Imprimir
                        </Button>
                      )}
                      <Button 
                        onClick={() => finalizarSaida(veiculo)}
                        variant="primary"
                        fullWidth
                      >
                        <LogOut className="w-5 h-5" style={{ marginRight: DESIGN.spacing.xs }} />
                        FINALIZAR / SAÍDA
                      </Button>
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

          <Input
            type="text"
            value={placaSaida}
            onChange={(e) => setPlacaSaida(formatarPlaca(e.target.value.toUpperCase()))}
            onKeyPress={(e) => e.key === 'Enter' && registrarSaidaPorPlaca()}
            placeholder="ABC-1234 ou ABC-1D23"
            style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', letterSpacing: 'wider', marginBottom: DESIGN.spacing.md }}
            maxLength="8"
          />

          <Button
            variant="primary"
            fullWidth
            onClick={registrarSaidaPorPlaca}
            size="lg"
            style={{ fontSize: '1.125rem', marginTop: DESIGN.spacing.md }}
          >
            LOCALIZAR E FINALIZAR SAÍDA
          </Button>
        </div>
        )}

        {/* Histórico de Saidas */}
        {abaHome === 'saidas' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <History className="w-6 h-6 text-green-600" />
            Veículos que Saíram ({historico.length})
          </h2>
          {usarVirtualizacaoHistorico ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr 100px 110px 110px 120px 110px',
                  gap: DESIGN.spacing.sm,
                  padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                  border: `1px solid ${DESIGN.colors.neutral[200]}`,
                  borderBottom: 'none',
                  borderRadius: `${DESIGN.border.radius.md} ${DESIGN.border.radius.md} 0 0`,
                  backgroundColor: DESIGN.colors.neutral[100],
                  fontWeight: '700',
                  color: DESIGN.colors.neutral[800],
                  fontSize: DESIGN.typography.sizes.sm
                }}
              >
                <span>Placa</span>
                <span>Modelo</span>
                <span>Tipo</span>
                <span>Entrada</span>
                <span>Saída</span>
                <span>Permanência</span>
                <span style={{ textAlign: 'right' }}>Valor</span>
              </div>

              <VirtualizedList
                items={historicoGridData}
                itemHeight={52}
                height={520}
                keyExtractor={(item) => item.id}
                renderItem={(item) => (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '90px 1fr 100px 110px 110px 120px 110px',
                      gap: DESIGN.spacing.sm,
                      width: '100%',
                      alignItems: 'center',
                      fontSize: DESIGN.typography.sizes.sm,
                      color: '#f1f5f9'
                    }}
                  >
                    <span>{item.placa}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.modelo}</span>
                    <span>{item.tipo}</span>
                    <span>{item.entrada}</span>
                    <span>{item.saida}</span>
                    <span>{item.permanencia}</span>
                    <span style={{ textAlign: 'right', fontWeight: '600' }}>{item.valor}</span>
                  </div>
                )}
                emptyState={
                  <div style={{ textAlign: 'center', padding: `${DESIGN.spacing.lg}px` }}>
                    <p style={{ color: DESIGN.colors.neutral[500] }}>Nenhum registro de saída</p>
                  </div>
                }
                style={{ borderRadius: `0 0 ${DESIGN.border.radius.md} ${DESIGN.border.radius.md}` }}
              />
              <p style={{ marginTop: DESIGN.spacing.sm, color: DESIGN.colors.neutral[600], fontSize: DESIGN.typography.sizes.xs }}>
                Modo otimizado ativo: virtualização para grandes volumes de histórico.
              </p>
            </>
          ) : (
            <DataGrid
               columns={colunasHistorico}
              data={historicoGridData}
              sortable
              hover
              striped
              emptyState={
                <div style={{ textAlign: 'center', padding: `${DESIGN.spacing.lg}px` }}>
                  <p style={{ color: DESIGN.colors.neutral[500] }}>Nenhum registro de saída</p>
                </div>
              }
            />
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
                <Button 
                  onClick={() => {
                    const permanencia = formatarTempo(Date.now() - veiculoSelecionado.entrada);
                    const valor = calcularValor(veiculoSelecionado.entrada, Date.now(), veiculoSelecionado.tipo);
                    imprimirSaida(veiculoSelecionado, permanencia, valor);
                  }}
                  variant="primary"
                  fullWidth
                  style={{ backgroundColor: DESIGN.colors.primary[600] }}
                >
                  <Printer className="w-5 h-5" style={{ marginRight: DESIGN.spacing.xs }} />
                  Imprimir
                </Button>
              )}
              <Button 
                onClick={confirmarSaida}
                variant="primary"
                fullWidth
              >
                <CheckCircle className="w-5 h-5" style={{ marginRight: DESIGN.spacing.xs }} />
                Confirmar
              </Button>
              <Button 
                onClick={() => setVeiculoSelecionado(null)}
                variant="secondary"
                fullWidth
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {renderToasts()}
      <ConfirmDialog
        isOpen={!!confirmDialog}
        title={confirmDialog?.titulo || ''}
        message={confirmDialog?.mensagem || ''}
        variant="danger"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirmarDialogo}
        onCancel={cancelarDialogo}
      />
      {renderModalControleCaixa()}
      {renderRelatorioFechamento()}
    </div>
  );
}

export default App;
