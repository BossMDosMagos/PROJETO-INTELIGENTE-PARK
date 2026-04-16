import React from 'react';
import { RefreshCw, Bluetooth, Printer, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '../Button';
import { Input, TextArea } from '../Input';
import { Table } from '../Table';

const GestaoPatios = ({
  carregarPatios,
  carregandoPatios,
  formPatio,
  setFormPatio,
  tipoLocalizacao,
  setTipoLocalizacao,
  buscarCepAutomatico,
  criarPatioAdmin,
  salvandoPatio,
  limparFormularioPatio,
  patiosAdminTableData
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-medium text-white">Gestão de Unidades</h3>
          <p className="text-sm text-slate-400">Configure as localizações físicas do estacionamento.</p>
        </div>
        <Button
          variant="secondary"
          onClick={carregarPatios}
          disabled={carregandoPatios}
          style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.2)' }}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${carregandoPatios ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-[#0F172A]/50 rounded-xl border border-slate-800/50">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Nome da Unidade *</label>
          <Input
            type="text"
            value={formPatio.nome}
            onChange={(e) => setFormPatio({ ...formPatio, nome: e.target.value })}
            placeholder="ex: Unidade Centro - Matriz"
            className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
          />
        </div>

        {/* Seletor de Tipo de Localização */}
        <div className="md:col-span-2 flex gap-4 p-4 bg-[#1E293B] rounded-lg border border-slate-700">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tipoLocalizacao === 'endereco' ? 'border-emerald-500' : 'border-slate-500'}`}>
              {tipoLocalizacao === 'endereco' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
            </div>
            <input
              type="radio"
              name="tipoLocalizacao"
              value="endereco"
              checked={tipoLocalizacao === 'endereco'}
              onChange={() => setTipoLocalizacao('endereco')}
              className="hidden"
            />
            <span className={`text-sm font-medium ${tipoLocalizacao === 'endereco' ? 'text-white' : 'text-slate-400'} group-hover:text-emerald-400 transition-colors`}>📍 Endereço Postal</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tipoLocalizacao === 'coordenadas' ? 'border-emerald-500' : 'border-slate-500'}`}>
              {tipoLocalizacao === 'coordenadas' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
            </div>
            <input
              type="radio"
              name="tipoLocalizacao"
              value="coordenadas"
              checked={tipoLocalizacao === 'coordenadas'}
              onChange={() => setTipoLocalizacao('coordenadas')}
              className="hidden"
            />
            <span className={`text-sm font-medium ${tipoLocalizacao === 'coordenadas' ? 'text-white' : 'text-slate-400'} group-hover:text-emerald-400 transition-colors`}>🌍 Coordenadas GPS (Alta Precisão)</span>
          </label>
        </div>

        {tipoLocalizacao === 'endereco' ? (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">CEP</label>
              <Input
                type="text"
                value={formPatio.cep}
                onChange={(e) => buscarCepAutomatico(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Cidade</label>
              <Input
                type="text"
                value={formPatio.cidade}
                onChange={(e) => setFormPatio({ ...formPatio, cidade: e.target.value })}
                placeholder="ex: São Paulo"
                className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">UF</label>
              <Input
                type="text"
                value={formPatio.estado}
                onChange={(e) => setFormPatio({ ...formPatio, estado: e.target.value.toUpperCase() })}
                maxLength="2"
                placeholder="SP"
                className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Logradouro</label>
              <Input
                type="text"
                value={formPatio.endereco}
                onChange={(e) => setFormPatio({ ...formPatio, endereco: e.target.value })}
                placeholder="ex: Avenida Paulista"
                className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Número</label>
              <Input
                type="text"
                value={formPatio.numero}
                onChange={(e) => setFormPatio({ ...formPatio, numero: e.target.value })}
                placeholder="1000"
                className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Latitude</label>
              <Input
                type="number"
                step="any"
                min="-90"
                max="90"
                value={formPatio.latitude}
                onChange={(e) => setFormPatio({ ...formPatio, latitude: e.target.value })}
                placeholder="-23.550520"
                className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Longitude</label>
              <Input
                type="number"
                step="any"
                min="-180"
                max="180"
                value={formPatio.longitude}
                onChange={(e) => setFormPatio({ ...formPatio, longitude: e.target.value })}
                placeholder="-46.633308"
                className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
              />
            </div>
            <div className="md:col-span-2 text-xs text-emerald-400/80 bg-emerald-900/20 p-2 rounded border border-emerald-900/50">
              💡 Use coordenadas exatas do Google Maps para posicionamento preciso no mapa tático.
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Capacidade (Vagas)</label>
          <Input
            type="number"
            value={formPatio.qtd_vagas}
            onChange={(e) => setFormPatio({ ...formPatio, qtd_vagas: e.target.value })}
            placeholder="ex: 150"
            className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Telefone</label>
          <Input
            type="text"
            value={formPatio.telefone}
            onChange={(e) => setFormPatio({ ...formPatio, telefone: e.target.value })}
            placeholder="(11) 9999-9999"
            className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">E-mail de Contato</label>
          <Input
            type="email"
            value={formPatio.email}
            onChange={(e) => setFormPatio({ ...formPatio, email: e.target.value })}
            placeholder="contato@patio.com.br"
            className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-400">Notas / Observações</label>
          <TextArea
            value={formPatio.descricao}
            onChange={(e) => setFormPatio({ ...formPatio, descricao: e.target.value })}
            placeholder="Informações operacionais..."
            rows={3}
            className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 w-full rounded-lg p-2"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-10">
        <Button
          variant="primary"
          fullWidth
          onClick={criarPatioAdmin}
          disabled={salvandoPatio}
          style={{ background: 'linear-gradient(to right, #10b981, #059669)', border: 'none' }}
        >
          {salvandoPatio ? 'Salvando...' : '+ Cadastrar Unidade'}
        </Button>

        <Button
          variant="secondary"
          fullWidth
          onClick={limparFormularioPatio}
          style={{ background: 'transparent', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#cbd5e1' }}
        >
          Limpar
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-2">Unidades Ativas</h3>

        {carregandoPatios ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Carregando unidades...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <Table
              columns={[
                { key: 'nome', label: 'Unidade', width: '30%' },
                { key: 'localizacao', label: 'Endereço', width: '30%' },
                { key: 'vagas', label: 'Vagas', width: '10%', align: 'center' },
                { key: 'telefone', label: 'Contato', width: '20%' },
                { key: 'acao', label: '', width: '10%', align: 'right' }
              ]}
              data={patiosAdminTableData}
              striped={false}
              hover={true}
              emptyState={
                <div className="p-8 text-center text-slate-500">Nenhum pátio cadastrado.</div>
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

export default GestaoPatios;
