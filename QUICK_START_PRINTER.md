# 🎯 Guia Rápido - Impressora Térmica Bluetooth

## ⚡ Start 5 Minutos

### Passo 1: Conectar Impressora
1. Clique no botão **🖨️📡** (topo direito)
2. Selecione sua impressora térmica Bluetooth
3. Aguarde "✅ Conectado" aparecer

### Passo 2: Testar
1. Vá para **Administração** (📋 botão no topo)
2. Procure "Impressora Térmica Bluetooth"
3. Clique em **Teste de Impressão**
4. Verifique se saiu um recibo da impressora

### Passo 3: Usar
1. **ENTRADA**: Registre um veículo → clique **🖨️**
2. **SAÍDA**: Finalize → clique **🖨️** no modal
3. Pronto! 🎉

---

## 🖥️ Compatibilidade

### Impressoras Suportadas
- Elgin i7/i9/i10
- Sweda SI-300/SI-800
- Bematech MP-100S/MP-2100
- Zebra ZQ110/ZQ220
- Star Micronics SM-S210i
- **Qualquer impressora ESC/POS 58mm com Bluetooth**

### Dispositivo
- Windows 11+ com Bluetooth 4.0+
- Mac com Chrome 56+
- Tablet/Smartphone Android com Bluetooth
- **NÃO funciona em Safari**

---

## 📋 Checklist de Configuração

- [ ] Impressora ligada e pareada ao computador
- [ ] Bluetooth ativado no dispositivo
- [ ] Papel na impressora (mínimo 2 metros para testes)
- [ ] Chrome, Edge ou Opera instalado (versão recente)
- [ ] HTTPS em produção (HTTP ok em localhost)

---

## 🐛 Problemas Comuns

### "Nenhuma impressora encontrada"
```
❌ Problema: Impressora não pareada
✅ Solução: 
  1. Vá para Bluetooth do SO
  2. Pareie a impressora manualmente
  3. Tente novamente
```

### "Erro ao conectar"
```
❌ Problema: Bluetooth indisponível
✅ Solução:
  1. Reinicie o Bluetooth
  2. Feche outras abas que usam Bluetooth
  3. Reinicie o navegador
```

### "Recibo sai em branco"
```
❌ Problema: Sem papel ou cabeça não aquecida
✅ Solução:
  1. Verifique papel na impressora
  2. Limpe a cabeça térmica
  3. Ajuste temperatura (menu impressora)
```

### "QR Code não aparece"
```
❌ Problema: Impressora não suporta imagem
✅ Solução:
  1. Normal em modelos antigos
  2. ID será impresso em texto
  3. Recibo funciona normalmente
```

---

## 🎓 Layouts de Recibo

### Entrada (Simples)
```
ESTACIONAMENTO ABC
─────────────────
       ABC-1234
DATA: 01/03/2026
15:30:45

Gol • Branco

  [QR CODE]

Conserve recibo
```

### Saída (Completo)
```
ESTACIONAMENTO ABC
─────────────────
   RECIBO SAÍDA
       ABC-1234
ENTRADA: 14:30
SAÍDA: 15:45

Gol • Branco

  [QR CODE]

─────────────────
TEMPO: 1:15
  R$ 18,00

Obrigado!
```

---

## ➕ Funcionalidades Extra

### Reimpressão de Recibos
```
Admin → Sistema de Deleção
→ "Deletar Registros Individuais"
→ Clique 🖨️ para reimprimir
```

### Teste de Impressão
```
Admin → Impressora Térmica
→ Botão "Teste de Impressão"
→ Valida formatação
```

### Desconectar
```
Header → Clique 🖨️📡 (conconectado)
→ Desconecta Bluetooth
→ Botão volta a azul
```

---

## 📊 Especificações

| Item | Detalhe |
|------|---------|
| Largura | 58mm (384 dots) |
| Caracteres/Linha | 32 caracteres |
| QR Code | Até 300x300px |
| Peso Recibo | ~5 gramas |
| Temperatura | 50-80°C (cabeça) |
| Fundo | Branco (papel) |

---

## 💾 Dados

- ✅ Locais (localStorage)
- ❌ Nenhum upload para servidor
- ✅ QR Code contém apenas ID
- ✅ Desconecta automaticamente

---

## 🔒 Segurança

- Bluetooth encriptado (padrão)
- Sem dados pessoais em QR Code
- Senha admin: `1234` (customize em produção)
- HTTPS obrigatório em produção

---

## 📞 Precisa de Ajuda?

1. Consulte **Administração → Impressora Térmica**
2. Leia **IMPRESSORA_SETUP.md** (completo)
3. Leia **TECNICO_BLUETOOTH.md** (técnico)
4. Verifique **Console** do navegador (F12)

---

## 🎉 Próximos Passos

- Personalizar nome da empresa (Admin)
- Adicionar logo (Admin)
- Testar com entrada/saída real
- Monitorar qualidade de impressão

---

**Última atualização**: 1º de março de 2026

Happy Printing! 🖨️✨
