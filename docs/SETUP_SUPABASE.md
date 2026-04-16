# Guia de Setup Supabase - Sistema Inteligente Park

## 🚀 Pré-requisitos

- Conta Supabase (https://supabase.com)
- Projeto criado no Supabase
- Node.js e npm instalados

## 📋 Passo 1: Criar Projeto Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em "New project"
3. Preencha:
   - **Project name**: `inteligente-park-prod` ou similar
   - **Password**: Guarde em local seguro
   - **Region**: `South America (são paulo)` para melhor latência
4. Aguarde criação (siga o progresso na dashboard)

---

## 🗄️ Passo 2: Criar Schema

### Executar SQL Schema

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em "New Query"
3. Cole todo o conteúdo do arquivo: `database/schema.sql`
4. Clique **"Run"** (Ctrl+Enter)
5. ✅ Aguarde confirmação (3-5 segundos)

**Verificação:**
- Vá em **Table Editor**
- Você deve ver as tabelas:
  - `politicas_acesso` (com 4 linhas - MASTER, ADMIN, SUPERVISOR, OPERADOR)
  - `unidades` (vazia)
  - `perfis` (vazia)
  - `tickets` (vazia)
  - `mensalistas` (vazia)
  - `tarifas` (vazia)
  - `auditoria` (vazia)
  - `sync_log` (vazia)

---

## 🔑 Passo 3: Configurar Autenticação

### 3a. Enable Email Authentication

1. Supabase Dashboard → **Authentication** → **Providers**
2. Ative **Email** (geralmente já está)
3. Configure:
   - **Autoconfirm email**: Desativado (para controle)
   - **Double confirm changes**: Ativado (segurança)

### 3b. Configurar URL de Callback (GitHub Pages)

1. Em **Authentication** → **URL Configuration**
2. Adicione em **Redirect URLs**:
   ```
   https://bossmdosmagos.github.io/PROJETO-INTELIGENTE-PARK/
   https://bossmdosmagos.github.io/PROJETO-INTELIGENTE-PARK/admin
   http://localhost:3001/admin
   ```

---

## 🔐 Passo 4: Habilitar Row Level Security (RLS)

1. Vá em **Authentication** → **Policies**
2. Já devem estar com RLS habilitado (feito pelo schema.sql)

**Verificação de Permissões:**
- Table Editor → Clique em table `tickets`
- À direita, veja "RLS" com o status
- Deve aparecer "🔒 RLS na tabela mas 0 policies" (vamos adicionar policies)

### Adicionar Policies Manualmente (se não criadas automaticamente)

Se as policies não foram criadas pelo schema, vá em:

1. **SQL Editor** → **New Query**
2. Cole as políticas do arquivo `database/schema.sql` (seção 8. ROW LEVEL SECURITY)
3. Execute

---

## 📦 Passo 5: Configurar Variáveis de Ambiente

### Obter Credenciais

1. Supabase Dashboard → **Project Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **Anon key** (público, seguro para exposição no frontend)
   - **Service role key** (SECRETO - nunca commitir!)

### Adicionar ao `.env.local`

Crie arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx_seu_anon_key_secreto_xxxxx
```

⚠️ **AVISO**: `.env.local` está em `.gitignore` (não será commitido)

### Atualizar `supabaseService.js`

```javascript
export const supabaseService = new SupabaseService(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

---

## 👥 Passo 6: Criar Primeiro Usuário MASTER

### Via Supabase Auth

1. Dashboard → **Authentication** → **Users**
2. Clique **+ New user**
3. Preencha:
   - **Email**: `master@inteligente-park.com`
   - **Password**: Senha forte
4. Copie o **User ID** (UUID)

### Criar Perfil MASTER (via SQL)

```sql
INSERT INTO perfis (
  user_id,
  nome_completo,
  cpf,
  nivel_acesso,
  ativo,
  data_admissao
) VALUES (
  'COLE_O_USER_ID_AQUI',
  'Master Administrator',
  '00000000000',
  'MASTER',
  true,
  CURRENT_DATE
);
```

**Ou via Table Editor:**
1. Table Editor → **perfis**
2. Insert Row:
   - `user_id`: Cole o UUID copiado
   - `nome_completo`: Master Administrator
   - `cpf`: 00000000000
   - `nivel_acesso`: MASTER
   - `ativo`: true
   - `data_admissao`: data de hoje

---

## ⚡ Passo 7: Integrar no Frontend

### Instalar Cliente Supabase

```bash
npm install @supabase/supabase-js
```

### Usar Services no App

```jsx
import { policiaAcessoService } from './services/policiaAcessoService';
import { offlineSyncService } from './services/offlineSyncService';

// Após login bem-sucedido
await policiaAcessoService.inicializar(userId);

// Para sincronizar dados offline
await offlineSyncService.sincronizar();
```

---

## 🧪 Passo 8: Testar Conectividade

### Script de Teste

Create `test-supabase.js`:

```javascript
import { supabaseService } from './src/services/supabaseService.js';

async function testar() {
  try {
    console.log('🧪 Testando conexão Supabase...');
    
    const { data, error } = await supabaseService.client
      .from('politicas_acesso')
      .select('*');
    
    if (error) throw error;
    
    console.log('✅ Conexão OK!');
    console.log(`📊 Políticas encontradas: ${data.length}`);
    console.log(data);
    
  } catch (erro) {
    console.error('❌ Erro:', erro.message);
  }
}

testar();
```

Executar:
```bash
node test-supabase.js
```

---

## 📊 Passo 9: Verificar Dados

### Ver Políticas Inseridas

1. Dashboard → **Table Editor** → **politicas_acesso**
2. Você deve ver:
   - MASTER (todas permissões = true)
   - ADMIN (maioria true, algumas false)
   - SUPERVISOR (poucas permissões)
   - OPERADOR (permissões mínimas)

### Ver Usuários

1. Dashboard → **Authentication** → **Users**
2. Verá o usuário MASTER criado

### Ver Perfil

1. Dashboard → **Table Editor** → **perfis**
2. Verá o registro do utilizador MASTER

---

## 🔄 Passo 10: Configurar Backup Automático

### Storage Buckets

1. Dashboard → **Storage** → **Create new bucket**
2. Nome: `backups`
3. Configurar para público leitura, privado escrita

### Criar Trigger de Backup (Opcional)

Adicione ao `schema.sql`:

```sql
-- Backup automático da auditoria todo dia
CREATE OR REPLACE FUNCTION backup_daily_auditoria()
RETURNS void AS $$
BEGIN
  INSERT INTO storage.objects (bucket_id, name, owner, metadata)
  SELECT 
    'backups',
    'auditoria_' || DATE(NOW()) || '.json',
    auth.uid(),
    to_jsonb(array_agg(row_to_json(t)))
  FROM auditoria t
  WHERE DATE(t.created_at) = DATE(NOW());
END;
$$ LANGUAGE plpgsql;
```

---

## 🛡️ Segurança - Checklist

- [ ] `.env.local` está em `.gitignore`
- [ ] Variáveis de ambiente não estão em commits
- [ ] Service role key **nunca** é usado no frontend
- [ ] RLS habilitado em **todas** as tabelas
- [ ] Policies aplicadas para cada nível de acesso
- [ ] Autenticação de email habilitada
- [ ] 2FA habilitado para conta Supabase admin
- [ ] Backups configurados

---

## 🚨 Troubleshooting

### Erro: "Auth and RLS disabled"
**Solução**: Execute a seção 8 do schema.sql novamente

### Erro: "API key invalid"
**Solução**: Copie novamente a chave do Supabase Dashboard

### RLS bloqueando queries
**Solução**: Verifique se user_id está sendo passado em `auth.uid()`

### Dados não sincronizando
**Solução**: 
1. Verifique logs em `offlineSyncService.obterStatus()`
2. Abra DevTools → Console → veja logs de sincronização
3. Restart da app

---

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL RLS](https://www.postgresql.org/docs/14/ddl-rowsecurity.html)
- [@supabase/supabase-js](https://github.com/supabase/supabase-js)

---

## 🎯 Próximos Passos

1. ✅ Setup do Supabase (este guia)
2. → Integrar formulários React com Supabase
3. → Implementar permissões dinâmicas
4. → Testes e-2-e com dados reais
5. → Deploy em produção
