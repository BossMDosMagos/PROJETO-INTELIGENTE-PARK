/**
 * Inserir dados iniciais de políticas de acesso
 */

import { createClient } from '@supabase/supabase-js'

const url = 'https://pumbsmawfbzaczklxeog.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJzbWF3ZmJ6YWN6a2x4ZW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTIzODgsImV4cCI6MjA4ODIyODM4OH0.aNx8DCffzuxc7S6yEACCDuS2byuQf8SQzzSfJPA3RQI'

const politicas = [
  {
    nivel_acesso: 'MASTER',
    pode_criar_unidade: true,
    pode_editar_unidade: true,
    pode_deletar_unidade: true,
    pode_ver_financeiro_geral: true,
    pode_ver_financeiro_unidade: true,
    pode_registrar_entrada: true,
    pode_registrar_saida: true,
    pode_cancelar_ticket: true,
    pode_gerenciar_mensalistas: true,
    pode_gerar_relatorios: true,
    pode_fechar_caixa: true,
    pode_ver_auditoria: true,
    pode_editar_tarifa: true,
    pode_exportar_dados: true,
    pode_importar_dados: true,
    pode_gerenciar_usuarios: true,
    pode_acessar_operador: true,
    pode_acessar_admin: true
  },
  {
    nivel_acesso: 'ADMIN',
    pode_criar_unidade: false,
    pode_editar_unidade: true,
    pode_deletar_unidade: false,
    pode_ver_financeiro_geral: false,
    pode_ver_financeiro_unidade: true,
    pode_registrar_entrada: true,
    pode_registrar_saida: true,
    pode_cancelar_ticket: true,
    pode_gerenciar_mensalistas: true,
    pode_gerar_relatorios: true,
    pode_fechar_caixa: true,
    pode_ver_auditoria: false,
    pode_editar_tarifa: true,
    pode_exportar_dados: true,
    pode_importar_dados: false,
    pode_gerenciar_usuarios: false,
    pode_acessar_operador: true,
    pode_acessar_admin: false
  },
  {
    nivel_acesso: 'SUPERVISOR',
    pode_criar_unidade: false,
    pode_editar_unidade: false,
    pode_deletar_unidade: false,
    pode_ver_financeiro_geral: false,
    pode_ver_financeiro_unidade: true,
    pode_registrar_entrada: true,
    pode_registrar_saida: false,
    pode_cancelar_ticket: false,
    pode_gerenciar_mensalistas: true,
    pode_gerar_relatorios: true,
    pode_fechar_caixa: false,
    pode_ver_auditoria: false,
    pode_editar_tarifa: false,
    pode_exportar_dados: false,
    pode_importar_dados: false,
    pode_gerenciar_usuarios: false,
    pode_acessar_operador: true,
    pode_acessar_admin: false
  },
  {
    nivel_acesso: 'OPERADOR',
    pode_criar_unidade: false,
    pode_editar_unidade: false,
    pode_deletar_unidade: false,
    pode_ver_financeiro_geral: false,
    pode_ver_financeiro_unidade: false,
    pode_registrar_entrada: true,
    pode_registrar_saida: true,
    pode_cancelar_ticket: false,
    pode_gerenciar_mensalistas: false,
    pode_gerar_relatorios: false,
    pode_fechar_caixa: false,
    pode_ver_auditoria: false,
    pode_editar_tarifa: false,
    pode_exportar_dados: false,
    pode_importar_dados: false,
    pode_gerenciar_usuarios: false,
    pode_acessar_operador: true,
    pode_acessar_admin: false
  }
]

async function insertPolicies() {
  try {
    const supabase = createClient(url, key)
    
    console.log('🔄 Inserindo 4 níveis de acesso...\n')
    
    for (const politica of politicas) {
      const { data, error } = await supabase
        .from('politicas_acesso')
        .insert([politica])
        .select()
      
      if (error) {
        if (error.message.includes('duplicate')) {
          console.log(`⚠️  ${politica.nivel_acesso} já existe (ignorado)`)
        } else {
          console.error(`❌ Erro ao inserir ${politica.nivel_acesso}:`, error.message)
        }
      } else {
        console.log(`✅ ${politica.nivel_acesso} inserido com sucesso`)
      }
    }
    
    // Verificar final
    const { data, error: selectError } = await supabase
      .from('politicas_acesso')
      .select('*')
    
    if (selectError) {
      console.error('❌ Erro ao verificar:', selectError.message)
      return
    }
    
    console.log(`\n✅ Total de políticas no banco: ${data?.length || 0}`)
    console.log('🎉 Setup completo!\n')
    
  } catch (erro) {
    console.error('❌ Erro:', erro.message)
  }
}

insertPolicies()
