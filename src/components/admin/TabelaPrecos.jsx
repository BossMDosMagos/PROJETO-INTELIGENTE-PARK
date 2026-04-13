import React from 'react';
import { DollarSign, Car, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../Button';
import { Input, Select } from '../Input';
import DESIGN from '../../design-system';
import CalculadoraSimulacao from './CalculadoraSimulacao';

const TabelaPrecos = ({
  config,
  setConfig,
  formTipoEstacionavel,
  setFormTipoEstacionavel,
  adicionarTipoEstacionavel,
  salvandoTipo,
  editandoTipo,
  setEditandoTipo,
  tiposEstacionaveis,
  ativarDesativarTipo,
  removerTipoEstacionavel,
  formPrecoMensalista,
  setFormPrecoMensalista,
  adicionarPrecoMensalista,
  salvandoPreco,
  editandoPreco,
  setEditandoPreco,
  precosMensalistas,
  obterNomeTipo,
  removerPrecoMensalista
}) => {
  return (
    <div className="p-6 min-h-screen bg-[#050A14] overflow-auto">
      <div className="max-w-6xl mx-auto space-y-6">
      
      {/* SEÇÃO 1: PREÇOS POR FRAÇÃO */}
      <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-emerald-400">
          <DollarSign className="w-6 h-6" />
          Preços por Fração de Tempo
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Input
              type="number"
              label="Valor 1ª Hora (R$)"
              value={config.valor_primeira_hora || 15}
              onChange={(e) => setConfig({...config, valor_primeira_hora: parseFloat(e.target.value)})}
              min="0"
              step="0.01"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>
          <div>
            <Input
              type="number"
              label="Tolerância Inicial (min)"
              value={config.tolerancia_inicial || 30}
              onChange={(e) => setConfig({...config, tolerancia_inicial: parseInt(e.target.value)})}
              min="0"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>
          <div>
            <Input
              type="number"
              label="Fração Hora (minutos)"
              value={config.fracao_hora_minutos || 30}
              onChange={(e) => setConfig({...config, fracao_hora_minutos: parseInt(e.target.value)})}
              min="1"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              label="Valor da Fração (R$)"
              value={config.valorFracao}
              onChange={(e) => setConfig({...config, valorFracao: parseFloat(e.target.value)})}
              min="0"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              label="Valor do Teto (R$)"
              value={config.valorTeto}
              onChange={(e) => setConfig({...config, valorTeto: parseFloat(e.target.value)})}
              min="0"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>
          <div>
            <Input
              type="number"
              label="Ciclo do Teto (horas)"
              value={config.valor_teto_horas || 12}
              onChange={(e) => setConfig({...config, valor_teto_horas: parseInt(e.target.value)})}
              min="1"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Cobrar Adicional após Teto
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                Após atingir o teto, cobra frações adicionais ao invés de parar
              </p>
            </div>
            <button
              onClick={() => setConfig({...config, cobrar_adicional_teto: !config.cobrar_adicional_teto})}
              className={`w-16 h-10 rounded-full flex items-center px-1 transition-all ${
                config.cobrar_adicional_teto 
                  ? 'bg-emerald-500 justify-end' 
                  : 'bg-slate-600 justify-start'
              }`}
            >
              <div className={`w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
                config.cobrar_adicional_teto ? 'text-emerald-500' : 'text-slate-400'
              }`}>
                {config.cobrar_adicional_teto ? 'ON' : 'OFF'}
              </div>
            </button>
          </div>
          {config.cobrar_adicional_teto && (
            <div className="mt-3 text-sm text-emerald-400 bg-emerald-900/20 p-3 rounded-lg border border-emerald-700/30">
              ✅ Ativo! Fórmula: <strong>Total = (Ciclos × Teto) + (Frações Extras × Valor Fração)</strong>
            </div>
          )}
        </div>

        {/* Divisor para Moto */}
        <div className="border-t border-slate-700 py-4 mt-2">
          <p className="text-center font-bold text-slate-400 text-sm tracking-widest uppercase">VALORES PARA MOTO</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Input
              type="number"
              step="0.01"
              label="Valor da Fração Moto (R$)"
              value={config.valorFracaoMoto}
              onChange={(e) => setConfig({...config, valorFracaoMoto: parseFloat(e.target.value)})}
              min="0"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              label="Valor do Teto Moto (R$)"
              value={config.valorTetoMoto}
              onChange={(e) => setConfig({...config, valorTetoMoto: parseFloat(e.target.value)})}
              min="0"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>
          <div>
            <Input
              type="number"
              label="Percentual Moto (%)"
              value={config.percentual_moto || 50}
              onChange={(e) => setConfig({...config, percentual_moto: parseFloat(e.target.value)})}
              min="0"
              max="100"
              className="bg-[#0F172A] border-slate-700 text-white focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-2 bg-emerald-900/20 p-4 rounded-lg border border-emerald-700/30">
            <p className="text-sm text-emerald-400">
              ✅ <strong>Salvo automaticamente!</strong> Configure os preços de fração e teto para veículos.
            </p>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: TIPOS DE ESTACIONÁVEIS */}
      <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-purple-400">
          <Car className="w-6 h-6" />
          Tipos de Estacionáveis
        </h2>

        <div className="space-y-6 mb-8 bg-[#0F172A]/50 p-6 rounded-xl border border-slate-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                label="Nome do Tipo"
                value={formTipoEstacionavel.nome}
                onChange={(e) => setFormTipoEstacionavel({...formTipoEstacionavel, nome: e.target.value})}
                placeholder="ex: Bicicleta, Van, Barraca..."
                className="bg-[#1E293B] border-slate-700 text-white focus:border-purple-500"
              />
            </div>
            <div>
              <Input
                type="text"
                label="Descrição"
                value={formTipoEstacionavel.descricao}
                onChange={(e) => setFormTipoEstacionavel({...formTipoEstacionavel, descricao: e.target.value})}
                placeholder="ex: Bicicleta elétrica..."
                className="bg-[#1E293B] border-slate-700 text-white focus:border-purple-500"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
            <Button
              variant="primary"
              onClick={adicionarTipoEstacionavel}
              disabled={salvandoTipo}
              style={{ background: 'linear-gradient(to right, #a855f7, #6366f1)', border: 'none' }}
            >
              {editandoTipo ? 'Atualizar Tipo' : 'Adicionar Tipo'}
            </Button>
            {editandoTipo && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditandoTipo(null);
                  setFormTipoEstacionavel({ nome: '', descricao: '' });
                }}
                style={{ background: 'transparent', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#cbd5e1' }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Tipos Cadastrados</h3>
        <div className="space-y-3">
          {tiposEstacionaveis.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum tipo cadastrado.</p>
          ) : (
            tiposEstacionaveis.map((tipo) => (
              <div
                key={tipo.id}
                className={`border rounded-lg p-4 flex items-center justify-between transition-all ${
                  tipo.ativo ? 'bg-[#1E293B] border-purple-500/30 shadow-lg shadow-purple-900/10' : 'bg-slate-800/50 border-slate-700 opacity-60'
                }`}
              >
                <div>
                  <p className="font-bold text-white text-lg">
                    {tipo.nome}
                    {!tipo.ativo && <span className="ml-2 text-slate-500 text-xs font-mono uppercase border border-slate-600 px-1 rounded">(INATIVO)</span>}
                  </p>
                  {tipo.descricao && <p className="text-sm text-slate-400">{tipo.descricao}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => ativarDesativarTipo(tipo.id)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      tipo.ativo
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 border border-slate-600'
                    }`}
                    title={tipo.ativo ? 'Desativar' : 'Ativar'}
                  >
                    {tipo.ativo ? <span className="text-lg">✓</span> : <span className="text-lg">○</span>}
                  </button>

                  <button
                    onClick={() => {
                      setEditandoTipo(tipo);
                      setFormTipoEstacionavel({ nome: tipo.nome, descricao: tipo.descricao });
                    }}
                    className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 flex items-center justify-center"
                  >
                    ✎
                  </button>

                  <button
                    onClick={() => removerTipoEstacionavel(tipo.id)}
                    className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SEÇÃO 3: PREÇOS MENSALISTAS */}
      <div className="bg-[#1E293B]/40 backdrop-blur-xl rounded-xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-orange-400">
          <DollarSign className="w-6 h-6" />
          Preços Mensalistas por Tipo
        </h2>

        <div className="space-y-6 mb-8 bg-[#0F172A]/50 p-6 rounded-xl border border-slate-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Tipo de Estacionável"
                value={formPrecoMensalista.tipoEstacionavelId}
                onChange={(e) => setFormPrecoMensalista({...formPrecoMensalista, tipoEstacionavelId: e.target.value})}
                options={[
                  { value: '', label: 'Selecione um tipo...' },
                  ...tiposEstacionaveis.filter(t => t.ativo).map((tipo) => ({
                    value: tipo.id,
                    label: `${tipo.nome}${tipo.descricao ? ` (${tipo.descricao})` : ''}`
                  }))
                ]}
                className="bg-[#1E293B] border-slate-700 text-white focus:border-orange-500"
              />
            </div>
            <div>
              <Input
                type="number"
                step="0.01"
                label="Valor Mensal (R$)"
                value={formPrecoMensalista.valorMensal}
                onChange={(e) => setFormPrecoMensalista({...formPrecoMensalista, valorMensal: e.target.value})}
                placeholder="ex: 100.00"
                min="0"
                className="bg-[#1E293B] border-slate-700 text-white focus:border-orange-500"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
            <Button
              variant="primary"
              onClick={adicionarPrecoMensalista}
              disabled={salvandoPreco}
              style={{ background: 'linear-gradient(to right, #f97316, #ea580c)', border: 'none' }}
            >
              {editandoPreco ? 'Atualizar Preço' : 'Adicionar Preço'}
            </Button>
            {editandoPreco && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditandoPreco(null);
                  setFormPrecoMensalista({ tipoEstacionavelId: '', valorMensal: '' });
                }}
                style={{ background: 'transparent', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#cbd5e1' }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Preços Cadastrados</h3>
        <div className="space-y-3">
          {precosMensalistas.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum preço de mensalista cadastrado.</p>
          ) : (
            precosMensalistas.map((preco) => (
              <div
                key={preco.id}
                className="bg-[#1E293B] border border-orange-500/20 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800 transition-colors"
              >
                <div>
                  <p className="font-bold text-white">{obterNomeTipo(preco.tipoEstacionavelId)}</p>
                  <p className="text-sm text-slate-400">Valor mensal: <strong className="text-orange-400">R$ {preco.valorMensal.toFixed(2)}</strong></p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditandoPreco(preco);
                      setFormPrecoMensalista({
                        tipoEstacionavelId: preco.tipoEstacionavelId.toString(),
                        valorMensal: preco.valorMensal.toString()
                      });
                    }}
                    className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 flex items-center justify-center"
                  >
                    ✎
                  </button>

                  <button
                    onClick={() => removerPrecoMensalista(preco.id)}
                    className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-700/30 mt-6">
          <p className="text-sm text-orange-400">
            ✅ <strong>Salvo automaticamente!</strong> Configure os preços mensalistas para cada tipo de estacionável.
          </p>
        </div>
      </div>

      {/* SEÇÃO 4: CALCULADORA DE SIMULAÇÃO */}
      <CalculadoraSimulacao config={config} />

      </div>
    </div>
  );
};

export default TabelaPrecos;
