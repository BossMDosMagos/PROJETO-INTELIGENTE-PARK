# 📋 PASSO A PASSO - Deploy via GitHub Desktop

## ✅ Já Configurado
- [x] Build gerado (pasta `dist/`)
- [x] `.gitignore` ajustado para permitir commit de `dist/`

---

## 🎯 PASSO 1: GitHub Desktop

### 1. Abra o GitHub Desktop

Você verá **muitos arquivos novos** na lista de mudanças (Changes).  
✅ **Isso é NORMAL!** São os arquivos compilados da pasta `dist/`.

### 2. Na caixa de mensagem de commit, escreva:

```
build: adiciona pasta dist para GitHub Pages
```

### 3. Clique no botão azul:

```
✅ Commit to main
```

### 4. Clique no botão no topo:

```
⬆️ Push origin
```

### 5. Aguarde o upload terminar

Você verá uma barra de progresso. Pode demorar 10-30 segundos.

---

## 🌐 PASSO 2: Configurar GitHub Pages

### 1. Abra seu navegador

Vá até: `https://github.com/SEU-USUARIO/SEU-REPO`

### 2. Clique na aba "Settings" (no topo)

### 3. No menu lateral esquerdo, clique em "Pages"

### 4. Configure as opções:

**Source:**
```
✅ Deploy from a branch
```

**Branch:**
```
✅ main   ←  Selecione o branch "main"
✅ /dist  ←  Selecione a pasta "/dist"
```

### 5. Clique em "Save"

### 6. Aguarde 1-2 minutos ⏱️

A página vai recarregar e mostrar:
```
✅ Your site is live at https://SEU-USUARIO.github.io/SEU-REPO/
```

---

## 🎉 Pronto! Site Online

Acesse: `https://SEU-USUARIO.github.io/NOME-DO-REPO/`

---

## 🔄 Como Atualizar o Site Depois

Quando fizer mudanças no código:

```bash
# 1. Faça o build
npm run build

# 2. No GitHub Desktop:
#    - Verá mudanças em dist/
#    - Escreva: "build: atualiza site"
#    - Commit to main
#    - Push origin

# 3. Aguarde 1-2 minutos
#    O site será atualizado automaticamente
```

---

## ❓ Ajuda

### O GitHub Desktop não mostra mudanças em `dist/`
- ✅ Execute `npm run build` de novo
- ✅ Verifique se removeu `dist` do `.gitignore` (já foi feito)

### O site não atualiza no GitHub Pages
- ⏱️ Aguarde 2-3 minutos (deploy demora um pouco)
- 🔄 Limpe o cache do navegador (Ctrl+Shift+R)
- 📍 Verifique se configurou: Branch = `main`, Folder = `/dist`

### Erro 404 no site
- 📁 Confirme que a pasta `dist/` foi enviada
- ⚙️ Verifique a configuração no GitHub Pages

---

✨ **Tudo certo!** Agora é só fazer o commit e push no GitHub Desktop!
