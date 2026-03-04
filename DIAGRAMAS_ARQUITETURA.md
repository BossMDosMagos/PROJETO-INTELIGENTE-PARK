# 🏗️ DIAGRAMAS DE ARQUITETURA - SINCRONIZAÇÃO OFFLINE-FIRST

---

## 1️⃣ ARQUITETURA GERAL DO SISTEMA

```
┌────────────────────────────────────────────────────────────────┐
│                    APLICAÇÃO REACT (Frontend)                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐              ┌──────────────────┐      │
│  │   App.jsx        │              │  StatusConexao   │      │
│  │  (Componente)    │              │  (LED Visual)    │      │
│  │  - Home          │◄─────┬──────┤  - 🟢 Online     │      │
│  │  - Admin         │      │      │  - 🔴 Offline   │      │
│  │  - Pátio         │      │      │  - Painel Info   │      │
│  └────────┬─────────┘      │      └──────────────────┘      │
│           │                │                                 │
│    Registra entrada        │      Listener de eventos       │
│         /saída             │                                 │
│           │                │                                 │
│           ▼                │                                 │
│  ┌──────────────────────────────┐                           │
│  │   supabaseService            │                           │
│  │ (Offline-First CRUD)         │                           │
│  │ ┌────────────────────────┐   │                           │
│  │ │ 1. Salva localStorage  │   │                           │
│  │ │ 2. Se online→Supabase  │   │◄──────────────┐           │
│  │ │ 3. Se offline→Fila     │   │               │           │
│  │ └────────────────────────┘   │               │           │
│  └──────────┬────────────────────┘               │           │
│             │                                    │           │
│      ┌──────▼──────┐                    ┌────────┴────────┐  │
│      │ localStorage │                    │  syncService   │  │
│      │ (Persistência)                    │ (Sincronização)│  │
│      │              │                    │                │  │
│      │ shop-sync... │                    │ - Periódico    │  │
│      │ park-entradas                    │ - Online/Offline│  │
│      │ park-saidas  │                    │ - Retry Auto   │  │
│      │ park-veiculos│                    │ - Event Notify │  │
│      └──────────────┘                    └────────────────┘  │
│                                                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            ▼
    ┌────────────────────────────────────────┐
    │        SUPABASE (Opcional)             │
    │                                        │
    │ ┌──────────────────────────────────┐  │
    │ │   PostgreSQL Database            │  │
    │ │                                  │  │
    │ │ - entradas_saidas               │  │
    │ │ - mensalistas                   │  │
    │ │ - veiculos                      │  │
    │ └──────────────────────────────────┘  │
    │                                        │
    │ ┌──────────────────────────────────┐  │
    │ │   REST API                       │  │
    │ │   (Gerado automaticamente)       │  │
    │ └──────────────────────────────────┘  │
    │                                        │
    └────────────────────────────────────────┘
```

---

## 2️⃣ FLUXO DE SINCRONIZAÇÃO - ONLINE CONSTANTE

```
Operador registra entrada
        │
        ▼
┌─────────────────────┐
│ registrarEntrada()  │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────────┐
│ supabaseService.registrarEntrada │
└──────────┬───────────────────────┘
           │
     ┌─────▼─────┐
     │ Online?   │
     └─────┬─────┘
           │
        YES ▶───────────────────┐
           │                    │
        NO ▶─►Adiciona à fila   │
           │                    │
           │              ┌─────▼─────────────────┐
           │              │ Envia para Supabase   │
           │              └──────────┬────────────┘
           │                         │
           │                         ▼
           │              ┌──────────────────────┐
           │              │ Retorno (200 OK)     │
           │              └──────────┬───────────┘
           │                         │
           ▼                         ▼
┌────────────────┐        ┌──────────────────┐
│ localStorage   │        │ Supabase DB      │
│ (Salvo)        │        │ (Persistido)     │
└────────────────┘        └──────────────────┘
           │                         │
           └──────────┬──────────────┘
                      │
                      ▼
          ┌─────────────────────────┐
          │ syncService notifica    │
          │ Status: 'synced'        │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │ StatusConexao atualiza  │
          │ 🟢 Sincronizado (0)     │
          └─────────────────────────┘
```

---

## 3️⃣ FLUXO DE SINCRONIZAÇÃO - OFFLINE DEPOIS ONLINE

```
[INTERNET CAI]
        │
        ▼
┌─────────────────────────────────┐
│ Operador registra 3 entradas    │
│ (registrarEntrada() x3)         │
└──────────┬──────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│ supabaseService verifica: online?  │
│ Resultado: NO (offline)            │
└──────────┬─────────────────────────┘
           │
        ┌──▼──┬──────┬──────┐
        │     │      │      │
    Ent1 Ent2 Ent3  (Salvos em localStorage)
        │     │      │      │
        └──┬──┴──────┴──────┘
           │
           ▼
    ┌─────────────────┐
    │ park-sync-queue │
    │ [Ent1, Ent2,    │
    │  Ent3]          │
    │ count = 3       │
    └────────┬────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ StatusConexao atualiza       │
    │ 🔴 Offline - 3 pendentes     │
    │ ⚠️ Alerta visual             │
    └──────────────────────────────┘
             │
             │
    [INTERNET VOLTA]
             │
             ▼
    ┌──────────────────────────────┐
    │ Browser detecta: online      │
    │ Dispara event: 'online'      │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ syncService.handleOnline()   │
    │ Chama: sincronizarAgora()    │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Loop através da fila         │
    │ Para cada pendência:         │
    │  - Envia Ent1 ► Supabase (ok)│
    │  - Envia Ent2 ► Supabase (ok)│
    │  - Envia Ent3 ► Supabase (ok)│
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Fila limpa                   │
    │ park-sync-queue []           │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ StatusConexao atualiza       │
    │ 🟢 Sincronizado - 0 pend     │
    │ ✅ Tudo em dia!              │
    └──────────────────────────────┘
```

---

## 4️⃣ MÁQUINA DE ESTADOS - STATUS CONEXÃO

```
                    ┌──────────────┐
                    │   INICIANDO  │
                    └──────┬───────┘
                           │
              browser.onLine?
                    │      │
            ┌───────┘      └─────────┐
            │                        │
          YES                       NO
            │                        │
            ▼                        ▼
    ┌──────────────┐        ┌──────────────┐
    │    ONLINE    │        │   OFFLINE    │
    │  🟢 Verde    │        │  🔴 Vermelho │
    │  (piscando)  │        │  (fixo)      │
    └───┬──────┬───┘        └───┬──────┬───┘
        │      │                │      │
   evento      │          evento │      │
   "online"    │         "offline│      │
        │      │                │      │
        │      └──▶ detecta     │      │
        │         "offline"     │      │
        │            │          │      │
        │            ▼          │      │
        │      ┌──────────────┐ │      │
        │      │  SINCRONIZANDO  │      │
        │      │  🟡 Amarelo  │ │      │
        │      │  (spinner)   │ │      │
        │      └──────┬───────┘ │      │
        │             │         │      │
        │      ┌──────▼──┐      │      │
        │      │Sucesso? │      │      │
        │      └──┬───┬──┘      │      │
        │        SIM  NÃO       │      │
        │         │    │        │      │
        │         │    └───────►├─ RETRY
        │         │             │
        │         ▼             │
        │    ┌──────────────┐   │
        └───►│   SYNCED     │◄──┘
             │   ONLINE     │
             │   🟢 0 pend  │
             └──────────────┘
```

---

## 5️⃣ ESTRUTURA DE DADOS - FILA DE SINCRONIZAÇÃO

```
┌──────────────────────────────────────────────────────────┐
│           park-sync-queue (localStorage)                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Operação 1: ENTRADA                                │ │
│  │ {                                                  │ │
│  │   "type": "insert",                               │ │
│  │   "table": "entradas_saidas",                     │ │
│  │   "action": "entrada",                            │ │
│  │   "data": {                                       │ │
│  │     "placa": "ABC-1234",                          │ │
│  │     "modelo": "GOL",                              │ │
│  │     "cor": "BRANCO",                              │ │
│  │     "entrada": "2026-03-04T14:30:00Z",           │ │
│  │     "isMensalista": false                         │ │
│  │   },                                              │ │
│  │   "timestamp": 1709555400000,                     │ │
│  │   "synced": false                                 │ │
│  │ }                                                 │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Operação 2: SAÍDA                                  │ │
│  │ {                                                  │ │
│  │   "type": "update",                               │ │
│  │   "table": "entradas_saidas",                     │ │
│  │   "action": "saida",                              │ │
│  │   "data": {                                       │ │
│  │     "placa": "ABC-1234",                          │ │
│  │     "horaSaida": "2026-03-04T15:00:00Z",         │ │
│  │     "valor": 9.00,                                │ │
│  │     "tipo": "carro"                               │ │
│  │   },                                              │ │
│  │   "timestamp": 1709557200000,                     │ │
│  │   "synced": false                                 │ │
│  │ }                                                 │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  (... mais operações)                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 6️⃣ FLUXO COM RETRY (Falha de Conexão)

```
Sincronização iniciada
        │
        ▼
┌───────────────────────┐
│ Tentativa 1 de 3      │
│ Envia para Supabase   │
└───────┬───────────────┘
        │
   ┌────▼────┐
   │ Falha?  │
   └────┬────┘
        │
      YES ▶──────────────────┐
        │                    │
      NO ▶──────────────────►┤
        │                ┌───▼─────────┐
        │                │ Sucesso ✓   │
        │                │ Remove fila │
        │                └─────────────┘
        │
        ▼
┌──────────────────────┐
│ Aguardar 5000ms      │
│ (backoff)            │
└────────┬─────────────┘
         │
         ▼
┌───────────────────────┐
│ Tentativa 2 de 3      │
│ Envia novamente       │
└───────┬───────────────┘
        │
   ┌────▼────┐
   │ Falha?  │
   └────┬────┘
        │
      YES ▶──────────────────┐
        │                    │
      NO ▶──────────────────►┤
        │                ┌───▼─────────┐
        │                │ Sucesso ✓   │
        │                │ Remove fila │
        │                └─────────────┘
        │
        ▼
┌──────────────────────┐
│ Tentativa 3 de 3     │
│ Última chance        │
└────────┬─────────────┘
         │
    ┌────▼────┐
    │ Falha?  │
    └────┬────┘
         │
       YES ▶──────────────────┐
         │                    │
       NO ▶──────────────────►┤
         │                ┌───▼─────────┐
         │                │ Sucesso ✓   │
         │                │ Remove fila │
         │                └─────────────┘
         │
         ▼
┌──────────────────────┐
│ Falha após 3 retry   │
│ ⚠️ Mantém na fila    │
│ Tenta novamente em  │
│ 30 segundos         │
└──────────────────────┘
```

---

## 7️⃣ COMPONENTES E SUAS RESPONSABILIDADES

```
┌─────────────────────────────────────────────────────────┐
│                      App.jsx                            │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Responsabilidades:                                │ │
│  │ • Orquestra tudo                                  │ │
│  │ • Chama supabaseService.registrarEntrada/Saida  │ │
│  │ • Renderiza StatusConexao                        │ │
│  │ • Inicializa syncService                         │ │
│  │ • Gerencia state & localStorage                  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ supabaseService  │ │ syncService      │ │ StatusConexao    │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ Responsabilid.   │ │ Responsabilid.   │ │ Responsabilid.   │
│                  │ │                  │ │                  │
│ • CRUD offline   │ │ • Monitor online │ │ • LED visual     │
│ • Fila           │ │ • Sincroniza     │ │ • Painel detail  │
│ • localStorage   │ │ • Retry auto     │ │ • Listener event │
│ • Merge carro    │ │ • Notifica estado│ │ • Dropdown       │
│ • Backup/export  │ │ • Timer periód.  │ │ • Botão sync     │
│                  │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
        │
        ▼
   localStorage
   (Persistência)
```

---

## 8️⃣ CICLO DE VIDA - DO REGISTRO ATÉ SINCRONIZAÇÃO

```
┌─ Operador digita placa ABC-1234
│
├─► registrarEntrada() é chamado
│
├─► supabaseService.registrarEntrada(dados)
│   │
│   ├─► salvarNoLocalStorage('park-entradas', dados)
│   │   └─► JSON + localStorage urgentemente
│   │
│   ├─► Se online: envia Supabase
│   │   └─► Sucesso: pronto
│   │
│   └─► Se offline: addToPendingQueue()
│       ├─► Adiciona a fila
│       └─► savePendingQueueToStorage()
│           └─► Persiste fila em 'park-sync-queue'
│
├─► syncService.onStatusChange() é notificado
│   └─► atualiza estado de pendências
│
├─► StatusConexao renderiza
│   ├─► Se online: 🟢 Sincronizado [0]
│   └─► Se offline: 🔴 Offline [1]
│
└─► Usuário vê LED visual atualizando
    com contador em tempo real
```

---

## 9️⃣ SINCRONIZAÇÃO PERIÓDICA (Timer)

```
APP INICIA
   │
   ▼
syncService.iniciarSincronizacaoPeriodica()
   │
   ├─► setInterval(() => {
   │     if (isOnline && temDadosPendentes) {
   │       sincronizarAgora()
   │     }
   │   }, 30000) // A cada 30s
   │
   ▼
LOOP CONTANDO
   │
   ├─► 0s - Verificar
   │
   ├─► 5s - Verificar
   │
   ├─► 10s - Verificar
   │
   ├─► 15s - Verificar
   │
   ├─► 20s - Verificar
   │
   ├─► 25s - Verificar
   │
   ├─► 30s ◄─ DISPARA sincronizarAgora()
   │   │
   │   └─► Envia fila para Supabase
   │       Limpa se sucesso
   │       Retry se falha
   │
   └─► Reinicia contador
```

---

## 🔟 DECISÃO DE OFFLINE VS ONLINE

```
Browser.onLine
    │
    ├─ true (Hardware diz online)
    │  │
    │  ├─ Mas pode não ter conexão real
    │  ├─ Pode ter latência alta
    │  └─ HTTP request pode falhar
    │
    └─ false (Hardware diz offline)
       │
       └─ 100% offline (sem internet)
          └─ Dados devem ir para fila

Sistema INTELIGENTE:
  1. Confiar em browser.onLine
  2. usar HTTP status para validar
  3. Retry automático se falha
  4. Assume offline em caso de dúvida
```

---

## 📊 TABELA DE ESTADOS POSSÍVEIS

```
┌────────────┬─────────┬──────────────┬──────────────┬───────────┐
│ Estado     │ LED     │ Contador     │ Sincronizando│ Ação      │
├────────────┼─────────┼──────────────┼──────────────┼───────────┤
│ Online     │ 🟢      │ 0 pendentes  │ Não          │ Tudo OK   │
│ Sync       │ 🟢      │ ? pend.      │ SIM          │ Enviando  │
│ Offiline   │ 🔴      │ > 0 pend.    │ Não          │ Aguardand │
│ Erro       │ 🔴      │ ? pend.      │ Não          │ Retry     │
│ Reconec.   │ 🟡      │ ? pend.      │ SIM          │ Sinc.     │
└────────────┴─────────┴──────────────┴──────────────┴───────────┘
```

---

## 🎯 DIAGRAMA RESUMIDO (Quick Reference)

```
                    USUÁRIO
                       │
                       ▼
            ┌──────────────────────┐
            │  App.jsx (Tela HOME) │
            └──────────┬───────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    ┌────────┐  ┌────────────┐  ┌──────────┐
    │ Entrada│  │Supabase    │  │ Status   │
    │ /Saída │  │ Service    │  │ Conexão  │
    └───┬────┘  └────┬───────┘  └────┬─────┘
        │             │               │
        └─────┬───────┼───────┬───────┘
              │       │       │
              ▼       ▼       ▼
         localStorage + syncService
              │
              └─► PAINEL VISUAL LED 🟢/🔴
                  + Contador pendências
                  + Sincronização automática
```

---

**Qualquer dúvida sobre arquitetura, consulte estes diagramas! 🏗️**

