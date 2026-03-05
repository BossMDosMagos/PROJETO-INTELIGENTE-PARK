-- =====================================================================
-- SCHEMA INICIAL - INTELIGENTE PARK (Versão Simplificada)
-- =====================================================================

-- =====================================================================
-- 1. POLITICAS_ACESSO - Matriz de Permissões
-- =====================================================================
create table if not exists politicas_acesso (
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

-- =====================================================================
-- 2. UNIDADES - Estacionamentos/Filiais
-- =====================================================================
create table if not exists unidades (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text unique not null,
  endereco text,
  cidade text,
  estado text,
  cep text,
  telefone text,
  email text,
  responsavel text,
  capacidade_total integer,
  vagas_livres integer,
  status text default 'ativo',
  deleted_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =====================================================================
-- 3. PERFIS - Usuários do Sistema
-- =====================================================================
create table if not exists perfis (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id) on delete cascade,
  nome_completo text,
  telefone text,
  unidade_id uuid references unidades(id),
  nivel_acesso text not null,
  status text default 'ativo',
  ultimo_acesso timestamp,
  deleted_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(usuario_id)
);

-- =====================================================================
-- 4. TICKETS - Registros de Entrada e Saída
-- =====================================================================
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references unidades(id),
  placa text not null,
  modelo text,
  cor text,
  tipo_veiculo text,
  hora_entrada timestamp default now(),
  hora_saida timestamp,
  duracao_minutos integer,
  valor_cobrado decimal(10,2),
  metodo_pagamento text,
  operador_id uuid references auth.users(id),
  status text default 'ativa',
  observacoes text,
  deleted_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =====================================================================
-- 5. MENSALISTAS - Clientes de Passes Mensais
-- =====================================================================
create table if not exists mensalistas (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references unidades(id),
  nome text not null,
  cpf text unique not null,
  placa text unique not null,
  modelo text,
  cor text,
  whatsapp text,
  email text,
  data_vencimento date,
  status text default 'ativo',
  preco_mensal decimal(10,2),
  observacoes text,
  deleted_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =====================================================================
-- 6. TARIFAS - Preços por Unidade
-- =====================================================================
create table if not exists tarifas (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references unidades(id),
  tipo_veiculo text,
  tempo_fracao integer,
  valor_fracao decimal(10,2),
  valor_teto decimal(10,2),
  ciclo_teto integer,
  status text default 'ativo',
  deleted_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =====================================================================
-- 7. AUDITORIA - Log de Mudanças
-- =====================================================================
create table if not exists auditoria (
  id uuid primary key default gen_random_uuid(),
  tabela text not null,
  operacao text not null,
  registro_id uuid,
  usuario_id uuid references auth.users(id),
  dados_antes jsonb,
  dados_depois jsonb,
  descricao text,
  created_at timestamp default now()
);

-- =====================================================================
-- 8. SYNC_LOG - Histórico de Sincronização Offline
-- =====================================================================
create table if not exists sync_log (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id),
  operacoes_processadas integer,
  operacoes_falhadas integer,
  timestamp_inicio timestamp,
  timestamp_fim timestamp,
  observacoes text,
  created_at timestamp default now()
);

-- =====================================================================
-- ENABLE RLS (Row Level Security)
-- =====================================================================
alter table politicas_acesso enable row level security;
alter table unidades enable row level security;
alter table perfis enable row level security;
alter table tickets enable row level security;
alter table mensalistas enable row level security;
alter table tarifas enable row level security;
alter table auditoria enable row level security;
alter table sync_log enable row level security;

-- =====================================================================
-- BASIC RLS POLICIES (sem comparações complexas)
-- =====================================================================

-- Permitir leitura de politicas_acesso para todos autenticados
create policy "public read policies" on politicas_acesso
  for select
  to authenticated
  using (true);

-- Permitir CRUD completo para usuários autenticados (MASTER tem controle full no código)
create policy "authenticated all" on unidades
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated all" on perfis
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated all" on tickets
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated all" on mensalistas
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated all" on tarifas
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated all" on auditoria
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated all" on sync_log
  for all
  to authenticated
  using (true)
  with check (true);

-- =====================================================================
-- TRIGGERS
-- =====================================================================

-- Atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger para politicas_acesso
drop trigger if exists update_politicas_acesso_updated_at on politicas_acesso;
create trigger update_politicas_acesso_updated_at before update on politicas_acesso
  for each row execute function update_updated_at_column();

-- Trigger para unidades
drop trigger if exists update_unidades_updated_at on unidades;
create trigger update_unidades_updated_at before update on unidades
  for each row execute function update_updated_at_column();

-- Trigger para perfis
drop trigger if exists update_perfis_updated_at on perfis;
create trigger update_perfis_updated_at before update on perfis
  for each row execute function update_updated_at_column();

-- Trigger para tickets
drop trigger if exists update_tickets_updated_at on tickets;
create trigger update_tickets_updated_at before update on tickets
  for each row execute function update_updated_at_column();

-- Trigger para mensalistas
drop trigger if exists update_mensalistas_updated_at on mensalistas;
create trigger update_mensalistas_updated_at before update on mensalistas
  for each row execute function update_updated_at_column();

-- Trigger para tarifas
drop trigger if exists update_tarifas_updated_at on tarifas;
create trigger update_tarifas_updated_at before update on tarifas
  for each row execute function update_updated_at_column();

-- Normalizar placa em TICKETS
create or replace function normalizar_placa_ticket()
returns trigger as $$
begin
  new.placa = upper(trim(new.placa));
  return new;
end;
$$ language plpgsql;

drop trigger if exists normalizar_placa_ticket on tickets;
create trigger normalizar_placa_ticket before insert or update on tickets
  for each row execute function normalizar_placa_ticket();

-- =====================================================================
-- INDEXES para performance
-- =====================================================================
create index if not exists idx_tickets_placa on tickets(placa);
create index if not exists idx_tickets_status on tickets(status);
create index if not exists idx_tickets_unidade on tickets(unidade_id);
create index if not exists idx_mensalistas_placa on mensalistas(placa);
create index if not exists idx_mensalistas_cpf on mensalistas(cpf);
create index if not exists idx_perfis_usuario on perfis(usuario_id);
create index if not exists idx_auditoria_usuario on auditoria(usuario_id);
create index if not exists idx_auditoria_operacao on auditoria(operacao);

-- =====================================================================
-- INSERT POLÍTICAS BÁSICAS
-- =====================================================================
insert into politicas_acesso (nivel_acesso, pode_criar_unidade, pode_editar_unidade, pode_deletar_unidade, pode_ver_financeiro_geral, pode_ver_financeiro_unidade, pode_registrar_entrada, pode_registrar_saida, pode_cancelar_ticket, pode_gerenciar_mensalistas, pode_gerar_relatorios, pode_fechar_caixa, pode_ver_auditoria, pode_editar_tarifa, pode_exportar_dados, pode_importar_dados, pode_gerenciar_usuarios, pode_acessar_operador, pode_acessar_admin)
values 
  ('MASTER', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
  ('ADMIN', false, true, false, false, true, true, true, true, true, true, true, false, true, true, false, false, true, false),
  ('SUPERVISOR', false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, true, false),
  ('OPERADOR', false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, true, false)
on conflict (nivel_acesso) do nothing;

-- =====================================================================
-- FIM DO SCHEMA
-- =====================================================================
-- ✅ Todas as 8 tabelas criadas
-- ✅ RLS habilitado
-- ✅ Policies básicas criadas
-- ✅ Triggers de atualização automática
-- ✅ Indexes para performance
-- ✅ Dados iniciais (4 níveis de acesso)
-- ✅ Pronto para uso!
