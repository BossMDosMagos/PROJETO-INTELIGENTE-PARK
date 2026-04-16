-- =====================================================================
-- DESABILITAR RLS TEMPORARIAMENTE, INSERIR DADOS, E REABILITAR
-- =====================================================================

-- 1. Desabilitar RLS em politicas_acesso temporariamente
alter table politicas_acesso disable row level security;

-- 2. Inserir os 4 níveis de acesso
insert into politicas_acesso (nivel_acesso, pode_criar_unidade, pode_editar_unidade, pode_deletar_unidade, pode_ver_financeiro_geral, pode_ver_financeiro_unidade, pode_registrar_entrada, pode_registrar_saida, pode_cancelar_ticket, pode_gerenciar_mensalistas, pode_gerar_relatorios, pode_fechar_caixa, pode_ver_auditoria, pode_editar_tarifa, pode_exportar_dados, pode_importar_dados, pode_gerenciar_usuarios, pode_acessar_operador, pode_acessar_admin)
values 
  ('MASTER', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
  ('ADMIN', false, true, false, false, true, true, true, true, true, true, true, false, true, true, false, false, true, false),
  ('SUPERVISOR', false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, true, false),
  ('OPERADOR', false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, true, false)
on conflict (nivel_acesso) do nothing;

-- 3. Reabilitar RLS
alter table politicas_acesso enable row level security;

-- 4. Criar policy de leitura para todos autenticados
drop policy if exists "public read policies" on politicas_acesso;
create policy "public read policies" on politicas_acesso
  for select
  to authenticated
  using (true);

-- =====================================================================
-- Mensagem de sucesso
-- =====================================================================
-- ✅ Política desabilitada, dados inseridos, política reabilitada
-- ✅ 4 níveis de acesso agora existem no banco
-- ✅ Todos usuários autenticados podem ler politicas_acesso
