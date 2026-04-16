# 🚀 Servidor HTTP para Inteligente Park

Um servidor HTTP simples baseado em Node.js para servir a aplicação **sem dependências externas** (além do Node.js instalado).

## 🎯 Por que usar este servidor?

- ✅ Funciona **sem VS Code**
- ✅ Funciona **sem Vite** em background
- ✅ Funciona **fora da pasta do projeto**
- ✅ Suporta **caminhos relativos** automaticamente
- ✅ Perfeito para **testes locais**
- ✅ Simula **servidor de produção**

---

## 📋 Pré-requisitos

- **Node.js 12+** instalado (verifique com `node --version`)

Se não tiver Node.js, [baixe aqui](https://nodejs.org/).

---

## 🚀 Como usar

### 1️⃣ **Primeiro, compile o projeto**

```bash
npm run build
```

Isso criará a pasta `dist/` com os arquivos otimizados.

### 2️⃣ **Inicie o servidor**

```bash
node server.js
```

Ou com porta customizada:
```bash
node server.js 3000
```

### 3️⃣ **Abra no navegador**

A URL aparecerá no terminal:
```
✅ Servidor rodando!
📱 Local:   http://localhost:8080
🌐 Network: http://192.168.1.100:8080
```

Clique no link ou copie-cole na barra de endereços.

---

## 🎨 Arquivo `server.js` - O que ele faz?

| Recurso | Descrição |
|---------|-----------|
| **SPA Routing** | Qualquer rota → `index.html` (perfeito para React Router) |
| **MIME Types** | Detecta tipos corretos (JS, CSS, imagens, etc) |
| **Cache Headers** | Otimiza cache para desenvolvimento |
| **CORS** | Permite requisições cruzadas |
| **Path Traversal Protection** | Segurança contra acesso a pastas superiores |

---

## 💻 Exemplos de uso

### ✅ **Desenvolvimento local**
```bash
# Terminal 1 - Compilar mudanças
npm run dev     # ou npm run build (uma vez)

# Terminal 2 - Servir
node server.js
```

### ✅ **Testar produção localmente**
```bash
npm run build   # Compilar com otimizações
node server.js  # Servir
```

### ✅ **Rodar em porta diferente**
```bash
node server.js 5000   # Porta 5000
node server.js 8000   # Porta 8000
```

### ✅ **Acessar de outro PC**
Use a URL do Network:
```
http://192.168.1.100:8080
```

---

## 🔧 Troubleshooting

### ❌ Erro: "Port already in use"
Porta está em uso. Tente outra:
```bash
node server.js 3000
```

### ❌ Erro: "EACCES: permission denied"
(Linux/Mac) Permissão de arquivo:
```bash
chmod +x server.js
node server.js
```

### ❌ Erro: "Cannot find module 'fs'"
Node.js não está instalado corretamente. Verifique:
```bash
node --version
npm --version
```

### ❌ Página não carrega
1. Verificar se `dist/index.html` existe
2. Verificar URL (http://localhost:8080, não https)
3. Limpar cache do navegador (Ctrl+Shift+Delete)

---

## 📁 Estrutura esperada

```
PROJETO-ANTIGO-PARK/
├── server.js              ← Arquivo do servidor
├── dist/                  ← Pasta compilada (gerada por: npm run build)
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.js
│   │   └── index-*.css
│   └── ...
├── src/                   ← Código fonte
└── package.json
```

---

## 🌟 Dicas

1. **Hot Reload Development**: Use em outro terminal `npm run dev` enquanto server.js roda
2. **Sem dependências externas**: Apenas Node.js padrão (não precisa npm packages adicionais)
3. **Seguro**: Só serve arquivos dentro de `dist/`
4. **SPA Ready**: Todas as rotas retornam `index.html` (React Router funciona)

---

## 📝 Alternativas

Se preferir, pode também:

### Python (se instalado)
```bash
# Python 3
python -m http.server 8080

# ou Python 2
python -m SimpleHTTPServer 8080
```

### PHP (se instalado)
```bash
php -S localhost:8080
```

---

## ✅ Resumo das mudanças

- ✅ `server.js` criado (simples, sem npm extras)
- ✅ Funciona com `dist/` (saída compilada)
- ✅ Suporta SPA routing automático
- ✅ MIME types corretos para todos os arquivos
- ✅ Pronto para produção

**Próximo passo**: Executar `npm run build` e depois `node server.js`
