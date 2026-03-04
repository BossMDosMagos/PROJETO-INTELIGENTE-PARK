import React, { useState } from 'react';
import { MessageCircle, X, Copy, CheckCircle } from 'lucide-react';
import { audioService } from '../services/audioService';

export function ModalConviteWhatsApp({ isOpen, onClose, onEnviar }) {
  const [numeroTelefone, setNumeroTelefone] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState('');

  const urlCadastro = window.location.origin + window.location.pathname.replace(/\/admin.*/, '/cadastro-mensalista');

  const mensagem = `Olá! Para agilizar seu acesso como mensalista, preencha seus dados aqui: ${urlCadastro} Assim que terminar, faremos sua ativação no pátio! 🚗`;

  const handleNumeroChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 11);
    setNumeroTelefone(valor);
    setErro('');
  };

  const validarNumero = () => {
    if (!numeroTelefone || numeroTelefone.length !== 11) {
      setErro('Telefone inválido (11 dígitos com DDD)');
      audioService.erro();
      return false;
    }
    return true;
  };

  const handleEnviarWhatsApp = () => {
    if (!validarNumero()) return;

    audioService.sucesso();
    
    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/55${numeroTelefone}?text=${mensagemCodificada}`;

    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');

    // Chamar callback
    onEnviar?.(numeroTelefone, true);

    // Limpar e fechar
    setNumeroTelefone('');
    setTimeout(() => onClose(), 1000);
  };

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(urlCadastro);
    setCopiado(true);
    audioService.bip();
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleCopiarMensagem = () => {
    navigator.clipboard.writeText(mensagem);
    audioService.bip();
    setTimeout(() => setCopiado(false), 2000);
  };

  if (!isOpen) return null;

  const formatarTelefone = (tel) => {
    if (!tel || tel.length !== 11) return tel;
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[120]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">Convidar Mensalista</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Número de Telefone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número do Cliente (WhatsApp)
            </label>
            <div className="flex gap-2">
              <span className="text-gray-600 font-semibold py-3 px-4 bg-gray-100 rounded-lg">
                55
              </span>
              <input
                type="text"
                value={numeroTelefone}
                onChange={handleNumeroChange}
                placeholder="11987654321"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition font-mono text-lg"
                maxLength="11"
              />
            </div>
            {numeroTelefone && (
              <p className="text-xs text-gray-500 mt-1">
                {formatarTelefone(numeroTelefone)}
              </p>
            )}
            {erro && (
              <p className="text-xs text-red-600 mt-1 font-semibold">{erro}</p>
            )}
          </div>

          {/* Prévia da Mensagem */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensagem a Enviar
            </label>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {mensagem}
              </p>
              <button
                onClick={handleCopiarMensagem}
                className="w-full text-xs bg-white border border-green-300 text-green-600 hover:bg-green-50 py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Copy className="w-3 h-3" />
                Copiar Mensagem
              </button>
            </div>
          </div>

          {/* Link do Cadastro */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Link de Cadastro
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlCadastro}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-mono text-gray-600 overflow-x-auto"
              />
              <button
                onClick={handleCopiarLink}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-lg transition flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviarWhatsApp}
            disabled={!numeroTelefone || numeroTelefone.length !== 11}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition transform disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
