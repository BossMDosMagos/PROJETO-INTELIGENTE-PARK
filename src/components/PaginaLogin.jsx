import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

/**
 * Componente de Login para Supabase
 * Integra autenticação com email e senha
 */
export function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucessoLogin, setSucessoLogin] = useState(false);

  // Tentar restaurar sessão ao montar
  useEffect(() => {
    const restaurar = async () => {
      if (supabaseService.estaAutenticado()) {
        setSucessoLogin(true);
      }
    };
    restaurar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    // Validações
    if (!email.trim()) {
      setErro('Email é obrigatório');
      return;
    }
    
    if (!senha.trim()) {
      setErro('Senha é obrigatória');
      return;
    }

    if (senha.length < 6) {
      setErro('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setCarregando(true);

    try {
      const resultado = await supabaseService.login(email, senha);

      if (resultado.sucesso) {
        console.log('✅ Login bem-sucedido!');
        setSucessoLogin(true);
        // Redirecionar após 1 segundo
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setErro(resultado.erro || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setErro('Erro ao conectar com servidor');
    } finally {
      setCarregando(false);
    }
  };

  // Se já está autenticado
  if (sucessoLogin && supabaseService.estaAutenticado()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Bem-Sucedido!
          </h2>
          <p className="text-gray-600 mb-6">
            Bem-vindo, {supabaseService.obterUsuarioAtual()?.email}
          </p>
          <p className="text-sm text-gray-500">
            Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inteligente Park
          </h1>
          <p className="text-gray-600">
            Sistema de Gestão de Estacionamento
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{erro}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                disabled={carregando}
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                disabled={carregando}
              />
            </div>
          </div>

          {/* Status de Conexão */}
          <div className={`p-3 rounded-lg text-sm text-center ${
            supabaseService.initialized 
              ? 'bg-green-50 text-green-800' 
              : 'bg-yellow-50 text-yellow-800'
          }`}>
            {supabaseService.initialized 
              ? '🟢 Conectado ao servidor' 
              : '🟡 Modo offline - conectando...'}
          </div>

          {/* Botão Login */}
          <button
            type="submit"
            disabled={carregando || !supabaseService.initialized}
            className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              carregando || !supabaseService.initialized
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {carregando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-medium mb-1">👤 Demo Users:</p>
          <ul className="space-y-1 text-xs">
            <li><strong>Master:</strong> master@inteligente-park.com</li>
            <li><strong>Admin:</strong> admin@inteligente-park.com</li>
            <li><strong>Supervisor:</strong> supervisor@inteligente-park.com</li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Sistema versão 1.0 | Desenvolvido com Supabase
        </p>
      </div>
    </div>
  );
}

export default PaginaLogin;
