# 🔒 Segurança e Boas Práticas - Supabase

## ⚠️ REGRAS DE OURO

```
1. NUNCA commitar .env ou .env.local
2. NUNCA expor SUPABASE_SERVICE_ROLE_KEY 
3. NUNCA expor SUPABASE_DB_PASSWORD
4. NUNCA commitar tokens de acesso
5. SEMPRE usar GitHub Secrets para CI/CD
6. SEMPRE validar permissões no frontend
7. SEMPRE usar RLS no banco de dados
```

---

## 🔑 Tipos de Chaves

### 1. ANON_KEY (Pública - OK expor no frontend)

```javascript
// Seguro colocar no código git/frontend
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

**Permissões:**
- ✅ Consultar dados (SELECT)
- ✅ Inserir dados (INSERT)
- ✅ Atualizar dados (UPDATE)
- ❌ Contornado RLS ❌
- ❌ Acessar dados privados ❌

**Seguro porque:** Controlado por RLS no banco

---

### 2. SERVICE_ROLE_KEY (Secreto - Apenas servidor/admin)

```javascript
// ⚠️ NUNCA EXPOR!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...
```

**Permissões:**
- ✅ TUDO (contorna RLS)
- ✅ Modificar schema
- ✅ Deletar dados

**Usar apenas em:**
- ✅ Backend Node.js
- ✅ GitHub Actions (com Secrets)
- ✅ Scripts administrativos
- ❌ Frontend
- ❌ Código público

---

### 3. ACCESS_TOKEN (Secreto - CLI e Admin)

```bash
# Para Supabase CLI fazer login
sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Salvar em:**
- ✅ 1Password / Bitwarden
- ✅ GitHub Secrets
- ✅ Variável de ambiente local
- ❌ Git
- ❌ Código

---

## 📋 Checklist Segurança

### Antes de Commitar

```bash
# Verificar variáveis sensíveis
git diff --cached | grep -i "key\|password\|token"

# Verificar .env.local (deve estar em .gitignore)
ls -la .env*

# Verificar supabase.json
cat supabase.json | grep -v "projectId"
```

### Repositório GitHub

```
Settings → Secrets and variables → Actions

Adicionar:
  ✅ SUPABASE_ACCESS_TOKEN = sbp_xxxxx
  ✅ SUPABASE_DB_PASSWORD = sua-senha
  ✅ SUPABASE_PROJECT_ID = abc123def456

NÃO adicionar .env.local (Git sync)
```

### GitHub Secrets - Como Usar

Em `.github/workflows/*, use:

```yaml
env:
  SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
  SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
  SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

---

## 🛡️ RLS (Row Level Security)

### Verificar RLS está habilitado

```sql
-- No Supabase Dashboard → SQL Editor

SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Resultado esperado:
-- public | tickets | t
-- public | unidades | t
-- public | perfis | t
-- public | mensalistas | t
```

### Exemplo: Policy correta

```sql
-- Usuário só vê seus próprios tickets
CREATE POLICY "users_see_own_tickets" ON tickets
  FOR SELECT
  USING (
    operador_entrada_id = auth.uid()
    OR
    id_unidade = (
      SELECT id_unidade_principal 
      FROM perfis 
      WHERE user_id = auth.uid()
    )
  );
```

---

## 🔐 Fluxo Seguro de Desenvolvimento

### 1️⃣ Desenvolvimento Local

```bash
#1. Clonar repo
git clone https://github.com/seu-repo.git
cd PROJETO-INTELIGENTE-PARK

# 2. Criar .env.local (NÃO commitado!)
cat > .env.local << EOF
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_DB_PASSWORD=sua-senha
SUPABASE_ACCESS_TOKEN=sbp_...
SUPABASE_PROJECT_ID=abc123
EOF

# 3. Verificar .gitignore contém .env.local
grep ".env.local" .gitignore  # Deve listar

# 4. Dev normalmente
npm install
npm run db:start
npm run dev
```

### 2️⃣ Commitar Mudanças

```bash
# Só fazer commit do schema (migrations), NÃO de secrets!
git status  # Verificar NÃO tem .env.local

git add supabase/migrations/20260304_xxx.sql
git add docs/
git add src/

git commit -m "feat: add migration"
git push origin feature-branch

# NUNCA:
# git add .env.local
# git add supabase/.temp/
```

### 3️⃣ GitHub Actions Deploy (Automático)

```yaml
# .github/workflows/supabase-migration.yml

env:
  SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
  SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}

# Secrets nunca aparecem nos logs
# Nunca são commitados
# Nunca são expostos
```

---

## 🚨 Erros Comuns - Evitar

### ❌ Erro 1: Commitar segredos

```bash
# ERRADO!
git add .env
git commit -m "add env vars"
git push

# CORRETO!
echo ".env" >> .gitignore
git add .gitignore
git commit -m "add env to gitignore"
```

### ❌ Erro 2: Usar SERVICE_ROLE no frontend

```javascript
// ❌ ERRADO - Expõe chave secreto
const supabase = createClient(
  url, 
  SERVICE_ROLE_KEY  // ⚠️ NUNCA!
);

// ✅ CORRETO - Usa chave pública
const supabase = createClient(
  url,
  ANON_KEY  // ✅ OK
);
```

### ❌ Erro 3: Confiar apenas em validação frontend

```javascript
// ❌ INSEGURO - Só valida no frontend
if (user.role === 'ADMIN') {
  // Permite ação
}

// ✅ SEGURO - Valida no RLS + frontend
// 1. Frontend verifica permissão
// 2. RLS verifica no banco também
// 3. Query bloqueada se RLS falhar
const { data, error } = await supabase
  .from('tickets')
  .delete()
  .eq('id', ticketId);
// Retorna erro se RLS bloquear
```

### ❌ Erro 4: RLS desabilidado

```sql
-- ❌ ERRADO - RLS desabilidado
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ✅ CORRETO - RLS habilitado
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verificar
SELECT * FROM pg_tables 
WHERE tablename = 'users' AND rowsecurity = true;
```

---

## 🔄 Rotação de Secrets

### A cada trimestre (13 semanas):

1. **Gerar novo Access Token**
   - https://supabase.com/dashboard/account/tokens
   - Delete old, create new
   - Update GitHub Secrets

2. **Rotar API Keys** (se necessário)
   - Dashboard → Project settings → API
   - Regenerate keys
   - Update .env.local

3. **Auditar Logs**
   ```bash
   # Ver quem acessou
   npx supabase logs --follow
   
   # Arquivo SQL para auditoria
   SELECT * FROM auditoria 
   WHERE created_at > NOW() - INTERVAL '90 days'
   ORDER BY created_at DESC;
   ```

---

## 📝 Auditoria

### Logs de autenticação

```javascript
// Automático no service
await policiaAcessoService.registrarAuditoria(
  'tickets',
  'UPDATE',
  ticketId,
  antes,
  depois,
  'Alterado valor de R$ 10 para R$ 15'
);
```

### Ver logs

```sql
SELECT 
  usuario_nome,
  operacao,
  tabela_afetada,
  created_at,
  descricao,
  ip_address,
  user_agent
FROM auditoria
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

## 🆘 Se Acreditar que Houve Vazamento

1. **Imediatamente:**
   ```bash
   # Revogar chave comprometida
   # Supabase Dashboard → Project settings → API
   # Regenerate Keys
   ```

2. **Check:**
   ```bash
   # Ver logs de acesso suspeito
   SELECT * FROM auditoria 
   WHERE ip_address NOT IN (seus_ips)
   ORDER BY created_at DESC;
   ```

3. **Notify:**
   - Avise usuários
   - Reset senhas
   - Revogue tokens

4. **Habilitar 2FA:**
   - Supabase dashboard
   - Account → Two-factor authentication

---

## 📚 Referências

- [Supabase Security](https://supabase.com/docs/guides/security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OWASP Top 10](https://owasp.org/Top10/)

---

## ✅ Recomendações Finais

1. **Use 1Password / Bitwarden** para guardar secrets
2. **Enable 2FA** na sua conta Supabase
3. **Monitore auditoria** regularmente
4. **Teste RLS** com diferentes usuários
5. **Valide** sempre no backend
6. **Nunca trust** só em frontend
7. **Backup automático** configurado
8. **Logs centralizados** (Sentry/LogRocket)
