# 🚀 Deploy para GitHub Pages

## 🎯 Método Rápido (Recomendado)

### Opção A: Script Automatizado (Mais Fácil)

```bash
# Um único comando faz tudo:
npm run deploy
```

Este comando:
- ✅ Faz o build (`npm run build`)
- ✅ Cria/atualiza o branch `gh-pages`
- ✅ Copia arquivos de `dist/` para o branch
- ✅ Faz commit e push automaticamente
- ✅ Retorna para o branch original

**Primeira vez?** Configure no GitHub:
1. Vá em `https://github.com/SEU-USUARIO/SEU-REPO/settings/pages`
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` → **Folder**: `/ (root)`
4. **Save**

Aguarde 1-2 minutos e acesse: `https://SEU-USUARIO.github.io/SEU-REPO/`

---

### Opção B: Configurar GitHub Pages para Ler /dist (Mais Simples)

Se preferir não usar branch separado:

**1. Commitar a pasta dist/ (uma vez)**
```bash
git add dist/ -f
git commit -m "build: adiciona pasta dist para GitHub Pages"
git push
```

**2. Configurar no GitHub**
1. `https://github.com/SEU-USUARIO/SEU-REPO/settings/pages`
2. **Source**: Deploy from a branch
3. **Branch**: `main` → **Folder**: `/dist`
4. **Save**

**3. Atualizar .gitignore**
Remova a linha `dist` do arquivo `.gitignore` para poder commitar a pasta.

**Toda vez que atualizar:**
```bash
npm run build
git add dist/
git commit -m "build: atualiza build de produção"
git push
```

---

## ✅ Estrutura Correta do Projeto

### Desenvolvimento Local
```
├── index.html       ← Template de dev (aponta para /src/main.jsx)
├── src/             ← Código fonte React
├── public/          ← Arquivos estáticos (ícones, robots.txt)
└── vite.config.js   ← Configuração do Vite
```

### Build de Produção
```
└── dist/            ← Arquivos compilados (gerados por npm run build)
    ├── index.html   ← HTML com assets injetados
    ├── assets/      ← JS e CSS com hash
    └── ...          ← Demais arquivos estáticos
```

---

## 📦 Como Fazer Deploy

### Opção 1: Deploy Manual (Recomendado)

```bash
# 1. Fazer build de produção
npm run build

# 2. Commitar apenas a pasta dist/
git add dist/ -f
git commit -m "Build para produção"

# 3. Fazer push
git push origin main
```

Depois, no GitHub:
- **Settings** → **Pages** → **Source**: Deploy from a branch
- **Branch**: `main` → **Folder**: `/dist`
- Salvar

### Opção 2: Deploy Automático com GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

Depois, no GitHub:
- **Settings** → **Pages** → **Source**: Deploy from a branch
- **Branch**: `gh-pages` → **Folder**: `/` (root)
- Salvar

---

## ⚠️ Regras Importantes

### ❌ NÃO FAÇA ISSO:
- ❌ Commitar arquivos de build na raiz do projeto
- ❌ Copiar manualmente arquivos de `dist/` para a raiz
- ❌ Modificar `index.html` manualmente para adicionar links de assets

### ✅ FAÇA ISSO:
- ✅ Sempre use `npm run build` para gerar a pasta `dist/`
- ✅ Mantenha `index.html` na raiz apontando para `/src/main.jsx`
- ✅ Configure GitHub Pages para servir a pasta `dist/`
- ✅ Adicione `dist/` ao `.gitignore` se usar GitHub Actions

---

## 🔧 Comandos Essenciais

```bash
# Desenvolvimento local (sempre use essa URL)
npm run dev
# ➜ Acesse: http://localhost:3000/

# Build de produção
npm run build
# ➜ Arquivos gerados em: dist/

# Testar build localmente
npm run preview
# ➜ Acesse: http://localhost:4173/
```

---

## 🐛 Troubleshooting

### Problema: "App quebrado no localhost"
**Causa**: Arquivos de build commitados na raiz  
**Solução**: Execute os comandos abaixo

```bash
# Limpar arquivos de build da raiz
Remove-Item -Path "assets","registerSW.js","sw.js","manifest.webmanifest","workbox-*.js" -Recurse -Force

# Garantir que index.html está correto
# Deve ter: <script type="module" src="/src/main.jsx"></script>

# Reiniciar servidor
npm run dev
```

### Problema: Service Worker com cache antigo
**Solução**: Limpar cache do navegador
1. Abra DevTools (F12)
2. **Application** → **Service Workers** → **Unregister**
3. **Application** → **Storage** → **Clear site data**
4. Recarregue a página (Ctrl+Shift+R)

### Problema: GitHub Pages mostrando conteúdo antigo
**Solução**: 
1. Garantir que o build foi feito: `npm run build`
2. Verificar se a pasta `dist/` existe e tem os arquivos corretos
3. Limpar cache no GitHub Pages (Settings → Pages → salvar novamente)
4. Aguardar 1-2 minutos para propagação

---

## 📝 Commit Message Sugerida

Ao fazer deploy:
```bash
git commit -m "chore: build para deploy no GitHub Pages"
```

Ao corrigir ambiente local:
```bash
git commit -m "fix: restaura index.html para modo desenvolvimento"
```

---

✨ **Pronto!** Agora seu ambiente local e produção funcionam corretamente.
