# 🎯 INICIAR A APLICAÇÃO SEM VITE - GUIA RÁPIDO

## ✅ Opção 1: Windows (Mais fácil!)

### Passo 1: Compilar
```powershell
npm run build
```

### Passo 2: Iniciar servidor (duplo clique)
Abra o arquivo: **`iniciar-servidor.bat`** (duplo clique)

```
✅ Servidor rodando!
📱 Local: http://localhost:8080
```

## ✅ Opção 2: Windows (Via Terminal)

```powershell
npm run build
node server.js
```

## ✅ Opção 3: Linux/Mac

### Primeiro, dar permissão:
```bash
chmod +x iniciar-servidor.sh
```

### Depois rodar:
```bash
npm run build
./iniciar-servidor.sh
```

---

## 🌐 O que você consegue agora?

✅ Abrir em qualquer navegador
✅ Abrir de outro PC da rede
✅ Abrir sem VS Code
✅ Abrir mesmo com Vite fechado
✅ Funciona offline após carregar
✅ Pronto para produção

---

## 📱 Acessar do celular

1. Execute: `node server.js`
2. Pegue o IP mostrado (ex: `192.168.1.100`)
3. No celular, acesse: `http://192.168.1.100:8080`

---

## 🛠️ Arquivos criados

| Arquivo | Propósito |
|---------|-----------|
| `server.js` | Servidor HTTP simples (Node.js) |
| `iniciar-servidor.bat` | Atalho Windows (duplo clique) |
| `iniciar-servidor.sh` | Script Linux/Mac |
| `SERVER_README.md` | Documentação completa |
| `QUICK_START_SERVER.md` | Este arquivo |

---

## 💡 Troubleshooting

### "Arquivo .exe não encontrado"
Node.js não está instalado: https://nodejs.org/

### "Porta 8080 em uso"
Trocar porta:
```bash
node server.js 3000
```

### "dist/ não existe"
Executar primeiro:
```bash
npm run build
```

---

## 🚀 Pronto!

Agora você nunca mais terá problema com "interface quebrando fora do editor" 🎉
