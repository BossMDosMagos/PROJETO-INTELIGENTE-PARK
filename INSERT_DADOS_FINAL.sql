-- =====================================================================
-- SQL DEFINITIVO - INSERIR 4 NÍVEIS DE ACESSO
-- Execute isto NO DASHBOARD (não no terminal)
-- =====================================================================

-- 1️⃣ DESABILITAR RLS
alter table public.politicas_acesso disable row level security;

-- 2️⃣ DELETAR DADOS ANTIGOS (se houver)
delete from public.politicas_acesso;

-- 3️⃣ INSERIR OS 4 NÍVEIS
insert into public.politicas_acesso 
(nivel_acesso, pode_criar_unidade, pode_editar_unidade, pode_deletar_unidade, pode_ver_financeiro_geral, pode_ver_financeiro_unidade, pode_registrar_entrada, pode_registrar_saida, pode_cancelar_ticket, pode_gerenciar_mensalistas, pode_gerar_relatorios, pode_fechar_caixa, pode_ver_auditoria, pode_editar_tarifa, pode_exportar_dados, pode_importar_dados, pode_gerenciar_usuarios, pode_acessar_operador, pode_acessar_admin)
values 
('MASTER', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
('ADMIN', false, true, false, false, true, true, true, true, true, true, true, false, true, true, false, false, true, false),
('SUPERVISOR', false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, true, false),
('OPERADOR', false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, true, false);

-- 4️⃣ REABILITAR RLS
alter table public.politicas_acesso enable row level security;

-- 5️⃣ CRIAR POLICIES (se não existirem)
drop policy if exists "allow select to authenticated" on public.politicas_acesso;
drop policy if exists "allow insert to authenticated" on public.politicas_acesso;
drop policy if exists "allow update to authenticated" on public.politicas_acesso;

create policy "allow select to authenticated" on public.politicas_acesso
  for select to authenticated using (true);

create policy "allow insert to authenticated" on public.politicas_acesso
  for insert to authenticated with check (true);

create policy "allow update to authenticated" on public.politicas_acesso
  for update to authenticated using (true) with check (true);

-- ✅ PRONTO!
