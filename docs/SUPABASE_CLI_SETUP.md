# Setup e Controle do Supabase CLI

## 🚀 Instalação Rápida

A CLI já foi instalada como devDependency:

```bash
# Verificar versão
npx supabase --version

# Ver ajuda
npx supabase help
```

---

## 🔑 Passo 1: Login no Supabase

```bash
# Login com sua conta do Supabase
npx supabase login

# Será aberta janela do navegador
# Cole o token de acesso gerado em https://supabase.com/dashboard/account/tokens
```

**Como gerar token:**
1. Vai em https://supabase.com/dashboard
2. Account → Access Tokens
3. Gere novo token (salvo em local seguro!)
4. Cole no terminal quando solicitado

---

## 📋 Passo 2: Vincular Projeto

```bash
# Listar projetos disponíveis
npx supabase projects list

# Vincular projeto (use seu projectId)
npx supabase link --project-ref xxxx

# Verificar se está vinculado
npx supabase status
```

Será pedido:
- **Supabase database password**: Senha do banco que você criou
- **Database URL**: Deixa automaticamente detectar

---

## 🗄️ Passo 3: Gerenciar Migrações

### Listar migrações

```bash
npx supabase migration list
```

Mostra:
- Data/hora da migração
- Status (APPLIED, PENDING, etc)
- Nome do arquivo

### Aplicar migrações

```bash
# Aplicar todas as migrações pendentes
npx supabase migration up

# Aplicar com verbose
npx supabase migration up --verbose
```

### Criar nova migração

```bash
# Criar arquivo de migração vazio
npx supabase migration new add_column_example

# Arquivo criado em: supabase/migrations/20260304_123456_add_column_example.sql
# Edite o arquivo e adicione seu SQL

# Aplicar
npx supabase migration up
```

---

## 🔄 Passo 4: Sincronizar Schema

### Pull (Descarregar schema do Supabase)

Se alterou o schema diretamente no Dashboard:

```bash
# Baixar schema do Supabase
npx supabase db pull

# Cria/atualiza: supabase/migrations/20260304_234056_remote_schema.sql
```

### Push (Enviar migrações para Supabase)

```bash
# Enviar migrações locais para produção
npx supabase migration up --project-ref xxxx

# Verificar status
npx supabase migration list --project-ref xxxx
```

---

## 🌱 Passo 5: Seed Data

### Aplicar dados iniciais

```bash
# Executar arquivo seed.sql
npx supabase db push --force

# Ou manualmente
npx supabase start
# Depois abrir: http://localhost:54323 (Studio)
# Ir em SQL Editor → Cole supabase/seed.sql → Run
```

---

## 💻 Passo 6: Desenvolvimento Local

### Iniciar Supabase localmente

```bash
# Começar containers local
npx supabase start

# Mostra URLs:
# API URL: http://localhost:54321
# GraphQL URL: http://localhost:54321/graphql/v1
# Realtime URL: ws://localhost:54321/realtime/v1
# Database URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio: http://localhost:54323
```

### Parar Supabase local

```bash
npx supabase stop
```

### Resetar banco local

```bash
npx supabase reset

# Reaplica todas as migrações + seed data
```

---

## 🔐 Passo 7: Gerenciar Secrets

### Listar secrets

```bash
npx supabase secrets list
```

### Adicionar secret

```bash
# Interativo
npx supabase secrets set

# Direto
npx supabase secrets set STRIPE_KEY=sk_live_xxxxx DATABASE_URL=postgresql://...
```

### Remover secret

```bash
npx supabase secrets unset SECRET_NAME
```

### Sincronizar .env.local

```bash
# Pull secrets para .env.local
npx supabase secrets pull > .env.local
```

⚠️ Não commitar `.env.local`!

---

## 📊 Passo 8: Monitorar Banco

### Conectar com ferramenta SQL

**DBeaver, pgAdmin, etc:**

```
Host: seu-projeto.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: (sua senha)
SSL Mode: require
```

**Ou via CLI diretamente:**

```bash
# Listar dados
npx supabase db pull

# Executar query customizada
npx supabase sql -f query.sql
```

---

## 🔍 Passo 9: Verificar Migrações

```bash
# Ver migrações aplicadas
npx supabase migration list

# Ver detalhes de uma migração
cat supabase/migrations/20260304_001_initial_schema.sql

# Ver histórico completo
npx supabase migration list --verbose

# Ver schema atual
npx supabase db pull --schema-only
```

---

## 🚀 Passo 10: Deploy em Produção

### Preparar para deploy

```bash
# 1. Verificar migrações pendentes localmente ANTES de push
npx supabase migration list

# 2. Testar migrações localmente
npx supabase reset

# 3. Commit migrações ao Git
git add supabase/migrations/
git commit -m "feat: new migration"
git push origin main

# GitHub Actions pode executar automaticamente
```

### CI/CD no GitHub Actions

Vamos criar no próximo passo um workflow que:
- ✅ Roda migrações automaticamente
- ✅ Testa schema
- ✅ Valida queries
- ✅ Deploy em produção

---

## 📝 Scripts npm Recomendados

Adicione ao `package.json`:

```json
{
  "scripts": {
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:reset": "supabase reset",
    "db:new-migration": "supabase migration new",
    "db:migrate": "supabase migration up",
    "db:pull": "supabase db pull",
    "db:push": "supabase db push",
    "db:seed": "supabase seed restore supabase/seed.sql",
    "db:secrets-pull": "supabase secrets pull",
    "db:secrets-set": "supabase secrets set",
    "db:status": "supabase status",
    "db:logs-api": "supabase functions logs",
    "db:sql": "supabase sql -f"
  }
}
```

**Usar:**
```bash
npm run db:start
npm run db:reset
npm run db:migrate
npm run db:status
```

---

## 🔄 Fluxo de Desenvolvimento Completo

### 1️⃣ Começar trabalho

```bash
npm run db:start           # Inicia Supabase local
npm run dev               # Começa app local
# http://localhost:3001   # Frontend
# http://localhost:54323  # Studio (banco visual)
```

### 2️⃣ Fazer alteração no schema

```bash
# Opção A: Editar diretamente no SQL
cat supabase/migrations/20260304_999_add_new_column.sql
# Adicione seu SQL

npm run db:migrate        # Aplica mudança

# Opção B: Editar no Studio
# http://localhost:54323 → SQL Editor → Edite → Run
# Depois:
npm run db:pull           # Baixa mudança para arquivo
git add supabase/migrations/
git commit -m "feat: add new column"
```

### 3️⃣ Testar a mudança

```bash
# Frontend testa contra DB local
npm run dev

# Tudo funcionando? Commit!
git push origin feature-branch

# GitHub Actions testa automaticamente
```

### 4️⃣ Aprovar e fazer merge

```bash
# PR aprovada em https://github.com/seu-repo/pulls
git checkout main
git merge feature-branch
git push origin main

# GitHub Actions faz deploy automático em produção!
```

---

## ⚠️ Segurança - Checklist

- [ ] `.env.local` em `.gitignore`
- [ ] Secrets **nunca** commitados
- [ ] Database password **nunca** em repositório
- [ ] Token de acesso Supabase em **1Password** ou **Vercel**
- [ ] .supabaserc **não** contém dados sensíveis
- [ ] RLS habilitado em todas as tabelas
- [ ] Policies aplicadas corretamente

---

## 🆘 Troubleshooting

### Erro: "Project ref not found"

```bash
npx supabase link --project-ref xxxxx
# Copie do dashboard: https://supabase.com/dashboard/project/xxxxx
```

### Erro: "Database password is incorrect"

```bash
npx supabase link  # Vincula de novo pedindo senha
```

### Migrações não aplicaram

```bash
npx supabase migration list  # Ver status
npx supabase migration up --verbose  # Ver erro específico
```

### Banco local corrompido

```bash
npx supabase stop
npx supabase reset  # Recria tudo
```

### Precisar ver logs

```bash
npx supabase start --verbose

# Em outro terminal
npx supabase logs  # Logs em tempo real
```

---

## 📚 Próximas Migrações

Quando precisar adicionar novos campos/tabelas:

```bash
# 1. Criar arquivo
npx supabase migration new add_user_preferences

# 2. Editar supabase/migrations/20260304_xxx_add_user_preferences.sql
# Adicione ALTER TABLE ou CREATE TABLE

# 3. Testar localmente
npm run db:reset

# 4. Commit
git add supabase/migrations/20260304_xxx_add_user_preferences.sql
git commit -m "feat: add user preferences migration"

# 5. Push
git push origin main

# 6. Observar deploy https://github.com/seu-repo/actions
```

---

## 🎯 Resumo de Comandos Essenciais

```bash
# Setup
npx supabase login
npx supabase link --project-ref xxxxx

# Desenvolvimento
npm run db:start
npm run db:reset
npm run db:migrate
npm run db:pull

# Deploy
npx supabase migration list
npx supabase migration up

# Debug
npm run db:status
npx supabase logs
```
