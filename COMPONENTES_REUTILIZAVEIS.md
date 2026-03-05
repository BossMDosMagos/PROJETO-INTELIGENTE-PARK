# 📦 Componentes Reutilizáveis - Guia Rápido

## Sistema de Design - Fase 2: Componentes Funcionais

Componentes criados: **Input**, **TextArea**, **Select**, **Card**, **CardGrid**, **Alert**, **Badge**

---

## 1️⃣ **Input Component**

Campo de entrada com design system integrado.

### Props:
- `type` - 'text', 'number', 'email', 'password', 'date', etc.
- `value` - Valor do input
- `onChange` - Handler para mudanças
- `label` - Rótulo do campo
- `placeholder` - Texto de placeholder
- `variant` - 'primary' (default), 'success', 'warning', 'error'
- `disabled` - Desabilitar campo
- `error` - Mensagem de erro
- `hint` - Texto auxiliar
- `fullWidth` - Tomar 100% de largura (default: true)

### Exemplo:
```jsx
import { Input } from './components/Input';

<Input
  type="text"
  label="Placa do Veículo"
  placeholder="ABC-1234"
  value={placa}
  onChange={(e) => setPlaca(e.target.value)}
  error={placaError}
  hint="Formato: ABC-1234 ou ABC-1D23"
/>
```

---

## 2️⃣ **TextArea Component**

Área de texto multi-linha com design system.

### Props:
- `value` - Valor inicial
- `onChange` - Handler para mudanças
- `label` - Rótulo
- `placeholder` - Placeholder
- `rows` - Número de linhas (default: 4)
- `variant` - 'primary', 'success', 'warning', 'error'
- `error` - Mensagem de erro
- `hint` - Texto auxiliar
- `fullWidth` - Tomar 100% (default: true)

### Exemplo:
```jsx
import { TextArea } from './components/Input';

<TextArea
  label="Descrição"
  placeholder="Digite a descrição..."
  value={desc}
  onChange={(e) => setDesc(e.target.value)}
  rows={5}
/>
```

---

## 3️⃣ **Select Component**

Dropdown com design system.

### Props:
- `value` - Valor selecionado
- `onChange` - Handler
- `options` - Array de `{ value, label }`
- `label` - Rótulo
- `placeholder` - Texto padrão
- `disabled` - Desabilitar
- `error` - Mensagem de erro

### Exemplo:
```jsx
import { Select } from './components/Input';

<Select
  label="Tipo de Veículo"
  value={tipo}
  onChange={(e) => setTipo(e.target.value)}
  options={[
    { value: 'carro', label: '🚗 Carro' },
    { value: 'moto', label: '🏍️ Moto' }
  ]}
/>
```

---

## 4️⃣ **Card Component**

Container com design system styling.

### Props:
- `title` - Título do card
- `subtitle` - Subtítulo
- `variant` - 'default', 'primary', 'success', 'warning', 'danger'
- `shadow` - Mostrar sombra (default: true)
- `padding` - Tamanho de padding: 'sm', 'md', 'lg'
- `onClick` - Clique no card
- `interactive` - Enable hover effects
- `children` - Conteúdo interno

### Exemplo:
```jsx
import { Card } from './components/Card';

<Card 
  title="Veículos no Pátio"
  subtitle="5 veículos cadastrados"
  variant="primary"
>
  <p>Conteúdo aqui...</p>
</Card>
```

---

## 5️⃣ **CardGrid Component**

Grid responsivo para múltiplos cards.

### Props:
- `columns` - Número de colunas (default: 2)
- `gap` - Espaço entre cards: 'sm', 'md', 'lg'
- `children` - Cards para renderizar

### Exemplo:
```jsx
import { CardGrid, Card } from './components/Card';

<CardGrid columns={3} gap="lg">
  <Card title="Card 1">Conteúdo 1</Card>
  <Card title="Card 2">Conteúdo 2</Card>
  <Card title="Card 3">Conteúdo 3</Card>
</CardGrid>
```

---

## 6️⃣ **Alert Component**

Alertas formatados com design system.

### Props:
- `type` - 'info', 'success', 'warning', 'danger'
- `title` - Título do alerta
- `dismissible` - Permitir fechar
- `onDismiss` - Handler ao fechar
- `icon` - Ícone customizado (emoji)
- `children` - Conteúdo da mensagem

### Exemplo:
```jsx
import { Alert } from './components/Card';

<Alert 
  type="success"
  title="Sucesso!"
  dismissible
  onDismiss={() => setShowAlert(false)}
>
  Veículo registrado com sucesso!
</Alert>
```

---

## 7️⃣ **Badge Component**

Pequenos labels/badges para status.

### Props:
- `variant` - 'neutral', 'primary', 'success', 'warning', 'danger'
- `size` - 'sm', 'md', 'lg'
- `children` - Conteúdo do badge

### Exemplo:
```jsx
import { Badge } from './components/Card';

<Badge variant="success" size="sm">
  ✓ Ativo
</Badge>

<Badge variant="danger" size="md">
  ❌ Pendente
</Badge>
```

---

## 📝 **Padrão de Importação:**

```jsx
// Inputs
import { Input, TextArea, Select } from './components/Input';

// Cards & Layout
import { Card, CardGrid, Alert, Badge } from './components/Card';

// Design System
import DESIGN from './design-system';

// Botões
import { Button } from './components/Button';

// Header
import HeaderRedesenhado from './components/HeaderRedesenhado';
```

---

## 🎨 **Cores Disponíveis (DESIGN.colors):**

```js
DESIGN.colors = {
  primary: { 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 }, // Azure
  success: { ... }, // Green
  warning: { ... }, // Orange
  danger: { ... },  // Red
  neutral: { ... }  // Gray scale
}
```

---

## ⚡ **Próximas Etapas:**

1. ✅ Design System (design-system.js)
2. ✅ Button Component (6 variantes, 4 tamanhos)
3. ✅ Header Component (HeaderRedesenhado)
4. ✅ Input Components (Input, TextArea, Select)
5. ✅ Card Components (Card, CardGrid, Alert, Badge)
6. ⏳ Integração nos formulários do App.jsx
7. ⏳ Modais com novo design
8. ⏳ Tabelas profissionais
9. ⏳ Teste de responsividade mobile/tablet/desktop

---

## 📊 **Status:**

- **Design System Files:** 9 arquivos criados (2,400+ linhas)
- **Build Status:** ✅ Compilando sem erros
- **Bundle Size:** 691.87 KiB (gzip)
- **Git Status:** Commits registrados e pushed

Parabéns! Sistema de componentes profissionais pronto para usar! 🚀
