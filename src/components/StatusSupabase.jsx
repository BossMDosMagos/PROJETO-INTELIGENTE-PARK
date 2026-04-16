import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

/**
 * Componente para exibir status de conexão Supabase
 * Mostra se está online/offline, autenticado, e fila de sincronização
 */
export function StatusSupabase() {
  const [status, setStatus] = useState('conectando');
  const [usuario, setUsuario] = useState(null);
  const [pendenteCount, setPendenteCount] = useState(0);
  const [detalhes, setDetalhes] = useState('');

  // Atualizar status quando Supabase estiver pronto
  useEffect(() => {
    const verificar = async () => {
      try {
        // Aguardar um pouco para o supabaseService inicializar
        await new Promise(r => setTimeout(r, 1000));

        if (!supabaseService.initialized) {
          setStatus('aviso');
          setDetalhes('Conexão com Supabase em preparação.');
          return;
        }

        const conexao = await supabaseService.testarConexao();
        if (conexao.sucesso) {
          setStatus('pronto');
          setDetalhes('✅ Banco de dados conectado com sucesso');
        } else {
          setStatus('aviso');
          setDetalhes(`⚠️ ${conexao.erro}`);
        }

        // Obter usuário atual
        const user = supabaseService.obterUsuarioAtual();
        setUsuario(user);

        // Obter contagem de pendentes
        updatePendentes();

        // Atualizar pendentes a cada 5s
        const interval = setInterval(updatePendentes, 5000);
        return () => clearInterval(interval);

      } catch (erro) {
        console.error('Erro ao verificar Supabase:', erro);
        setStatus('erro');
        setDetalhes(`Erro: ${erro.message}`);
      }
    };

    verificar();
  }, []);

  const updatePendentes = () => {
    if (supabaseService.pendingQueue) {
      setPendenteCount(supabaseService.pendingQueue.length);
    }
  };

  // Renderizar diferente dependendo do status
  const statusConfig = {
    conectando: {
      icon: <Loader2 className="w-5 h-5 animate-spin text-blue-500" />,
      label: 'Conectando...',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    pronto: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      label: 'Pronto',
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200'
    },
    aviso: {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      label: 'Aviso',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200'
    },
    erro: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      label: 'Erro',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200'
    }
  };

  const config = statusConfig[status] || statusConfig.conectando;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-3 mb-4`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1">
          <div className={`font-medium ${config.text}`}>
            Supabase • {config.label}
          </div>
          <div className={`text-sm ${config.text} opacity-75 mt-1`}>
            {detalhes}
          </div>
          
          {/* Mostrar usuário se autenticado */}
          {usuario && (
            <div className={`text-sm ${config.text} opacity-75 mt-1`}>
              👤 Autenticado como: {usuario.email}
            </div>
          )}

          {/* Mostrar pendentes */}
          {pendenteCount > 0 && (
            <div className={`text-sm ${config.text} opacity-75 mt-1`}>
              📋 {pendenteCount} operações pendentes de sincronização
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para usar autenticação Supabase em componentes
 */
export function useAuth() {
  const [usuario, setUsuario] = useState(supabaseService.obterUsuarioAtual());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Restaurar sessão
    const restaurar = async () => {
      const session = await supabaseService.restaurarSessao?.();
      setUsuario(supabaseService.obterUsuarioAtual());
    };
    restaurar();

    // Escutar mudanças de auth
    const unsubscribe = supabaseService.onMudanca?.((ev) => {
      if (ev.tipo === 'auth') {
        setUsuario(ev.dados.session?.user || null);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    setCarregando(true);
    setErro('');
    const resultado = await supabaseService.logout();
    if (!resultado.sucesso) {
      setErro(resultado.erro);
    } else {
      setUsuario(null);
    }
    setCarregando(false);
    return resultado;
  };

  return {
    usuario,
    carregando,
    erro,
    estaAutenticado: !!usuario,
    logout
  };
}

export default StatusSupabase;
