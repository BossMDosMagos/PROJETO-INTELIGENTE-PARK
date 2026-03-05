import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, DollarSign, Trash2, Plus, Check, X, Calendar, User, Phone, Car } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { audioService } from '../services/audioService';

export function PaginaDetalhesMensalista({ mensalistaId, onVoltar, onAtualizar }) {
  const [mensalista, setMensalista] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({});
  const [pagamentos, setPagamentos] = useState([]);
  const [carregandoPagamentos, setCarregandoPagamentos] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [vencimento, setVencimento] = useState('');
  const [processando, setProcessando] = useState(false);

  const carregarDetalhes = async () => {
    if (!supabaseService.initialized || !mensalistaId) {
      setCarregando(false);
      return;
    }

    setCarregando(true);
    try {
      const resultado = await supabaseService.obterMensalistaDetalhes(mensalistaId);
      if (resultado.sucesso) {
        setMensalista(resultado.dados);
        setFormEdit(resultado.dados);
      }
    } catch (erro) {
      console.error('Erro:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const carregarPagamentos = async () => {
    if (!supabaseService.initialized || !mensalistaId) return;

    setCarregandoPagamentos(true);
    try {
      const resultado = await supabaseService.listarPagamentosMensalista(mensalistaId);
      if (resultado.sucesso) {
        setPagamentos(resultado.dados || []);
      }
    } catch (erro) {
      console.error('Erro:', erro);
    } finally {
      setCarregandoPagamentos(false);
    }
  };

  useEffect(() => {
    carregarDetalhes();
    carregarPagamentos();
  }, [mensalistaId]);

  const handleSalvarEdicao = async () => {
    setProcessando(true);
    try {
      const resultado = await supabaseService.editarMensalista(mensalistaId, formEdit);
      if (resultado.sucesso) {
        audioService.sucesso();
        setMensalista(resultado.dados);
        setEditando(false);
        onAtualizar?.();
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } finally {
      setProcessando(false);
    }
  };

  const handleRegistrarPagamento = async () => {
    if (!vencimento || vencimento <= 0) {
      alert('Informe um valor válido');
      return;
    }

    setProcessando(true);
    try {
      const resultado = await supabaseService.registrarPagamento(mensalistaId, vencimento, 'PIX');
      if (resultado.sucesso) {
        audioService.sucesso();
        setVencimento('');
        setModalPagamento(false);
        await carregarPagamentos();
      } else {
        audioService.erro();
        alert(`Erro: ${resultado.erro}`);
      }
    } finally {
      setProcessando(false);
    }
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

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  if (carregando) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!mensalista) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Mensalista não encontrado</p>
        <button onClick={onVoltar} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Voltar</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onVoltar} className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900">{mensalista.nome}</h2>
      </div>

      {/* Informações Principais */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card de Dados */}
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Dados Pessoais</h3>
            {!editando && (
              <button onClick={() => setEditando(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Edit2 className="w-5 h-5 text-blue-600" />
              </button>
            )}
          </div>

          {!editando ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">CPF</p>
                <p className="font-semibold">{formatarCPF(mensalista.cpf)}</p>
              </div>
              <div>
                <p className="text-gray-600">WhatsApp</p>
                <p className="font-semibold">{formatarTelefone(mensalista.whatsapp)}</p>
              </div>
              <div>
                <p className="text-gray-600">Placa</p>
                <p className="font-semibold font-mono text-lg">{mensalista.placa}</p>
              </div>
              <div>
                <p className="text-gray-600">Modelo</p>
                <p className="font-semibold">{mensalista.modelo || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Cor</p>
                <p className="font-semibold">{mensalista.cor || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold inline-block px-3 py-1 rounded-full text-white" style={{
                  backgroundColor: mensalista.status === 'ATIVO' ? '#10b981' : mensalista.status === 'PENDENTE' ? '#f59e0b' : '#6b7280'
                }}>
                  {mensalista.status}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={formEdit.nome || ''}
                onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })}
                placeholder="Nome"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formEdit.cpf || ''}
                onChange={(e) => setFormEdit({ ...formEdit, cpf: e.target.value })}
                placeholder="CPF"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formEdit.whatsapp || ''}
                onChange={(e) => setFormEdit({ ...formEdit, whatsapp: e.target.value })}
                placeholder="WhatsApp"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formEdit.modelo || ''}
                onChange={(e) => setFormEdit({ ...formEdit, modelo: e.target.value })}
                placeholder="Modelo do veículo"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formEdit.cor || ''}
                onChange={(e) => setFormEdit({ ...formEdit, cor: e.target.value })}
                placeholder="Cor"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSalvarEdicao}
                  disabled={processando}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  Salvar
                </button>
                <button
                  onClick={() => setEditando(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card de Datas */}
        <div className="bg-white border-2 border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Histórico</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data de Cadastro
              </p>
              <p className="font-semibold">{formatarData(mensalista.data_cadastro)}</p>
            </div>
            {mensalista.data_vencimento && (
              <div>
                <p className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Vencimento
                </p>
                <p className="font-semibold text-lg">{formatarData(mensalista.data_vencimento)}</p>
              </div>
            )}
            <div className="pt-4 border-t">
              <button
                onClick={() => setModalPagamento(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Registrar Pagamento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Histórico de Pagamentos</h3>
        {carregandoPagamentos ? (
          <p className="text-gray-600">Carregando pagamentos...</p>
        ) : pagamentos.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nenhum pagamento registrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Valor</th>
                  <th className="text-left p-3">Método</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map((pag) => (
                  <tr key={pag.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{formatarData(pag.data_pagamento)}</td>
                    <td className="p-3 font-bold text-green-600">{formatarMoeda(pag.valor)}</td>
                    <td className="p-3">{pag.metodo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Pagamento */}
      {modalPagamento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Registrar Pagamento</h3>
            <input
              type="number"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              placeholder="Valor (ex: 150.00)"
              step="0.01"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleRegistrarPagamento}
                disabled={processando}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
              >
                Confirmar
              </button>
              <button
                onClick={() => setModalPagamento(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
