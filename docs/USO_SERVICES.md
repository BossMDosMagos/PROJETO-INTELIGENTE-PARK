# Guia de Uso - Services Supabase

## 📚 Índice
1. [Política de Acesso (RBAC)](#política-de-acesso)
2. [Sincronização Offline](#sincronização-offline)
3. [Gerenciamento de Unidades](#gerenciamento-de-unidades)
4. [Gerenciamento de Mensalistas](#gerenciamento-de-mensalistas)
5. [Auditoria](#auditoria)

---

## 🔐 Política de Acesso

### Inicializar após login

```javascript
import { policiaAcessoService } from './services/policiaAcessoService';

// Após autenticação bem-sucedida
const perfil = await policiaAcessoService.inicializar(userId);

console.log(`Bem-vindo ${perfil.nome_completo}`);
console.log(`Nível: ${perfil.nivel_acesso}`);
```

### Verificar Permissões

#### ✅ Verificar permissão única

```javascript
if (policiaAcessoService.verificarPermissao('pode_fechar_caixa')) {
  // Exibir botão de fechar caixa
}
```

#### ✅ Verificar múltiplas permissões (AND)

```javascript
// Precisa de TODAS as permissões
if (policiaAcessoService.verificarPermissoes([
  'pode_editar_tarifa',
  'pode_editar_unidade'
])) {
  // Usar em edição de configurações
}
```

#### ✅ Verificar qualquer permissão (OR)

```javascript
// Precisa de qualquer Uma
if (policiaAcessoService.verificarAlgumaPermissao([
  'pode_gerar_comprovante',
  'pode_enviar_email'
])) {
  // Exibir opções de envio
}
```

### Verificar Nível de Acesso

```javascript
// Verificar se é MASTER
if (policiaAcessoService.ehMaster()) {
  return <PainelAdministrador />;
}

// Verificar se é ADMIN ou superior
if (policiaAcessoService.ehAdmin()) {
  return <PainelGerentes />;
}

// Verificar se é SUPERVISOR ou superior
if (policiaAcessoService.ehSupervisor()) {
  return <PainelSupervisors />;
}
```

### Verificar Acesso a Unidade

```javascript
const unidadeId = 'abc-123-def';

if (policiaAcessoService.temAcessoUnidade(unidadeId)) {
  // Carregar dados da unidade
  return <PainelUnidade unidadeId={unidadeId} />;
} else {
  return <div>Você não tem acesso a esta unidade</div>;
}
```

### Obter Unidades Acessíveis

```javascript
const unidades = policiaAcessoService.obterUnidadesAcessiveis();

// Se MASTER, retorna null (acesso ilimitado)
// Se ADMIN/SUPERVISOR, retorna array de UUIDs

if (unidades === null) {
  // Buscar TODAS as unidades
  const { data } = await supabaseService.client
    .from('unidades')
    .select('*');
} else {
  // Buscar apenas unidades do array
  const { data } = await supabaseService.client
    .from('unidades')
    .in('id', unidades);
}
```

### Usar Hook React

```jsx
import { usePermissoes } from './services/policiaAcessoService';

export function MeuComponente() {
  const { 
    temPermissao, 
    temAcesso,
    usuario,
    ehMaster,
    ehAdmin,
    nivelAcesso 
  } = usePermissoes();

  return (
    <div>
      <p>Bem-vindo, {usuario?.nome_completo}</p>
      
      {ehMaster && <p>Você é o MASTER!</p>}
      
      {temPermissao('pode_fechar_caixa') && (
        <button>Fechar Caixa</button>
      )}
      
      {temAcesso(unidadeId) ? (
        <PainelUnidade />
      ) : (
        <p>Acesso negado</p>
      )}
    </div>
  );
}
```

### Registrar Auditoria

```javascript
// Quando editar algo importante
await policiaAcessoService.registrarAuditoria(
  'tickets',           // tabela afetada
  'UPDATE',            // tipo de operação
  ticketId,            // ID do registro
  ticketAntigo,        // dados anteriores
  ticketNovo,          // dados novos
  'Valor aumentado de R$ 10,00 para R$ 15,00' // descrição
);
```

### Ver Matriz de Permissões (Debug)

```javascript
const matriz = policiaAcessoService.obterMatrizPermissoes();

console.table(matriz.permissoes);
// {
//   pode_cancelar_ticket: true,
//   pode_editar_tarifa: true,
//   pode_fechar_caixa: true,
//   ...
// }
```

---

## 🔄 Sincronização Offline

### Adicionar Operação (será sincronizada depois)

```javascript
import { offlineSyncService } from './services/offlineSyncService';

// Registrar entrada (quando offline)
const opId = await offlineSyncService.adicionarOperacao(
  'tickets',           // tabela
  'INSERT',            // tipo
  {                    // registro
    placa: 'ABC-1234',
    data_entrada: new Date().toISOString(),
    id_unidade: unidadeId
  }
);

console.log(`Operação registrada: ${opId}`);
```

### Forçar Sincronização

```javascript
// Sincronizar agora mesmo (se online)
await offlineSyncService.sincronizar();
```

### Monitorar Status

```javascript
// Obter status atual
const status = offlineSyncService.obterStatus();

console.log({
  online: status.isOnline,
  sincronizando: status.isSyncing,
  filaCount: status.filaCount,
  fila: status.fila
});
```

### Escutar Mudanças

```javascript
// Callback é chamado sempre que algo muda
const unsubscribe = offlineSyncService.onMudancaStatus((evento) => {
  console.log(evento.evento); // 'sync_start', 'sync_complete', 'online', 'offline'
  console.log(evento.dados);  // dados da operação
  console.log(evento.status); // status atual
  
  // Exemplo: atualizar UI quando sincronizar
  if (evento.evento === 'sync_complete') {
    console.log(`Sincronizadas ${evento.dados.operacoesSincronizadas} operações`);
  }
});

// Desinscrever quando não precisar mais
// unsubscribe();
```

### Usar Hook React

```jsx
import { useSyncStatus } from './services/offlineSyncService';

export function IndicadorConexao() {
  const { isOnline, isSyncing, filaCount } = useSyncStatus();

  return (
    <div>
      {isOnline ? (
        <span className="text-green-600">🟢 Online</span>
      ) : (
        <span className="text-red-600">🔴 Offline</span>
      )}
      
      {isSyncing && <span className="text-yellow-600">🔄 Sincronizando...</span>}
      
      {filaCount > 0 && (
        <span className="text-orange-600">
          {filaCount} operações pendentes
        </span>
      )}
    </div>
  );
}
```

### Exportar/Importar Dados

```javascript
// Exportar para backup
const backup = offlineSyncService.exportarDados();
localStorage.setItem('emergency-backup', JSON.stringify(backup));

// Importar de backup
const backupRestored = JSON.parse(localStorage.getItem('emergency-backup'));
offlineSyncService.importarDados(backupRestored);
```

---

## 🏢 Gerenciamento de Unidades

### Criar Unidade (Modal)

```jsx
import { ModalCadastroUnidade } from './components/ModalCadastroUnidade';
import { useState } from 'react';

export function AdminPanel() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Nova Unidade
      </button>

      <ModalCadastroUnidade
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSucesso={(unidade) => {
          console.log('Unidade criada:', unidade);
          // Recarregar lista de unidades
        }}
      />
    </>
  );
}
```

### Listar Unidades

```javascript
// Todos (se MASTER)
const { data: unidades } = await supabaseService.client
  .from('unidades')
  .select('*')
  .eq('status', 'ATIVA')
  .order('nome');

// Apenas minhas unidades (se ADMIN/SUPERVISOR)
const minhasUnidades = policiaAcessoService.obterUnidadesAcessiveis();
const { data } = await supabaseService.client
  .from('unidades')
  .select('*')
  .in('id', minhasUnidades);
```

### Atualizar Unidade

```javascript
const { error } = await supabaseService.client
  .from('unidades')
  .update({
    capacidade_total: 100,
    horario_abertura: '07:00'
  })
  .eq('id', unidadeId);

if (!error) {
  await policiaAcessoService.registrarAuditoria(
    'unidades',
    'UPDATE',
    unidadeId,
    { capacidade_total: 50 },
    { capacidade_total: 100 },
    'Aumentada capacidade de 50 para 100 vagas'
  );
}
```

---

## 👥 Gerenciamento de Mensalistas

### Criar Mensalista

```javascript
const novoMensalista = {
  id_unidade: unidadeId,
  nome: 'João Silva',
  cpf: '12345678901',
  placa: 'ABC-1234',
  modelo: 'GOL',
  cor: 'PRETO',
  status: 'PENDENTE',
  telefone: '11987654321',
  whatsapp: '11987654321'
};

const { data } = await supabaseService.client
  .from('mensalistas')
  .insert([novoMensalista])
  .select()
  .single();
```

### Ativar Mensalista

```javascript
// Ativar por 30 dias
const dataVencimento = new Date();
dataVencimento.setDate(dataVencimento.getDate() + 30);

const { data } = await supabaseService.client
  .from('mensalistas')
  .update({
    status: 'ATIVO',
    data_ativacao: new Date().toISOString(),
    data_vencimento: dataVencimento.toISOString()
  })
  .eq('id', mensalistaId)
  .select()
  .single();

// Enviar notificação WhatsApp
// await gerarComprovante(data);
```

### Verificar Mensalista (no registro de entrada)

```javascript
function verificarMensalista(placa) {
  const { data: mensalista } = await supabaseService.client
    .from('mensalistas')
    .select('*')
    .eq('placa', placa.toUpperCase())
    .single();

  if (!mensalista) {
    return { valido: false, mensagem: 'Não é mensalista' };
  }

  if (mensalista.status !== 'ATIVO') {
    return { valido: false, mensagem: `Status: ${mensalista.status}` };
  }

  const vencimento = new Date(mensalista.data_vencimento);
  if (vencimento < new Date()) {
    return { valido: false, mensagem: 'Mensalidade vencida' };
  }

  return { valido: true, mensalista };
}
```

---

## 📝 Auditoria

### Visualizar Logs

```javascript
// Apenas MASTER vê tudo, ADMIN vê sua unidade
const unidadeId = policiaAcessoService.obterUsuarioAtual().id_unidade_principal;

const { data: logs } = await supabaseService.client
  .from('auditoria')
  .select('*')
  .eq('id_unidade', unidadeId)
  .order('created_at', { ascending: false })
  .limit(100);

logs.forEach(log => {
  console.log(`${log.operacao} em ${log.tabela_afetada}`);
  console.log(`Por: ${log.usuario_nome}`);
  console.log(`Descrição: ${log.descricao}`);
});
```

### Ver Alterações Específicas

```javascript
// Ver histórico de um ticket
const { data: historico } = await supabaseService.client
  .from('auditoria')
  .select('*')
  .eq('tabela_afetada', 'tickets')
  .eq('id_registro', ticketId)
  .order('created_at', { ascending: true });

historico.forEach(log => {
  console.log('Antes:', log.dados_antes);
  console.log('Depois:', log.dados_depois);
  console.log('Hora:', log.created_at);
});
```

---

## 🎯 Fluxo Completo: Registrar Entrada

```jsx
import { useState } from 'react';
import { policiaAcessoService } from './services/policiaAcessoService';
import { offlineSyncService } from './services/offlineSyncService';

export function RegistroEntrada() {
  const [placa, setPlaca] = useState('');

  async function handleRegistro(e) {
    e.preventDefault();

    // 1. Verificar permissão
    if (!policiaAcessoService.verificarPermissao('pode_registrar_entrada')) {
      alert('Você não tem permissão');
      return;
    }

    // 2. Verificar mensalista
    const { data: mensalista } = await supabaseService.client
      .from('mensalistas')
      .select('*')
      .eq('placa', placa.toUpperCase())
      .eq('status', 'ATIVO')
      .single();

    // 3. Criar ticket
    const novoTicket = {
      id_unidade: policiaAcessoService.usuarioAtual.id_unidade_principal,
      placa: placa.toUpperCase(),
      data_entrada: new Date().toISOString(),
      id_mensalista: mensalista?.id || null,
      eh_mensalista: !!mensalista,
      operador_entrada_id: policiaAcessoService.usuarioAtual.id,
      status: 'ATIVO'
    };

    // 4. Adicionar à fila offline
    await offlineSyncService.adicionarOperacao(
      'tickets',
      'INSERT',
      novoTicket
    );

    // 5. Registrar auditoria
    await policiaAcessoService.registrarAuditoria(
      'tickets',
      'INSERT',
      novoTicket.placa,
      {},
      novoTicket,
      `Entrada registrada: ${placa}`
    );

    alert('✅ Entrada registrada');
  }

  return (
    <form onSubmit={handleRegistro}>
      <input
        type="text"
        value={placa}
        onChange={(e) => setPlaca(e.target.value)}
        placeholder="ABC-1234"
      />
      <button type="submit">Registrar Entrada</button>
    </form>
  );
}
```

---

## 🔗 Integração Completa no App

```jsx
// App.jsx
import { useEffect } from 'react';
import { policiaAcessoService } from './services/policiaAcessoService';
import { offlineSyncService } from './services/offlineSyncService';

function App() {
  useEffect(() => {
    // Após login bem-sucedido
    const handleLogin = async (userId) => {
      // 1. Inicializar política de acesso
      await policiaAcessoService.inicializar(userId);
      
      // 2. Carregar fila offline
      offlineSyncService.carregarFila();
      
      // 3. Sincronizar agora se online
      if (navigator.onLine) {
        await offlineSyncService.sincronizar();
      }
    };

    // Listener de mudanças offline/online
    offlineSyncService.onMudancaStatus((evento) => {
      switch (evento.evento) {
        case 'online':
          console.log('📡 Conectado - Iniciando sincronização');
          offlineSyncService.sincronizar();
          break;
        case 'offline':
          console.log('📴 Desconectado - Modo offline ativo');
          break;
        case 'sync_complete':
          console.log(`✅ ${evento.dados.operacoesSincronizadas} operações sincronizadas`);
          break;
      }
    });

  }, []);

  return (
    <div>
      {/* Sua app aqui */}
    </div>
  );
}

export default App;
```

---

## 📊 Status Checker (Debug)

```javascript
// Execute no console do navegador
import { policiaAcessoService } from './services/policiaAcessoService';
import { offlineSyncService } from './services/offlineSyncService';

window.debug = {
  usuario: () => policiaAcessoService.obterUsuarioAtual(),
  permissoes: () => policiaAcessoService.obterMatrizPermissoes(),
  sync: () => offlineSyncService.obterStatus(),
  backup: () => offlineSyncService.exportarDados()
};

// Usar:
debug.usuario(); // Ver perfil do usuário
debug.permissoes(); // Ver matriz de permissões
debug.sync(); // Ver status de sincronização
debug.backup(); // Fazer backup de emergência
```

---

## ✅ Checklist de Implementação

- [ ] Supabase criado e schema criado
- [ ] Variáveis de ambiente configuradas
- [ ] `policiaAcessoService` inicializado após login
- [ ] `offlineSyncService` monitorando status
- [ ] Modal de cadastro funcionando
- [ ] Permissões sendo verificadas em componentes críticos
- [ ] Auditoria sendo registrada em operações importantes
- [ ] Sincronização offline testada
- [ ] Backup de emergência implementado
- [ ] Testes e2e executados
