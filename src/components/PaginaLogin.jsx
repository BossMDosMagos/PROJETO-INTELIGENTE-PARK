import React, { useState } from 'react';
import { User, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

export function PaginaLogin({ onLoginSuccess }) {
  const [operador, setOperador] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    if (!operador.trim()) {
      setErro('Operador é obrigatório');
      return;
    }
    
    if (!senha.trim()) {
      setErro('Senha é obrigatória');
      return;
    }

    setCarregando(true);

    try {
      // Inicializar Supabase só quando tentar login
      if (!supabaseService.initialized) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
          setErro('Variáveis de ambiente Supabase não configuradas');
          setCarregando(false);
          return;
        }
        
        console.log('🔑 Inicializando Supabase...');
        const Init = await supabaseService.initialize(supabaseUrl, supabaseAnonKey);
        if (!Init) {
          setErro('Erro ao conectar com Supabase');
          setCarregando(false);
          return;
        }
      }

      console.log('🔐 Tentando login com operador:', operador);
      const resultado = await supabaseService.login(operador, senha);

      if (resultado.sucesso) {
        console.log('✅ Login bem-sucedido!');
        if (onLoginSuccess) {
          const user = supabaseService.obterUsuarioAtual();
          onLoginSuccess(user);
        }
      } else {
        setErro(resultado.erro || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('❌ Erro:', err);
      setErro('Erro: ' + err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-indigo-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inteligente Park</h1>
          <p className="text-gray-600 text-sm">Sistema de Gestão de Estacionamento</p>
        </div>

        {erro && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-800">{erro}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="operador-input" className="block text-sm font-medium text-gray-700 mb-2">
              Operador <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                id="operador-input"
                type="text"
                value={operador}
                onChange={(e) => setOperador(e.target.value)}
                placeholder="master, admin, supervisor ou operador"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                disabled={carregando}
                required
                aria-required="true"
                aria-invalid={!!erro && !operador}
                aria-label="Campo de operador"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha-input" className="block text-sm font-medium text-gray-700 mb-2">
              Senha <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                id="senha-input"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                disabled={carregando}
                required
                aria-required="true"
                aria-invalid={!!erro && !senha}
                aria-label="Campo de senha"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              carregando
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
            aria-busy={carregando}
          >
            {carregando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" aria-hidden="true" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm">
          <p className="font-medium text-blue-900 mb-2">👤 Teste:</p>
          <p className="text-xs text-blue-800"><strong>Operador:</strong> master</p>
          <p className="text-xs text-blue-800"><strong>Senha:</strong> Senha@123</p>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">Sistema v1.0</p>
      </div>
    </div>
  );
}

export default PaginaLogin;
