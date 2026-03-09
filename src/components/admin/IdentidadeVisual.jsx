import React from 'react';
import { Car } from 'lucide-react';
import { Input } from '../Input';

const IdentidadeVisual = ({
  config,
  setConfig,
  formatarCNPJ,
  handleLogoUpload,
  removerLogo
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <Car className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Identidade da Marca</h2>
          <p className="text-slate-400">Defina como sua empresa aparece nos tickets e telas.</p>
        </div>
      </div>

      <div className="space-y-6 bg-[#0F172A]/50 p-8 rounded-xl border border-slate-800">
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
      </div>
    </div>
  );
};

export default IdentidadeVisual;
