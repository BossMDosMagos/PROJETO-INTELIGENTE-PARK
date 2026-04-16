# 🔧 Referência Técnica - ESC/POS & Bluetooth

## ESC/POS - Padrão de Comando

ESC/POS é um padrão de impressoras térmicas desenvolvido pela Epson, usado globalmente.

### Comandos Principais Implementados

```
INICIALIZAR
ESC @ → Reseta impressora

ALINHAMENTO
ESC a 0 → Esquerda
ESC a 1 → Centro
ESC a 2 → Direita

TAMANHO DE FONTE
ESC ! 0x00 → Normal (1x1)
ESC ! 0x01 → 2x altura
ESC ! 0x10 → 2x largura
ESC ! 0x11 → 2x2

NEGRITO
ESC E 1 → Ativar
ESC E 0 → Desativar

SUBLINHADO
ESC - 1 → Ativar
ESC - 0 → Desativar

IMAGEM
GS v 0 <width> <height> ... → Imprimir raster

CORTE DE PAPEL
GS V 0x41 0x03 → Corte total
GS V 0x42 0x03 → Corte parcial

NOVA LINHA
LF (0x0A)

BUZZER (algumas impressoras)
ESC c 5 <duration>
```

### Exemplo Raw ESC/POS

```javascript
// Recibo simples em ESC/POS bruto
const recibo = [
  0x1B, 0x40,           // Initialize
  0x1B, 0x61, 0x01,     // Center align
  0x1B, 0x21, 0x11,     // 2x2 size
  0x41, 0x42, 0x43, // Display "ABC"
  0x0A,                 // New line
];
```

## Web Bluetooth API - Especificações

### GATT (Generic Attribute Profile)

Padrão de comunicação Bluetooth LE:

```
Device → GATT Server
  ├─ Service 1
  │  ├─ Characteristic 1 (Read/Write/Notify)
  │  └─ Characteristic 2 (Read)
  └─ Service N
     └─ Characteristic N
```

### UUIDs de Impressoras Térmicas

```javascript
// Serial Port Profile (SPP) - Padrão
"00001101-0000-1000-8000-00805f9b34fb"

// Custom UUIDs por fabricante
Elgin:    "0000ff01-0000-1000-8000-00805f9b34fb"
Sweda:    "0000aaa0-0000-1000-8000-00805f9b34fb"
Zebra:    "0000ff00-0000-1000-8000-00805f9b34fb"
```

### Fluxo de Conexão

```
1. Solicitar Dispositivo
   navigator.bluetooth.requestDevice({filters: [...]})
   ↓ Usuário seleciona na UI do SO
   ↓ Retorna BluetoothDevice

2. Conectar GATT
   device.gatt.connect()
   ↓ Conexão estabelecida
   ↓ Retorna BluetoothRemoteGATTServer

3. Obter Serviço
   server.getPrimaryService(uuid)
   ↓ Localiza serviço no dispositivo
   ↓ Retorna BluetoothRemoteGATTService

4. Obter Característica
   service.getCharacteristic(uuid)
   ↓ Encontra característica writable
   ↓ Retorna BluetoothRemoteGATTCharacteristic

5. Escrever Dados
   characteristic.writeValue(uint8array)
   ↓ Envia para impressora
   ↓ Impressora processa

6. Desconectar (opcional)
   device.gatt.disconnect()
```

## Gerando QR Code para Impressora

### Usando qrcode.js

```javascript
// Gerar em canvas
const canvas = document.createElement('canvas');
await QRCode.toCanvas(canvas, 'ABC-1234', {
  errorCorrectionLevel: 'H',     // High (30% recovery)
  type: 'image/png',
  width: 150,                    // 150x150 pixels
  margin: 1,
  color: { 
    dark: '#000000',            // Tinta preta
    light: '#ffffff'            // Fundo branco
  }
});

// Resultado: Image data optimizado para B&W
```

### Conversão para B&W (Dithering)

```javascript
function converterParaBranco(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Para cada pixel RGBA
  for (let i = 0; i < data.length; i += 4) {
    // Calcular luminância (RGB → Gray)
    const gray = 
      data[i] * 0.299 +     // R
      data[i+1] * 0.587 +   // G
      data[i+2] * 0.114;    // B

    // Threshold simples (128 = meio)
    const bw = gray > 128 ? 255 : 0;
    
    // Aplicar ao canal RGB (deixar Alpha)
    data[i] = data[i+1] = data[i+2] = bw;
  }

  return canvas.toDataURL('image/png');
}
```

## Chunking de Dados (Bluetooth LE)

Web Bluetooth LE tem limite de escrita: **512 bytes por mensagem**

```javascript
async function enviarDadosEmChunks(characteristic, buffer) {
  const chunkSize = 512;
  
  for (let i = 0; i < buffer.length; i += chunkSize) {
    // Extrair chunk
    const chunk = buffer.slice(i, i + chunkSize);
    
    // Enviar
    await characteristic.writeValue(chunk);
    
    // Pequena pausa entre chunks
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

// Exemplo: Recibo de 2 KB
// → Dividido em 4 chunks
// → 4 mensagens Bluetooth
// → Total ~40ms de pausa
```

## Compatibilidade de Navegadores

### Suporte Web Bluetooth API

| Navegador | Suporte | Versão |
|-----------|---------|--------|
| Chrome | ✅ Completo | 56+ |
| Edge | ✅ Completo | 79+ |
| Opera | ✅ Completo | 43+ |
| Samsung Internet | ✅ Completo |  |
| Firefox | ⚠️ Experimental | Flag |
| Safari (macOS) | ❌ Não | - |
| Safari (iOS) | ⚠️ Limitado | App only |

### Requisitos de Segurança

```
✅ HTTPS em produção (obrigatório)
✅ HTTP em localhost (ok para testes)
✅ Usuário iniciou a ação (clique)
✅ Https context (secure context)
❌ WebWorker (não suportado)
```

## Teste Manual de Impressora

### Via Python (simulação)

```python
import socket
import struct

# Conectar à impressora Bluetooth
bluetooth_mac = "AA:BB:CC:DD:EE:FF"
port = 1  # RFCOMM Port 1

sock = socket.socket(socket.AF_BLUETOOTH, socket.SOCK_STREAM, 
                     socket.BTPROTO_RFCOMM)
sock.connect((bluetooth_mac, port))

# Enviar ESC/POS
esc_init = b'\x1b\x40'  # Initialize
esc_center = b'\x1b\x61\x01'  # Center
esc_2x2 = b'\x1b\x21\x11'  # 2x2 size

sock.send(esc_init)
sock.send(esc_center)
sock.send(esc_2x2)
sock.send(b'TESTE\n')

sock.close()
```

### Via Bash (Linux)

```bash
# Listar dispositivos Bluetooth pareados
bluetoothctl list-devices

# Conectar
bluetoothctl connect AA:BB:CC:DD:EE:FF

# Enviar dados (se exposto como /dev/rfcomm0)
echo -ne '\x1b\x40' > /dev/rfcomm0  # Init
echo "TESTE" > /dev/rfcomm0
```

## Customização de Layout

### Alterar Tamanho de Fonte

```javascript
// Em BluetoothPrinter.js
encoder.setTextSize(4, 4);  // 4x4 (máximo)
encoder.text('PLACA');
encoder.setTextSize(1, 1);  // Volta normal
```

### Alterar Largura de Caracteres

```javascript
// A largura máxima é sempre 32 chars em 58mm
// Para títulos longos, quebra automaticamente
const titulo = "Estacionamento Inteligente Park";
// Resultado:
// Estacionamento | 32
// Inteligente... | 32
```

### Adicionar Logomarca

```javascript
// Se a impressora suporte (algumas não)
try {
  encoder.image(logoBase64, 200, 100);
} catch (e) {
  // Fallback para texto
  encoder.text('LOGO AQUI');
}
```

## Troubleshooting Técnico

### Impressora Não Responde

```javascript
// Verificar característica
const chars = await service.getCharacteristics();
console.log(chars.map(c => ({
  uuid: c.uuid,
  properties: c.properties,
  writable: c.properties.write
})));
```

### Dados Chegam Incompletos

```javascript
// Aumentar pausa entre chunks
await new Promise(resolve => setTimeout(resolve, 50));  // 50ms

// Ou usar readValue para confirmar entrega
const response = await characteristic.readValue();
console.log(new Uint8Array(response.buffer));
```

### Imagem Não Imprime

```javascript
// Algumas impressoras não suportam
// Solução: detectar e fazer fallback
try {
  encoder.image(...);
} catch (error) {
  if (error.message.includes('image')) {
    // Imprimir ID em texto
    encoder.text('ID: ' + veiculo.id);
  }
}
```

## Performance

### Métricas Esperadas

| Operação | Tempo |
|----------|-------|
| Conectar | 1-3s |
| Gerar Recibo | 200-500ms |
| Enviar (sem imagem) | 500-1000ms |
| Enviar (com QR Code) | 1000-2000ms |
| Imprimir | 5-10 segundos (física) |

### Otimizações Implementadas

```javascript
// 1. Chunking automático
const chunkSize = 512;  // Limite LE

// 2. Pausa entre chunks
await new Promise(r => setTimeout(r, 10));

// 3. Reutilizar impressora
this.isConnected = true;  // Cache

// 4. Gerar offline
const dados = await gerarRecibo();  // Async
await enviarDados(dados);           // Serial
```

## Referências Externas

- [MDN Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [ESC/POS Specification](https://www.epson.com.br/)
- [QRCode.js Documentation](https://davidshimjs.github.io/qrcodejs/)
- [esc-pos-encoder GitHub](https://github.com/escpos/esc-pos-encoder)
- [W3C Bluetooth Spec](https://webbluetoothcg.github.io/web-bluetooth/)

---

**Última atualização**: 1º de março de 2026  
**Versão**: 1.0 - Referência Técnica Completa
