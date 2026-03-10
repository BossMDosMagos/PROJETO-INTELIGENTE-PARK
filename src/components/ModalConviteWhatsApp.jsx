import React, { useState } from 'react';
import { MessageCircle, X, Copy, CheckCircle } from 'lucide-react';
import { audioService } from '../services/audioService';

export function ModalConviteWhatsApp({ isOpen, onClose, onEnviar, config }) {
  const [numeroTelefone, setNumeroTelefone] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState('');

  const urlCadastro = 'https://BossMDosMagos.github.io/PROJETO-INTELIGENTE-PARK/?cadastro=1';

  const mensagemPadrao = `Olá! Para agilizar seu acesso como mensalista, preencha seus dados aqui:

${urlCadastro}

Assim que terminar, faremos sua ativação no pátio! 🚗`;

  const mensagem = config?.mensagemConvite 
    ? `${config.mensagemConvite}\n\n${urlCadastro}`
    : mensagemPadrao;

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[120]">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">Convidar Mensalista</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Número de Telefone */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Número do Cliente (WhatsApp)
            </label>
            <div className="flex gap-2">
              <span className="text-slate-400 font-semibold py-3 px-4 bg-[#1E293B] border border-slate-700 rounded-lg flex items-center">
                +55
              </span>
              <input
                type="text"
                value={numeroTelefone}
                onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setNumeroTelefone(valor);
                    setErro('');
                }}
                placeholder="11999999999"
                className="flex-1 px-4 py-3 bg-[#1E293B] border border-slate-700 text-white rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition font-mono text-lg placeholder-slate-600"
                maxLength="11"
              />
            </div>
            {numeroTelefone && (
              <p className="text-xs text-emerald-400 mt-2 font-mono">
                Formatado: {formatarTelefone(numeroTelefone)}
              </p>
            )}
            {erro && (
              <p className="text-xs text-red-400 mt-2 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                {erro}
              </p>
            )}
          </div>

          {/* Prévia da Mensagem */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Mensagem a Enviar
            </label>
            <div className="bg-[#1E293B]/50 border border-slate-700 rounded-xl p-4 space-y-3">
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                {mensagem}
              </p>
              <button
                onClick={handleCopiarMensagem}
                className="w-full text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-600 py-2.5 rounded-lg transition flex items-center justify-center gap-2 font-semibold"
              >
                {copiado ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiado ? "Copiado!" : "Copiar Mensagem"}
              </button>
            </div>
          </div>

          {/* Link do Cadastro */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Link Direto
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlCadastro}
                readOnly
                className="flex-1 px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs font-mono text-slate-400 overflow-x-auto"
              />
              <button
                onClick={handleCopiarLink}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition flex items-center gap-1 border border-slate-600"
                title="Copiar Link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#020617]/50 p-6 flex gap-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviarWhatsApp}
            disabled={!numeroTelefone || numeroTelefone.length !== 11}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
