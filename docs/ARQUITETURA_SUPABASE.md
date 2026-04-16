# Arquitetura Supabase - Sistema Inteligente Park

## 📊 Visão Geral

Sistema de gestão de múltiplos pátios de estacionamento com:
- **Autenticação**: JWT via Supabase Auth
- **Autorização**: RBAC (Role-Based Access Control) com 4 níveis
- **Sincronização**: Offline-First com replicação automática
- **Auditoria**: Log completo de todas as operações

---

## 👥 Hierarquia de Acesso

```
MASTER (Proprietário)
  ├─ Vê todas as 20 unidades
  ├─ Controle total financeiro
  └─ Delegação de permissões

ADMIN (Gerente de Unidade)
  ├─ Vê apenas sua unidade
  ├─ Acesso financeiro completo
  └─ Gerencia supervisores e operadores

SUPERVISOR (Chefe de Turno)
  ├─ Monitora operadores
  ├─ Gera relatórios simples
  └─ Não acessa financeiro

OPERADOR (Atendente)
  ├─ Registro entrada/saída
  ├─ Cobra tarifa
  └─ Enxerga apenas o seu pátio
```

---

## 🗄️ Estrutura de Dados por Entidade

### 1️⃣ UNIDADES (Pátios)

```javascript
{
  id: UUID,                    // PK
  nome: string,               // "Pátio Centro Histórico"
  endereco: string,           // Endereço completo
  endereco_numero: string,
  endereco_complemento: string,
  cidade: string,
  estado: string,
  cep: string,
  latitude: number,           // Para geolocalização
  longitude: number,
  cnpj: string,              // Identificador legal ÚNICO
  telefone: string,
  email: string,
  responsavel: string,        // Nome do responsável
  capacidade_total: integer,  // Vagas totais
  vagas_disponiveis: integer, // Atualizado em tempo real
  
  // Configuração
  horario_abertura: string,   // "08:00"
  horario_fechamento: string, // "22:00"
  aceita_online: boolean,
  aceita_mensalistas: boolean,
  
  // Status
  status: enum('ATIVA', 'INATIVA', 'SUSPENSA'),
  
  // Timestamps
  created_at: timestamp,
  updated_at: timestamp,
  created_by: UUID,           // Referência ao usuário
}
```

---

### 2️⃣ USUÁRIOS E PERFIS

#### Tabela: `perfis`

```javascript
{
  id: UUID,                   // PK
  user_id: UUID,              // FK → auth.users
  nome_completo: string,
  cpf: string,                // ÚNICO
  rg: string,
  
  // Acesso
  nivel_acesso: enum('MASTER', 'ADMIN', 'SUPERVISOR', 'OPERADOR'),
  id_unidade_principal: UUID, // FK → unidades
  unidades_permissao: UUID[], // Array de UUIDs - quais unidades pode acessar
  
  // Contato
  telefone: string,
  email: string,
  
  // Documentação
  data_nascimento: date,
  endereco: string,
  cidade: string,
  estado: string,
  cep: string,
  
  // Status
  ativo: boolean,
  data_admissao: date,
  data_demissao: date,
  
  // Timestamps
  created_at: timestamp,
  updated_at: timestamp,
}
```

#### Tabela: `politicas_acesso`

```javascript
{
  id: UUID,                           // PK
  nivel: enum('MASTER', 'ADMIN', 'SUPERVISOR', 'OPERADOR'),
  
  // Permissões de Ticket/Operacional
  pode_registrar_entrada: boolean,    // true, false, false, true
  pode_registrar_saida: boolean,      // true, true, true, true
  pode_cancelar_ticket: boolean,      // true, true, false, false
  pode_editar_valor_pago: boolean,    // true, true, false, false
  pode_gerar_comprovante: boolean,    // true, true, true, true
  
  // Permissões Financeiras
  pode_fechar_caixa: boolean,         // true, true, false, false
  pode_abrir_caixa: boolean,          // true, true, false, false
  pode_ver_financeiro_unidade: boolean, // true, true, true, false
  pode_ver_financeiro_geral: boolean, // true, false, false, false
  pode_gerar_boletos: boolean,        // true, true, false, false
  
  // Permissões Administrativas
  pode_cadastrar_usuarios: boolean,   // true, true, false, false
  pode_editar_usuarios: boolean,      // true, true, false, false
  pode_deletar_usuarios: boolean,     // true, false, false, false
  pode_editar_tarifa: boolean,        // true, true, false, false
  pode_editar_unidade: boolean,       // true, true, false, false
  pode_ver_auditoria: boolean,        // true, true, false, false
  
  // Permissões de Mensalista
  pode_cadastrar_mensalista: boolean, // true, true, false, false
  pode_editar_mensalista: boolean,    // true, true, false, false
  pode_deletar_mensalista: boolean,   // true, false, false, false
  
  // Timestamps
  created_at: timestamp,
  updated_at: timestamp,
}
```

---

### 3️⃣ MOVIMENTAÇÃO (Tickets)

#### Tabela: `tickets`

```javascript
{
  id: UUID,                   // PK
  id_unidade: UUID,           // FK → unidades (para particionamento)
  
  // Identificação do Veículo
  placa: string,              // "ABC-1234" - ÍNDICE para busca
  placa_normalizada: string,  // "ABC1234" - busca flexível
  modelo: string,
  cor: string,
  marca: string,
  
  // Registro de Tempo
  data_entrada: timestamp,    // com timezone
  data_saida: timestamp NULL, // ainda estacionado
  duracao_minutos: integer NULL,
  
  // Mensalista
  id_mensalista: UUID NULL,   // FK → mensalistas
  eh_mensalista: boolean,
  
  // Financeiro
  valor_tarifa: decimal,
  desconto: decimal DEFAULT 0,
  valor_pago: decimal,
  forma_pagamento: string,    // DINHEIRO, DEBITO, CREDITO, PIX
  
  // Status
  status: enum('ATIVO', 'PAGO', 'CANCELADO', 'CORTESIA'),
  motivo_cancelamento: string NULL,
  
  // Operador
  operador_entrada_id: UUID,  // FK → perfis
  operador_saida_id: UUID NULL, // FK → perfis
  
  // Timestamps
  created_at: timestamp,
  updated_at: timestamp,
  deleted_at: timestamp NULL, // soft delete
}
```

#### Tabela: `mensalistas`

```javascript
{
  id: UUID,                   // PK
  id_unidade: UUID,           // FK → unidades
  
  // Identificação
  nome: string,
  cpf: string,                // ÚNICO por unidade
  rg: string,
  
  // Contato
  telefone: string,
  whatsapp: string,
  email: string,
  
  // Endereço
  endereco: string,
  numero: string,
  complemento: string,
  cidade: string,
  estado: string,
  cep: string,
  
  // Veículo
  placa: string,              // ÚNICO por unidade
  modelo: string,
  cor: string,
  marca: string,
  ano: integer,
  renavam: string NULL,
  
  // Status
  status: enum('PENDENTE', 'ATIVO', 'SUSPENSO', 'CANCELADO'),
  data_ativacao: date NULL,
  data_vencimento: date NULL,
  duracao_vigencia_dias: integer DEFAULT 30,
  
  // Financeiro
  valor_mensalidade: decimal,
  data_proxima_cobranca: date NULL,
  
  // Documentação
  data_criacao: timestamp,
  data_cancelamento: timestamp NULL,
  
  // Timestamps
  created_at: timestamp,
  updated_at: timestamp,
}
```

---

### 4️⃣ TARIFAS

#### Tabela: `tarifas`

```javascript
{
  id: UUID,                   // PK
  id_unidade: UUID,           // FK → unidades (tarifas por unidade)
  
  // Configuração
  nome: string,               // "Tarifa Padrão", "Meio Período"
  descricao: string,
  
  // Faixas de Preço
  primeira_hora_minutos: integer,    // 60
  valor_primeira_hora: decimal,
  
  valor_hora_adicional: decimal,
  valor_meia_hora_adicional: decimal,
  
  valor_maximo_diario: decimal,      // Teto de preço por dia
  
  // Especiais
  valor_mensalista: decimal,         // Tarifa reduzida
  percentual_desconto_mensalista: integer, // 30%
  
  // Validade
  data_vigencia_inicio: date,
  data_vigencia_fim: date NULL,
  
  // Status
  ativo: boolean,
  
  // Timestamps
  created_at: timestamp,
  updated_at: timestamp,
}
```

---

### 5️⃣ LOGS DE AUDITORIA

#### Tabela: `auditoria`

```javascript
{
  id: UUID,                   // PK
  id_unidade: UUID,           // FK → unidades
  
  // Ação
  tabela_afetada: string,     // "tickets", "perfis", "tarifas"
  operacao: enum('INSERT', 'UPDATE', 'DELETE'),
  id_registro: UUID,          // ID do registro modificado
  
  // Dados
  dados_antes: JSONB,         // Snapshot antes
  dados_depois: JSONB,        // Snapshot depois
  
  // Usuário
  usuario_id: UUID,           // FK → auth.users
  usuario_nome: string,       // Desnormalizado para relatório
  
  // Detalhes
  descricao: string,
  ip_address: string,
  user_agent: string,
  
  // Timestamps
  created_at: timestamp,
}
```

---

## 📱 Objeto JSON para Modo Offline

```javascript
{
  // Identificação do sincronismo
  syncId: UUID,                    // Única requisição de sync
  timestamp: ISO8601,
  deviceId: string,                // Identificación do dispositivo
  userId: UUID,
  unidadeId: UUID,
  
  // Operações pendentes (fila)
  pendingOperations: [
    {
      id: UUID,                    // ID único da operação
      type: 'INSERT' | 'UPDATE' | 'DELETE',
      table: 'tickets' | 'mensalistas' | 'caixa',
      record: {...},               // Dados da operação
      timestamp: ISO8601,
      synced: false,
      retryCount: 0,
      lastError: string NULL,
    }
  ],
  
  // Cache local (dados sincronizados)
  cache: {
    unidade: {...},               // Dados da unidade
    perfil: {...},                // Dados do usuário
    tickets: [...],               // Últimos 100 tickets
    mensalistas: [...],           // Todos os mensalistas ativas
    tarifas: {...},               // Tarifa ativa
  },
  
  // Metadados
  metadata: {
    lastSyncTime: ISO8601,
    lastSyncId: UUID,
    isOnline: boolean,
    cacheVersion: string,
    appVersion: string,
  }
}
```

---

## 🔒 Segurança e Row Level Security (RLS)

```sql
-- Exemplo: Usuários veem apenas sua unidade
CREATE POLICY "users_see_own_unit" ON tickets
  FOR SELECT
  USING (
    id_unidade IN (
      SELECT unidades_permissao FROM perfis
      WHERE user_id = auth.uid()
    )
    OR (SELECT nivel_acesso FROM perfis WHERE user_id = auth.uid()) = 'MASTER'
  );
```

---

## 📈 Índices Recomendados

```sql
-- Busca de tickets por unidade
CREATE INDEX idx_tickets_unidade_data ON tickets(id_unidade, data_entrada DESC);

-- Busca por placa
CREATE INDEX idx_tickets_placa ON tickets(placa_normalizada);

-- Mensalistas ativas
CREATE INDEX idx_mensalistas_status ON mensalistas(id_unidade, status);

-- Performance de auditoria
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id, created_at DESC);
```

---

## 🔄 Fluxo de Sincronização Offline

```
App Offline
    ↓
[Fila de Operações] → LocalStorage/IndexedDB
    ↓
[Detecça de Conexão]
    ↓
App Online
    ↓
[Validação de Conflitos]
    ↓
[Replicação Supabase]
    ↓
[Atualização de Cache]
    ↓
[Limpeza de Fila]
```

---

## 🛡️ Matriz de Permissões RBAC

| Permissão | MASTER | ADMIN | SUPERVISOR | OPERADOR |
|-----------|--------|-------|------------|----------|
| Registrar entrada | ✅ | ✅ | ✅ | ✅ |
| Registrar saída | ✅ | ✅ | ✅ | ✅ |
| Cancelar ticket | ✅ | ✅ | ❌ | ❌ |
| Editar valor | ✅ | ✅ | ❌ | ❌ |
| Fechar caixa | ✅ | ✅ | ❌ | ❌ |
| Ver financeiro | ✅ | ✅ | ❌ | ❌ |
| Criar usuário | ✅ | ✅ | ❌ | ❌ |
| Editar tarifa | ✅ | ✅ | ❌ | ❌ |
| Gerir mensalistas | ✅ | ✅ | ❌ | ❌ |
| Ver auditoria | ✅ | ✅ | ❌ | ❌ |
| Ver todas unidades | ✅ | ❌ | ❌ | ❌ |

