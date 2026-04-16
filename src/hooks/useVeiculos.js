import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../useLocalStorage';
import { calcularValor, gerarId } from '../lib/utils';

/**
 * Hook para gerenciar veículos do estacionamento
 */
export function useVeiculos(config) {
  const [veiculos, setVeiculos] = useLocalStorage('park-veiculos', []);
  const [historico, setHistorico] = useLocalStorage('park-historico', []);

  const adicionarVeiculo = useCallback((dados) => {
    const novoVeiculo = {
      id: gerarId(),
      placa: dados.placa.toUpperCase(),
      modelo: dados.modelo || '',
      cor: dados.cor || '',
      tipo: dados.tipo || 'carro',
      horaEntrada: Date.now(),
      horaSaida: null,
      valor: 0,
      status: 'ativo',
      patioId: dados.patioId || null,
      operadorId: dados.operadorId || null
    };

    setVeiculos(prev => [...prev, novoVeiculo]);
    return novoVeiculo;
  }, [setVeiculos]);

  const registrarSaida = useCallback((veiculoId) => {
    const horaSaida = Date.now();
    
    setVeiculos(prev => {
      const veiculo = prev.find(v => v.id === veiculoId);
      if (!veiculo) return prev;

      const tempoMinutos = Math.floor((horaSaida - veiculo.horaEntrada) / (1000 * 60));
      const valorCalculado = calcularValor(
        tempoMinutos,
        config?.tempoFracao || 30,
        veiculo.tipo === 'moto' ? (config?.valorFracaoMoto || 4.50) : (config?.valorFracao || 9.00),
        veiculo.tipo === 'moto' ? (config?.valorTetoMoto || 27.50) : (config?.valorTeto || 55.00),
        config?.cicloTeto || 720
      );

      const veiculoAtualizado = {
        ...veiculo,
        horaSaida,
        valor: valorCalculado.valor,
        status: 'pago'
      };

      setHistorico(h => [...h, veiculoAtualizado]);
      return prev.filter(v => v.id !== veiculoId);
    });
  }, [config, setVeiculos, setHistorico]);

  const removerVeiculo = useCallback((veiculoId) => {
    setVeiculos(prev => prev.filter(v => v.id !== veiculoId));
  }, [setVeiculos]);

  const getVeiculosAtivos = useCallback(() => {
    return veiculos.filter(v => v.status === 'ativo');
  }, [veiculos]);

  const getHistoricoDia = useCallback(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const timestampHoje = hoje.getTime();
    
    return historico.filter(v => v.horaEntrada >= timestampHoje);
  }, [historico]);

  return {
    veiculos,
    historico,
    adicionarVeiculo,
    registrarSaida,
    removerVeiculo,
    getVeiculosAtivos,
    getHistoricoDia
  };
}

/**
 * Hook para atualizar tempo dos veículos em tempo real
 */
export function useTempoReal(veiculos) {
  const [tempoAtual, setTempoAtual] = useState(Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempoAtual(Date.now());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const getTempoVeiculo = useCallback((horaEntrada) => {
    return Math.floor((tempoAtual - horaEntrada) / (1000 * 60));
  }, [tempoAtual]);

  return { tempoAtual, getTempoVeiculo };
}
