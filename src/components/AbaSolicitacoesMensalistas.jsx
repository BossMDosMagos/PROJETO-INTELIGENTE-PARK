import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, User, Phone, Car, RefreshCw } from 'lucide-react';
import { mensalistaService } from '../services/mensalistaService';
import { audioService } from '../services/audioService';

export function AbaSolicitacoesMensalistas() {
  const [mensalistas, setMensalistas] = useState(mensalistaService.getAll());
  const [filtro, setFiltro] = useState('PENDENTE'); // PENDENTE, ATIVO, INATIVO, TODAS
  const [diasVigencia, setDiasVigencia] = useState(30);
  const [confirmando, setConfirmando] = useState(null);

  // Atualizar lista automaticamente a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setMensalistas(mensalistaService.getAll());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Também atualizar quando o componente for exibido
  useEffect(() => {
    setMensalistas(mensalistaService.getAll());
  }, [filtro]);

  const handleRecarregar = () => {
    setMensalistas(mensalistaService.getAll());
    audioService.sucesso();
  };

  const handleAtivar = (id) => {
    const resultado = mensalistaService.ativar(id, diasVigencia);
    
    if (resultado.sucesso) {
      audioService.sucesso();
      setMensalistas(mensalistaService.getAll());
      setConfirmando(null);
    } else {
      audioService.erro();
    }
  };

  const handleInativar = (id) => {
    const resultado = mensalistaService.inativar(id);
    
    if (resultado.sucesso) {
      audioService.sucesso();
      setMensalistas(mensalistaService.getAll());
    } else {
      audioService.erro();
    }
  };

  const handleDeletar = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cadastro?')) {
      const resultado = mensalistaService.deletar(id);
      
      if (resultado.sucesso) {
        audioService.sucesso();
        setMensalistas(mensalistaService.getAll());
      } else {
        audioService.erro();
      }
    }
  };

  // Filtrar mensalistas
  const mensalistasFiltrante = filtro === 'TODAS'
    ? mensalistas
    : mensalistas.filter(m => m.status === filtro);

  const contadores = {
    pendentes: mensalistas.filter(m => m.status === 'PENDENTE').length,
    ativos: mensalistas.filter(m => m.status === 'ATIVO').length,
    inativos: mensalistas.filter(m => m.status === 'INATIVO').length,
    total: mensalistas.length
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const formatarCPF = (cpf) => {
    if (!cpf || cpf.length !== 11) return cpf;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  };

  const formatarTelefone = (tel) => {
    if (!tel || tel.length !== 11) return tel;
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
  };

  const getBadgeStatus = (status) => {
    const badgeMap = {
      'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'ATIVO': 'bg-green-100 text-green-800 border-green-200',
      'INATIVO': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return badgeMap[status] || badgeMap['PENDENTE'];
  };

  const getIconStatus = (status) => {
    const iconMap = {
      'PENDENTE': <Clock className="w-4 h-4" />,
      'ATIVO': <CheckCircle className="w-4 h-4" />,
      'INATIVO': <XCircle className="w-4 h-4" />
    };
    return iconMap[status] || iconMap['PENDENTE'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Car className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Solicitações de Mensalistas</h2>
      </div>

      {/* Cards de Contadores */}
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

      {/* Filtros */}
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
          onClick={handleRecarregar}
          className="ml-auto px-4 py-2 rounded-lg font-semibold transition bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-2"
          title="Recarregar lista"
        >
          <RefreshCw className="w-4 h-4" />
          Recarregar
        </button>
      </div>

      {/* Configuração de Vigência (para ativação) */}
      {filtro === 'PENDENTE' && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dias de Vigência ao Ativar
          </label>
          <div className="flex gap-2">
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

      {/* Lista de Mensalistas */}
      <div className="space-y-3">
        {mensalistasFiltrante.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">
              Nenhum mensalista encontrado com este filtro
            </p>
          </div>
        ) : (
          mensalistasFiltrante.map((mensalista) => (
            <div
              key={mensalista.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Info Principal */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {mensalista.nome}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {formatarCPF(mensalista.cpf)}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getBadgeStatus(mensalista.status)}`}>
                    {getIconStatus(mensalista.status)}
                    <span className="font-bold text-sm">{mensalista.status}</span>
                  </div>
                </div>

                {/* Grid de Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-gray-500">Placa</p>
                      <p className="font-bold font-mono">{mensalista.placa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-gray-500">WhatsApp</p>
                      <p className="font-bold">{formatarTelefone(mensalista.whatsapp)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-gray-500">Cadastro</p>
                      <p className="font-bold">{formatarData(mensalista.dataCadastro)}</p>
                    </div>
                  </div>

                  {mensalista.dataVencimento && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-gray-500">Vencimento</p>
                        <p className="font-bold">{formatarData(mensalista.dataVencimento)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detalhes do Veículo */}
                {(mensalista.modelo || mensalista.cor) && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p>
                      Veículo: <span className="font-semibold">{mensalista.modelo || '-'}</span>
                      {mensalista.cor && ` (${mensalista.cor})`}
                    </p>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="border-t pt-4 flex gap-2 flex-wrap">
                {mensalista.status === 'PENDENTE' && confirmando !== mensalista.id && (
                  <>
                    <button
                      onClick={() => setConfirmando(mensalista.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 rounded-lg transition active:scale-95"
                    >
                      ✓ Ativar
                    </button>
                    <button
                      onClick={() => handleDeletar(mensalista.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition active:scale-95"
                    >
                      ✗ Deletar
                    </button>
                  </>
                )}

                {confirmando === mensalista.id && (
                  <>
                    <div className="w-full text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200 mb-2">
                      Vigência: <strong>{diasVigencia} dias</strong>
                    </div>
                    <button
                      onClick={() => handleAtivar(mensalista.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition active:scale-95"
                    >
                      Confirmar Ativação
                    </button>
                    <button
                      onClick={() => setConfirmando(null)}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition active:scale-95"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                {mensalista.status === 'ATIVO' && (
                  <>
                    <button
                      onClick={() => handleInativar(mensalista.id)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition active:scale-95"
                    >
                      Inativar
                    </button>
                    <button
                      onClick={() => handleDeletar(mensalista.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition active:scale-95"
                    >
                      Deletar
                    </button>
                  </>
                )}

                {mensalista.status === 'INATIVO' && (
                  <>
                    <button
                      onClick={() => setConfirmando(mensalista.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition active:scale-95"
                    >
                      Reativar
                    </button>
                    <button
                      onClick={() => handleDeletar(mensalista.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition active:scale-95"
                    >
                      Deletar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
