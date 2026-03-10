import React, { useState, useEffect } from 'react';
import { Car, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { mensalistaService } from '../services/mensalistaService';
import { supabaseService } from '../services/supabaseService';
import { audioService } from '../services/audioService';

export function PaginaCadastroMensalista() {
  const [passo, setPasso] = useState(1); // 1 = Dados Pessoais, 2 = Dados Veículo, 3 = Confirmação
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [mensalistaEnviado, setMensalistaEnviado] = useState(null);
  const [config, setConfig] = useState({
    nomeEmpresa: 'Command Park',
    logoUrl: null
  });

  // Carregar configurações da empresa (Supabase e Local)
  useEffect(() => {
    const carregarConfig = async () => {
      try {
        // Tentar buscar do Supabase primeiro
        if (supabaseService.isOnline) {
          const { sucesso, dados } = await supabaseService.obterConfiguracoes();
          if (sucesso && dados) {
             setConfig({
               nomeEmpresa: dados.nome_empresa || 'Command Park',
               logoUrl: dados.logo_url || null
             });
             return;
          }
        }
        
        // Fallback para localStorage (apenas se offline)
        const savedConfig = localStorage.getItem('park-config');
        if (savedConfig) {
           const parsed = JSON.parse(savedConfig);
           setConfig({
             nomeEmpresa: parsed.nomeEmpresa || 'Command Park',
             logoUrl: parsed.logoUrl || null
           });
        }
      } catch (error) {
        console.error('Erro ao carregar config:', error);
      }
    };
    carregarConfig();
  }, []);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    whatsapp: '',
    placa: '',
    modelo: '',
    cor: ''
  });

  // Formatter de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    // Maiúsculas para placa
    if (name === 'placa') {
      novoValor = value.toUpperCase();
    }

    // Maiúsculas para modelo e cor
    if (name === 'modelo' || name === 'cor') {
      novoValor = value.toUpperCase();
    }

    // Nome propriamente dito
    if (name === 'nome') {
      novoValor = value.toUpperCase();
    }

    // Apenas números para CPF
    if (name === 'cpf') {
      novoValor = value.replace(/\D/g, '').slice(0, 11);
    }

    // Apenas números para WhatsApp
    if (name === 'whatsapp') {
      novoValor = value.replace(/\D/g, '').slice(0, 11);
    }

    setFormData(prev => ({
      ...prev,
      [name]: novoValor
    }));
    setErro('');
  };

  // Validar Passo 1 (Dados Pessoais)
  const validarPasso1 = () => {
    if (!formData.nome.trim()) {
      setErro('Nome é obrigatório');
      return false;
    }

    if (!formData.cpf || formData.cpf.length !== 11) {
      setErro('CPF deve ter 11 dígitos');
      return false;
    }

    if (!mensalistaService.validarCPF(formData.cpf)) {
      setErro('CPF inválido');
      return false;
    }

    if (!formData.whatsapp || formData.whatsapp.length !== 11) {
      setErro('WhatsApp deve ter 11 dígitos (com DDD)');
      return false;
    }

    return true;
  };

  // Validar Passo 2 (Dados Veículo)
  const validarPasso2 = () => {
    if (!formData.placa || formData.placa.length < 3) {
      setErro('Placa do veículo é obrigatória');
      return false;
    }
    return true;
  };

  // Avançar para próximo passo
  const proximoPasso = () => {
    if (passo === 1) {
      if (validarPasso1()) {
        setPasso(2);
        setErro('');
      } else {
        audioService.erro();
      }
    }
  };

  // Voltar para passo anterior
  const voltarPasso = () => {
    if (passo === 2) {
      setPasso(1);
      setErro('');
    }
  };

  // Enviar cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarPasso2()) {
      audioService.erro();
      return;
    }

    setCarregando(true);

    try {
      // Envio real ao servidor (Supabase via Service)
      const resultado = await mensalistaService.criar(formData);

      if (resultado.sucesso) {
        audioService.sucesso();
        setMensalistaEnviado(resultado.mensalista);
        setSucesso(true);
        setPasso(3); // Tela de Sucesso
        setFormData({
          nome: '',
          cpf: '',
          whatsapp: '',
          placa: '',
          modelo: '',
          cor: ''
        });
      } else {
        audioService.erro();
        setErro(resultado.erro);
      }
    } catch (error) {
      console.error('Erro ao enviar cadastro:', error);
      audioService.erro();
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Formatadores de exibição
  const formatarCPF = (cpf) => {
    if (!cpf || cpf.length !== 11) return cpf;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  };

  const formatarTelefone = (tel) => {
    if (!tel || tel.length !== 11) return tel;
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Header - LOGO e NOME da Empresa */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative w-28 h-28 bg-[#0F172A] rounded-2xl flex items-center justify-center border border-slate-700/50 shadow-2xl overflow-hidden p-4">
              {config.logoUrl ? (
                <img 
                  src={config.logoUrl} 
                  alt="Logo Empresa" 
                  className="w-full h-full object-contain"
                />
              ) : (
                 <Car className="w-12 h-12 text-cyan-400" />
              )}
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2">
            {config.nomeEmpresa || 'Command Park'}
          </h1>
          <p className="text-cyan-400/80 font-medium tracking-wide uppercase text-sm">Sistema de Cadastramento Seguro</p>
        </div>

        {/* Card Principal */}
        <div className="bg-[#1E293B]/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
          
          {/* Barra de Progresso */}
          {passo < 3 && (
            <div className="flex w-full h-1.5 bg-slate-800">
              <div 
                className={`h-full bg-cyan-500 transition-all duration-500 ${passo === 1 ? 'w-1/2' : 'w-full'}`}
              ></div>
            </div>
          )}

          {passo === 1 && (
            /* PASSO 1: DADOS PESSOAIS */
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white mb-2">Dados Pessoais</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Informe seus dados para contato e identificação.
                </p>
              </div>

              {erro && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 font-medium text-sm">{erro}</p>
                </div>
              )}

              <div className="space-y-5">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="SEU NOME COMPLETO"
                    className="w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition placeholder-slate-600"
                    maxLength="60"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition font-mono placeholder-slate-600"
                    maxLength="11"
                  />
                  <p className="text-xs text-slate-500 mt-1 ml-1">
                    {formData.cpf ? formatarCPF(formData.cpf) : 'Apenas números'}
                  </p>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition font-mono placeholder-slate-600"
                    maxLength="11"
                  />
                  <p className="text-xs text-slate-500 mt-1 ml-1">
                    {formData.whatsapp ? formatarTelefone(formData.whatsapp) : 'DDD + Número'}
                  </p>
                </div>

                {/* Botão Próximo */}
                <button
                  onClick={proximoPasso}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-8 shadow-lg border border-white/10"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {passo === 2 && (
            /* PASSO 2: DADOS DO VEÍCULO */
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white mb-2">Dados do Veículo</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Qual veículo você vai estacionar?
                </p>
              </div>

              {erro && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 font-medium text-sm">{erro}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Placa */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    Placa do Veículo *
                  </label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition font-mono text-lg tracking-widest placeholder-slate-600 uppercase"
                    maxLength="8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Modelo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      placeholder="GOL, CIVIC..."
                      className="w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition placeholder-slate-600 uppercase"
                      maxLength="30"
                    />
                  </div>

                  {/* Cor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                      Cor
                    </label>
                    <input
                      type="text"
                      name="cor"
                      value={formData.cor}
                      onChange={handleInputChange}
                      placeholder="BRANCO..."
                      className="w-full px-4 py-3.5 bg-[#0F172A] text-white border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition placeholder-slate-600 uppercase"
                      maxLength="20"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={voltarPasso}
                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition border border-slate-700"
                  >
                    Voltar
                  </button>
                  
                  {/* Botão Enviar */}
                  <button
                    type="submit"
                    disabled={carregando}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 border border-white/10"
                  >
                    {carregando ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <span>Finalizar Cadastro</span>
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {passo === 3 && (
            /* PASSO 3: CONFIRMAÇÃO */
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-lg shadow-green-500/30 animate-scaleIn">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Cadastro Enviado!</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Seus dados foram recebidos com sucesso.
                <br />
                <span className="text-cyan-400 font-semibold block mt-2">Aguarde a ativação pelo administrador do pátio.</span>
              </p>
              
              {/* Resumo do Cadastro */}
              {mensalistaEnviado && (
                <div className="bg-slate-800/50 rounded-xl p-4 mb-8 text-left border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Nome: <span className="text-white">{mensalistaEnviado.nome}</span></p>
                  <p className="text-sm text-slate-400 mb-1">Placa: <span className="text-white font-mono">{mensalistaEnviado.placa}</span></p>
                  <p className="text-sm text-slate-400">Protocolo: <span className="text-cyan-400 font-mono">#{mensalistaEnviado.id?.slice(0, 8)}</span></p>
                </div>
              )}

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all border border-white/10"
              >
                Novo Cadastro
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-3 opacity-60 hover:opacity-100 transition-opacity">
           <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                <span className="text-cyan-400 font-bold text-xs">CP</span>
              </div>
              <span className="text-slate-300 font-bold tracking-tight">Command Park</span>
           </div>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">
            Tecnologia de Gestão Inteligente
          </p>
        </div>
      </div>
    </div>
  );
}
