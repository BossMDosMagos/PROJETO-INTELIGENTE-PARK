import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, DollarSign, Trash2, Plus, Check, X, Calendar, User, Phone, Car, History, AlertTriangle } from 'lucide-react';
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
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400">Carregando detalhes...</p>
      </div>
    );
  }

  if (!mensalista) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 p-4 rounded-full inline-block mb-4">
            <X className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-400 font-bold mb-4">Mensalista não encontrado</p>
        <button onClick={onVoltar} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all">
            Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
            onClick={onVoltar} 
            className="p-2 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{mensalista.nome}</h2>
            <p className="text-slate-400 text-sm flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${mensalista.status === 'ATIVO' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500'}`}></span>
                {mensalista.status}
            </p>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card de Dados */}
        <div className="bg-[#1E293B]/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <User className="w-32 h-32 text-cyan-500" />
          </div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Dados Cadastrais
            </h3>
            <button
              onClick={() => setEditando(!editando)}
              className="p-2 hover:bg-white/10 text-cyan-400 rounded-lg transition-colors"
            >
              {editando ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>
          </div>

          {!editando ? (
            <div className="space-y-4 text-sm relative z-10">
              {mensalista.email && (
                <div className="bg-[#0F172A]/50 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><User className="w-4 h-4 text-slate-400" /></div>
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider">E-mail</p>
                        <p className="text-slate-200">{mensalista.email}</p>
                    </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0F172A]/50 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">CPF</p>
                    <p className="font-mono text-slate-200">{formatarCPF(mensalista.cpf)}</p>
                </div>
                <div className="bg-[#0F172A]/50 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">WhatsApp</p>
                    <p className="font-mono text-slate-200">{formatarTelefone(mensalista.whatsapp)}</p>
                </div>
              </div>

              <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3 border-b border-slate-700/50 pb-2">
                    <div className="bg-slate-800 p-2 rounded-lg">
                        <Car className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-white font-bold">Veículo & Plano</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-slate-500 text-xs uppercase">Placa</p>
                        <p className="text-white font-bold font-mono text-lg">{mensalista.placa}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs uppercase">Renavam</p>
                        <p className="text-white font-mono">{mensalista.renavam || '-'}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs uppercase">Modelo</p>
                        <p className="text-white">{mensalista.modelo} <span className="text-slate-500 text-xs">({mensalista.cor})</span></p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs uppercase">Tipo</p>
                        <p className="text-white">{mensalista.tipo_veiculo || 'Passeio'}</p>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="text-slate-400 text-xs uppercase font-bold">Vencimento Preferencial</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                        Dia {mensalista.dia_vencimento || '05'}
                    </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in relative z-10">
                {/* Formulário de Edição */}
                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Nome Completo</label>
                  <input
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition"
                    value={formEdit.nome || ''}
                    onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">CPF</label>
                    <input
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-cyan-500 focus:outline-none transition"
                      value={formEdit.cpf || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, cpf: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">WhatsApp</label>
                    <input
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-cyan-500 focus:outline-none transition"
                      value={formEdit.whatsapp || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">E-mail</label>
                  <input
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition"
                    value={formEdit.email || ''}
                    onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Placa</label>
                    <input
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-mono uppercase focus:border-cyan-500 focus:outline-none transition"
                      value={formEdit.placa || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, placa: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Renavam</label>
                    <input
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-mono focus:border-cyan-500 focus:outline-none transition"
                      value={formEdit.renavam || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, renavam: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Modelo</label>
                    <input
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white uppercase focus:border-cyan-500 focus:outline-none transition"
                      value={formEdit.modelo || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, modelo: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Cor</label>
                    <select
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition"
                      value={formEdit.cor || ''}
                      onChange={(e) => setFormEdit({ ...formEdit, cor: e.target.value })}
                    >
                      <option value="">Selecione</option>
                      <option value="BRANCO">BRANCO</option>
                      <option value="PRETO">PRETO</option>
                      <option value="PRATA">PRATA</option>
                      <option value="CINZA">CINZA</option>
                      <option value="VERMELHO">VERMELHO</option>
                      <option value="AZUL">AZUL</option>
                      <option value="OUTROS">OUTROS</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Tipo Veículo</label>
                    <select
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition"
                      value={formEdit.tipo_veiculo || 'Passeio'}
                      onChange={(e) => setFormEdit({ ...formEdit, tipo_veiculo: e.target.value })}
                    >
                      <option value="Passeio">Passeio</option>
                      <option value="SUV/Pick-up">SUV/Pick-up</option>
                      <option value="Motocicleta">Motocicleta</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Dia Vencimento</label>
                    <select
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition"
                      value={formEdit.dia_vencimento || '05'}
                      onChange={(e) => setFormEdit({ ...formEdit, dia_vencimento: e.target.value })}
                    >
                      <option value="05">Dia 05</option>
                      <option value="10">Dia 10</option>
                      <option value="15">Dia 15</option>
                      <option value="20">Dia 20</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSalvarEdicao}
                  disabled={processando}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                >
                  {processando ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                        <Check className="w-5 h-5" /> 
                        Salvar Alterações
                    </>
                  )}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
            </div>
          )}
        </div>

        {/* Card de Datas */}
        <div className="bg-[#1E293B]/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Calendar className="w-32 h-32 text-violet-500" />
            </div>

          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <Calendar className="w-5 h-5 text-violet-400" />
            Status & Vigência
          </h3>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between p-4 bg-[#0F172A]/50 rounded-xl border border-slate-700/50">
              <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Cadastro</p>
                  <p className="text-slate-300 font-semibold">{formatarData(mensalista.data_cadastro)}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Status Atual</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    mensalista.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    mensalista.status === 'PENDENTE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}>
                    {mensalista.status}
                </span>
              </div>
            </div>

            {mensalista.data_vencimento ? (
                <div className="p-4 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 rounded-xl border border-violet-500/20">
                    <p className="text-violet-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Vencimento
                    </p>
                    <p className="text-2xl font-bold text-white">{formatarData(mensalista.data_vencimento)}</p>
                    <p className="text-xs text-violet-400 mt-2">
                        O acesso será bloqueado após esta data.
                    </p>
                </div>
            ) : (
                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-amber-400 text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Sem vigência ativa
                    </p>
                </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setModalPagamento(true)}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 border border-white/10 transition-all active:scale-95 group-hover:shadow-violet-900/40"
              >
                <DollarSign className="w-5 h-5" />
                Registrar Pagamento / Renovar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="bg-[#1E293B]/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            Histórico de Pagamentos
        </h3>
        
        {carregandoPagamentos ? (
          <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-slate-600 border-t-slate-300 rounded-full mx-auto mb-2"></div>
              <p className="text-slate-500 text-sm">Carregando...</p>
          </div>
        ) : pagamentos.length === 0 ? (
          <div className="text-center py-12 bg-[#0F172A]/30 rounded-xl border border-slate-800/50 border-dashed">
            <DollarSign className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Nenhum pagamento registrado ainda.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-700/50">
            <table className="w-full text-sm">
              <thead className="bg-[#0F172A] border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 text-slate-400 font-medium">Data</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Valor</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Método</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pagamentos.map((pag) => (
                  <tr key={pag.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-slate-300">{formatarData(pag.data_pagamento)}</td>
                    <td className="p-4 font-bold text-emerald-400 font-mono">{formatarMoeda(pag.valor)}</td>
                    <td className="p-4">
                        <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold uppercase">
                            {pag.metodo}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Pagamento */}
      {modalPagamento && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-2">Registrar Pagamento</h3>
            <p className="text-slate-400 text-sm mb-6">
                Informe o valor para registrar o pagamento e renovar a vigência.
            </p>
            
            <div className="mb-6">
                <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Valor (R$)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
                    <input
                    type="number"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    placeholder="0,00"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-4 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-xl font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                    autoFocus
                    />
                </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRegistrarPagamento}
                disabled={processando}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
              >
                {processando ? 'Processando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setModalPagamento(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
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
