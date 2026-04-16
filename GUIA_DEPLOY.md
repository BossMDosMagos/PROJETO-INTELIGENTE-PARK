# 🚀 GUIA RÁPIDO DE DEPLOY

## Escolha Seu Método

### 🎯 Opção 1: Script Automatizado (RECOMENDADO)

**Vantagens:**
- ✅ Um único comando
- ✅ Branch `gh-pages` separado (código fonte limpo)
- ✅ Sem conflitos no histórico
- ✅ Fácil de reverter

**Como usar:**

```bash
npm run deploy
```

**Configuração inicial no GitHub (uma vez):**
1. Vá em: `Settings` → `Pages`
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` → **Folder**: `/ (root)`
4. Clique em **Save**
5. Aguarde 1-2 minutos

**URL do site:**
```
https://SEU-USUARIO.github.io/NOME-DO-REPO/
```

---

### 📁 Opção 2: Commitar pasta dist/ (Simples)

**Vantagens:**
- ✅ Mais simples de entender
- ✅ Usa GitHub Desktop normalmente
- ✅ Um único branch

**Desvantagens:**
- ⚠️ Código compilado no repositório
- ⚠️ Histórico de commits mais poluído

**Passo a passo:**

**1. Permitir commit da pasta dist/**

Edite `.gitignore` e remova ou comente esta linha:
```
# dist    <- comente ou remova
```

**2. Fazer build e commit**

No terminal:
```bash
npm run build
git add dist/ -f
git commit -m "build: adiciona pasta dist para deploy"
git push
```

Ou no **GitHub Desktop**:
- Faça o build: `npm run build`
- O GitHub Desktop vai mostrar mudanças em `dist/`
- Escreva mensagem: "build: deploy para produção"
- Clique em **Commit to main**
- Clique em **Push origin**

**3. Configurar GitHub Pages (uma vez):**
1. Vá em: `Settings` → `Pages`
2. **Source**: Deploy from a branch
3. **Branch**: `main` → **Folder**: `/dist`
4. Clique em **Save**
5. Aguarde 1-2 minutos

**4. Para atualizar depois:**
```bash
npm run build
git add dist/
git commit -m "build: atualiza site"
git push
```

---

## 🎬 Qual Escolher?

| Critério | Opção 1 (Script) | Opção 2 (dist/) |
|----------|------------------|-----------------|
| **Facilidade de uso** | ⭐⭐⭐ Um comando | ⭐⭐ Vários passos |
| **GitHub Desktop** | ⭐⭐ Funciona mas via terminal | ⭐⭐⭐ Usa interface |
| **Limpeza do repo** | ⭐⭐⭐ Código fonte limpo | ⭐⭐ Build no histórico |
| **Separação dev/prod** | ⭐⭐⭐ Branches separados | ⭐⭐ Pasta separada |
| **Reversão de deploy** | ⭐⭐⭐ Muito fácil | ⭐⭐ Requer revert |

**Minha recomendação:** Use **Opção 1** se você estiver confortável com o terminal. Use **Opção 2** se preferir usar só o GitHub Desktop.

---

## 🆘 Problemas Comuns

### "npm run deploy" não funciona
- Certifique-se que fez o build: `npm run build`
- Verifique se tem mudanças não commitadas no branch main

### Site não atualiza no GitHub Pages
1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Aguarde 2-3 minutos (o GitHub Pages demora um pouco)
3. Verifique se o deploy aconteceu: `Settings` → `Pages` (deve mostrar data/hora)

### "dist não está no .gitignore" (Opção 2)
É normal! Para a Opção 2 funcionar, você PRECISA remover `dist` do `.gitignore`.

---

## 📝 Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Fazer build
npm run build

# Testar build localmente
npm run preview

# Deploy automático (Opção 1)
npm run deploy
```

---

✨ **Pronto para fazer o deploy?** Escolha uma opção acima e siga os passos!
