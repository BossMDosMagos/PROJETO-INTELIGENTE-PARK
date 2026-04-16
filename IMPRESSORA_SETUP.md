# 🖨️ Sistema de Impressão Térmica Bluetooth - Inteligente Park

## Visão Geral

O Inteligente Park agora suporta impressão térmica via Bluetooth para impressoras ESC/POS de 58mm, gerando recibos profissionais de ENTRADA e SAÍDA com QR Code.

## ✨ Características

### Recibos de ENTRADA
- ✅ Nome da empresa (configurável)
- ✅ Placa do veículo (grande e centralizado)
- ✅ Data e hora de entrada
- ✅ Modelo e cor do veículo
- ✅ QR Code para rápida identificação
- ✅ Layout formatado para 32 caracteres/linha

### Recibos de SAÍDA
- ✅ Tudo do recibo de entrada +
- ✅ Hora de saída
- ✅ Tempo total de permanência
- ✅ Valor total a pagar
- ✅ Mensagem de agradecimento

## 🔧 Compatibilidade de Impressoras

Qualquer impressora térmica com Bluetooth e suporte ESC/POS 58mm, como:

| Marca | Modelo(s) |
|-------|-----------|
| **Elgin** | I7, I9, I10, i12 |
| **Sweda** | SI-300, SI-800 |
| **Bematech** | MP-100S, MP-2100 |
| **Zebra** | ZQ110, ZQ220, ZQ320 |
| **Star Micronics** | SM-S210i, SM-S220i |
| **Impressoras Genéricas** | Qualquer modelo com ESC/POS 58mm |

## 📱 Requisitos do Sistema

### Navegador
- ✅ Chrome 56+
- ✅ Edge 79+
- ✅ Opera 43+
- ✅ Android Chrome
- ⚠️ **NOT suportado**: Firefox, Safari (Web Bluetooth limitado)

### Hardware
- Bluetooth 4.0+ no dispositivo
- Impressora térmica conectada via Bluetooth
- Mínimo de dispositivos pareados

### Conexão
- **HTTPS obrigatório** em produção
- **HTTP** funciona em `localhost` para testes

## 🚀 Como Usar

### 1️⃣ Conectar Impressora

#### Opção A: Dashboard Principal
1. Clique no botão **🖨️📡** (Printer + Bluetooth) no topo direito
2. Selecione sua impressora na caixa de diálogo
3. Aguarde confirmação "✅ Conectado"

#### Opção B: Painel de Administração
1. Entre em **Administração** (senha: `1234`)
2. Localize "Impressora Térmica Bluetooth"
3. Clique em **Conectar Impressora**
4. Selecione o dispositivo

### 2️⃣ Imprimir Recibo de ENTRADA
1. Registre um veículo normalmente
2. Após a entrada ser registrada, clique em **🖨️ Imprimir** no cartão do veículo
3. O recibo será enviado para a impressora

### 3️⃣ Imprimir Recibo de SAÍDA
1. Clique em **FINALIZAR / SAÍDA** no veículo
2. No modal de confirmação, clique em **🖨️ Imprimir** (se conectado)
3. Depois clique **Confirmar** para registrar a saída

### 4️⃣ Reimpressão de Recibos
No **Painel Admin** → **Sistema de Deleção de Registros**:
- Localize o registro em "Deletar Registros Individuais"
- Clique em **🖨️** para reimprimir
- Clique em **🗑️** para deletar (se necessário)

## 📊 Layouts de Recibos

### Recibo de Entrada (32 caracteres x linha)
```
    INTELIGENTE PARK
────────────────────────────
             ABC-1234

DATA: 01/03/2026
HORA: 14:30:45

Gol • Branco

        [QR CODE]

Conserve este recibo
```

### Recibo de Saída
```
    INTELIGENTE PARK
────────────────────────────
        RECIBO DE SAÍDA

             ABC-1234

DATA: 01/03/2026
ENTRADA: 14:30:45
SAÍDA: 15:45:30

Gol • Branco

        [QR CODE]

────────────────────────────
TEMPO: 1:14:45
    R$ 18,00

Obrigado pela preferência!
Volte sempre! 🅿️
```

## 🔐 Segurança

### Proteção de Dados
- ✅ Dados armazenados localmente (localStorage)
- ✅ Nenhum dado enviado para servidor externo
- ✅ Impressora conectada via Bluetooth local
- ✅ QR Code contém apenas ID do registro

### Privacidade
- Bluetooth desconecta automaticamente se a aba fecha
- Dados de impressora não são persistidos
- Conexão Bluetooth encriptada por padrão

## ⚙️ Configurações

### No Painel Admin
```
Administração → Impressora Térmica Bluetooth
├── Status da Conexão (em tempo real)
├── Botão Conectar/Desconectar
├── Teste de Impressão
└── Instruções de Configuração
```

### Personalizações
- Nome da empresa aparece no topo de cada recibo
- Logo não é impressa (espaço limitado de 58mm)
- Formato de data padrão: `DD/MM/AAAA`
- Formato de hora padrão: `HH:MM:SS`

## 🧪 Teste de Impressão

1. Vá ao **Painel Admin**
2. Cique em **Teste de Impressão**
3. Um recibo de teste será impresso com dados fictícios
4. Verifique se o formato e alinhamento estão corretos

## ❌ Solução de Problemas

### "Impressora não encontrada"
- [ ] Verifique se a impressora está ligada
- [ ] Ative Bluetooth no seu computador
- [ ] Pareie a impressora com o sistema antes de usar
- [ ] Certifique-se que é uma impressora com Bluetooth

### "Erro ao conectar"
- [ ] Feche outras abas que possam estar usando Bluetooth
- [ ] Reinicie a impressora e o navegador
- [ ] Se em produção, confirme que está usando **HTTPS**
- [ ] Verifique o console do navegador para mais detalhes

### "Recibo imprime cortado ou mal alinhado"
- [ ] Ajuste a largura do papel na impressora (padrão 58mm)
- [ ] Alguns modelos podem precisar ajuste ESC/POS
- [ ] Use o "Teste de Impressão" para validar

### "QR Code não aparece no recibo"
- [ ] Alguns modelos não suportam impressão de imagem
- [ ] O recibo ainda será impresso com o ID em texto
- [ ] Verifique a memória da impressora

## 🔍 Visão Técnica

### Arquitetura

```
App.jsx
├── useLocalStorage hook (persistência)
├── BluetoothPrinter class
│   ├── conectar() - Web Bluetooth API
│   ├── gerarReciboEntrada() - ESC/POS encoder
│   ├── gerarReciboSaida() - ESC/POS encoder
│   ├── enviarDados() - writeValue() Bluetooth
│   └── gerarQRCodeCanvas() - QRCode.js
└── UI com Lucide React icons
```

### Dependências
- `esc-pos-encoder`: Geração de comandos ESC/POS
- `qrcode`: Geração de QR Code
- `lucide-react`: Ícones UI
- `tailwindcss`: Estilização responsiva

### Fluxo de Dados

1. Usuário clica em "Conectar Impressora"
2. `navigator.bluetooth.requestDevice()` abre seletor nativo
3. Após seleção, conecta via GATT (Bluetooth LE protocol)
4. Localiza serviço e característica de escrita
5. Ao imprimir, gera Uint8Array com comandos ESC/POS
6. Envia via `characteristic.writeValue()` em chunks de 512 bytes
7. Impressora recebe e processa os comandos

## 📝 Notas Importantes

- **Primeira conexão lenta**: Normal, o Bluetooth precisa discocar e conectar
- **Recibo em branco**: Verifique se há papel na impressora
- **QR Code não lê**: Certifique-se que a câmera consegue focar (16x16px mínimo)
- **Desempenho**: Impressora não é bloqueante, app continua responsivo

## 🎯 Próximas Melhorias Possíveis

- [ ] Impressão via HTTP/API (impressora IP/USB)
- [ ] Múltiplas impressoras
- [ ] Customização de layout (logo, cores)
- [ ] Impressão em WiFi (impressoras WiFi 58mm)
- [ ] Previsualização antes de imprimir
- [ ] Histórico de impressões com retry

## 📞 Suporte

Para problemas e dúvidas:
1. Consulte a seção "Solução de Problemas"
2. Verifique o console do navegador (F12 → Console)
3. Teste a impressora com outro programa ESC/POS
4. Verifique manual da impressora para comandos específicos

---

**Última atualização**: 1º de março de 2026  
**Versão**: 1.0 - Impressão Térmica Bluetooth
