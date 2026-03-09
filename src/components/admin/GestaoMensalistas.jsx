import React from 'react';
import { Users, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '../Button';
import { LazyPage } from '../../pages';
import { ModalConviteWhatsApp } from '../ModalConviteWhatsApp';

// Nota: AbaSolicitacoesMensalistasLazy deve ser passado como prop ou importado se for um componente default.
// Assumindo que será passado como prop para flexibilidade ou importado se for estático.
// Se for lazy, o Suspense já deve estar no LazyPage.

const GestaoMensalistas = ({
  AbaSolicitacoesMensalistasLazy, // Componente Lazy
  showModalConvite,
  setShowModalConvite,
  showToast,
  limparTudo
}) => {
  return (
    <>
      {/* CONTROLE DE MENSALISTAS */}
      <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-6 border border-slate-800 shadow-xl mb-6 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-500">
          <Users className="w-32 h-32 text-violet-500" />
        </div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white relative z-10">
          <div className="p-2 bg-violet-500/20 rounded-lg border border-violet-500/30">
            <Users className="w-6 h-6 text-violet-400" />
          </div>
          Controle de Cadastros
        </h2>
        
        <div className="space-y-6 relative z-10">
          <p className="text-slate-400 text-sm">
            Gerencie mensalistas, ative cadastros pendentes e envie convites via WhatsApp.
          </p>

          <div className="bg-[#0F172A]/50 p-1 rounded-xl border border-slate-800 backdrop-blur-sm">
            {/* Renderizar componente Lazy */}
            <LazyPage component={AbaSolicitacoesMensalistasLazy} />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowModalConvite(true)}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-violet-900/20 border border-white/10"
            >
              <MessageCircle className="w-5 h-5" />
              Convidar Novo Mensalista
            </button>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg text-sm border border-slate-800">
            <p className="font-bold mb-3 uppercase tracking-wider text-xs text-violet-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
              Como Funciona?
            </p>
            <ol className="space-y-3 list-decimal list-inside text-xs text-slate-400 font-medium">
              <li className="pl-2">Clique em <span className="text-white">"Convidar"</span> e digite o número do cliente</li>
              <li className="pl-2">Sistema envia link de cadastro pelo WhatsApp</li>
              <li className="pl-2">Cliente preenche dados (nome, CPF, placa, etc)</li>
              <li className="pl-2">Você ativa o cadastro com vigência de dias</li>
              <li className="pl-2">Mensalista obtém acesso automático ao pátio!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Botão Limpar Tudo */}
      <Button 
        variant="danger" 
        fullWidth
        onClick={limparTudo}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px', 
          marginTop: '24px',
          background: 'rgba(239, 68, 68, 0.1)', 
          color: '#fca5a5', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '16px'
        }}
      >
        <Trash2 className="w-5 h-5" />
        RESETAR SISTEMA (LIMPAR TUDO)
      </Button>

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
    </>
  );
};

export default GestaoMensalistas;
