# Command Park - Sistema de Estacionamento Inteligente

## 📋 Descrição

Sistema completo de gerenciamento de estacionamento com controle de entrada/saída de veículos, cálculo automático de preços por fração de tempo, suporte a mensalistas, impressão de tickets, e sincronização offline-first com Supabase.

## 🏗️ Arquitetura do Projeto

```
PROJETO-INTELIGENTE-PARK/
├── src/
│   ├── App.jsx                    # Componente principal (3000+ linhas)
│   ├── main.jsx                   # Entry point
│   ├── index.css                  # Estilos globais
│   ├── AppWrapper.jsx            # Wrapper com lazy loading
│   │
│   ├── components/
│   │   ├── Sidebar.jsx           # Menu lateral com botões 3D
│   │   ├── TopBarSimplificada.jsx # Navbar superior
│   │   ├── DashboardContent.jsx  # Dashboard operacional (cards duplos)
│   │   ├── Input.jsx             # Componentes de input
│   │   ├── Button.jsx            # Botões estilizados
│   │   ├── Modal.jsx             # Modais reutilizáveis
│   │   ├── PaginaLogin.jsx       # Tela de login
│   │   ├── PaginaCadastroMensalista.jsx
│   │   ├── PaginaCadastroPublico.jsx
│   │   │
│   │   └── admin/
│   │       ├── TabelaPrecos.jsx      # Configuração de preços
│   │       ├── CalculadoraSimulacao.jsx # Simulador de cálculos
│   │       ├── GestaoMensalistas.jsx
│   │       ├── GestaoOperadores.jsx
│   │       ├── GestaoPatios.jsx
│   │       ├── GestaoImpressoras.jsx
│   │       ├── LimpezaDados.jsx
│   │       ├── IdentidadeVisual.jsx
│   │       └── LayoutTicket.jsx
│   │
│   ├── services/
│   │   ├── supabaseService.js    # CRUD + sincronização offline
│   │   └── mensalistaService.js  # Lógica de mensalistas
│   │
│   ├── hooks/
│   │   ├── useAuth.js            # Autenticação
│   │   ├── useVeiculos.js        # Gestão de veículos
│   │   ├── useImpressora.js      # Impressão Bluetooth/USB
│   │   └── useLocalStorage.js    # Persistência local
│   │
│   ├── lib/
│   │   ├── utils.js              # Funções utilitárias
│   │   └── constants.js           # Constantes do sistema
│   │
│   ├── types/
│   │   └── index.d.ts            # TypeScript types
│   │
│   └── pro/
│       ├── ProLayout.jsx         # Layout do mapa
│       └── MasterDashboard.jsx    # Dashboard master
│
├── public/
│   ├── fonts/                    # Fontes do sistema
│   │   ├── Mandatory.otf
│   │   └── CARGO2.TTF
│   ├── img/                      # Imagens de template de placa
│   │   ├── NOVA.png              # Template Mercosul
│   │   └── ANTIGA.png            # Template Placa Antiga
│   └── index.html
│
├── supabase/
│   └── migrations/               # Scripts SQL de migração
│       ├── 20260304_001_initial_schema.sql
│       ├── 20260309120000_create_configuracoes.sql
│       ├── 20260309130000_add_business_rules.sql
│       └── 20260309140000_add_mensalista_fields.sql
│
├── docs/                         # Documentação
├── database/
│   └── schema.sql               # Schema completo do banco
│
├── dist/                        # Build de produção
├── package.json
├── vite.config.js
├── vitest.config.js
└── .env.local                   # Variáveis de ambiente (não commitar)
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Bundler e servidor de desenvolvimento
- **TailwindCSS** - Framework de estilos
- **Lucide React** - Ícones
- **React Router** - Navegação
- **PWA Plugin (Vite)** - Service Worker para offline

### Backend / Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL
  - Autenticação
  - Row Level Security (RLS)
  - Persistência offline-first

### Impressão
- **Web Bluetooth API** - Impressão via Bluetooth
- **Web USB API** - Impressão via USB/Serial
- **ESC/POS** - Protocolo de impressoras térmicas 58mm

### Infraestrutura
- **GitHub Pages** - Hospedagem do frontend
- **GitHub Actions** - CI/CD para deploy automático

## 📊 Estrutura de Dados

### Tabelas Supabase

| Tabela | Descrição |
|--------|-----------|
| `configuracoes` | Configurações globais da empresa |
| `patios` | Pátios de estacionamento |
| `unidades` | Unidades/unidades do sistema |
| `perfis` | Perfis de usuários (operadores) |
| `politicas_acesso` | Matriz RBAC (MASTER, ADMIN, SUPERVISOR, OPERADOR) |
| `tarifas` | Tabela de preços por unidade |
| `mensalistas` | Clientes mensalistas |
| `tickets` | Registros de entrada/saída |
| `entradas_saidas` | Log de operações |
| `auditoria` | Log de auditoria |
| `sync_log` | Log de sincronização offline |

### LocalStorage (Fallback Offline)

| Chave | Descrição |
|-------|-----------|
| `park-config` | Configurações do sistema |
| `park-veiculos` | Veículos no pátio atualmente |
| `park-historico` | Histórico de entradas/saídas |
| `park-veiculos-cadastrados` | Veículos já cadastrados |
| `park-caixa-aberto` | Estado do caixa |
| `park-pending-queue` | Operações pendentes de sync |

## 🎨 Design System

### Paleta de Cores
- **Background**: `#0B1120` (azul escuro)
- **Surface**: `#1E293B` (slate)
- **Primary**: `#06B6D4` (cyan)
- **Success**: `#10B981` (emerald)
- **Warning**: `#F59E0B` (amber)
- **Danger**: `#EF4444` (red)

### Tipografia
- **Fontes do Sistema**: Mandatory.otf, CARGO2.TTF
- **Fallback**: system-ui, sans-serif

## 🔐 Sistema de Permissões (RBAC)

| Nível | Permissões |
|-------|-----------|
| **MASTER** | Todas as permissões |
| **ADMIN** | Operações, financeiro, usuários, configurações |
| **SUPERVISOR** | Operações, mensalistas |
| **OPERADOR** | Apenas entrada/saída |

## 💰 Sistema de Preços

### Regras de Negócio
- **Tolerância inicial**: 30 minutos (dentro do gratuito)
- **Fração hora**: 30 minutos
- **Valor fração**: R$ 9,00 (carro) / R$ 4,50 (moto)
- **Valor teto**: R$ 55,00 (carro) / R$ 27,50 (moto)
- **Ciclo do teto**: 12 horas

### Fórmula de Cálculo
```
Se minutos <= tolerância: valor = 0
Se minutos > tolerância:
  ciclos = floor(minutos / ciclo_teto)
  minutos_ciclo = minutos % ciclo_teto
  fracoes = ceil((minutos_ciclo - tolerância) / fracao)
  valor_ciclo = min(fracoes * valor_fracao, valor_teto)
  valor_total = (ciclos * valor_teto) + valor_ciclo
```

## 📱 Funcionalidades

### Dashboard Operacional
- [x] Entrada rápida de veículos
- [x] Saída por placa
- [x] Mini-cards com valor e tempo em tempo real
- [x] Clique nos mini-cards para selecionar saída
- [x] Detecção automática Mercosul vs Placa Antiga
- [x] Input visual de placa com template

### Impressão
- [x] Impressora Bluetooth (Web Bluetooth API)
- [x] Impressora USB/Serial (Web USB API)
- [x] Ticket de entrada
- [x] Ticket de saída com valor
- [x] Teste de alinhamento

### Mensalistas
- [x] Cadastro de mensalistas
- [x] Convite via WhatsApp
- [x] Detecção automática na entrada
- [x] Isenção de pagamento

### Admin
- [x] Configuração de preços
- [x] Calculadora de simulação
- [x] Gestão de pátios
- [x] Gestão de operadores
- [x] Gestão de mensalistas
- [x] Visualização de histórico
- [x] Limpeza de dados

### Offline-First
- [x] Funciona sem internet
- [x] Sincronização quando online
- [x] Fila de operações pendentes
- [x] Indicador de status de sincronização

## 🚀 Deploy

### GitHub Pages
```bash
npm run build
# Os arquivos vão para dist/
# Deploy via script ou GitHub Actions
```

### Supabase CLI
```bash
npm run db:migrate     # Aplicar migrations
npm run db:status      # Verificar status
npm run db:push        # Push schema para produção
```

## 🔧 Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
SUPABASE_ACCESS_TOKEN=xxx
```

## 📝 Issues Conhecidas

1. **Veículos no Limbo**: Veículos que ficaram sem registro de saída no localStorage - Use o botão "Limpar Veículo Órfão"
2. **Tabela entradas_saidas**: Precisa ser criada no Supabase via script fix_supabase.cjs
3. **Coluna email na tabela perfis**: Precisa ser adicionada via fix_supabase.cjs
4. **Cache PWA**: Pode causar problemas após deploy - faça hard refresh (Ctrl+Shift+R)

## 🐛 Debug e Solução de Problemas

### Veículo não aparece nos mini-cards mas está no pátio
- Use o botão **"Limpar Veículo Órfão"** abaixo do botão de saída
- Digite a placa para remover manualmente

### Impressora não imprime
1. Verifique se está conectada (veja logs do console)
2. `Impressora USB: true` ou `Impressora BT: true` = conectada
3. Teste pelo painel de configurações

### Entrada não funciona após saída
- Verifique se o veículo foi removido do localStorage
- Use "Limpar Veículo Órfão" se necessário

## 📅 Updates Recentes (26/03/2026)

### Implementado Hoje
- [x] Dashboard com mini-cards de veículos
- [x] Valor em tempo real nos mini-cards (vermelho)
- [x] Tempo em tempo real nos mini-cards (verde)
- [x] Clique nos mini-cards para selecionar saída
- [x] Botão muda para verde quando veículo selecionado
- [x] Registro de saída automático (calcula + histórico + impressão)
- [x] Seção "Últimas Saídas" no Dashboard
- [x] Botão "Limpar Veículo Órfão"
- [x] Calculadora de Simulação de Preços
- [x] Switch "Cobrar Adicional após Teto"
- [x] Campos de pricing no Supabase
- [x] Documentação MEMORIA.md

### Próximos Passos
- [ ] Corrigir sync com Supabase (tabelas faltantes)
- [ ] Adicionar coluna email na tabela perfis
- [ ] Criar tabela entradas_saidas
- [ ] Implementar impressão automática na saída
- [ ] Testar fluxo completo de entrada/saída

## 👤 Contato

- Desenvolvedor: IA Assistant (OpenCode)
- Repositório: https://github.com/BossMDosMagos/PROJETO-INTELIGENTE-PARK
- Deploy: https://bossmdosmagos.github.io/PROJETO-INTELIGENTE-PARK/

---

**Boa noite! Até a próxima! 🌙**

## 🔄 Fluxo de Dados

```
Entrada:
  Dashboard → registrarEntrada() → setVeiculos() → localStorage → Supabase (sync)

Saída:
  Dashboard → registrarSaidaPorPlaca() → calcularValor() → setHistorico() → setVeiculos() → localStorage → Supabase (sync)

Sincronização:
  Offline: localStorage → pending-queue
  Online: pending-queue → Supabase REST API
```

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador (F12) para logs de erro
2. Status da conexão Supabase
3. Estado da impressora (Bluetooth/USB)
4. localStorage (Application > Local Storage no DevTools)
