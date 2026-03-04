# 🚀 Primeiros Passos - Integração Supabase

## ✅ Checklist de Configuração

Esta é uma checklist rápida para armar o projeto com Supabase. Siga os passos na ordem.

### 1️⃣ Configurar Variáveis de Ambiente

**Arquivo: `.env.local` (na raiz do projeto)**

```bash
# URLs e Chaves (do seu projeto Supabase)
VITE_SUPABASE_URL=https://pumbsmawfbzaczklxeog.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# Para CLI de desenvolvimento
SUPABASE_DB_PASSWORD=sua-senha-do-banco

# Para CI/CD (deployments automáticos)
SUPABASE_ACCESS_TOKEN=seu-access-token-aqui
```

**Como obter as chaves:**
- 🔗 **VITE_SUPABASE_URL**: Dashboard → Settings → API → Project URL
- 🔑 **VITE_SUPABASE_ANON_KEY**: Dashboard → Settings → API → Project API keys (copiar "anon" key)
- 💾 **SUPABASE_DB_PASSWORD**: Mesma senha que você usou ao criar o projeto
- 🔐 **SUPABASE_ACCESS_TOKEN**: Dashboard → Account → Tokens → Personal Access Tokens

⚠️ **IMPORTANTE:**
- Nunca commit `.env.local` no Git (já está em `.gitignore`)
- Guarde as chaves com segurança
- A ANON_KEY é pública, mas RLS (Row Level Security) protege seus dados


### 2️⃣ Instalar Dependências

O Supabase JS já deve estar instalado. Para verificar:

```bash
npm list @supabase/supabase-js
```

Se não estiver:

```bash
npm install @supabase/supabase-js
```


### 3️⃣ Criar Usuários de Teste (Opcional)

No Dashboard Supabase:
1. Vá para **Authentication** → **Users**
2. Clique **"Add user"** → **"Email with password"**
3. Crie 4 usuários:

| Email | Senha | Nível |
|-------|-------|-------|
| `master@inteligente-park.com` | `Senha@123` | Master |
| `admin@inteligente-park.com` | `Senha@123` | Admin |
| `supervisor@inteligente-park.com` | `Senha@123` | Supervisor |
| `operador@inteligente-park.com` | `Senha@123` | Operador |

⚠️ **Em Produção:** Mude as senhas para senhas fortes e aleatórias!


### 4️⃣ Aplicar Migrations (Schema do Banco)

Se ainda não aplicou a schema:

```bash
# Local (para desenvolvimento)
npm run db:push

# Ou via CLI
npx supabase db push
```

Isto criará todas as 8 tabelas com RLS, triggers, views, etc.


### 5️⃣ Verificar Aplicação

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrir em navegador
http://localhost:3001
```

**O que você deve ver:**
- ✅ App carrega sem erros
- ✅ Console mostra: "✅ Supabase inicializado com sucesso"
- ✅ Console mostra: "✅ Conexão com banco de dados OK"
- ✅ Component StatusSupabase mostra "🟢 Pronto"


### 6️⃣ Testar Login (Opcional)

Se criou usuários de teste, teste o login:

```
URL: http://localhost:3001/login
Email: master@inteligente-park.com
Senha: Senha@123
```

Você deve ser redirecionado para home após login bem-sucedido.


## 🆘 Troubleshooting

### "Supabase não inizializado" ou variáveis não configuradas

**Solução:**
1. Verificar se `.env.local` existe com as 2 chaves obrigatórias:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Reiniciar servidor: `npm run dev`
3. Limpar cache do navegador (Ctrl+Shift+Delete)


### Erro "Failed to fetch" ao tentar logar

**Possíveis causas:**
1. URL de Supabase está incorreta → verificar dashboard
2. Projeto Supabase está pausado → retomar na dashboard
3. Chave anon está expirada → gerar nova no dashboard
4. RLS está bloqueando → verificar policies em Database → RLS


### "Conexão com banco de dados falhou"

**Verificar:**
1. Projeto Supabase está ativo (não pausado)
2. Schema foi aplicado: `npm run db:push`
3. Usuário tem permissão de leitura em `politicas_acesso` table
4. Firewall/proxy não está bloqueando conexão


### App funciona offline mas não sincroniza

**Checklist:**
1. `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretos
2. Supabase está online (verificar dashboard)
3. RLS policies permitem INSERT para seu nível de usuário
4. Abrir DevTools → Network → ver erros em requisições Supabase


## 📚 Próximos Passos

Após confirmação que Supabase está funcionando:

1. **Testar funcionalidades principais:**
   - [ ] Login com cada nível de acesso
   - [ ] Criar unidade (MASTER)
   - [ ] Ver mensalistas (ADMIN/SUPERVISOR)
   - [ ] Registrar entrada/saída

2. **Testar offline:**
   - [ ] DevTools → Network → Offline
   - [ ] Fazer algumas ações
   - [ ] Voltar online
   - [ ] Verificar se sincroniza automaticamente

3. **Testar RBAC (permissões):**
   - [ ] MASTER acessa tudo
   - [ ] ADMIN não consegue acessar financeiro geral
   - [ ] SUPERVISOR vê apenas leitura
   - [ ] OPERADOR acessa apenas entrada/saída

4. **Configurar CI/CD (deployment):**
   - [ ] Adicione `SUPABASE_ACCESS_TOKEN` em GitHub Secrets
   - [ ] Faça push de branch
   - [ ] Monitor GitHub Actions para verificar deployment automático

## 💬 Dúvidas?

Consulte:
- `docs/SUPABASE_CLI_SETUP.md` - Desenvolvimento local
- `docs/ARQUITETURA_SUPABASE.md` - Design do banco de dados
- `docs/SEGURANCA_SUPABASE.md` - Boas práticas de segurança
- `docs/USO_SERVICES.md` - Como usar services no código

---

**Status Checklist:**
- [x] Variáveis de ambiente (.env.local)
- [x] Dependências instaladas
- [x] Usuarios de teste criados (opcional)
- [x] Migrations aplicadas (db:push)
- [x] Aplicação testada localmente
- [ ] Login funcionando
- [ ] RBAC testado
- [ ] CI/CD configurado
- [ ] Pronto para produção!
