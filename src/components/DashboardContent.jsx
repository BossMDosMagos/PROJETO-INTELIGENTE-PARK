import React, { useState, useEffect } from 'react';
import { Car, ArrowUpCircle, ArrowDownCircle, Clock, DollarSign, Trash2 } from 'lucide-react';

export default function DashboardContent({
  veiculos = [],
  historico = [],
  config = {},
  onRegistrarEntrada = () => {},
  onRegistrarSaida = () => {},
  onLimparVeiculoOrfao = () => {},
  showToast = () => {}
}) {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('carro');
  const [placaSaida, setPlacaSaida] = useState('');
  const [tempoAtual, setTempoAtual] = useState(Date.now());
  const [saidaSelecionada, setSaidaSelecionada] = useState(null);

  useEffect(() => {
    const intervalo = setInterval(() => setTempoAtual(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const selecionarVeiculoParaSaida = (veiculo) => {
    setPlacaSaida(veiculo.placa);
    setSaidaSelecionada(veiculo.id);
  };

  // Função de cálculo de valor - Cada 12h = 1 teto (não acumula)
  const calcularValor = (entrada, tipoVeic = 'carro') => {
    const diferencaMs = tempoAtual - entrada;
    const diferencaMinutos = Math.floor(diferencaMs / (1000 * 60));
    
    // Usar valores da tabela de preços (config)
    let valorTeto;
    if (tipoVeic === 'moto') {
      valorTeto = config.valorTetoMoto || (config.valorTeto ? config.valorTeto * 0.5 : 27.50);
    } else {
      valorTeto = config.valorTeto || 55.00;
    }
    
    // Ciclo do teto em minutos (padrão 12 horas = 720 min)
    const cicloTetoMin = (config.valor_teto_horas || 12) * 60;
    // Tolerância em minutos (padrão 30 min)
    const tolerancia = config.tolerancia_inicial || 30;
    
    // Dentro da tolerância = gratuito
    if (diferencaMinutos <= tolerancia) return 0;
    
    // Cada ciclo de 12h = 1 teto completo
    // 0-12h = 55, 12-24h = 110, 24-36h = 165, etc.
    const tetosCompletos = Math.floor(diferencaMinutos / cicloTetoMin);
    const valor = tetosCompletos * valorTeto;
    
    return valor;
  };

  // Detectar tipo de placa (Mercosul ou Antiga)
  const getTipoPlaca = (valor) => {
    const cleaned = valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length !== 7) return null;
    // Mercosul: LLL1L11 (4° é número, 5° é letra)
    // Antiga: LLLNNNN (todos números após 3 letras)
    if (/^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/.test(cleaned)) return 'mercosul';
    if (/^[A-Z]{3}[0-9]{4}$/.test(cleaned)) return 'antiga';
    return null;
  };

  const formatarPlaca = (valor) => {
    const cleaned = valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 3) return cleaned;
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7);
  };

  const formatarTempo = (ms) => {
    if (!ms || ms <= 0) return '0:00:00';
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    return `${String(horas).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;
  };

  const tipoPlaca = getTipoPlaca(placa);

  const veiculosAtivos = veiculos.filter(v => v.status === 'ativo');
  const totalArrecadado = historico.reduce((sum, v) => sum + (Number(v.valor) || 0), 0);

  return (
    <div 
      className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 h-full"
      style={{ minHeight: 'calc(100vh - 60px)' }}
    >
      {/* Card 1 - Operacional (Esquerda) */}
      <div 
        className="bg-[#0B1120]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Car className="w-6 h-6 text-cyan-400" />
          Operacional
        </h2>

        {/* Entrada Rápida */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-400 mb-3 text-center">Placa</label>
          
          {/* Input Visual de Placa */}
          <div className={`input-placa-container ${tipoPlaca || 'antiga'}`}>
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(formatarPlaca(e.target.value))}
              placeholder="ABC-1234"
              className={`input-placa ${tipoPlaca === 'mercosul' ? 'fonte-mercosul' : tipoPlaca === 'antiga' ? 'fonte-antiga' : ''}`}
              maxLength="8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value.toUpperCase())}
            placeholder="Modelo"
            className="p-2 bg-[#1E293B] border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="text"
            value={cor}
            onChange={(e) => setCor(e.target.value.toUpperCase())}
            placeholder="Cor"
            className="p-2 bg-[#1E293B] border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Tipo de Veículo */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTipoVeiculo('carro')}
            className={`flex-1 p-2 rounded-lg font-semibold text-sm transition-all ${
              tipoVeiculo === 'carro' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-[#1E293B] text-gray-400 border border-white/10'
            }`}
          >
            🚗 Carro
          </button>
          <button
            onClick={() => setTipoVeiculo('moto')}
            className={`flex-1 p-2 rounded-lg font-semibold text-sm transition-all ${
              tipoVeiculo === 'moto' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-[#1E293B] text-gray-400 border border-white/10'
            }`}
          >
            🏍️ Moto
          </button>
        </div>

        <button
          onClick={() => {
            const placaFormat = placa.replace('-', '').toUpperCase();
            if (placaFormat.length >= 7 && modelo.trim() && cor.trim()) {
              onRegistrarEntrada({ placa, modelo, cor, tipoVeiculo });
              setPlaca('');
              setModelo('');
              setCor('');
            } else if (placaFormat.length < 7) {
              alert('Digite uma placa válida!');
            } else {
              alert('Preencha Modelo e Cor!');
            }
          }}
          className="w-full p-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 mb-4"
        >
          <span className="flex items-center justify-center gap-2">
            <ArrowUpCircle className="w-5 h-5" />
            REGISTRAR ENTRADA
          </span>
        </button>

        {/* Saída Rápida */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-400 mb-2">Saída por Placa</label>
          <input
            type="text"
            value={placaSaida}
            onChange={(e) => setPlacaSaida(formatarPlaca(e.target.value))}
            placeholder="ABC-1234"
            className="w-full p-3 bg-[#1E293B] border border-white/10 rounded-lg text-white text-center font-bold text-lg tracking-wider focus:border-amber-500 focus:outline-none"
            maxLength="8"
          />
        </div>

        <button
          onClick={() => {
            if (placaSaida) {
              onRegistrarSaida(placaSaida);
              setPlacaSaida('');
              setSaidaSelecionada(null);
            }
          }}
          className={`w-full p-4 font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
            saidaSelecionada
              ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-green-500/30'
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-amber-500/30'
          }`}
        >
          <ArrowDownCircle className="w-5 h-5" />
          {saidaSelecionada ? 'REGISTRAR SAÍDA ✓' : 'REGISTRAR SAÍDA'}
        </button>

        {/* Botão para limpar veículo órfão */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              const placa = prompt('Digite a placa do veículo órfão para remover:');
              if (placa && placa.trim()) {
                onLimparVeiculoOrfao(placa.trim().toUpperCase());
              }
            }}
            className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Veículo Órfão
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Use se o veículo não aparece nos mini-cards
          </p>
        </div>
      </div>

      {/* Card 2 - Status/Dinâmico (Direita) */}
      <div 
        className="bg-[#0B1120]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-cyan-400" />
          Status do Pátio
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#1E293B]/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Car className="w-4 h-4" />
              Veículos
            </div>
            <div className="text-3xl font-bold text-white">{veiculosAtivos.length}</div>
          </div>
          <div className="bg-[#1E293B]/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <DollarSign className="w-4 h-4" />
              Arrecadado
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              R$ {totalArrecadado.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Últimas Saídas */}
        {historico.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Últimas Saídas</h3>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {historico.slice(0, 5).map((h, i) => (
                <div key={h.id || i} className="flex items-center justify-between p-2 bg-emerald-900/20 rounded-lg border border-emerald-700/30">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="font-bold text-white text-sm">{h.placa}</span>
                    <span className="text-gray-400 text-xs">{h.modelo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-sm">R$ {Number(h.valor || 0).toFixed(2)}</span>
                    <span className="text-gray-500 text-xs block">
                      {h.permanencia ? formatarTempo(h.permanencia) : '0:00:00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Veículos Recentes */}
        <div className="flex-1 overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Veículos no Pátio</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {veiculosAtivos.map((v, i) => {
              const entrada = v.entrada || v.horaEntrada;
              const tempo = Math.floor((tempoAtual - entrada) / 1000);
              const horas = Math.floor(tempo / 3600);
              const minutos = Math.floor((tempo % 3600) / 60);
              const segundos = tempo % 60;
              const tempoFormatado = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
              const valor = v.isMensalista ? 0 : calcularValor(entrada, v.tipo);
              
              const isSelecionado = saidaSelecionada === v.id;
              
              return (
                <div 
                  key={v.id || i} 
                  onClick={() => selecionarVeiculoParaSaida(v)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelecionado 
                      ? 'bg-cyan-900/50 border-cyan-500 shadow-lg shadow-cyan-500/20' 
                      : 'bg-[#1E293B]/50 border-white/5 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isSelecionado && <span className="text-cyan-400">✓</span>}
                      <div className="font-bold text-white text-xl">{v.placa}</div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-2xl font-mono font-bold text-red-500"
                        style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.6)' }}
                      >
                        R$ {valor.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {v.modelo || 'Não informado'} {v.cor ? `- ${v.cor}` : ''}
                      {v.isMensalista && <span className="text-emerald-400 ml-2">📋</span>}
                    </div>
                    <div 
                      className="text-xl font-mono font-bold text-emerald-400"
                      style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
                    >
                      {tempoFormatado}
                    </div>
                  </div>
                  {isSelecionado && (
                    <div className="mt-2 text-center text-cyan-400 text-sm font-semibold">
                      👆 Clique em "REGISTRAR SAÍDA ✓"
                    </div>
                  )}
                </div>
              );
            })}
            {veiculosAtivos.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                Nenhum veículo no pátio
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
