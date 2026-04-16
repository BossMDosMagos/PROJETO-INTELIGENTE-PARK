import React from 'react';
import { Bluetooth, Printer, Settings, AlertTriangle } from 'lucide-react';

const GestaoImpressoras = ({
  impressoraConectada,
  nomeImpressora,
  desconectarImpressora,
  conectarImpressora,
  imprimirEntrada,
  testarAlinhamento,
  impressoraUSBConectada,
  nomeImpressoraUSB,
  desconectarImpressoraUSB,
  conectarImpressoraUSB,
  tentarSerialNoProximoClique
}) => {
  return (
    <>
      {/* Configuração de Impressora Bluetooth */}
      <div className="mb-6 bg-[#0F172A]/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Bluetooth className="w-32 h-32 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-blue-400">
          <Bluetooth className="w-6 h-6" />
          Impressora Térmica Bluetooth (58mm)
        </h2>
        <div className="space-y-6 relative z-10">
          <div className="bg-[#1E293B] p-4 rounded-lg border border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Status da Conexão</p>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${impressoraConectada ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-600'}`}></div>
              <span className={`font-bold text-lg ${impressoraConectada ? 'text-emerald-400' : 'text-slate-500'}`}>
                {impressoraConectada ? `Conectado: ${nomeImpressora}` : 'Desconectado'}
              </span>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-700/30 p-4 rounded-lg">
            <p className="text-sm font-bold text-amber-400 mb-2">📋 Como conectar:</p>
            <ol className="text-sm text-amber-200/80 space-y-1 list-decimal list-inside">
              <li>Ligue a impressora Bluetooth</li>
              <li>Ative o Bluetooth deste dispositivo</li>
              <li>Clique no botão "Conectar Impressora" abaixo</li>
              <li>Pareie com o dispositivo que aparecer na lista</li>
            </ol>
          </div>

          <div className="flex gap-3 flex-wrap">
            {impressoraConectada ? (
              <>
                <button
                  onClick={desconectarImpressora}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
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
                  className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Teste
                </button>
                <button
                  onClick={testarAlinhamento}
                  className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Alinhar
                </button>
              </>
            ) : (
              <button
                onClick={conectarImpressora}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <Bluetooth className="w-5 h-5" />
                Conectar Impressora Bluetooth
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Configuração de Impressora USB / Serial */}
      <div className="mb-6 bg-[#0F172A]/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Settings className="w-32 h-32 text-purple-500" />
        </div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-purple-400">
          <Printer className="w-6 h-6" />
          Impressora USB / Serial (58mm)
        </h2>
        <div className="space-y-6 relative z-10">
          <div className="bg-[#1E293B] p-4 rounded-lg border border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Status da Conexão</p>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${impressoraUSBConectada ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-600'}`}></div>
              <span className={`font-bold text-lg ${impressoraUSBConectada ? 'text-emerald-400' : 'text-slate-500'}`}>
                {impressoraUSBConectada ? `Conectado: ${nomeImpressoraUSB}` : 'Desconectado'}
              </span>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-700/30 p-4 rounded-lg">
            <p className="text-sm font-bold text-amber-400 mb-2">📋 Instruções USB:</p>
            <ol className="text-sm text-amber-200/80 space-y-1 list-decimal list-inside">
              <li>Conecte o cabo USB</li>
              <li>Clique em "Conectar" (WebUSB)</li>
              <li>Se falhar, use "Tentar Serial"</li>
            </ol>
          </div>

          <div className="flex gap-3">
            {impressoraUSBConectada ? (
              <>
                <button
                  onClick={desconectarImpressoraUSB}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
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
                  className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Teste
                </button>
              </>
            ) : (
              <button
                onClick={conectarImpressoraUSB}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
              >
                <Settings className="w-5 h-5" />
                {tentarSerialNoProximoClique ? 'Tentar Modo Serial' : 'Conectar via USB'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GestaoImpressoras;
