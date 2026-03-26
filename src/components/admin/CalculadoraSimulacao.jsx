import React, { useState, useEffect } from 'react';
import { Calculator, Clock, Car, Bike } from 'lucide-react';
import DESIGN from '../../design-system';

const CalculadoraSimulacao = ({ config }) => {
  const [tempoHoras, setTempoHoras] = useState(1);
  const [tempoMinutos, setTempoMinutos] = useState(0);
  const [tipoVeiculo, setTipoVeiculo] = useState('carro');
  const [resultado, setResultado] = useState(null);

  const calcularSimulacao = () => {
    const diferencaMs = (tempoHoras * 60 + tempoMinutos) * 60 * 1000;
    const diferencaMinutos = Math.floor(diferencaMs / (1000 * 60));
    
    let valorFracao, valorTeto, valorPrimeiraHora;
    const percentualMoto = config.percentual_moto || 50;
    
    if (tipoVeiculo === 'moto') {
      valorFracao = (config.valorFracao || 5) * (percentualMoto / 100);
      valorTeto = (config.valorTeto || 55) * (percentualMoto / 100);
      valorPrimeiraHora = (config.valor_primeira_hora || 15) * (percentualMoto / 100);
    } else {
      valorFracao = config.valorFracao || 5;
      valorTeto = config.valorTeto || 55;
      valorPrimeiraHora = config.valor_primeira_hora || 15;
    }
    
    const tempoFracao = config.fracao_hora_minutos || 30;
    const tolerancia = config.tolerancia_inicial || 30;
    const cicloTetoHoras = config.valor_teto_horas || 12;
    const cicloTetoMinutos = cicloTetoHoras * 60;
    const cobrarAdicional = config.cobrar_adicional_teto || false;
    
    const ciclosCompletos = Math.floor(diferencaMinutos / cicloTetoMinutos);
    const minutosNoCicloAtual = diferencaMinutos % cicloTetoMinutos;
    
    let valorCicloAtual = 0;
    let fracaoCobrada = 0;
    
    if (minutosNoCicloAtual <= tolerancia) {
      valorCicloAtual = 0;
      fracaoCobrada = 0;
    } else {
      const minutosAcimaDoGratuito = minutosNoCicloAtual - tolerancia;
      fracaoCobrada = Math.ceil(minutosAcimaDoGratuito / tempoFracao);
      let valorFracoesAtual = fracaoCobrada * valorFracao;
      
      if (minutosNoCicloAtual > cicloTetoMinutos && cobrarAdicional) {
        const minutosExcedentes = minutosNoCicloAtual - cicloTetoMinutos;
        const fracoesExtras = Math.ceil(minutosExcedentes / tempoFracao);
        valorCicloAtual = valorTeto + (fracoesExtras * valorFracao);
      } else {
        valorCicloAtual = Math.min(valorFracoesAtual, valorTeto);
      }
    }
    
    const ciclosCobrados = ciclosCompletos * valorTeto;
    let valorTotal = ciclosCobrados + valorCicloAtual;
    
    if (ciclosCompletos > 0 && cobrarAdicional) {
      valorTotal = ciclosCobrados + valorCicloAtual;
    }
    
    setResultado({
      tempoTotal: diferencaMinutos,
      ciclosCompletos,
      minutosNoCiclo: minutosNoCicloAtual,
      fracaoCobrada,
      valorCiclo: valorCicloAtual,
      ciclosCobrados,
      valorTotal: Math.max(0, valorTotal),
      isento: minutosNoCicloAtual <= tolerancia
    });
  };

  useEffect(() => {
    calcularSimulacao();
  }, [tempoHoras, tempoMinutos, tipoVeiculo, config]);

  return (
    <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-800 shadow-xl shadow-cyan-900/10">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-cyan-400">
        <Calculator className="w-6 h-6" />
        Calculadora de Simulação
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Tempo de Permanência
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              min="0"
              max="72"
              value={tempoHoras}
              onChange={(e) => setTempoHoras(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-24 bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-white text-center"
            />
            <span className="text-slate-400 self-center">h</span>
            <input
              type="number"
              min="0"
              max="59"
              value={tempoMinutos}
              onChange={(e) => setTempoMinutos(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-24 bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-white text-center"
            />
            <span className="text-slate-400 self-center">min</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Veículo</label>
          <div className="flex gap-3">
            <button
              onClick={() => setTipoVeiculo('carro')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                tipoVeiculo === 'carro'
                  ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                  : 'bg-slate-800 text-slate-400 border-2 border-transparent hover:border-slate-600'
              }`}
            >
              <Car className="w-4 h-4" />
              Carro
            </button>
            <button
              onClick={() => setTipoVeiculo('moto')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                tipoVeiculo === 'moto'
                  ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                  : 'bg-slate-800 text-slate-400 border-2 border-transparent hover:border-slate-600'
              }`}
            >
              <Bike className="w-4 h-4" />
              Moto
            </button>
          </div>
        </div>
      </div>

      {resultado && (
        <div className="space-y-4">
          <div className="bg-[#0F172A] rounded-xl p-6 border border-slate-700">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Detalhes do Cálculo</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Tolerância</p>
                <p className="text-lg font-bold text-white">{config.tolerancia_inicial || 30} min</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Fração</p>
                <p className="text-lg font-bold text-white">{config.fracao_hora_minutos || 30} min</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Valor Teto</p>
                <p className="text-lg font-bold text-emerald-400">
                  R$ {(tipoVeiculo === 'moto' ? (config.valorTeto || 55) * ((config.percentual_moto || 50) / 100) : config.valorTeto || 55).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Ciclo Teto</p>
                <p className="text-lg font-bold text-white">{config.valor_teto_horas || 12}h</p>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tempo total:</span>
                <span className="text-white">{Math.floor(resultado.tempoTotal / 60)}h {resultado.tempoTotal % 60}min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Ciclos completos ({config.valor_teto_horas || 12}h):</span>
                <span className="text-white">{resultado.ciclosCompletos}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Minutos no ciclo atual:</span>
                <span className="text-white">{resultado.minutosNoCiclo} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Frações cobradas:</span>
                <span className="text-white">{resultado.fracaoCobrada}</span>
              </div>
              {resultado.ciclosCompletos > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Valor ciclos completos:</span>
                  <span className="text-orange-400">R$ {resultado.ciclosCobrados.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Valor ciclo atual:</span>
                <span className="text-orange-400">R$ {resultado.valorCiclo.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 text-center ${
            resultado.isento 
              ? 'bg-emerald-900/30 border-2 border-emerald-500' 
              : 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-2 border-cyan-500'
          }`}>
            {resultado.isento ? (
              <>
                <p className="text-2xl font-bold text-emerald-400">ISENTO!</p>
                <p className="text-sm text-emerald-300 mt-1">Dentro do período de tolerância</p>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-400 mb-1">VALOR A PAGAR</p>
                <p className="text-4xl font-bold text-white">R$ {resultado.valorTotal.toFixed(2)}</p>
              </>
            )}
          </div>

          {config.cobrar_adicional_teto && (
            <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3 text-center">
              <p className="text-xs text-amber-400">
                ⚡ Modo Adicional Ativo: Cobra frações extras após atingir o teto
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculadoraSimulacao;
