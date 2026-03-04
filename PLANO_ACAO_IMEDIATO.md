# 🚀 Plano de Ação Imediato - Inteligente Park

**Data:** 4 de março de 2026  
**Período:** Próximas 2-4 semanas

---

## ⚡ QUICK WINS - Faça Hoje (2-3 horas)

### 1. Corrigir Dependência Deprecada
**Tempo:** 15 minutos  
**Impacto:** Segurança futura

```bash
# Desinstalar versão antiga
npm uninstall esc-pos-encoder

# Instalar nova versão mantida
npm install @point-of-sale/receipt-printer-encoder
```

**Arquivos a atualizar:**
- `src/BluetoothPrinter.js` (linha ~1)
- `src/USBPrinter.js` (linha ~1)

Mudar:
```javascript
// ❌ ANTES
import Encoder from 'esc-pos-encoder';

// ✅ DEPOIS
import Encoder from '@point-of-sale/receipt-printer-encoder';
```

### 2. Adicionar .gitignore
**Tempo:** 5 minutos

```bash
# Criar arquivo .gitignore na raiz
node_modules/
dist/
build/
*.log
.DS_Store
.env
.env.local
.env.*.local
*.swp
*.swo
*~
.vscode/settings.json
.eslintcache
```

### 3. Criar .env.example
**Tempo:** 5 minutos

```
# Configurações da Aplicação

# Credenciais Admin
VITE_ADMIN_PASSWORD=1234

# Configuração de Impressora
VITE_PRINTER_TIMEOUT=5000

# API URLs (para integração futura)
VITE_API_BASE_URL=http://localhost:3001
VITE_API_KEY=

# Analytics
VITE_GA_ID=

# Modo Debug
VITE_DEBUG_MODE=false
```

### 4. Atualizar package.json - Scripts Úteis
**Tempo:** 5 minutos

Adicionar ao `scripts`:
```json
{
  "scripts": {
    "dev": "npx vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && powershell -ExecutionPolicy Bypass -File ./deploy-gh-pages.ps1",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "audit-fix": "npm audit fix --legacy-peer-deps",
    "clean": "rm -rf node_modules dist && npm install"
  }
}
```

### 5. Adicionar README Novo com Setup Claro
**Tempo:** 10 minutos

---

## 📅 SEMANA 1 - Refatoração Base

### Objetivo
Dividir `App.jsx` (2.350 linhas) em componentes menores

### Componentes a Criar

#### 1. `src/components/Header.jsx` (150 linhas)
```jsx
// Responsabilidades:
// - Logo e título
// - Status das impressoras
// - Botões conectar/desconectar
// - Link para admin
// - Hamburger menu mobile

export function Header({ 
  impressoraConectada, 
  nomeImpressora, 
  onConectar, 
  onDesconectar 
}) {
  return (
    <header className="...">
      {/* Conteúdo */}
    </header>
  );
}
```

#### 2. `src/components/ParquingLot.jsx` (500 linhas)
```jsx
// Responsabilidades:
// - Listagem de veículos
// - Cards com cronômetro
// - Botão finalizar saída
// - Busca e filtros

export function ParquingLot({ 
  veiculos, 
  onFinalizarSaida, 
  tempoAtual 
}) {
  return (
    <div className="...">
      {/* Cards de veículos */}
    </div>
  );
}
```

#### 3. `src/components/RulesCalculator.jsx` (200 linhas)
```jsx
// Responsabilidades:
// - Formulário entrada veículo
// - Sugestões de placa
// - Validações

export function RulesCalculator({ 
  onRegistrarEntrada 
}) {
  return (
    <form className="...">
      {/* Formulário */}
    </form>
  );
}
```

#### 4. `src/components/AdminPanel.jsx` (400 linhas)
```jsx
// Responsabilidades:
// - Configurações de preço
// - Histórico do dia
// - Total em caixa
// - Limpar dados

export function AdminPanel({ 
  config, 
  onSalvarConfig, 
  historico 
}) {
  return (
    <div className="...">
      {/* Admin interface */}
    </div>
  );
}
```

#### 5. `src/components/ExitModal.jsx` (250 linhas)
```jsx
// Responsabilidades:
// - Modal de saída
// - Resumo do veículo
// - Cálculo de valor
// - Botão imprimir

export function ExitModal({ 
  veiculo, 
  tempoAtual, 
  onConfirmar, 
  onFechar 
}) {
  return (
    <div className="...">
      {/* Modal */}
    </div>
  );
}
```

### Timeline
- Segunda: Criar estrutura de pastas e Header
- Terça: ParquingLot + RulesCalculator
- Quarta: AdminPanel
- Quinta: ExitModal + Testes
- Sexta: Code Review + Ajustes

---

## 📅 SEMANA 2 - Hooks Customizados

### Criar 3 Hooks Essenciais

#### 1. `src/hooks/useToast.js`
```javascript
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (mensagem, tipo = 'info', duracao = 3500) => {
    // ...
  };

  const removeToast = (id) => {
    // ...
  };

  return { toasts, showToast, removeToast };
}
```

#### 2. `src/hooks/usePrinter.js`
```javascript
export function usePrinter() {
  const [impressora, setImpressora] = useState(null);
  const [conectada, setConectada] = useState(false);
  const [nome, setNome] = useState('');

  const conectar = async () => {
    // ...
  };

  const desconectar = async () => {
    // ...
  };

  const imprimir = async (dados) => {
    // ...
  };

  return { conectada, nome, conectar, desconectar, imprimir };
}
```

#### 3. `src/hooks/useParkingCalculus.js`
```javascript
export function useParkingCalculus(config) {
  const calcularValor = (tempoMinutos, tipoVeiculo) => {
    // Lógica de cálculo
  };

  const calcularTempoDecorrido = (dataEntrada, dataAtual) => {
    // Calcula tempo decorrido
  };

  const formatarTempo = (minutos) => {
    // Formata para "1h 30m"
  };

  return { calcularValor, calcularTempoDecorrido, formatarTempo };
}
```

---

## 📅 SEMANA 3 - Testes & Documentação

### Adicionar Testes Básicos
```bash
npm install --save-dev vitest @testing-library/react
```

#### 1. `tests/App.test.jsx`
```javascript
describe('App', () => {
  it('renderiza Home na inicialização', () => {
    // teste
  });

  it('alterna para Admin ao clicar botão', () => {
    // teste
  });
});
```

#### 2. `tests/services.test.js`
```javascript
describe('CalcuusService', () => {
  it('calcula valor corretamente para 30 minutos', () => {
    // teste
  });

  it('aplica teto de 12 horas', () => {
    // teste
  });
});
```

---

## 🎯 Métricas de Sucesso

Após 4 semanas, você deve ter:

| Métrica | Target | Status |
|---------|--------|--------|
| App.jsx reduzido para | <500 linhas | ❌ |
| Componentes criados | 8+ | ❌ |
| Hooks customizados | 3+ | ❌ |
| Testes | 20+ cases | ❌ |
| Vulnerabilidades | 0 | ❌ |
| TypeScript coverage | 50% | ❌ |
| Documentação | 100% | ❌ |

---

## 💻 Comandos Úteis

```bash
# Iniciar servidor
cd c:\PROJETO-ANTIGO-PARK
npx vite

# Construir produção
npm run build

# Verificar vulnerabilidades
npm audit

# Rodar testes
npm test

# Forçar limpeza
npm run clean

# Visualizar tamanho do build
npm run build -- --sourcemap
```

---

## 📞 Suporte Rápido

Se encontrar problemas:

1. **Erro de Bluetooth**: Verifique se navegador suporta Web Bluetooth (Chrome/Edge)
2. **Erro de USB**: Precisa permissão do SO, recarregue a página
3. **localStorage não funciona**: Modo privado do navegador, trabalha em PWA instalado
4. **Impressora não conecta**: Reinicie impressora e app

---

## ✅ Checklist de Implementação

- [ ] Semana 1: Estrutura de componentes
- [ ] Semana 2: Hooks customizados
- [ ] Semana 3: Testes
- [ ] Semana 4: Deploy em produção
- [ ] Deploy: GitHub Pages com PWA

---

**Próxima atualização: 11 de março de 2026**
