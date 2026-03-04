# 📘 GUIA PRÁTICO - COMO USAR O MÓDULO DE MENSALISTAS

## 🎯 Para o Cliente (Autocadastro)

### Passo 1: Receber o Convite
O proprietário do veículo recebe uma mensagem no WhatsApp:

```
Olá! Para agilizar seu acesso como mensalista, 
preencha seus dados aqui: 
https://seu-patio.com/cadastro-mensalista 
Assim que terminar, faremos sua ativação no pátio! 🚗
```

### Passo 2: Abrir o Link
- Clica no link
- É levado para página `/cadastro-mensalista`
- Vê formulário com campos simples

### Passo 3: Preencher Dados
```
┌─────────────────────────────────────┐
│  CADASTRO DE MENSALISTA             │
├─────────────────────────────────────┤
│                                      │
│  Nome Completo:    [João Silva  ]   │
│  CPF:              [123.456.789-01] │
│  WhatsApp:         [(11) 98765-4321]│
│  Placa:            [ABC-1234    ]   │
│  Modelo:           [GOL         ]   │
│  Cor:              [BRANCO      ]   │
│                                      │
│  [ENVIAR CADASTRO]                  │
│                                      │
└─────────────────────────────────────┘
```

**Dicas:**
- ✅ CPF e Telefone são formatados automaticamente
- ✅ Placa, Modelo e Cor viram MAIÚSCULAS sozinhas
- ✅ Só precisa preencher os campos obrigatórios (*)

### Passo 4: Confirmação
Após enviar, vê tela de confirmação:

```
┌─────────────────────────────────────┐
│  ✅ CADASTRO RECEBIDO!              │
├─────────────────────────────────────┤
│                                      │
│  Olá João da Silva!                 │
│                                      │
│  Seu cadastro foi recebido com      │
│  sucesso. Assim que o admin         │
│  ativar sua mensalidade, você      │
│  poderá usar o pátio normalmente!  │
│                                      │
│  Placa: ABC-1234                    │
│                                      │
│  Status: AGUARDANDO ATIVAÇÃO        │
│  [FECHAR]                            │
│                                      │
└─────────────────────────────────────┘
```

---

## 👨‍💼 Para o Admin (Ativação de Mensalistas)

### Passo 1: Acessar Admin
1. Clica em "⚙️ Admin" na barra superior
2. Digite a senha: `1234`
3. Entra no painel de controle

### Passo 2: Ir para "Controle de Cadastros"
No menu, procure a seção **"CONTROLE DE CADASTROS"** com ícone de pessoas 👥

### Passo 3: Ver Solicitações Pendentes
A tela mostra:

```
┌──────────────────────────────────────────┐
│  GERENCIAR MENSALISTAS                   │
├──────────────────────────────────────────┤
│                                           │
│ [PENDENTES: 3]  [ATIVOS: 5]  [INAT: 0]  │
│                                           │
│ Filtrar por:                             │
│ [PENDENTE] [ATIVO] [INATIVO] [TODAS]    │
│                                           │
│ ┌─ João da Silva ──────────────────────┐ │
│ │ CPF: 123.456.789-01                   │ │
│ │ WhatsApp: (11) 98765-4321             │ │
│ │ Placa: ABC-1234 | Modelo: GOL         │ │
│ │ Status: 🟡 PENDENTE                   │ │
│ │ Data Cadastro: 04/03/2026 10:30       │ │
│ │                                        │ │
│ │ Vigência por:                          │ │
│ │ [7 dias] [15 dias] [30 dias] [...]    │ │
│ │                                        │ │
│ │ [✅ ATIVAR] [🗑️ DELETAR]               │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌─ Maria Silva ──────────────────────────┐ │
│ │ ... mais registros ...                 │ │
│ └────────────────────────────────────────┘ │
│                                            │
└──────────────────────────────────────────┘
```

### Passo 3: Ativar Mensalista
1. Procure o cadastro na lista
2. Clique o botão **[✅ ATIVAR]**
3. Modal aparece pedindo confirmação:

```
┌────────────────────────────────────┐
│  CONFIRMAR ATIVAÇÃO                │
├────────────────────────────────────┤
│                                    │
│  João da Silva será ativado       │
│  como mensalista válido por       │
│  30 dias (até 03/04/2026)         │
│                                    │
│  [CANCELAR]       [CONFIRMAR]      │
│                                    │
└────────────────────────────────────┘
```

4. Clique **[CONFIRMAR]**
5. Resultado:

```
✅ Toast: "Mensalista ativado com sucesso!"
Status muda para: 🟢 ATIVO
Data Vencimento: 03/04/2026
```

### Passo 4: Gerenciar Mensalistas Ativos
- Mensalistas **ATIVOS** mostram botões:
  - **[⏸️ INATIVAR]** - Para/suspende acesso temporário
  - **[🗑️ DELETAR]** - Remove cadastro (com confirmação)

- Mensalistas **INATIVOS** mostram:
  - **[▶️ REATIVAR]** - Volta para ATIVO
  - **[🗑️ DELETAR]** - Remove cadastro

---

## 🚗 Para o Operador do Pátio (Reconhecimento)

### Cenário 1: Entrada de Mensalista Ativo
```
1. Cliente chega no pátio
2. Operador digita placa: ABC-1234
3. Clica [REGISTRAR ENTRADA]
4. Sistema verifica...
```

**Resultado:**

```
┌─────────────────────────────────────┐
│          🎉 ALERTA VISUAL           │
├─────────────────────────────────────┤
│                                      │
│     ACESSO LIBERADO! ✅             │
│                                      │
│     João da Silva                    │
│     Placa: ABC-1234                 │
│                                      │
│     Mensalista Ativo ✓              │
│     Vencimento: 03/04/2026          │
│                                      │
│            🔊 BIP BIP               │
│                                      │
│           [FECHAR]                  │
│                                      │
└─────────────────────────────────────┘
```

**Feedback:**
- ✅ Alerta verde e brilhante na tela
- 🔊 Bipe sonoro duplo toca automaticamente
- ✅ Registro marcado como mensalista
- ✅ Acesso garantido sem cobrança

### Cenário 2: Mensalista Vencido
Se a mensalista **expirou** (passou data de vencimento):

```
Sistema detecta: ❌ MENSALISTA VENCIDO
Ação: Trata como veículo normal
Resultado: Cobra tarifa de estacionamento
```

### Cenário 3: Placa Não é Mensalista
```
Sistema não encontra na lista
Ação: Trata como veículo comum
Resultado: Calcula tarifa normal
```

---

## 📱 Usando o Modal de Convite (Admin)

### Passo 1: Localizar Botão
No "Controle de Cadastros", procure:
```
[💬 CONVIDAR MENSALISTA]
```

### Passo 2: Abrir Modal
Clique no botão → Modal aparece:

```
┌────────────────────────────────────┐
│  ENVIAR CONVITE WHATSAPP           │
├────────────────────────────────────┤
│                                    │
│  Telefone:                         │
│  [(11) ______-____]                │
│                                    │
│  Mensagem que será enviada:        │
│  ┌──────────────────────────────┐ │
│  │ Olá! Para agilizar seu acesso│ │
│  │ como mensalista, preencha   │ │
│  │ seus dados aqui:             │ │
│  │[https://seu-patio.com/...]  │ │
│  │ Assim que terminar,         │ │
│  │ faremos sua ativação! 🚗     │ │
│  └──────────────────────────────┘ │
│                                    │
│ [📋 COPIAR LINK] [💬 ENVIAR NO WA]│
│                                    │
└────────────────────────────────────┘
```

### Passo 3: Enviar Convite
**Opção A - Via WhatsApp Web:**
1. Digite o número do cliente (11 dígitos)
2. Clique **[💬 ENVIAR NO WA]**
3. Se cliente tiver WhatsApp Web aberto, aprece mensagem
4. Revise a mensagem e clique "Enviar"

**Opção B - Cópia Manual:**
1. Digite o número
2. Clique **[📋 COPIAR LINK]**
3. Abra seu WhatsApp
4. Selecione o cliente
5. Vá para um chat com ele
6. Cole o link na mensagem

---

## 🔍 Consultando o Status de Mensalistas

### Visualizar Tudo
Clique em **[TODAS]** para ver lista completa com filtros:

| Status | Cor | O que significa |
|--------|-----|-----------------|
| 🟡 PENDENTE | Amarelo | Aguardando ativação |
| 🟢 ATIVO | Verde | Pode usar pátio |
| ⚫ INATIVO | Cinza/Preto | Acesso bloqueado |

### Deletar Mensalista
Se cliente cancelar ou não quer mais:
1. Encontre registro
2. Clique **[🗑️ DELETAR]**
3. Confirme exclusão
4. Registro removido da lista

---

## 🎵 Testando Áudio

### Teste de Bips Sonoros
Na tela HOME, quando usar a aplicação:
- ✅ Quando mensalista é reconhecido: **BIP BIP** (duplo)
- ✅ Quando form é enviado com sucesso: **BIP** (único)
- ✅ Se tiver erro: **BIP BIP BIP** (triplo)

**Nota:** Você pode precisar **interagir com a página** (clicar ou tocar) antes que o áudio funcione (segurança do navegador).

---

## 💾 Dados Salvos

Todos os dados estão em **localStorage** (persistentes):
```javascript
// Abra console do navegador (F12)
// Vá para Application → Local Storage
// Procure: park-mensalistas

// Estrutura:
[
  {
    id: 1709577600000,
    nome: "JOÃO DA SILVA",
    cpf: "12345678901",
    whatsapp: "11987654321",
    placa: "ABC-1234",
    modelo: "GOL",
    cor: "BRANCO",
    status: "ATIVO",
    dataCadastro: "2026-03-04T10:30:00",
    dataAtivacao: "2026-03-04T11:15:00",
    dataVencimento: "2026-04-03T23:59:59"
  }
]
```

---

## ⚠️ Dicas Importantes

### CPF
- Deve ter 11 dígitos
- Sistema valida digitadores automaticamente
- Exemplo válido: `123.456.789-01`

### Telefone
- Deve começar com DDD (ex: 11, 21, 31)
- Total de 11 dígitos (2 DDD + 9 dígitos)
- Exemplo: `(11) 98765-4321`

### Placa
- Formato novo: ABC-1234 (3 letras + 4 números)
- Sistema aceita com ou sem hífen
- Salva sempre em MAIÚSCULAS

### Vigência
Ao ativar, escolha quantos dias:
- **7 dias** - Teste/trial
- **15 dias** - Quinzenal
- **30 dias** - Mensal (comum)
- **60 dias** - Bimestral
- **90 dias** - Trimestral

---

## 🆘 Resolvendo Problemas

**P: Mensalista não é reconhecido no pátio?**
- ✅ Verifique se placa está correta (sem caracteres extras)
- ✅ Verifique se status é ATIVO (verde)
- ✅ Verifique se não venceu (data vencimento no futuro)

**P: Botão "Ativar" não funciona?**
- ✅ Certifique-se que selecionou dias de vigência
- ✅ Tente clicar novamente após selecionar dias
- ✅ Recarregue page (F5) e tente novamente

**P: WhatsApp não abre?**
- ✅ Cliente precisa ter WhatsApp instalado
- ✅ Se usar no desktop, precisa ter WhatsApp Web aberto
- ✅ Alternativa: Copiar link e enviar manualmente

**P: Áudio não toca?**
- ✅ Verifique volume do computador
- ✅ Navegador pode bloquear áudio - clique na página antes
- ✅ Tente em outro navegador (Chrome, Firefox, Edge)

---

## 📞 Contato e Suporte

Se ficou com dúvidas, consulte:
- 📄 `IMPLEMENTACAO_MENSALISTAS.md` - Detalhes técnicos
- 📄 `README.md` - Visão geral do projeto
- 💬 Peça ajuda ao desenvolvedor

---

**Última atualização:** 4 de março de 2026  
**Versão:** 1.0  
**Status de Funcionalidade:** ✅ Completa

