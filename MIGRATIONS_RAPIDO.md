# ⚡ GUIA RÁPIDO - Criar Tabelas no Supabase

## Status Atual ✅

✅ **Variáveis de ambiente preenchidas** - `.env.local` está configurado  
✅ **App conectando ao Supabase** - Cliente JS está funcionando  
✅ **Teste visual on** - Veja o widget "🧪 Teste Supabase" na app  

**Próximo passo:** Criar as 8 tabelas do banco de dados

---

## 🚀 Como Criar as Tabelas (3 minutos)

### 1️⃣ Abra o SQL Editor

https://supabase.com/dashboard/project/pumbsmawfbzaczklxeog/sql

### 2️⃣ Clique "New query"

![New Query Button](https://via.placeholder.com/300x50?text=New+Query)

### 3️⃣ Cole TODO este SQL

```sql
-- Copie TUDO do arquivo supabase/migrations/20260304_001_initial_schema.sql
-- E cole aqui no SQL Editor

-- Dica: Se preferir, pode abrir o arquivo na sua IDE
-- Localização: c:\PROJETO-INTELIGENTE-PARK\supabase\migrations\20260304_001_initial_schema.sql
```

**Ou copie e cole diretamente abaixo:**

```sql
-- =====================================================================
-- SCHEMA INICIAL - INTELIGENTE PARK
-- =====================================================================

-- =====================================================================
-- 1. POLITICAS_ACESSO - Matriz de Permissões
-- =====================================================================
create table if not exists politicas_acesso (
  id uuid primary key default auth.uid(),
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
-- RLS POLICIES
-- =====================================================================

-- Política MASTER (acesso completo)
create policy "MASTER access all" on politicas_acesso
  for all using (true);

create policy "MASTER access all" on unidades
  for all using (true);

create policy "MASTER access all" on perfis
  for all using (true);

create policy "MASTER access all" on tickets
  for all using (true);

create policy "MASTER access all" on mensalistas
  for all using (true);

create policy "MASTER access all" on tarifas
  for all using (true);

create policy "MASTER access all" on auditoria
  for all using (true);

create policy "MASTER access all" on sync_log
  for all using (true);

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

create trigger update_politicas_acesso_updated_at before update on politicas_acesso
  for each row execute function update_updated_at_column();

create trigger update_unidades_updated_at before update on unidades
  for each row execute function update_updated_at_column();

create trigger update_perfis_updated_at before update on perfis
  for each row execute function update_updated_at_column();

create trigger update_tickets_updated_at before update on tickets
  for each row execute function update_updated_at_column();

create trigger update_mensalistas_updated_at before update on mensalistas
  for each row execute function update_updated_at_column();

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

create trigger normalizar_placa_ticket before insert or update on tickets
  for each row execute function normalizar_placa_ticket();

-- INDICESS para performance
create index idx_tickets_placa on tickets(placa);
create index idx_tickets_status on tickets(status);
create index idx_tickets_unidade on tickets(unidade_id);
create index idx_mensalistas_placa on mensalistas(placa);
create index idx_mensalistas_cpf on mensalistas(cpf);
create index idx_perfis_usuario on perfis(usuario_id);
create index idx_auditoria_usuario on auditoria(usuario_id);
create index idx_auditoria_operacao on auditoria(operacao);
```

### 4️⃣ Clique "Run"

Isso vai criar TUDO em segundos!

---

## ✅ Após Executar o SQL

1. **Verifique no navegador:**
   - Abra http://localhost:3002/PROJETO-INTELIGENTE-PARK/
   - Procure no canto inferior direito o widget "🧪 Teste Supabase"
   - Deve mostrar: **"✅ 100% Funcional!"**

2. **Se vir:"⚠️ Tabela não existe ainda":**
   - Significa que uma das tabelas não foi criada
   - Volte no SQL Editor e verifique se o SQL rodou sem erros
   - Execute apenas a parte CREATE TABLE da tabela faltante

3. **Próximo:** Criar usuários de teste para testar login!

---

## 📋 Checklist

- [ ] Abrir SQL Editor do Supabase
- [ ] Colar e executar SQL
- [ ] Testar no navegador (🧪 widget)
- [ ] Ver "✅ 100% Funcional"
- [ ] Próximo: Criar usuários de teste

---

## 🆘 Se der erro?

**Erro: "relation "politicas_acesso" already exists"**
→ As tabelas já foram criadas. Ignore ou delete e rerun.

**Erro: "permission denied"**
→ Verifique se seu usuário Supabase tem permissão de admin

**Erro: outro qualquer**
→ Copie a mensagem e busque na documentação Supabase

---

**Pronto! Após executar, volte me avisar que rodou tudo ok!** ✅
