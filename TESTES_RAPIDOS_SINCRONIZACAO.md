# 🧪 GUIA DE TESTES RÁPIDOS - SINCRONIZAÇÃO OFFLINE

**Tempo de teste estimado:** 5 minutos  
**Pré-requisito:** Servidor rodando em http://localhost:3000/

---

## ✅ TESTE 1: Verificar Status Visual (30 segundos)

### Passo 1: Abra o App
- URL: http://localhost:3000/
- Observe o topo da página

### Passo 2: Procure o LED
```
Você verá algo assim:

┌─────────────────────────┐
│ 🟢 Sincronizado [0 pend] │  ← Este componente
└─────────────────────────┘
```

### Passo 3: Clique no LED
- O painel dropdown deve aparecer
- Mostra: Status, Pendências, Última sincronização
- Botão para "Sincronizar Agora"

**✅ Se viu o LED verde piscando → TESTE 1 PASSOU**

---

## ✅ TESTE 2: Simular Modo Offline (2 minutos)

### Passo 1: Abra DevTools
- Pressione `F12`
- Vá para aba "Network"

### Passo 2: Desativar Internet (Simular)
- Procure o ícone de conectividade (lado direito)
- Clique até mostrar "Offline"

### Passo 3: Observe a Mudança
```
O LED deve agora aparecer assim:

┌──────────────────────────────────────┐
│ 🔴 Offline - 0 pendentes             │  ← LED Vermelho
└──────────────────────────────────────┘
```

**✅ Se mudou para vermelho → TESTE 2 PASSOU**

---

## ✅ TESTE 3: Registrar Dados Offline (1 minuto)

### Passo 1: Registre uma Entrada
- Ainda em Offline (DevTools)
- Placa: `ABC-1234`
- Modelo: `GOL`
- Cor: `BRANCO`
- Clique "REGISTRAR ENTRADA"

### Passo 2: Observe a Fila
- Clique no LED vermelho
- Painel mostra: **"1 pendente"**

### Passo 3: Registre Mais Uma
- Placa: `XYZ-9876`
- Modelo: `PALIO`
- Cor: `PRETO`
- Clique "REGISTRAR ENTRADA"

### Passo 4: Observe a Contagem
- Painel agora mostra: **"2 pendentes"**

**✅ Se contador aumentou → TESTE 3 PASSOU**

---

## ✅ TESTE 4: Voltar Online e Sincronizar (1 minuto)

### Passo 1: Volte a Ficar Online
- DevTools → Network
- Mude de "Offline" para "Online"

### Passo 2: Observe Sincronização Automática
```
Deverá acontecer em até 5 segundos:

Antes:
┌────────────────────────────────┐
│ 🔴 Offline - 2 pendentes       │
└────────────────────────────────┘

Depois:
┌────────────────────────────────┐
│ 🟢 Sincronizado - 0 pendentes  │
└────────────────────────────────┘
```

### Passo 3: Verifique localStorage
No console, paste:
```javascript
JSON.parse(localStorage.getItem('park-sync-queue')).length
```

Resultado deve ser: `0` (fila vazia)

**✅ Se ficou verde e fila zerou → TESTE 4 PASSOU**

---

## ✅ TESTE 5: Debug Console (30 segundos)

### Passo 1: Abra Console
- `F12` → Console

### Passo 2: Digite Comandos
```javascript
// Ver status atual
syncService.obterStatus()

// Resultado esperado:
// {
//   isOnline: true,           ← Deve ser true (online)
//   syncInProgress: false,
//   pendingItems: 0,          ← Deve ser 0 (nada pendente)
//   statusText: "🟢 Sincronizado"
// }
```

### Passo 3: Ver Fila Detalhada
```javascript
// Se houvesse itens pendentes, veria aqui
syncService.debugShowQueue()
```

**✅ Se mostrou status correto → TESTE 5 PASSOU**

---

## ✅ TESTE 6: Teste de Alerta (1 minuto)

### Passo 1: Fique Offline Novamente
- DevTools → Network → Offline

### Passo 2: Registre Uma Entrada
- Placa: `TEST-001`
- Modelo: `TESTE`
- Cor: `CINZA`
- Clique "REGISTRAR ENTRADA"

### Passo 3: Tente Fechar Guia
- Clique no X (fechar aba)
- OU pressione `Ctrl+W`

### Passo 4: Observe Alerta
```
Você deverá ver um alerta como:

"Você tem 1 operação(ões) não sincronizadas. 
Tem certeza que deseja sair?"

[Sair]  [Ficar na página]
```

### Passo 5: Clique "Ficar"
- Volta para app normalmente
- Dados ainda estão salvos

**✅ Se apareceu alerta → TESTE 6 PASSOU**

---

## 📊 RESUMO DOS TESTES

| Teste | Descrição | Status |
|-------|-----------|--------|
| 1 | LED Visual | ✅ PASSOU |
| 2 | Modo Offline | ✅ PASSOU |
| 3 | Registrar Offline | ✅ PASSOU |
| 4 | Sincronização Automática | ✅ PASSOU |
| 5 | Debug Console | ✅ PASSOU |
| 6 | Alerta de Saída | ✅ PASSOU |

---

## 🎯 Testes Avançados (Opcional)

### Teste A: Forçar Sincronização Imediata

```javascript
// No console:
await syncService.sincronizarUrgente()

// Resultado esperado:
// 🚨 Sincronização urgente acionada
// 🔄 Iniciando sincronização...
// ✅ Sincronização completa!
```

### Teste B: Simular Erro de Rede

```javascript
// No console:
navigator.onLine = false  // Simula offline
window.dispatchEvent(new Event('offline'))

// LED deve ficar vermelho mesmo se Network mostra Online
```

### Teste C: Ver Todos os localStorage

```javascript
// No console:
Object.keys(localStorage).filter(k => k.startsWith('park-'))

// Resultado:
// [
//   'park-veiculos',
//   'park-sync-queue',
//   'park-entradas',
//   'park-saidas',
//   'park-config',
//   'park-historico'
// ]
```

---

## 🐛 Troubleshooting - Testes

### Problema: LED não aparece

**Solução:**
1. Recarregue página `F5`
2. Verifique console: `F12` → Console
3. Procure por erros em vermelho
4. Se houver error: "StatusConexao not imported"
   - Solução: Reinicie servidor `npx vite`

### Problema: Offline não funciona

**Solução:**
1. Verifique DevTools está aberto
2. Network tab → Chrome/Firefox pode não mostrar dropdown
3. Tente: `F12` → `...` (menu) → More tools → Network Conditions
4. Marque "Offline"

### Problema: Contador não muda

**Solução:**
1. Recarregue página
2. Verifique se "REGISTRAR ENTRADA" foi clicado
3. No console: `syncService.obterContagemPendentes()`
4. Deve mostrar número > 0

### Problema: Não volta online

**Solução:**
1. DevTools → Network → mude "Offline" para "Online"
2. Se não houver opção:
   - Feche DevTools
   - Reabra DevTools
   - Tente novamente

---

## ✨ Esperado vs Real

### Esperado Online
```
┌─────────────────────────────┐
│ 🟢 Sincronizado [0 pendentes]│
│  ▲ LED piscando             │
└─────────────────────────────┘
```

### Real Offline
```
┌─────────────────────────────┐
│ 🔴 Offline - 5 pendentes    │
│  ▲ LED fixo (não pisca)     │
└─────────────────────────────┘
```

---

## 🎓 O Que Você Testou

✅ **Visualização** - LED 3D/Neumórfico funciona  
✅ **Detecção** - Sistema detecta online/offline  
✅ **Persistência** - Dados salvos em localStorage  
✅ **Sincronização** - Fila processa automaticamente  
✅ **Segurança** - Alerta antes de sair com dados pendentes  
✅ **Debug** - Console tools funcionam  

---

## 🚀 Próximas Ações

1. **Se tudo passou:** App está pronto! 🎉
2. **Se algo falhou:** Volte para terminal com `npx vite` e reinicie

---

## 📝 Checklist Final

- [ ] Teste 1: LED visual aparece
- [ ] Teste 2: Muda para vermelho offline
- [ ] Teste 3: Contador aumenta
- [ ] Teste 4: Volta para verde + sincroniza
- [ ] Teste 5: Console mostra status correto
- [ ] Teste 6: Alerta de saída funciona

**Todos os testes passaram? 🎉 PARABÉNS! Seu sistema está operacional!**

---

**Status:** ✅ Pronto para testes  
**Próximo:** Deploy para produção ou ativar Supabase  
**Tempo total de testes:** ~5 minutos

