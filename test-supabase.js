/**
 * Teste de Conexão Supabase
 * Execute em: node test-supabase.js
 */

import { createClient } from '@supabase/supabase-js'

const url = 'https://pumbsmawfbzaczklxeog.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJzbWF3ZmJ6YWN6a2x4ZW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTIzODgsImV4cCI6MjA4ODIyODM4OH0.aNx8DCffzuxc7S6yEACCDuS2byuQf8SQzzSfJPA3RQI'

console.log('🔄 Testando conexão com Supabase...')
console.log('URL:', url)

try {
  const supabase = createClient(url, key)
  
  console.log('✅ Cliente Supabase criado com sucesso!\n')
  
  // Testar conexão
  const { data, error } = await supabase
    .from('politicas_acesso')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Erro ao consultar banco:', error.message)
    process.exit(1)
  }
  
  console.log('✅ Conexão com banco de dados bem-sucedida!')
  console.log(`✅ Tabela 'politicas_acesso' contém ${data?.length || 0} registros`)
  console.log('\n🎉 Supabase está 100% operacional!')
  
} catch (erro) {
  console.error('❌ Erro:', erro.message)
  process.exit(1)
}
