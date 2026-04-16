# Inteligente Park 🚗

App PWA de Gerenciamento de Estacionamento com funcionalidade totalmente offline.

## 🎯 Funcionalidades

- ✅ Registro de entrada de veículos por placa
- ⏱️ Cronômetro em tempo real para cada veículo
- 💰 Cálculo automático de valor baseado em frações de tempo
- 🔄 Sistema de ciclos de 12 horas com teto de valor
- 📊 Histórico completo de veículos do dia
- ⚙️ Área administrativa protegida por senha
- 🔧 Configurações ajustáveis de preços
- 📱 PWA - Funciona offline e pode ser instalado no celular
- 💾 Persistência total no localStorage

## 🎨 Tecnologias

- **React 18** - Framework JavaScript
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones modernos
- **Vite PWA Plugin** - Service Worker e manifest automáticos

## 📐 Lógica de Cobrança

### Parâmetros Padrão (Configuráveis)
- **Fração de tempo**: 30 minutos
- **Valor da fração**: R$ 9,00
- **Regra**: Fração iniciada = fração cobrada
- **Teto (Diária)**: R$ 55,00
- **Ciclo do teto**: 12 horas

### Como Funciona
1. A cada 30 minutos (ou parte), cobra-se R$ 9,00
2. Se o valor atingir R$ 55,00 antes de 12h, trava nesse valor
3. Após 12h, inicia novo ciclo somado ao anterior
4. Exemplo: 13h de estacionamento = R$ 55,00 (primeiro ciclo) + R$ 9,00 (1ª fração do 2º ciclo) = R$ 64,00

## 🚀 Instalação

\`\`\`bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Prévia da build de produção
npm run preview
\`\`\`

## 🔐 Acesso Administrativo

**Senha padrão**: `1234`

Na área administrativa você pode:
- Ajustar preços e tempos
- Ver histórico completo do dia
- Consultar total em caixa
- Limpar todos os dados

## 📱 Instalação como PWA

1. Acesse o app pelo navegador no celular
2. No menu do navegador, selecione "Adicionar à tela inicial"
3. O app será instalado e funcionará offline

## 💡 Uso

### Registrar Entrada
1. Digite a placa do veículo (letras maiúsculas automáticas)
2. Clique em "REGISTRAR ENTRADA"

### Finalizar Saída
1. Na lista de veículos no pátio, clique em "FINALIZAR / SAÍDA"
2. Confira o resumo com valor total
3. Clique em "Confirmar"

## 📄 Licença

Projeto desenvolvido para fins educacionais e comerciais.

---

Desenvolvido com ❤️ para facilitar a gestão de estacionamentos
