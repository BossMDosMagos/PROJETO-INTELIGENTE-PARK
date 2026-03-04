import React, { useState } from 'react';
import { Car, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { mensalistaService } from '../services/mensalistaService';
import { audioService } from '../services/audioService';

export function PaginaCadastroMensalista() {
  const [passo, setPasso] = useState(1); // 1 = formulário, 2 = confirmação
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [mensalistaEnviado, setMensalistaEnviado] = useState(null);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-lg p-4 rounded-full">
              <Car className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Inteligente Park</h1>
          <p className="text-blue-100 text-lg">Cadastro de Mensalista</p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {passo === 1 ? (
            /* PASSO 1: FORMULÁRIO */
            <div className="p-8">
              <div className="mb-6">
                <p className="text-gray-600 text-center">
                  Preencha seus dados abaixo para registrar seu veículo como mensalista. 
                  Você será contactado em breve para ativação! 🎉
                </p>
              </div>

              {erro && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 font-medium">{erro}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="João da Silva"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    maxLength="60"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="12345678901"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition font-mono"
                    maxLength="11"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.cpf ? formatarCPF(formData.cpf) : '11 dígitos'}
                  </p>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="11987654321"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition font-mono"
                    maxLength="11"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.whatsapp ? formatarTelefone(formData.whatsapp) : 'DDD + 9 dígitos'}
                  </p>
                </div>

                {/* Placa */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Placa do Veículo *
                  </label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition font-mono text-lg tracking-widest"
                    maxLength="8"
                  />
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo do Veículo
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    placeholder="GOL, CIVIC, etc"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    maxLength="30"
                  />
                </div>

                {/* Cor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cor do Veículo
                  </label>
                  <input
                    type="text"
                    name="cor"
                    value={formData.cor}
                    onChange={handleInputChange}
                    placeholder="BRANCO, PRETO, etc"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    maxLength="20"
                  />
                </div>

                {/* Botão Enviar */}
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mt-6 shadow-lg"
                >
                  {carregando ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Cadastro
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  (*) Campos obrigatórios
                </p>
              </form>
            </div>
          ) : (
            /* PASSO 2: CONFIRMAÇÃO */
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-6 rounded-full animate-pulse">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cadastro Recebido! ✅
              </h2>

              <div className="bg-blue-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                <p className="text-gray-700 mb-4">
                  Seus dados foram registrados com sucesso!
                </p>

                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="font-semibold text-gray-700">Nome:</span>
                    <span className="text-gray-900">{mensalistaEnviado?.nome}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="font-semibold text-gray-700">Placa:</span>
                    <span className="text-gray-900 font-mono text-lg">{mensalistaEnviado?.placa}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      PENDENTE
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 mb-6 border-l-4 border-yellow-500">
                <p className="text-sm text-yellow-900">
                  <strong>Próximo passo:</strong> Você será contactado via WhatsApp em breve para ativar seu cadastro. 
                  Fique atento! 📱
                </p>
              </div>

              <button
                onClick={() => {
                  setPasso(1);
                  setSucesso(false);
                }}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition transform active:scale-95"
              >
                Fazer Novo Cadastro
              </button>

              <p className="text-xs text-gray-500 mt-6">
                Dúvidas? Entre em contato conosco pelo WhatsApp.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-white mt-8 text-sm">
          <p>© 2026 Inteligente Park - Seu estacionamento inteligente</p>
        </div>
      </div>
    </div>
  );
}
