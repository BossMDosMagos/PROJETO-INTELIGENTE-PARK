import React, { useState, useEffect } from 'react';
import { Car, ArrowUpCircle, ArrowDownCircle, Clock, DollarSign } from 'lucide-react';

export default function DashboardContent({
  veiculos = [],
  historico = [],
  config = {},
  onRegistrarEntrada = () => {},
  onRegistrarSaida = () => {}
}) {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('carro');
  const [placaSaida, setPlacaSaida] = useState('');
  const [tempoAtual, setTempoAtual] = useState(Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => setTempoAtual(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Função de cálculo de valor
  const calcularValor = (entrada) => {
    const diferencaMs = tempoAtual - entrada;
    const diferencaMinutos = Math.floor(diferencaMs / (1000 * 60));
    
    const tipo = 'carro';
    let valorFracao, valorTeto;
    if (tipo === 'moto') {
      valorFracao = config.valorFracaoMoto || 4.50;
      valorTeto = config.valorTetoMoto || 27.50;
    } else {
      valorFracao = config.valorFracao || 9.00;
      valorTeto = config.valorTeto || 55.00;
    }
    
    const tempoFracao = config.tempoFracao || 30;
    const cicloTeto = config.cicloTeto || 720;
    const tolerancia = config.toleranciaMinutos || 15;
    
    if (diferencaMinutos <= tolerancia) return 0;
    
    const ciclosCompletos = Math.floor(diferencaMinutos / cicloTeto);
    const minutosNoCicloAtual = diferencaMinutos % cicloTeto;
    
    let valorCicloAtual = 0;
    if (minutosNoCicloAtual > tolerancia) {
      const minutosAcimaDoGratuito = minutosNoCicloAtual - tolerancia;
      const fracoesNoCicloAtual = Math.ceil(minutosAcimaDoGratuito / tempoFracao);
      const valorFracoesAtual = fracoesNoCicloAtual * valorFracao;
      valorCicloAtual = Math.min(valorFracoesAtual, valorTeto);
    }
    
    return (ciclosCompletos * valorTeto) + valorCicloAtual;
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
            if (placaSaida.length >= 7) {
              onRegistrarSaida(placaSaida);
              setPlacaSaida('');
            }
          }}
          className="w-full p-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <ArrowDownCircle className="w-5 h-5" />
            REGISTRAR SAÍDA
          </span>
        </button>
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
              const valor = v.isMensalista ? 0 : calcularValor(entrada);
              
              return (
                <div key={v.id || i} className="p-4 bg-[#1E293B]/50 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold text-white text-xl">{v.placa}</div>
                      <div className="text-sm text-gray-400">
                        {v.modelo || 'Não informado'} {v.cor ? `- ${v.cor}` : ''}
                        {v.isMensalista && <span className="text-emerald-400 ml-2">📋 Mensalista</span>}
                      </div>
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
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      Tempo:
                    </div>
                    <div 
                      className="text-xl font-mono font-bold text-emerald-400"
                      style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
                    >
                      {tempoFormatado}
                    </div>
                  </div>
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
