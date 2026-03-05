import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, Phone, Car, RefreshCw, Eye } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { audioService } from '../services/audioService';
import { PaginaDetalhesMensalista } from './PaginaDetalhesMensalista';

export function AbaSolicitacoesMensalistas() {
  const [mensalistas, setMensalistas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('PENDENTE');
  const [diasVigencia, setDiasVigencia] = useState(30);
  const [confirmando, setConfirmando] = useState(null);
  const [processando, setProcessando] = useState(null);
  const [mensalistaDetalhes, setMensalistaDetalhes] = useState(null);

  const carregarMensalistas = async () => {
    if (!supabaseService.initialized) {
      console.warn('⚠️ Supabase não inicializado');
      return;
    }

    setCarregando(true);
    try {
      const resultado = await supabaseService.listarMensalistas(
        filtro === 'TODAS' ? null : filtro
      );

      if (resultado.sucesso) {
        setMensalistas(resultado.dados || []);
        // Som removido - notificações agora na tela principal
      } else {
        console.error('Erro ao carregar:', resultado.erro);
        setMensalistas([]);
      }
    } catch (erro) {
      console.error('Erro:', erro);
      setMensalistas([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMensalistas();
  }, [filtro]);

  // Refresh automático silencioso (a cada 30 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      carregarMensalistas();
    }, 30000);
    return () => clearInterval(interval);
  }, [filtro]);

  const handleAtivar = async (mensalista) => {
    setProcessando(mensalista.id);
    try {
      const resultado = await supabaseService.atualizarMensalista(
        mensalista.id,
        'ATIVO',
        diasVigencia
      );

      if (resultado.sucesso) {
        audioService.sucesso();
        await carregarMensalistas();
        setConfirmando(null);
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } catch (erro) {
      console.error('Erro:', erro);
      audioService.erro();
    } finally {
      setProcessando(null);
    }
  };

  const handleInativar = async (mensalista) => {
    setProcessando(mensalista.id);
    try {
      const resultado = await supabaseService.atualizarMensalista(
        mensalista.id,
        'INATIVO',
        0
      );

      if (resultado.sucesso) {
        audioService.sucesso();
        await carregarMensalistas();
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } catch (erro) {
      console.error('Erro:', erro);
      audioService.erro();
    } finally {
      setProcessando(null);
    }
  };

  const handleDeletar = async (mensalista) => {
    if (!window.confirm(`Deletar permanentemente ${mensalista.nome}?`)) {
      return;
    }

    setProcessando(mensalista.id);
    try {
      const resultado = await supabaseService.removerMensalista(mensalista.id);

      if (resultado.sucesso) {
        audioService.sucesso();
        await carregarMensalistas();
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } catch (erro) {
      console.error('Erro:', erro);
      audioService.erro();
    } finally {
      setProcessando(null);
    }
  };

  const mensalistasFiltrante = filtro === 'TODAS'
    ? mensalistas
    : mensalistas.filter(m => (m.status || 'PENDENTE') === filtro);

  const contadores = {
    pendentes: mensalistas.filter(m => (m.status || 'PENDENTE') === 'PENDENTE').length,
    ativos: mensalistas.filter(m => (m.status || 'PENDENTE') === 'ATIVO').length,
    inativos: mensalistas.filter(m => (m.status || 'PENDENTE') === 'INATIVO').length,
    total: mensalistas.length
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return '-';
    const c = String(cpf).replace(/\D/g, '');
    return c.length === 11 ? `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}` : cpf;
  };

  const formatarTelefone = (tel) => {
    if (!tel) return '-';
    const t = String(tel).replace(/\D/g, '');
    return t.length === 11 ? `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}` : tel;
  };

  const getBadgeStatus = (status) => {
    const map = {
      'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'ATIVO': 'bg-green-100 text-green-800 border-green-200',
      'INATIVO': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return map[status] || map['PENDENTE'];
  };

  const getIconStatus = (status) => {
    const map = {
      'PENDENTE': <Clock className="w-4 h-4" />,
      'ATIVO': <CheckCircle className="w-4 h-4" />,
      'INATIVO': <XCircle className="w-4 h-4" />
    };
    return map[status] || map['PENDENTE'];
  };

  if (mensalistaDetalhes) {
    return (
      <PaginaDetalhesMensalista
        mensalistaId={mensalistaDetalhes}
        onVoltar={() => {
          setMensalistaDetalhes(null);
          carregarMensalistas();
        }}
        onAtualizar={carregarMensalistas}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Car className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Solicitações de Mensalistas</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-xs uppercase font-bold text-yellow-700">Pendentes</p>
          <p className="text-3xl font-bold text-yellow-800 mt-2">{contadores.pendentes}</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="text-xs uppercase font-bold text-green-700">Ativos</p>
          <p className="text-3xl font-bold text-green-800 mt-2">{contadores.ativos}</p>
        </div>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
          <p className="text-xs uppercase font-bold text-gray-700">Inativos</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{contadores.inativos}</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p className="text-xs uppercase font-bold text-blue-700">Total</p>
          <p className="text-3xl font-bold text-blue-800 mt-2">{contadores.total}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {['PENDENTE', 'ATIVO', 'INATIVO', 'TODAS'].map((status) => (
          <button
            key={status}
            onClick={() => setFiltro(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtro === status
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
        <button
          onClick={carregarMensalistas}
          disabled={carregando}
          className="ml-auto px-4 py-2 rounded-lg font-semibold transition bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin' : ''}`} />
          Recarregar
        </button>
      </div>

      {filtro === 'PENDENTE' && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dias de Vigência ao Ativar
          </label>
          <div className="flex gap-2 flex-wrap">
            {[7, 15, 30, 60, 90].map((dias) => (
              <button
                key={dias}
                onClick={() => setDiasVigencia(dias)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  diasVigencia === dias
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-blue-300 hover:bg-blue-50'
                }`}
              >
                {dias}d
              </button>
            ))}
          </div>
        </div>
      )}

      {carregando && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
          <p className="text-gray-600 font-semibold">Carregando mensalistas...</p>
        </div>
      )}

      {!carregando && (
        <div className="space-y-3">
          {mensalistasFiltrante.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-semibold">Nenhum mensalista encontrado</p>
            </div>
          ) : (
            mensalistasFiltrante.map((m) => (
              <div key={m.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{m.nome}</h3>
                      <p className="text-sm text-gray-500 font-mono">{formatarCPF(m.cpf)}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getBadgeStatus(m.status || 'PENDENTE')}`}>
                      {getIconStatus(m.status || 'PENDENTE')}
                      <span className="font-bold text-sm">{m.status || 'PENDENTE'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-gray-500">Placa</p>
                        <p className="font-bold font-mono">{m.placa || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-gray-500">WhatsApp</p>
                        <p className="font-bold">{formatarTelefone(m.whatsapp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-gray-500">Cadastro</p>
                        <p className="font-bold">{formatarData(m.data_cadastro)}</p>
                      </div>
                    </div>
                    {m.data_vencimento && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <div>
                          <p className="text-gray-500">Vencimento</p>
                          <p className="font-bold">{formatarData(m.data_vencimento)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {(m.modelo || m.cor) && (
                    <div className="mt-3 text-sm text-gray-600">
                      <p>Veículo: <span className="font-semibold">{m.modelo || '-'}</span> {m.cor && `(${m.cor})`}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setMensalistaDetalhes(m.id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </button>

                  {(m.status || 'PENDENTE') === 'PENDENTE' && confirmando !== m.id && (
                    <>
                      <button onClick={() => setConfirmando(m.id)} disabled={processando === m.id} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg disabled:opacity-50">✓ Ativar</button>
                      <button onClick={() => handleDeletar(m)} disabled={processando === m.id} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg disabled:opacity-50">✗ Deletar</button>
                    </>
                  )}

                  {confirmando === m.id && (
                    <>
                      <div className="w-full text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200 mb-2">Vigência: <strong>{diasVigencia} dias</strong></div>
                      <button onClick={() => handleAtivar(m)} disabled={processando === m.id} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg disabled:opacity-50">{processando === m.id ? 'Processando...' : 'Confirmar'}</button>
                      <button onClick={() => setConfirmando(null)} disabled={processando === m.id} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg disabled:opacity-50">Cancelar</button>
                    </>
                  )}

                  {(m.status || 'PENDENTE') === 'ATIVO' && (
                    <>
                      <button onClick={() => handleInativar(m)} disabled={processando === m.id} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg disabled:opacity-50">Inativar</button>
                      <button onClick={() => handleDeletar(m)} disabled={processando === m.id} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg disabled:opacity-50">Deletar</button>
                    </>
                  )}

                  {(m.status || 'PENDENTE') === 'INATIVO' && (
                    <>
                      <button onClick={() => setConfirmando(m.id)} disabled={processando === m.id} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg disabled:opacity-50">Reativar</button>
                      <button onClick={() => handleDeletar(m)} disabled={processando === m.id} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg disabled:opacity-50">Deletar</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
