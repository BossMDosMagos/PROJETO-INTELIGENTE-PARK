import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../useLocalStorage';
import { supabaseService } from '../services/supabaseService';

/**
 * Hook para gerenciar autenticação
 */
export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const { sucesso, dados } = await supabaseService.verificarSessao();
        if (sucesso && dados) {
          setUsuario(dados);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setCarregando(false);
      }
    };

    verificarSessao();
  }, []);

  const login = useCallback(async (identificador, senha) => {
    setErro(null);
    setCarregando(true);
    
    try {
      const { sucesso, dados, erro: erroLogin } = await supabaseService.login(identificador, senha);
      
      if (sucesso && dados) {
        setUsuario(dados);
        return { sucesso: true, dados };
      } else {
        setErro(erroLogin || 'Erro ao fazer login');
        return { sucesso: false, erro: erroLogin };
      }
    } catch (error) {
      const mensagem = error.message || 'Erro desconhecido';
      setErro(mensagem);
      return { sucesso: false, erro: mensagem };
    } finally {
      setCarregando(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabaseService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUsuario(null);
    }
  }, []);

  const temPermissao = useCallback((perfilNecessario) => {
    if (!usuario) return false;
    
    const hierarquia = {
      master: 4,
      admin: 3,
      supervisor: 2,
      operador: 1
    };
    
    const nivelUsuario = hierarquia[usuario.perfil] || 0;
    const nivelNecessario = hierarquia[perfilNecessario] || 0;
    
    return nivelUsuario >= nivelNecessario;
  }, [usuario]);

  return {
    usuario,
    carregando,
    erro,
    login,
    logout,
    temPermissao,
    isAuthenticated: !!usuario
  };
}
