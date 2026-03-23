# Plano de Refatoração: API de Agendamentos

## Fluxo Detalhado de Negociação

O diagrama abaixo mostra exatamente o que acontece em cada estágio:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    FLUXO COMPLETO                                         │
│                                                                                          │
│  ┌─────────────┐     ┌─────────────┐     ┌──────────────────────┐     ┌─────────────┐    │
│  │   CLIENTE  │     │  PRESTADOR │     │      STATUS         │     │  AÇÕES      │    │
│  │  (contrata)│     │ (fornecedor)│     │                      │     │  POSSÍVEIS  │    │
│  └──────┬──────┘     └──────┬──────┘     └──────────┬─────────┘     └──────┬──────┘    │
│         │                    │                       │                      │            │
│         │──── CRIA ────────►│                       │                      │            │
│         │    AGENDAMENTO    │                       │                      │            │
│         │                   │                       │                      │            │
│         │                   │◄─── NOTIFICAÇÃO ─────│   PENDENTE           │            │
│         │                   │                       │                      │            │
│         │                   │───── ACEITA ────────►│                      │            │
│         │                   │    (data/valor ok)   │                      │            │
│         │                   │                       │                      │            │
│         │◄──── ORÇAMENTO ───│                       │   AGUARDANDO        │            │
│         │    (se necessário)│                       │   CONFIRMAÇÃO        │            │
│         │                   │                       │                      │            │
│         │──── CONFIRMA ────►│                       │                      │            │
│         │   (ou modifica)  │                       │                      │            │
│         │                   │                       │                      │            │
│         │                   │◄─── SOLICITA ────────│   AGUARDANDO         │            │
│         │──── PAGAMENTO ───►│    PAGAMENTO         │   PAGAMENTO          │            │
│         │                   │                       │                      │            │
│         │                   │◄─ CONFIRMAÇÃO ──────│   PAGAMENTO           │            │
│         │                   │    DO GATEWAY       │   APROVADO           │            │
│         │                   │                       │                      │            │
│         │                   │───── INICIA ───────►│   EM ANDAMENTO       │            │
│         │                   │    SERVIÇO          │                      │            │
│         │                   │                       │                      │            │
│         │                   │──── CONCLUI ────────►│   AGUARDANDO         │            │
│         │                   │    SERVIÇO          │   CONFIRMAÇÃO        │            │
│         │                   │                       │                      │            │
│         │──── CONFIRMA ────►│                       │   CONCLUIDO          │            │
│         │   (ou recusar)    │                       │                      │            │
│         │                   │                       │                      │            │
│         │◄── AVALIA ────────│──── AVALIA ────────►│   AVALIADO           │            │
│         │                   │                       │   (por ambos)        │            │
│         │                   │                       │                      │            │
└─────────┴───────────────────┴───────────────────────┴──────────────────────┴────────────┘
```

---

## 1. STATUS: PENDENTE (Início)

### O que acontece:
O **cliente** cria um agendamento escolhendo:
- Prestador
- Serviço
- Data e horário desejado
- Endereço
- Valor (do serviço cadastrado)

### Quem recebe:
O **prestador** recebe uma notificação

### Ações disponíveis para cada pessoa:

| Quem | Ação | O que acontece |
|------|------|----------------|
| **Prestador** | ✅ ACEITAR | Aceita o trabalho com as condições propostas → Vai para AGUARDANDO_CONFIRMAÇÃO |
| **Prestador** | ❌ RECUSAR | Recusa o trabalho → Vai para CANCELADO (motivo registrado) |
| **Prestador** | 📝 SUGERIR_DATA | Sugere outra data → Cliente recebe notificação → Volta para PENDENTE |
| **Prestador** | 💰 ENVIAR_ORÇAMENTO | Envia orçamento diferente (valor/prazo) → Cliente recebe → Aguarda resposta |
| **Cliente** | ❌ CANCELAR | Cancela antes de aceite → Vai para CANCELADO |

### Detalhe importante:
- Se o serviço tem **preço fixo** (preco_base definido): O prestador pode aceitar diretamente
- Se precisa **orçamento**: O prestador envia o valor, cliente aprova

---

## 2. STATUS: AGUARDANDO_CONFIRMAÇÃO

### O que acontece:
O prestador aceitou! Agora o cliente precisa confirmar para continuar.

### Ações disponíveis:

| Quem | Ação | O que acontece |
|------|------|----------------|
| **Cliente** | ✅ CONFIRMAR | Confirma que está de acordo com data/valor → Vai para AGUARDANDO_PAGAMENTO |
| **Cliente** | ❌ RECUSAR | Não concorda com algo → Volta para PENDENTE (prestador pode sugerir nova data) |
| **Cliente** | ❌ CANCELAR | Desiste → Vai para CANCELADO |
| **Prestador** | 📝 SUGERIR_DATA | Precisa mudar a data → Cliente recebe notificação |

---

## 3. STATUS: AGUARDANDO_PAGAMENTO

### O que acontece:
O cliente precisa realizar o pagamento agora.

### Ações disponíveis:

| Quem | Ação | O que acontece |
|------|------|----------------|
| **Cliente** | 💳 PAGAR | Efetua pagamento via gateway → Sistema verifica aprovação → Se OK, vai para PAGO |
| **Cliente** | ❌ CANCELAR | Desiste antes de pagar → Vai para CANCELADO |

### REGRA IMPORTANTE (Bug atual a corrigir):
```
NÃO É PERMITIDO prosseguir para "EM ANDAMENTO" 
sem que "pagamento_aprovado" seja TRUE
```

---

## 4. STATUS: PAGO (Pagamento Aprovado)

### O que acontece:
O pagamento foi confirmado pelo gateway. O serviço pode ser realizado.

### Ações disponíveis:

| Quem | Ação | O que acontece |
|------|------|----------------|
| **Prestador** | ▶️ INICIAR_SERVICO | Marca que vai executar o serviço → Vai para EM_ANDAMENTO |
| **Prestador** | ❌ CANCELAR | Cancela (motivo) → Vai para CANCELADO +的可能性 de reembolso |

---

## 5. STATUS: EM_ANDAMENTO

### O que acontece:
O prestador está executando o serviço.

### Ações disponíveis:

| Quem | Ação | O que acontece |
|------|------|----------------|
| **Prestador** | ✅ CONCLUIR_SERVICO | Marca que terminou → Vai para AGUARDANDO_CONFIRMACAO_CLIENTE |

---

## 6. STATUS: AGUARDANDO_CONFIRMACAO_CLIENTE

### O que acontece:
O prestador disse que concluiu. O cliente precisa confirmar que recebeu o serviço.

### Ações disponíveis:

| Quem | Ação | O que acontece |
|------|------|----------------|
| **Cliente** | ✅ CONFIRMAR_CONCLUSAO | Confirma que o serviço foi prestado → Vai para CONCLUIDO |
| **Cliente** | ❌ RECUSAR_CONCLUSAO | Não concorda (problema no serviço) → Vai para EM_ANDAMENTO (prestador precisa resolver) |

---

## 7. STATUS: CONCLUIDO

### O que acontece:
O serviço foi prestado e confirmado por ambos.

### Ações disponíveis:

| Quem | Ação | O que acontece |
|------|------|----------------|
| **Cliente** | ⭐ AVALIAR | Dá nota e comentário → Vai para AVALIADO |
| **Prestador** | ⭐ AVALIAR | Dá nota e comentário → Vai para AVALIADO |

### REGRA:
```
O agendamento SÓ termina quando AMBOS avaliarem
OU após 7 dias (avaliação automática)
```

---

## 8. STATUS: AVALIADO (Fim do fluxo)

### O que aconteceu:
- Serviço prestado ✓
- Pago ✓
- Avaliado por ambos ✓
- **Nenhuma ação necessária**

---

## Tabela de Transições Completa

| Status Atual | Ação | Requer | Próximo Status | Campo Timestamp |
|--------------|------|--------|----------------|-----------------|
| PENDENTE | ACEITAR | prestador | AGUARDANDO_CONFIRMAÇÃO | data_aceito |
| PENDENTE | RECUSAR | prestador | CANCELADO | data_cancelado |
| PENDENTE | SUGERIR_DATA | prestador | PENDENTE | data_sugerida |
| PENDENTE | ENVIAR_ORCAMENTO | prestador | PENDENTE | (guarda orçamento) |
| PENDENTE | CANCELAR | cliente | CANCELADO | data_cancelado |
| AGUARDANDO_CONFIRMAÇÃO | CONFIRMAR | cliente | AGUARDANDO_PAGAMENTO | data_confirmado |
| AGUARDANDO_CONFIRMAÇÃO | RECUSAR | cliente | PENDENTE | - |
| AGUARDANDO_CONFIRMAÇÃO | SUGERIR_DATA | prestador | PENDENTE | data_sugerida |
| AGUARDANDO_CONFIRMAÇÃO | CANCELAR | ambos | CANCELADO | data_cancelado |
| AGUARDANDO_PAGAMENTO | PAGAR | cliente | PAGO | data_pago |
| AGUARDANDO_PAGAMENTO | CANCELAR | cliente | CANCELADO | data_cancelado |
| PAGO | INICIAR_SERVICO | prestador | EM_ANDAMENTO | data_iniciado |
| PAGO | CANCELAR | ambos | CANCELADO | data_cancelado |
| EM_ANDAMENTO | CONCLUIR_SERVICO | prestador | AGUARDANDO_CONFIRMACAO | data_concluido_prestador |
| AGUARDANDO_CONFIRMACAO | CONFIRMAR_CONCLUSAO | cliente | CONCLUIDO | data_concluido_cliente |
| AGUARDANDO_CONFIRMACAO | RECUSAR_CONCLUSAO | cliente | EM_ANDAMENTO | - |
| CONCLUIDO | AVALIAR | ambos | AVALIADO | data_avaliado |

---

## Exemplo de Timeline

```json
{
  "agendamento_id": 123,
  "timeline": [
    {
      "status": "pendente",
      "data": "2024-01-15T10:30:00Z",
      "acao": "Agendamento criado",
      "usuario": "João (cliente)",
      "detalhes": { "servico": "Corte de cabelo", "valor": 50.00, "data": "2024-01-20T14:00:00Z" }
    },
    {
      "status": "pendente",
      "data": "2024-01-15T14:00:00Z",
      "acao": "Data sugerida",
      "usuario": "Maria (prestador)",
      "detalhes": { "nova_data": "2024-01-22T10:00:00Z", "motivo": "Agenda lotada no dia 20" }
    },
    {
      "status": "pendente",
      "data": "2024-01-16T09:00:00Z",
      "acao": "Agendamento aceito",
      "usuario": "João (cliente)",
      "detalhes": { "nova_data_confirmada": "2024-01-22T10:00:00Z" }
    },
    {
      "status": "confirmado",
      "data": "2024-01-16T09:05:00Z",
      "acao": "Agendamento confirmado",
      "usuario": "João (cliente)",
      "detalhes": {}
    },
    {
      "status": "pago",
      "data": "2024-01-16T09:10:00Z",
      "acao": "Pagamento aprovado",
      "usuario": "Sistema (gateway)",
      "detalhes": { "transacao_id": "tx_123", "metodo": "pix" }
    },
    {
      "status": "em_andamento",
      "data": "2024-01-22T10:00:00Z",
      "acao": "Serviço iniciado",
      "usuario": "Maria (prestador)",
      "detalhes": {}
    },
    {
      "status": "aguardando_confirmacao",
      "data": "2024-01-22T11:00:00Z",
      "acao": "Serviço concluído",
      "usuario": "Maria (prestador)",
      "detalhes": { "nota": "Corte realizado com sucesso" }
    },
    {
      "status": "concluido",
      "data": "2024-01-22T14:00:00Z",
      "acao": "Conclusão confirmada",
      "usuario": "João (cliente)",
      "detalhes": {}
    },
    {
      "status": "avaliado",
      "data": "2024-01-22T15:00:00Z",
      "acao": "Avaliação recebida",
      "usuario": "João (cliente)",
      "detalhes": { "nota": 5, "comentario": "Excelente trabalho!" }
    },
    {
      "status": "avaliado",
      "data": "2024-01-22T16:00:00Z",
      "acao": "Avaliação recebida",
      "usuario": "Maria (prestador)",
      "detalhes": { "nota": 5, "comentario": "Cliente muito educado!" }
    }
  ]
}
```

---

## Resumo das Regras de Negócio

1. **Pendente → Aguardando Confirmação**: Apenas o prestador pode aceitar
2. **Aguardando Confirmação → Pago**: Cliente deve confirmar E pagar
3. **Pago → Em Andamento**: Apenas após confirmação do gateway
4. **Concluído → Avaliado**: Ambos DEVEM avaliar (ou após 7 dias)
5. **Qualquer momento**: Ambos podem cancelar (se pago, entra em processo de reembolso)
