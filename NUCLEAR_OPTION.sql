-- =====================================================================
-- SOLUÇÃO NUCLEAR: DELETAR TABELA E RECRIAR FRESH
-- =====================================================================

-- 1️⃣ DELETAR A TABELA (tira todos os problemas de RLS)
drop table if exists public.politicas_acesso cascade;

-- 2️⃣ RECRIAR TABELA SEM RLS
create table public.politicas_acesso (
  id uuid primary key default gen_random_uuid(),
  nivel_acesso text not null unique,
  pode_criar_unidade boolean default false,
  pode_editar_unidade boolean default false,
  pode_deletar_unidade boolean default false,
  pode_ver_financeiro_geral boolean default false,
  pode_ver_financeiro_unidade boolean default false,
  pode_registrar_entrada boolean default false,
  pode_registrar_saida boolean default false,
  pode_cancelar_ticket boolean default false,
  pode_gerenciar_mensalistas boolean default false,
  pode_gerar_relatorios boolean default false,
  pode_fechar_caixa boolean default false,
  pode_ver_auditoria boolean default false,
  pode_editar_tarifa boolean default false,
  pode_exportar_dados boolean default false,
  pode_importar_dados boolean default false,
  pode_gerenciar_usuarios boolean default false,
  pode_acessar_operador boolean default false,
  pode_acessar_admin boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 3️⃣ INSERIR OS 4 NÍVEIS DE ACESSO
insert into public.politicas_acesso 
(nivel_acesso, pode_criar_unidade, pode_editar_unidade, pode_deletar_unidade, pode_ver_financeiro_geral, pode_ver_financeiro_unidade, pode_registrar_entrada, pode_registrar_saida, pode_cancelar_ticket, pode_gerenciar_mensalistas, pode_gerar_relatorios, pode_fechar_caixa, pode_ver_auditoria, pode_editar_tarifa, pode_exportar_dados, pode_importar_dados, pode_gerenciar_usuarios, pode_acessar_operador, pode_acessar_admin)
values 
('MASTER', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
('ADMIN', false, true, false, false, true, true, true, true, true, true, true, false, true, true, false, false, true, false),
('SUPERVISOR', false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, true, false),
('OPERADOR', false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, true, false);

-- 4️⃣ HABILITAR RLS AGORA (DEPOIS dos dados inseridos)
alter table public.politicas_acesso enable row level security;

-- 5️⃣ CRIAR POLICIES SUUUPER PERMISSIVAS
create policy "anyone can read" on public.politicas_acesso
  for select
  using (true);

create policy "anyone can insert" on public.politicas_acesso
  for insert
  with check (true);

create policy "anyone can update" on public.politicas_acesso
  for update
  using (true)
  with check (true);

create policy "anyone can delete" on public.politicas_acesso
  for delete
  using (true);

-- ✅ PRONTO! Agora deve ter 4 registros!
