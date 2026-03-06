# 🎨 Fase 5: Polish, Accessibility & Performance Testing

**Data Início:** 5 de março de 2026  
**Status:** ⏳ Em Progresso (0% → ∞%)  
**Objetivo:** Refino final, testes e otimizações  
**Build Anterior:** 505.12 KB | 0 erros | 9.13s

---

## 📋 Roadmap Fase 5

### 🎯 Prioridade Crítica (P0)
- [ ] **Animações de Transição** - Suavizar navegação e interações
- [ ] **Paginação Avançada** - DataGrid com prev/next/números
- [ ] **Filtros Dinâmicos** - Combo filters no DataGrid/Tables
- [ ] **Busca Integrada** - Search com autocomplete
- [ ] **Performance Optimization** - Bundle splitting, lazy loading

### 🎯 Prioridade Alta (P1)
- [ ] **Accessibility Audit** - WCAG 2.1 AA full compliance
- [ ] **Dark Mode Support** - Theme toggle with persistence
- [ ] **Testes E2E Básicos** - Playwright/Cypress flows críticos
- [ ] **Responsiveness Refinement** - Mobile/tablet/desktop validação

### 🎯 Prioridade Média (P2)
- [ ] **PDF/Excel Export** - Tabelas para relatórios
- [ ] **Impressão Formatada** - Print CSS otimizado
- [ ] **Caching de Queries** - Redux/Context para estado compartilhado
- [ ] **Analytics Tracking** - User behavior monitoring

### 🎯 Prioridade Baixa (P3)
- [ ] **PWA Features** - Service worker, offline mode
- [ ] **Performance Monitoring** - Sentry/LogRocket
- [ ] **Internationalization** - i18n for pt-BR/en
- [ ] **A/B Testing Setup** - Experiment framework

---

## 📊 Status Atual (Pré-Fase 5)

**Code Quality:**
- App.jsx: 4,318 linhas (estrutura monolítica)
- Componentes: 19 reutilizáveis
- Instâncias migradas: 99+ ao design system
- Design tokens: 100% compliance

**Performance:**
- Build size: 505.12 KB
- Bundle: Single main.js (não chunked)
- Compile time: 9.13s
- Network: Sem lazy loading

**Accessibility:**
- WCAG 2.1 AA: Baseline atendida
- Touch targets: 48x48px✅
- Color contrast: >4.5:1 ✅
- Keyboard nav: Suportado ✅
- Screen readers: Testado (improvements needed)

**Testing:**
- Unit tests: Nenhum
- E2E tests: Nenhum
- Visual tests: Manual
- Performance tests: Nenhum

---

## 🔧 Tarefa 1: Animações de Transição (P0)

### Objetivo
Adicionar transições suaves via Framer Motion ou React Spring para:
- Navegação entre telas (fade/slide)
- Modale entrando/saindo (scale, fade)
- Cards aparecendo em cascade
- Lists transitioning com reorder

### Implementação

```jsx
// Exemplo com Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Transição de página
<AnimatePresence mode="wait">
  <motion.div
    key={currentScreen}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {/* Conteúdo da página */}
  </motion.div>
</AnimatePresence>

// Modal com scale
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
/>

// CardGrid com stagger
<motion.div>
  {cards.map((card, i) => (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      <Card>{...}</Card>
    </motion.div>
  ))}
</motion.div>
```

### Package.json Update
```json
"dependencies": {
  "framer-motion": "^10.16.4"
}
```

### Prioridade: P0 (Impacto Alto, Complexidade Média)
- Instalação: 1h
- Implementação em App.jsx: 3-4h
- Testes: 1h
- **Total Estimado:** 5-6h

---

## 🔍 Tarefa 2: DataGrid Paginação Avançada (P0)

### Objetivo
Adicionar controles de paginação no DataGrid:
- Prev/Next buttons
- Números de página (1, 2, 3...)
- "Ir para página X" input
- Items por página selector (10, 25, 50, 100)

### Implementação em Table.jsx/DataGrid.jsx

```jsx
// Adicionar ao DataGrid
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 25;

const totalPages = Math.ceil(data.length / itemsPerPage);
const startIdx = (currentPage - 1) * itemsPerPage;
const paginatedData = data.slice(startIdx, startIdx + itemsPerPage);

// UI de paginação
<div style={{ display: 'flex', gap: DESIGN.spacing.md, alignItems: 'center', padding: DESIGN.spacing.md }}>
  <Button 
    size="sm" 
    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
    disabled={currentPage === 1}
  >
    ← Anterior
  </Button>
  
  {/* Números de página */}
  <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
    {Array.from({ length: totalPages }).map((_, i) => (
      <Button
        key={i + 1}
        size="sm"
        variant={currentPage === i + 1 ? 'primary' : 'default'}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </Button>
    ))}
  </div>
  
  <Button 
    size="sm"
    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
  >
    Próximo →
  </Button>
  
  <span style={{ fontSize: DESIGN.typography.sizes.sm, color: DESIGN.colors.neutral[600] }}>
    Página {currentPage} de {totalPages}
  </span>
</div>
```

### Prioridade: P0 (Impacto Alto, Complexidade Baixa)
- Implementação: 2-3h
- Testes: 1h
- **Total Estimado:** 3-4h

---

## 🎛️ Tarefa 3: Filtros Dinâmicos (P0)

### Objetivo
Adicionar filtros rápidos acima do DataGrid para:
- **Tipo de Veículo** (Carro, Moto, etc)
- **Status** (Ativo, Inativo, Wait...)
- **Data Range** (Última semana, Mês, etc)
- **Busca por Placa/Nome**

### Implementação

```jsx
// Novo componente FilterBar.jsx
export function FilterBar({ onFilter, filters = {} }) {
  return (
    <div style={{
      display: 'flex',
      gap: DESIGN.spacing.md,
      padding: DESIGN.spacing.md,
      backgroundColor: DESIGN.colors.neutral[50],
      borderRadius: DESIGN.borderRadius.md,
      marginBottom: DESIGN.spacing.md,
      flexWrap: 'wrap'
    }}>
      <Select
        label="Tipo"
        value={filters.tipo || 'all'}
        onChange={(e) => onFilter({ ...filters, tipo: e.target.value })}
        options={[
          { value: 'all', label: 'Todos os Tipos' },
          { value: 'carro', label: '🚗 Carro' },
          { value: 'moto', label: '🏍️ Moto' }
        ]}
      />
      
      <Select
        label="Status"
        value={filters.status || 'all'}
        onChange={(e) => onFilter({ ...filters, status: e.target.value })}
        options={[
          { value: 'all', label: 'Todos Status' },
          { value: 'ativo', label: '🟢 Ativo' },
          { value: 'inativo', label: '⚫ Inativo' }
        ]}
      />
      
      <Input
        placeholder="Buscar placa..."
        value={filters.search || ''}
        onChange={(e) => onFilter({ ...filters, search: e.target.value })}
        style={{ width: '200px' }}
      />
      
      <Button 
        onClick={() => onFilter({})}
        variant="default"
      >
        Limpar Filtros
      </Button>
    </div>
  );
}

// Usar no App.jsx
const [filters, setFilters] = useState({});
const filteredData = historico.filter(item => {
  if (filters.tipo && item.tipo !== filters.tipo) return false;
  if (filters.search && !item.placa.includes(filters.search.toUpperCase())) return false;
  return true;
});

<FilterBar onFilter={setFilters} filters={filters} />
<DataGrid columns={[...]} data={filteredData} sortable />
```

### Prioridade: P0 (Impacto Alto, Complexidade Média)
- Criar FilterBar.jsx: 1-2h
- Integrar em Histórico/Operadores/Pátios: 2-3h
- Testes: 1h
- **Total Estimado:** 4-6h

---

## 🔎 Tarefa 4: Busca Integrada com Autocomplete (P0)

### Objetivo
Header global search que procura:
- Veículos por placa
- Operadores por nome/email
- Pátios por nome
- Histórico por placa/modelo

### Implementação

```jsx
// Novo componente SearchBar.jsx
export function SearchBar({ onSearch, placeholder = "Buscar..." }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const handleSearch = (value) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    // Chamado nos dados locais
    const res = searchAcrossApp(value);
    setResults(res);
        setShowResults(true);
  };
  
  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        prefix={<Search className="w-5 h-5" />}
      />
      
      {showResults && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: `1px solid ${DESIGN.colors.neutral[200]}`,
          borderRadius: DESIGN.borderRadius.md,
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 50,
          boxShadow: DESIGN.shadows.md
        }}>
          {results.map(result => (
            <div 
              key={result.id}
              onClick={() => {
                onSearch(result);
                setQuery('');
                setShowResults(false);
              }}
              style={{ padding: DESIGN.spacing.sm, cursor: 'pointer', borderBottom: `1px solid ${DESIGN.colors.neutral[100]}` }}
            >
              <div style={{ fontWeight: '600' }}>{result.label}</div>
              <div style={{ fontSize: DESIGN.typography.sizes.sm, color: DESIGN.colors.neutral[600] }}>
                {result.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Prioridade: P0 (Impacto Médio, Complexidade Média)
- Criar SearchBar.jsx: 2-3h
- Integrar no Header: 1h
- Testes: 1h
- **Total Estimado:** 4-5h

---

## ⚡ Tarefa 5: Performance Optimization (P0)

### Objetivo
Otimizar bundle e rendering:
- Code splitting via React.lazy()
- Chunked imports para telas
- Memoization de componentes
- Virtual scrolling em listas grandes

### Implementação

```jsx
// React.lazy para páginas
const PaginaLogin = lazy(() => import('./components/PaginaLogin'));
const PaginaCadastroBike = lazy(() => import('./pages/PaginaCadastroBike'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Suspense boundary
<Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
  <PaginaLogin />
</Suspense>

// Memoização
const HistoricoTable = memo(({ data }) => (
  <DataGrid columns={[...]} data={data} />
));

// Virtual scrolling para listas grandes (npm install react-window)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={data.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      {/* Row {index} */}
    </div>
  )}
</FixedSizeList>
```

### Impact Expected:
- Bundle reduction: 30-40%
- Initial load: -2-3s
- Memory usage: -20-30%

### Prioridade: P0 (Impacto Alto, Complexidade Alta)
- Identificar split points: 1-2h
- Implementar lazy loading: 3-4h
- Memoization: 2-3h
- Virtual scrolling: 2-3h
- Testes e validação: 2-3h
- **Total Estimado:** 10-15h

---

## ♿ Tarefa 6: Accessibility Audit (P1)

### Objetivo
Full WCAG 2.1 AA compliance:

**Checklist:**
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader announcement (aria-labels, roles)
- [ ] Color contrast (Lighthouse check)
- [ ] Focus indicators (visible outline)
- [ ] Form labels e descriptions
- [ ] Error messages e validation
- [ ] Table headers e captions
- [ ] Modal dialogs (focus trap)
- [ ] Skip links (skip to main content)
- [ ] Language attributes (lang="pt-BR")

### Ferramentas
- Chrome DevTools Lighthouse
- axe DevTools extension
- NVDA screen reader (testes)
- WebAIM contrast checker

### Prioridade: P1 (Impacto Alto, Complexidade Média)
- Audit initial: 2-3h
- Remediation: 4-6h
- Testing: 2-3h
- **Total Estimado:** 8-12h

---

## 🌓 Tarefa 7: Dark Mode Support (P1)

### Objetivo
Theme toggle com persistência em localStorage

### Implementação

```jsx
// Atualizar design-system.js
export const DESIGN_LIGHT = { /* colores atuais */ };
export const DESIGN_DARK = {
  colors: {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: { ... }
  }
};

// Context para tema
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useLocalStorage('theme', false);
  
  const theme = isDark ? DESIGN_DARK : DESIGN_LIGHT;
  
  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
      <div style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Hook customizado
export function useTheme() {
  return useContext(ThemeContext);
}

// Usar no App.jsx
const { theme, isDark, setIsDark } = useTheme();

<Button onClick={() => setIsDark(!isDark)}>
  {isDark ? '☀️ Light' : '🌙 Dark'}
</Button>
```

### Prioridade: P1 (Impacto Médio, Complexidade Média)
- Design tokens dark: 2-3h
- Context/Hooks: 1-2h
- Refactor App.jsx: 3-4h
- Testing: 1-2h
- **Total Estimado:** 7-11h

---

## 🧪 Tarefa 8: Testes E2E Básicos (P1)

### Objetivo
Testes críticos com Playwright:
- Login flow
- Entrada/Saída veículos
- CRUD Operadores
- CRUD Pátios
- Busca e filtros

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install

# playwright.config.js
export default {
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: false
  },
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure'
  }
};
```

### Arquivo de teste exemplo

```javascript
// tests/e2e/login.spec.js
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[type="email"]', 'teste@example.com');
  await page.fill('input[type="password"]', '123456');
  await page.click('button:has-text("Entrar")');
  
  await expect(page).toHaveURL('/home');
  await expect(page.locator('text=Home')).toBeVisible();
});

test('entrada de veículo', async ({ page }) => {
  await page.goto('/home');
  await page.fill('input[placeholder="Placa"]', 'ABC1234');
  await page.click('button:has-text("Entrada")');
  
  await expect(page.locator('text=ABC1234')).toBeVisible();
});
```

### Prioridade: P1 (Impacto Alto, Complexidade Média)
- Setup Playwright: 1-2h
- Escrever testes base: 4-6h
- CI/CD integration: 2-3h
- **Total Estimado:** 7-11h

---

## 📊 Timeline Estimado

| Tarefa | Prioridade | Horas | Status |
|--------|-----------|-------|--------|
| 1. Animações | P0 | 5-6h | ⏳ Próximo |
| 2. Paginação DataGrid | P0 | 3-4h | ⏳ |
| 3. Filtros | P0 | 4-6h | ⏳ |
| 4. Busca Integrada | P0 | 4-5h | ⏳ |
| 5. Performance | P0 | 10-15h | ⏳ |
| 6. Accessibility | P1 | 8-12h | ⏳ |
| 7. Dark Mode | P1 | 7-11h | ⏳ |
| 8. Testes E2E | P1 | 7-11h | ⏳ |
| **Total Estimado** | - | **48-70h** | - |

---

## 🎯 Próximas Ações

1. **Começar com Tarefa 2** (Paginação DataGrid)
   - Menor complexidade, rápido ROI
   - Estabelece padrão para filtros

2. **Depois Tarefa 4** (Busca Integrada)
   - Dependente de estrutura de paginação

3. **Paralelo com Tarefa 1** (Animações)
   - Pode ser implementada independentemente

4. **Then Tarefa 5** (Performance)
   - Baseline final antes de testes

---

**Última atualização:** 05/03/2026 - 16:00  
**Mantido por:** GitHub Copilot (Claude Haiku 4.5)  
**Próxima Review:** Após Tarefa 2 (Paginação)

