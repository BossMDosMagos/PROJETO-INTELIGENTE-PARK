/**
 * Teste Visual de Conexão Supabase
 * Adicionar temporariamente ao App.jsx para testar
 */

import React, { useEffect, useState } from 'react'
import { supabaseService } from '../services/supabaseService'

export function TesteSupabase() {
  const [status, setStatus] = useState('testando...')
  const [erro, setErro] = useState(null)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const testar = async () => {
      try {
        // Esperar inicialização se ainda não tiver
        let tentativasRestantes = 10
        while (!supabaseService.initialized && tentativasRestantes > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
          tentativasRestantes--
        }

        // 1. Verificar inicialização
        if (!supabaseService.initialized) {
          setErro('❌ Supabase não foi inicializado após 5 segundos')
          setStatus('⏳ Aguardando...')
          return
        }

        // 2. Obter usuário
        const user = supabaseService.obterUsuarioAtual()
        setUsuario(user)

        if (user) {
          setStatus('✅ Autenticado!')
        } else {
          setStatus('✅ Supabase pronto')
        }
        setErro(null)

      } catch (erro) {
        setErro(erro.message)
        setStatus('❌ Erro')
      }
    }

    testar()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-white rounded-lg shadow-xl border-2 border-blue-500 z-50">
      <h3 className="font-bold text-lg mb-2">🧪 Teste Supabase</h3>
      
      <div className="space-y-2 text-sm">
        <p className="font-medium">{status}</p>
        
        {usuario && (
          <p className="text-green-700">
            👤 Autenticado: {usuario.email}
          </p>
        )}
        
        {erro && (
          <div className="bg-yellow-50 p-2 rounded text-yellow-800 whitespace-pre-wrap">
            {erro}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Se vir "tabelas não criadas", execute migrations no Supabase Dashboard →  SQL Editor
      </p>
    </div>
  )
}

export default TesteSupabase
