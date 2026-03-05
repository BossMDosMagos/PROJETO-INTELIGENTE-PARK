# 🚀 Guia Rápido de Uso - Sistema de Componentes

## Importações Essenciais

```jsx
// Sistema de design
import DESIGN from './design-system';

// Componentes de formulário
import { Input, TextArea, Select } from './components/Input';

// Componentes de container
import { Card, CardGrid, Alert, Badge } from './components/Card';

// Componentes de diálogo
import { Modal, ConfirmDialog, Drawer } from './components/Modal';

// Componentes de dados
import { Table, DataGrid } from './components/Table';

// Componentes básicos
import { Button } from './components/Button';
import HeaderRedesenhado from './components/HeaderRedesenhado';
import { StatusSincronizacao } from './components/StatusSincronizacao';
```

---

## 1️⃣ Usando Cores do Design System

```jsx
// Todas as cores disponíveis em DESIGN.colors
const exemplo = {
  primaryBlue: DESIGN.colors.primary[500],      // #3b82f6
  successGreen: DESIGN.colors.success[500],     // #22c55e
  warningOrange: DESIGN.colors.warning[500],    // #fb923c
  dangerRed: DESIGN.colors.danger[500],         // #ef4444
  textDark: DESIGN.colors.neutral[900],         // #111827
  textLight: DESIGN.colors.neutral[50],         // #fafafa
  
  // Escalas: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
};
```

## 2️⃣ Usando Espaçamento

```jsx
// Escalas: xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px), 3xl(64px), 4xl(80px)
<div style={{ padding: DESIGN.spacing.md }}>
  <p style={{ marginBottom: DESIGN.spacing.sm }}>Texto</p>
</div>
```

## 3️⃣ Botões Diversos

```jsx
// Variantes: primary, secondary, danger, outline, ghost, disabled
// Tamanhos: sm, md, lg, xl

<Button variant="primary" size="md" onClick={handleClick}>
  Salvar
</Button>

<Button variant="danger" size="sm">
  Deletar
</Button>

<Button variant="outline" fullWidth>
  Largura Completa
</Button>

<Button variant="ghost" disabled>
  Desabilitado
</Button>
```

## 4️⃣ Campos de Entrada

```jsx
const [estado, setEstado] = useState('');

// Campo de texto
<Input
  label="Nome Completo"
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
  placeholder="Digite aqui..."
  variant="primary"
  error={!estado ? 'Campo obrigatório' : ''}
  hint="Mínimo 3 caracteres"
/>

// Múltiplas linhas
<TextArea
  label="Descrição"
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
  rows={4}
  placeholder="Digite uma descrição..."
/>

// Seleção
<Select
  label="Tipo de Usuário"
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
  options={[
    { value: 'admin', label: 'Administrador' },
    { value: 'operador', label: 'Operador' },
    { value: 'cliente', label: 'Cliente' }
  ]}
/>
```

## 5️⃣ Cards e Layouts

```jsx
// Card simples
<Card title="Título do Card" variant="primary">
  <p>Conteúdo do card</p>
</Card>

// Card com subtítulo
<Card 
  title="Dados" 
  subtitle="Informações do usuário"
  variant="success"
  shadow="lg"
  padding="lg"
>
  Conteúdo
</Card>

// Grid de Cards
<CardGrid columns={2} gap="md">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
  <Card>Card 4</Card>
</CardGrid>

// Alertas
<Alert type="success" title="Sucesso!" dismissible>
  Operação realizada com sucesso!
</Alert>

<Alert type="warning">
  Atenção: Este campo é obrigatório
</Alert>

// Badges
<Badge variant="primary">Ativo</Badge>
<Badge variant="danger" size="sm">Inativo</Badge>
```

## 6️⃣ Modais e Diálogos

```jsx
const [showModal, setShowModal] = useState(false);

// Modal simples
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Editar Usuário"
  size="md"
>
  <Input label="Nome" placeholder="..." />
  <div style={{ textAlign: 'right', marginTop: DESIGN.spacing.lg }}>
    <Button variant="primary" onClick={() => setShowModal(false)}>
      Salvar
    </Button>
  </div>
</Modal>

// Diálogo de confirmação
<ConfirmDialog
  isOpen={showConfirm}
  title="Confirmar Deleção"
  message="Tem certeza que deseja deletar este registro?"
  variant="danger"
  confirmText="Deletar"
  cancelText="Cancelar"
  onConfirm={() => handleDelete()}
  onCancel={() => setShowConfirm(false)}
/>

// Drawer (painel lateral)
<Drawer
  isOpen={showDrawer}
  onClose={() => setShowDrawer(false)}
  title="Menu"
  position="left"
  width="300px"
>
  <Button fullWidth variant="outline">Opção 1</Button>
  <Button fullWidth variant="outline">Opção 2</Button>
  <Button fullWidth variant="outline">Opção 3</Button>
</Drawer>
```

## 7️⃣ Tabelas de Dados

```jsx
// Tabela simples
const colunas = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'Email', align: 'left' },
  { key: 'status', label: 'Status' }
];

const dados = [
  { id: 1, nome: 'João', email: 'joao@email.com', status: 'Ativo' },
  { id: 2, nome: 'Maria', email: 'maria@email.com', status: 'Ativo' },
  { id: 3, nome: 'Pedro', email: 'pedro@email.com', status: 'Inativo' }
];

<Table 
  columns={colunas} 
  data={dados}
  striped
  hover
  sortable
  onRowClick={(row) => console.log(row)}
/>

// Tabela com paginação e busca
<DataGrid
  columns={colunas}
  data={dados}
  pageSize={10}
  onRowClick={(row) => console.log(row)}
/>
```

## 🎨 Variantes de Componentes

### Variantes do Card
- `default` - Neutro, cinza
- `primary` - Azul, destaque principal
- `success` - Verde, sucesso
- `warning` - Laranja, aviso
- `danger` - Vermelho, erro

### Variantes do Alert
- `info` - Azul, informação
- `success` - Verde, sucesso
- `warning` - Laranja, aviso
- `danger` - Vermelho, erro

### Variantes do Button
- `primary` - Azul cheio
- `secondary` - Cinza alternativo
- `danger` - Vermelho para ações destrutivas
- `outline` - Borda com fundo transparente
- `ghost` - Apenas texto
- `disabled` - Desabilitado

### Tamanhos de Button
- `sm` - 36px altura, texto pequenininho
- `md` - 44px altura, texto normal (padrão)
- `lg` - 52px altura, texto maior
- `xl` - 64px altura, texto grande

## 📱 Layout Mobile/Desktop

```jsx
// Os componentes já são responsivos!
// Em mobile (< 640px): Cards empilham, tabelas scroll horizontal
// Em desktop (≥ 1024px): Layouts completos, grids em 2+ colunas

const isMobile = window.innerWidth < 640;

<CardGrid columns={isMobile ? 1 : 2} gap="md">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
</CardGrid>
```

## 🎯 Padrões Comuns

### Formulário Completo
```jsx
const [form, setForm] = useState({
  nome: '',
  email: '',
  tipo: '',
  descricao: ''
});

const [erro, setErro] = useState('');

const handleSubmit = () => {
  if (!form.nome) {
    setErro('Nome é obrigatório');
    return;
  }
  // Submit logic
};

return (
  <Card title="Novo Registro" variant="primary">
    {erro && <Alert type="danger">{erro}</Alert>}
    
    <Input
      label="Nome"
      value={form.nome}
      onChange={(e) => setForm({...form, nome: e.target.value})}
    />
    <Input
      type="email"
      label="Email"
      value={form.email}
      onChange={(e) => setForm({...form, email: e.target.value})}
    />
    <Select
      label="Tipo"
      value={form.tipo}
      onChange={(e) => setForm({...form, tipo: e.target.value})}
      options={[...]}
    />
    
    <Button variant="primary" fullWidth onClick={handleSubmit}>
      Salvar
    </Button>
  </Card>
);
```

### Lista com Ações
```jsx
const [lista, setLista] = useState([...]);
const [confirmDelete, setConfirmDelete] = useState(null);

const colunas = [
  { key: 'nome', label: 'Nome' },
  { 
    key: 'acoes', 
    label: 'Ações',
    render: (row) => (
      <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
        <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
          Editar
        </Button>
        <Button 
          size="sm" 
          variant="danger" 
          onClick={() => setConfirmDelete(row)}
        >
          Deletar
        </Button>
      </div>
    )
  }
];

return (
  <>
    <Table columns={colunas} data={lista} />
    
    {confirmDelete && (
      <ConfirmDialog
        isOpen={true}
        title="Confirmar"
        message="Deseja deletar este item?"
        variant="danger"
        onConfirm={() => {
          setLista(lista.filter(i => i.id !== confirmDelete.id));
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    )}
  </>
);
```

---

## ✨ Próximas Integrações Recomendadas

1. **Login Form** → Use `Input` + `Button`
2. **Admin Panels** → Use `Card` + `Table` + `Modal`
3. **Operador List** → Use `DataGrid` com pagination
4. **Confirmações** → Use `ConfirmDialog`
5. **Notificações** → Use `Alert` com `dismissible`

---

**Todos os componentes estão prontos para uso imediato! 🚀**
