import React from 'react';
import { Trash2, History, Car } from 'lucide-react';
import { Button } from '../Button';
import { Input, Select } from '../Input';

const LimpezaDados = ({
  datasUnicasHistorico,
  deletarPorDia,
  opcoesMesesDelecao,
  deletarPorMes,
  historico,
  impressoraConectada,
  impressoraUSBConectada,
  imprimirSaida,
  formatarTempo,
  deletarRegistro,
  veiculosCadastrados,
  setVeiculosCadastrados
}) => {
  return (
    <>
      {/* Sistema de Deleção */}
      <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-6 border border-red-900/30 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Trash2 className="w-32 h-32 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-red-400 relative z-10">
          <Trash2 className="w-6 h-6" />
          Sistema de Deleção de Registros
        </h2>
        
        <div className="space-y-6 relative z-10">
          {/* Deletar por Dia */}
          <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-red-400 mb-4 uppercase tracking-wider text-sm">🗑️ Deletar por Dia</h3>
            <div className="flex gap-4">
              <Input
                type="date"
                id="dataDeletar"
                style={{ flex: 1 }}
                className="bg-[#1E293B] border-slate-700 text-white"
              />
              <Button
                variant="danger"
                onClick={() => {
                  const input = document.getElementById('dataDeletar');
                  if (input.value) {
                    const data = new Date(input.value + 'T00:00:00');
                    deletarPorDia(data.getTime());
                    input.value = '';
                  }
                }}
                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)' }}
              >
                Executar Limpeza
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-mono">Datas disponíveis: {datasUnicasHistorico.length > 0 ? datasUnicasHistorico.join(', ') : 'Nenhuma'}</p>
          </div>

          {/* Deletar por Mês */}
          <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-red-400 mb-4 uppercase tracking-wider text-sm">🗑️ Deletar por Mês</h3>
            <div className="flex gap-4">
              <Select
                id="mesDeletar"
                style={{ flex: 1 }}
                options={opcoesMesesDelecao}
                className="bg-[#1E293B] border-slate-700 text-white"
              />
              <Button
                variant="danger"
                onClick={() => {
                  const select = document.getElementById('mesDeletar');
                  if (select.value) {
                    const [mes, ano] = select.value.split('/').map(Number);
                    deletarPorMes(ano, mes);
                    select.value = '';
                  }
                }}
                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)' }}
              >
                Executar Limpeza
              </Button>
            </div>
          </div>

          {/* Deletar Individual */}
          <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-red-400 mb-4 uppercase tracking-wider text-sm">🗑️ Deletar Registros Individuais</h3>
            {historico.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Nenhum registro para deletar</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {historico.map((reg) => {
                  const emoji = reg.tipo === 'moto' ? '🏍️' : '🚗';
                  return (
                    <div key={reg.id} className="bg-[#1E293B] p-4 rounded-lg flex justify-between items-center border border-slate-700 hover:border-slate-600 transition-colors">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-white mb-1">{emoji} {reg.placa}</p>
                        <p className="text-xs text-slate-400">
                          {reg.modelo} • {reg.cor}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(reg.saida).toLocaleString('pt-BR')} • Permanência: {formatarTempo(reg.permanencia)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-emerald-400">
                          R$ {reg.valor.toFixed(2)}
                        </p>
                        {(impressoraConectada || impressoraUSBConectada) && (
                          <button
                            onClick={() => imprimirSaida(reg, formatarTempo(reg.permanencia), reg.valor)}
                            className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 p-2 rounded-lg transition-all border border-purple-500/30"
                            title="Imprimir recibo"
                          >
                            🖨️
                          </button>
                        )}
                        <button
                          onClick={() => deletarRegistro(reg.id)}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2 rounded-lg transition-all border border-red-500/30"
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
      <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-6 border border-slate-800 shadow-xl mb-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-purple-400">
          <History className="w-6 h-6" />
          Histórico Total ({historico.length} registros)
        </h2>
        {historico.length === 0 ? (
          <p className="text-slate-500 text-center py-4">Nenhum registro ainda</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {historico.map((reg) => {
              const emoji = reg.tipo === 'moto' ? '🏍️' : '🚗';
              return (
              <div key={reg.id} className="bg-[#1E293B] p-4 rounded-lg flex justify-between items-center border border-slate-700 hover:border-purple-500/30 transition-colors">
                <div>
                  <p className="font-bold text-lg text-white mb-1">{emoji} {reg.placa}</p>
                  <p className="text-xs text-slate-400">
                    {reg.modelo} • {reg.cor}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <p className="text-xs text-slate-500">
                      Entrada: <span className="text-slate-300">{new Date(reg.entrada).toLocaleTimeString('pt-BR')}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Saída: <span className="text-slate-300">{new Date(reg.saida).toLocaleTimeString('pt-BR')}</span>
                    </p>
                  </div>
                  <p className="text-xs text-purple-400 mt-1 font-mono">
                    Tempo: {formatarTempo(reg.permanencia)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">
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
      <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-6 border border-slate-800 shadow-xl mb-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-cyan-400">
          <Car className="w-6 h-6" />
          Veículos Cadastrados ({veiculosCadastrados ? Object.keys(veiculosCadastrados).length : 0})
        </h2>
        {!veiculosCadastrados || Object.keys(veiculosCadastrados).length === 0 ? (
          <p className="text-slate-500 text-center py-4">Nenhum veículo cadastrado na memória</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
            {Object.entries(veiculosCadastrados).map(([placa, dados]) => (
              <div key={placa} className="bg-[#1E293B] p-4 rounded-lg flex justify-between items-center border border-slate-700">
                <div>
                  <p className="font-bold text-white text-lg">{placa}</p>
                  <p className="text-sm text-slate-400">
                    {dados.modelo} • {dados.cor}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const novosCadastrados = { ...veiculosCadastrados };
                    delete novosCadastrados[placa];
                    setVeiculosCadastrados(novosCadastrados);
                  }}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2 rounded-lg transition-all border border-red-500/30"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LimpezaDados;
