import React from 'react';
import { RefreshCw, Users } from 'lucide-react';
import { Button } from '../Button';
import { Input, Select } from '../Input';
import { Table } from '../Table';

const GestaoOperadores = ({
  carregarDadosOperadores,
  carregandoOperadores,
  formOperador,
  setFormOperador,
  niveisAcessoOptions,
  criarOperadorAdmin,
  salvandoOperador,
  limparFormularioOperador,
  operadoresAdminTableData
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-medium text-white">Cadastrar Novo Operador</h3>
          <p className="text-sm text-slate-400">Adicione membros à sua equipe e defina permissões.</p>
        </div>
        <Button
          variant="secondary"
          onClick={carregarDadosOperadores}
          disabled={carregandoOperadores}
          style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.2)' }}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${carregandoOperadores ? 'animate-spin' : ''}`} />
          {carregandoOperadores ? 'Sincronizando...' : 'Atualizar Lista'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-[#0F172A]/50 rounded-xl border border-slate-800/50">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-cyan-400">Usuário (Login)</label>
          <Input
            type="text"
            value={formOperador.operador}
            onChange={(e) => setFormOperador({ ...formOperador, operador: e.target.value })}
            placeholder="ex: joao.silva"
            className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-cyan-400">Nome Completo</label>
          <Input
            type="text"
            value={formOperador.nomeCompleto}
            onChange={(e) => setFormOperador({ ...formOperador, nomeCompleto: e.target.value })}
            placeholder="ex: João da Silva"
            className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-cyan-400">Senha Provisória</label>
          <Input
            type="password"
            value={formOperador.senha}
            onChange={(e) => setFormOperador({ ...formOperador, senha: e.target.value })}
            placeholder="••••••"
            className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-cyan-400">Nível de Acesso</label>
          <Select
            value={formOperador.nivelAcesso}
            onChange={(e) => setFormOperador({ ...formOperador, nivelAcesso: e.target.value })}
            options={niveisAcessoOptions}
            className="bg-[#1E293B] border-slate-700 text-white focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-10">
        <Button
          variant="primary"
          onClick={criarOperadorAdmin}
          disabled={salvandoOperador}
          style={{ background: 'linear-gradient(to right, #06b6d4, #3b82f6)', border: 'none' }}
        >
          {salvandoOperador ? 'Processando...' : 'Confirmar Cadastro'}
        </Button>
        <Button
          variant="secondary"
          onClick={limparFormularioOperador}
          style={{ background: 'transparent', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#cbd5e1' }}
        >
          Limpar Campos
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-2">Equipe Registrada</h3>

        {carregandoOperadores ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Carregando dados...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <Table
              columns={[
                { key: 'nomeCompleto', label: 'Nome', width: '25%' },
                { key: 'email', label: 'Login/Email', width: '25%' },
                { key: 'nivelAcesso', label: 'Cargo', width: '20%' },
                { key: 'status', label: 'Status', width: '15%', align: 'center' },
                { key: 'acao', label: '', width: '15%', align: 'right' }
              ]}
              data={operadoresAdminTableData}
              striped={false}
              hover={true}
              emptyState={
                <div className="p-8 text-center text-slate-500">Nenhum operador encontrado.</div>
              }
              className="w-full text-slate-300"
              headerClassName="bg-[#0F172A] text-slate-400 uppercase text-xs font-bold tracking-wider"
              rowClassName="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default GestaoOperadores;
