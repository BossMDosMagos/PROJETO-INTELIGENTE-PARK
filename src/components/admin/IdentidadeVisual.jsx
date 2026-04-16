import React, { useState } from 'react';
import { Car, Save, MessageSquare, ShieldCheck, DollarSign, Calendar, Settings } from 'lucide-react';
import { Input, TextArea } from '../Input';

const IdentidadeVisual = ({
  config,
  setConfig,
  formatarCNPJ,
  handleLogoUpload,
  removerLogo,
  salvarConfiguracoes
}) => {
  const [abaAtiva, setAbaAtiva] = useState('marca'); // 'marca' | 'regras'

  return (
    <div className="mb-6">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            {abaAtiva === 'marca' ? (
              <Car className="w-8 h-8 text-indigo-400" />
            ) : (
              <Settings className="w-8 h-8 text-indigo-400" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {abaAtiva === 'marca' ? 'Identidade da Marca' : 'Regras & Comunicação'}
            </h2>
            <p className="text-slate-400">
              {abaAtiva === 'marca' 
                ? 'Defina como sua empresa aparece nos tickets e telas.' 
                : 'Configure mensagens automáticas e regras de negócio.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          {/* Navegação de Abas */}
          <div className="flex bg-[#0F172A] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button 
                  onClick={() => setAbaAtiva('marca')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${abaAtiva === 'marca' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                  Marca & Identidade
              </button>
              <button 
                  onClick={() => setAbaAtiva('regras')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${abaAtiva === 'regras' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                  Regras & Convites
              </button>
          </div>

          {salvarConfiguracoes && (
            <button
              onClick={salvarConfiguracoes}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-95 whitespace-nowrap"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 bg-[#0F172A]/50 p-8 rounded-xl border border-slate-800">
        
        {abaAtiva === 'marca' && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-400">Nome Fantasia</label>
                <Input
                  type="text"
                  value={config.nomeEmpresa}
                  onChange={(e) => setConfig({...config, nomeEmpresa: e.target.value})}
                  placeholder="ex: Command Park Center"
                  className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-400">CNPJ</label>
                <Input
                  type="text"
                  value={config.cnpj || ''}
                  onChange={(e) => setConfig({...config, cnpj: formatarCNPJ(e.target.value)})}
                  placeholder="00.000.000/0001-00"
                  maxLength={18}
                  className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-400">Endereço Completo</label>
                <Input
                  type="text"
                  value={config.endereco || ''}
                  onChange={(e) => setConfig({...config, endereco: e.target.value})}
                  placeholder="Rua, número, bairro..."
                  className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-400">Telefone Comercial</label>
                <Input
                  type="text"
                  value={config.telefone || ''}
                  onChange={(e) => setConfig({...config, telefone: e.target.value})}
                  placeholder="(00) 0000-0000"
                  className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-6 mt-6">
              <label className="block text-sm font-bold mb-4 text-white flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg">📸</div> 
                Logotipo da Empresa
              </label>
              
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-slate-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-600 file:text-white
                      hover:file:bg-indigo-700
                      cursor-pointer bg-[#1E293B] rounded-lg border border-slate-700"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Recomendado: PNG Transparente ou JPG. Máx 2MB.
                  </p>
                </div>

                {config.logoUrl && (
                  <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 flex flex-col items-center gap-3">
                    <img 
                      src={config.logoUrl} 
                      alt="Logo Preview" 
                      className="w-24 h-24 object-contain"
                    />
                    <button
                      onClick={removerLogo}
                      className="text-xs text-red-400 hover:text-red-300 font-bold"
                    >
                      REMOVER
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {abaAtiva === 'regras' && (
          <div className="space-y-8">
            {/* Mensagem de Convite */}
            <div>
              <label className="block text-sm font-bold mb-4 text-white flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg">💬</div> 
                Mensagem de Convite (WhatsApp)
              </label>
              <p className="text-sm text-slate-400 mb-2">
                Personalize o texto enviado ao convidar um mensalista via WhatsApp. O link de cadastro será adicionado automaticamente ao final.
              </p>
              <TextArea
                value={config.mensagemConvite || ''}
                onChange={(e) => setConfig({...config, mensagemConvite: e.target.value})}
                placeholder="Ex: Olá! Cadastre-se no nosso estacionamento..."
                rows={4}
                className="bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 w-full rounded-xl p-4"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 border-t border-slate-800 pt-8">
              {/* Regras de Veículos */}
              <div>
                <label className="block text-sm font-bold mb-4 text-white flex items-center gap-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">🛵</div> 
                  Tipos de Veículos
                </label>
                
                <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-slate-700">
                  <div>
                    <span className="text-white font-bold block">Aceitar Motos</span>
                    <span className="text-xs text-slate-400">Permitir cadastro de motocicletas</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={config.aceitaMoto}
                      onChange={(e) => setConfig({...config, aceitaMoto: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Regras de Cobrança */}
              <div>
                <label className="block text-sm font-bold mb-4 text-white flex items-center gap-2">
                  <div className="p-2 bg-rose-500/20 rounded-lg">💰</div> 
                  Multas e Atrasos
                </label>
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-slate-700">
                    <div>
                      <span className="text-white font-bold block">Cobrar Multa por Atraso</span>
                      <span className="text-xs text-slate-400">Aplicar taxa em pagamentos vencidos</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={config.cobraMulta}
                        onChange={(e) => setConfig({...config, cobraMulta: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>

                  {config.cobraMulta && (
                    <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 animate-fadeIn">
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-rose-400">Valor da Multa (R$)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.valorMulta}
                        onChange={(e) => setConfig({...config, valorMulta: e.target.value})}
                        placeholder="0.00"
                        className="bg-[#0F172A] border-slate-700 text-white focus:border-rose-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Vencimento */}
              <div>
                <label className="block text-sm font-bold mb-4 text-white flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg">📅</div> 
                  Vencimento Padrão
                </label>
                
                 <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amber-400">Dias para Vencimento</label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={config.diasVencimento}
                        onChange={(e) => setConfig({...config, diasVencimento: e.target.value})}
                        placeholder="5"
                        className="bg-[#0F172A] border-slate-700 text-white focus:border-amber-500 w-24"
                      />
                      <span className="text-slate-400 text-sm">dias após a geração</span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentidadeVisual;
