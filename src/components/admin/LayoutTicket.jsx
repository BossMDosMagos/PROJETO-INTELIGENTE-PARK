import React from 'react';
import { Printer } from 'lucide-react';

const LayoutTicket = ({
  config,
  setConfig
}) => {
  return (
    <div className="mb-6 bg-[#0F172A]/50 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-pink-400">
        <Printer className="w-6 h-6" />
        Layout do Comprovante
      </h2>

      <div className="space-y-6">
        {/* SEÇÃO 1: TAMANHO DO QR CODE */}
        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">
          <h3 className="font-bold text-sm text-cyan-400 mb-4 uppercase tracking-wider">📋 TAMANHO DO QR CODE</h3>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">
              Tamanho ({config.tamanhoQrCode || 150}px)
            </label>
            <input
              type="range"
              min="80"
              max="200"
              step="10"
              value={config.tamanhoQrCode || 150}
              onChange={(e) => setConfig({...config, tamanhoQrCode: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-xs text-slate-500 mt-2">Intervalo: 80px a 200px</div>
          </div>
        </div>

        {/* SEÇÃO 2: DIMENSÕES DO TICKET */}
        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">
          <h3 className="font-bold text-sm text-cyan-400 mb-4 uppercase tracking-wider">📐 DIMENSÕES DO TICKET</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                Largura em caracteres ({config.larguraTicket || 32} chars)
              </label>
              <input
                type="range"
                min="20"
                max="40"
                value={config.larguraTicket || 32}
                onChange={(e) => setConfig({...config, larguraTicket: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                Linha divisória ({config.linhaDivisoria || 24} caracteres)
              </label>
              <input
                type="range"
                min="16"
                max="32"
                value={config.linhaDivisoria || 24}
                onChange={(e) => setConfig({...config, linhaDivisoria: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: TAMANHO DAS FONTES */}
        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">
          <h3 className="font-bold text-sm text-cyan-400 mb-4 uppercase tracking-wider">🔤 TAMANHO DAS FONTES</h3>
          <div className="space-y-6">
            {/* Nome da Empresa */}
            <div className="border-b border-slate-700 pb-4">
              <label className="block text-sm font-semibold mb-3 text-white">Nome da Empresa</label>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-2">Altura: {config.tamanhoFonteNome?.altura || 1}x</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={config.tamanhoFonteNome?.altura || 1}
                    onChange={(e) => setConfig({
                      ...config,
                      tamanhoFonteNome: {...config.tamanhoFonteNome, altura: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-2">Largura: {config.tamanhoFonteNome?.largura || 1}x</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={config.tamanhoFonteNome?.largura || 1}
                    onChange={(e) => setConfig({
                      ...config,
                      tamanhoFonteNome: {...config.tamanhoFonteNome, largura: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Dados */}
            <div className="border-b border-slate-700 pb-4">
              <label className="block text-sm font-semibold mb-3 text-white">Dados Gerais (CNPJ, Endereço, etc)</label>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-2">Altura: {config.tamanhoFonteDados?.altura || 1}x</label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    value={config.tamanhoFonteDados?.altura || 1}
                    onChange={(e) => setConfig({
                      ...config,
                      tamanhoFonteDados: {...config.tamanhoFonteDados, altura: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-2">Largura: {config.tamanhoFonteDados?.largura || 1}x</label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    value={config.tamanhoFonteDados?.largura || 1}
                    onChange={(e) => setConfig({
                      ...config,
                      tamanhoFonteDados: {...config.tamanhoFonteDados, largura: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Placa */}
            <div className="border-b border-slate-700 pb-4">
              <label className="block text-sm font-semibold mb-3 text-white">Placa do Veículo</label>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-2">Altura: {config.tamanhoFontePlaca?.altura || 2}x</label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={config.tamanhoFontePlaca?.altura || 2}
                    onChange={(e) => setConfig({
                      ...config,
                      tamanhoFontePlaca: {...config.tamanhoFontePlaca, altura: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-2">Largura: {config.tamanhoFontePlaca?.largura || 2}x</label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={config.tamanhoFontePlaca?.largura || 2}
                    onChange={(e) => setConfig({
                      ...config,
                      tamanhoFontePlaca: {...config.tamanhoFontePlaca, largura: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-white">Valor (R$)</label>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-2">Altura: {config.tamanhoFonteValor?.altura || 2}x</label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={config.tamanhoFonteValor?.altura || 2}
                    onChange={(e) => setConfig({
                      ...config,
                      tamanhoFonteValor: {...config.tamanhoFonteValor, altura: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-2">Largura: {config.tamanhoFonteValor?.largura || 2}x</label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={config.tamanhoFonteValor?.largura || 2}
                    onChange={(e) => setConfig({
                      ...config,
                      tamanhoFonteValor: {...config.tamanhoFonteValor, largura: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: ESPAÇAMENTO */}
        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">
          <h3 className="font-bold text-sm text-cyan-400 mb-4 uppercase tracking-wider">↔️ ESPAÇAMENTO (LINHAS VAZIAS)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                Antes da Divisória ({config.linhasAntesDivisoria || 0} linhas)
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={config.linhasAntesDivisoria || 0}
                onChange={(e) => setConfig({...config,linhasAntesDivisoria: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                Depois da Divisória ({config.linhasDepoisDivisoria || 0} linhas)
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={config.linhasDepoisDivisoria || 0}
                onChange={(e) => setConfig({...config, linhasDepoisDivisoria: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                Antes do QR Code ({config.linhasAntesQR || 0} linhas)
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={config.linhasAntesQR || 0}
                onChange={(e) => setConfig({...config, linhasAntesQR: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                Depois do QR Code ({config.linhasDepoisQR || 1} linhas)
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={config.linhasDepoisQR || 1}
                onChange={(e) => setConfig({...config, linhasDepoisQR: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 5: VISIBILIDADE DE CAMPOS */}
        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">
          <h3 className="font-bold text-sm text-cyan-400 mb-4 uppercase tracking-wider">👁️ VISIBILIDADE DE CAMPOS</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={Boolean(config.mostrarModelo)}
                onChange={(e) => setConfig({...config, mostrarModelo: e.target.checked})}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
              Modelo do Veículo
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={Boolean(config.mostrarCor)}
                onChange={(e) => setConfig({...config, mostrarCor: e.target.checked})}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
              Cor do Veículo
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={Boolean(config.mostrarDatas)}
                onChange={(e) => setConfig({...config, mostrarDatas: e.target.checked})}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
              Data
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={Boolean(config.mostrarHoras)}
                onChange={(e) => setConfig({...config, mostrarHoras: e.target.checked})}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
              Horas
            </label>
            <div className="mt-4 border-t border-slate-700 pt-4">
              <label className="block text-sm font-semibold mb-3 text-white">Dados da Empresa no Recibo:</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(config.imprimirCnpj)}
                    onChange={(e) => setConfig({...config, imprimirCnpj: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  CNPJ
                </label>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(config.imprimirEndereco)}
                    onChange={(e) => setConfig({...config, imprimirEndereco: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  Endereço
                </label>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(config.imprimirTelefone)}
                    onChange={(e) => setConfig({...config, imprimirTelefone: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  Telefone
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 6: ALINHAMENTOS */}
        <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">
          <h3 className="font-bold text-sm text-cyan-400 mb-4 uppercase tracking-wider">⬅️➡️ ALINHAMENTO DOS TEXTOS</h3>
          <div className="space-y-4">
            {/* Nome da Empresa */}
            <div className="border-b border-slate-700 pb-3">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Nome da Empresa</label>
              <select
                value={config.alinhamentoNome || 'center'}
                onChange={(e) => setConfig({...config, alinhamentoNome: e.target.value})}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-sm text-white focus:border-cyan-500"
              >
                <option value="left">⬅️ Esquerda</option>
                <option value="center">⬆️⬇️ Centralizado</option>
                <option value="right">➡️ Direita</option>
              </select>
            </div>

            {/* CNPJ, Endereço, Telefone */}
            <div className="border-b border-slate-700 pb-3">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Dados da Empresa</label>
              <select
                value={config.alinhamentoDados || 'center'}
                onChange={(e) => setConfig({...config, alinhamentoDados: e.target.value})}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-sm text-white focus:border-cyan-500"
              >
                <option value="left">⬅️ Esquerda</option>
                <option value="center">⬆️⬇️ Centralizado</option>
                <option value="right">➡️ Direita</option>
              </select>
            </div>

            {/* Linha Divisória */}
            <div className="border-b border-slate-700 pb-3">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Linha Divisória</label>
              <select
                value={config.alinhamentoDivisoria || 'center'}
                onChange={(e) => setConfig({...config, alinhamentoDivisoria: e.target.value})}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-sm text-white focus:border-cyan-500"
              >
                <option value="left">⬅️ Esquerda</option>
                <option value="center">⬆️⬇️ Centralizado</option>
                <option value="right">➡️ Direita</option>
              </select>
            </div>

            {/* Placa */}
            <div className="border-b border-slate-700 pb-3">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Placa do Veículo</label>
              <select
                value={config.alinhamentoPlaca || 'center'}
                onChange={(e) => setConfig({...config, alinhamentoPlaca: e.target.value})}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-sm text-white focus:border-cyan-500"
              >
                <option value="left">⬅️ Esquerda</option>
                <option value="center">⬆️⬇️ Centralizado</option>
                <option value="right">➡️ Direita</option>
              </select>
            </div>

            {/* Datas e Horas */}
            <div className="border-b border-slate-700 pb-3">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Data, Hora e Informações</label>
              <select
                value={config.alinhamentoDatas || 'center'}
                onChange={(e) => setConfig({...config, alinhamentoDatas: e.target.value})}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-sm text-white focus:border-cyan-500"
              >
                <option value="left">⬅️ Esquerda</option>
                <option value="center">⬆️⬇️ Centralizado</option>
                <option value="right">➡️ Direita</option>
              </select>
            </div>

            {/* Modelo e Cor */}
            <div className="border-b border-slate-700 pb-3">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Modelo e Cor do Veículo</label>
              <select
                value={config.alinhamentoModeloCor || 'center'}
                onChange={(e) => setConfig({...config, alinhamentoModeloCor: e.target.value})}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-sm text-white focus:border-cyan-500"
              >
                <option value="left">⬅️ Esquerda</option>
                <option value="center">⬆️⬇️ Centralizado</option>
                <option value="right">➡️ Direita</option>
              </select>
            </div>

            {/* Valor e Tempo */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Valor (R$) e Tempo</label>
              <select
                value={config.alinhamentoValor || 'center'}
                onChange={(e) => setConfig({...config, alinhamentoValor: e.target.value})}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-sm text-white focus:border-cyan-500"
              >
                <option value="left">⬅️ Esquerda</option>
                <option value="center">⬆️⬇️ Centralizado</option>
                <option value="right">➡️ Direita</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESUMO */}
        <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-700/30">
          <p className="text-sm text-cyan-300">
            ✅ <strong>Todas as configurações são salvas automaticamente!</strong> Teste com um veículo na tela inicial para ver as mudanças.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LayoutTicket;
