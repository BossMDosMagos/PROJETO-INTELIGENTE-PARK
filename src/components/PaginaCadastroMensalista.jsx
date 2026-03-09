import React, { useState, useEffect } from 'react';
import { Car, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { mensalistaService } from '../services/mensalistaService';
import { audioService } from '../services/audioService';

export function PaginaCadastroMensalista() {
  const [passo, setPasso] = useState(1); // 1 = formulário, 2 = confirmação
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [mensalistaEnviado, setMensalistaEnviado] = useState(null);
  const [config, setConfig] = useState({
    nomeEmpresa: 'Inteligente Park',
    logoUrl: null
  });

  // Carregar configurações da empresa
  useEffect(() => {
    const carregarConfig = () => {
      try {
        const savedConfig = localStorage.getItem('config_empresa');
        if (savedConfig) {
          setConfig(JSON.parse(savedConfig));
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

  // Validar CPF
  const validarFormulario = () => {
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

    if (!formData.placa || formData.placa.length < 3) {
      setErro('Placa do veículo é obrigatória');
      return false;
    }

    return true;
  };

  // Enviar cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      audioService.erro();
      return;
    }

    setCarregando(true);

    // Simular envio ao servidor (em produção seria uma chamada API)
    setTimeout(() => {
      const resultado = mensalistaService.criar(formData);

      if (resultado.sucesso) {
        audioService.sucesso();
        setMensalistaEnviado(resultado.mensalista);
        setSucesso(true);
        setPasso(2);
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

      setCarregando(false);
    }, 1000);
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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/20 border border-white/10 p-4">
              {config.logoUrl ? (
                <img 
                  src={config.logoUrl} 
                  alt="Logo Empresa" 
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              ) : (
                <Car className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white tracking-tight">
            {config.nomeEmpresa || 'Inteligente Park'}
          </h1>
          <p className="text-slate-400 text-lg">Cadastro de Mensalista</p>
        </div>

        {/* Card Principal */}
        <div className="bg-[#1E293B]/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
          {passo === 1 ? (
            /* PASSO 1: FORMULÁRIO */
            <div className="p-8">
              <div className="mb-8">
                <p className="text-slate-400 text-center leading-relaxed">
                  Preencha seus dados abaixo para registrar seu veículo. 
                  <br />
                  <span className="text-cyan-400 font-semibold">Rápido, fácil e seguro! 🚀</span>
                </p>
              </div>

              {erro && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 font-medium text-sm">{erro}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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

                {/* Botão Enviar */}
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-8 shadow-lg shadow-violet-900/20 border border-white/10"
                >
                  {carregando ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Cadastro</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* PASSO 2: CONFIRMAÇÃO */
            <div className="p-8 text-center">
              <div className="flex justify-center mb-8">
                <div className="bg-emerald-500/20 p-6 rounded-full animate-bounce border border-emerald-500/30">
                  <CheckCircle className="w-16 h-16 text-emerald-400" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                Cadastro Recebido! 🎉
              </h2>

              <div className="bg-[#0F172A] rounded-xl p-6 mb-8 border border-slate-700">
                <p className="text-slate-400 mb-6 text-sm">
                  Seus dados foram registrados com sucesso no nosso sistema.
                </p>

                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-400 text-sm">Nome:</span>
                    <span className="text-white font-medium">{mensalistaEnviado?.nome}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-400 text-sm">Placa:</span>
                    <span className="text-cyan-400 font-mono text-lg font-bold">{mensalistaEnviado?.placa}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-slate-400 text-sm">Status:</span>
                    <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
                      AGUARDANDO APROVAÇÃO
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-violet-900/20 rounded-xl p-5 mb-8 border border-violet-500/30">
                <p className="text-sm text-violet-200">
                  <strong>Próximo passo:</strong> Nossa equipe entrará em contato via WhatsApp para ativar seu acesso. 
                  Fique atento! 📱
                </p>
              </div>

              <button
                onClick={() => {
                  setPasso(1);
                  setSucesso(false);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl transition border border-slate-700 hover:text-white"
              >
                Fazer Novo Cadastro
              </button>

              <p className="text-xs text-slate-500 mt-6">
                Dúvidas? Entre em contato com a administração.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-slate-500 text-xs">
            &copy; 2026 Command Park Solutions. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
