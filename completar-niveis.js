import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const niveis = [
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
    pode_acessar_admin: true,
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
    pode_acessar_admin: false,
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
    pode_acessar_admin: false,
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
    pode_acessar_admin: false,
  },
];

async function completarNiveis() {
  console.log('📋 Verificando registros existentes...\n');

  // Ler registros existentes
  const { data, error } = await supabase
    .from('politicas_acesso')
    .select('nivel_acesso');

  if (error) {
    console.error('❌ Erro ao ler politicas_acesso:', error.message);
    return;
  }

  console.log(`✅ Registros existentes: ${data.length}`);
  const existentes = new Set(data.map(r => r.nivel_acesso));
  data.forEach(r => console.log(`   - ${r.nivel_acesso}`));
  console.log('');

  // Identificar quais faltam
  const faltam = niveis.filter(n => !existentes.has(n.nivel_acesso));

  if (faltam.length === 0) {
    console.log('✅ Todos os 4 níveis já existem!');
    return;
  }

  console.log(`⚠️  Faltam ${faltam.length} registros. Tentando inserir...\n`);

  // Inserir um a um pra ver qual falha
  for (const nivel of faltam) {
    const { error: insError } = await supabase
      .from('politicas_acesso')
      .insert([nivel]);

    if (insError) {
      console.error(`❌ Erro ao inserir ${nivel.nivel_acesso}:`);
      console.error(`   ${insError.message}`);
    } else {
      console.log(`✅ Inserido com sucesso: ${nivel.nivel_acesso}`);
    }
  }

  // Verificar resultado final
  console.log('\n📊 Contagem final...');
  const { data: final } = await supabase
    .from('politicas_acesso')
    .select('nivel_acesso');

  console.log(`\n🎯 Total de registros: ${final.length}`);
  final.forEach(r => console.log(`   - ${r.nivel_acesso}`));

  if (final.length === 4) {
    console.log('\n🎉 SUCESSO! Todos os 4 níveis de acesso estão no banco!');
  }
}

completarNiveis().catch(err => console.error('Erro fatal:', err.message));
