# Plano de Implementação - Página da Praça

> **Última atualização:** Março de 2026
> **Status:** FASE 8 Concluída

---

## ✅ FASE 1: UI Mobile + CardPostagem Instagram (CONCLUÍDA)

### Itens Implementados:
- [x] Barra de navegação inferior mobile estilo Instagram
- [x] CardPostagem com layout Instagram (mídia no topo)
- [x] Editar postagem
- [x] Excluir postagem
- [x] Comentar (modal)
- [x] Compartilhar (modal)
- [x] Curtir

---

## ✅ FASE 2: Itens Salvos + Agenda (CONCLUÍDA)

### Itens Implementados:
- [x] Modelo PostagemSalva no Prisma
- [x] API de salvar/desselvar posts
- [x] Página /itens-salvos
- [x] Página /agenda (redireciona para dashboard)

---

## ✅ FASE 3: Melhorias UX (CONCLUÍDA)

### Itens Implementados:
- [x] **Toast Notifications** - Sistema de notificações toast integrado ao app
- [x] **Providers** - Provider global para contexto de toast
- [x] Animação slide-in para toasts
- [x] Toast notifications em vez de alert()
- [x] Indicador visual de postagem salva (ícone filled)
- [x] Contador de visualizações nas postagens

---

## ✅ FASE 4: Novas Funcionalidades (CONCLUÍDA)

### Itens Implementados:
- [x] **Loading States** - Skeleton loading para Server Components
- [x] **SkeletonPost** - Componente skeleton para posts
- [x] **LoadMorePosts** - Componente base para paginação infinita
- [x] Sistema de seguidores (API existente e funcional)
- [x] Notificações automáticas ao seguir usuário

### Funcionalidades de Banco (Prisma):
- `visualizacoes` - Contador de visualizações
- `videoYoutubeId` - ID do vídeo YouTube
- `salva` - Relação com PostagemSalva

---

## ✅ FASE 5: Otimizações e Imagens (CONCLUÍDA)

### Itens Implementados:
- [x] Utilitário de compressão de imagens via Canvas HTML5 (`src/lib/imageCompression.ts`)
- [x] Paginação infinita completa na Praça (via componente `LoadMorePosts`)
- [x] Controle de estado para carregamento seguro (hasMore e loading states)

---

## ✅ FASE 6: Motor Financeiro e Pagamentos (CONCLUÍDA)

### Itens Implementados:
- [x] Banco de Dados: Novos campos no Agendamento (`orcamento_aprovado`, `concluido_prestador`, `concluido_cliente`, `valor_orcamento`, `descricao_orcamento`, `condicoes_orcamento`)
- [x] Tabela `HistoricoAgendamento` para auditoria
- [x] Provider Actions na tela `/dashboard/agendamentos/[id]`:
  - [x] Botão Aceitar → status = aceito
  - [x] Botão Sugerir Nova Data → status = aguardando_cliente
  - [x] Botão Recusar → status = recusado
  - [x] Botão Enviar Orçamento
  - [x] Botão Marcar como Concluído (para prestador)
- [x] Client Actions:
  - [x] Botão Pagar (Pix/Cartão) - visível apenas após prestador aceitar
  - [x] Botão Aprovar/Recusar Orçamento
  - [x] Botão Confirmar Conclusão
  - [x] Botão Negociar (via chat)
- [x] Lógica de Negócio:
  - [x] Lógica de mudança de status (9+ estados)
  - [x] Fluxo de Orçamento
  - [x] Fluxo de Two-Step Completion
  - [x] Integração com chat (botão disponível)
  - [x] Histórico de auditoria (HistoricoAgendamento)
- [x] Pagamentos:
  - [x] Liberação de pagamento (96% prestador / 4% plataforma)
  - [x] Regra: Só permite pagamento se status permite
  - [x] Regra: Não liberar dinheiro antes da confirmação do cliente
  - [x] Transações atômicas
- [x] Configurar Conta Mestra da Plataforma (Usuário Mestre) para concentrar os ganhos.
- [x] Integração com Gateway de Pagamento (Mercado Pago) para gerar PIX.
- [x] Criação de Webhook para receber confirmação de pagamento em tempo real e executar o Split (96% e 4%).
- [x] Modal de Checkout na interface (`CheckoutModal.tsx` e `BotaoPagarPix.tsx`).
- [x] Permitir pagamento de contratos usando o próprio saldo da Carteira do usuário.

### 📊 Schema do Banco - Campos do Agendamento

Adicionar ao modelo `Agendamento` no Prisma:
```prisma
model Agendamento {
  // ... campos existentes
  orcamento_aprovado     Boolean?  @default(false)
  concluido_prestador   Boolean   @default(false)
  concluido_cliente     Boolean   @default(false)
  valor_orcamento       Decimal?  @db.Decimal(10, 2)
  descricao_orcamento   String?
  condicoes_orcamento   String?
}
```

### 📊 Tabela de Auditoria - HistoricoAgendamento

```prisma
model HistoricoAgendamento {
  id            String   @id @default(cuid())
  agendamento_id String
  acao          String   // ex: "STATUS_CHANGE", "PAYMENT", "APPROVAL", etc.
  user_id       String
  timestamp     DateTime @default(now())
  metadata      Json?    // dados adicionais da ação
  agendamento   Agendamento @relation(fields: [agendamento_id], references: [id])
}
```

### 📌 Valores de Status (9 Estados)

Os status do Agendamento devem seguir esta definição:

| Status | Descrição |
|--------|-----------|
| `pendente` | Agendamento criado, aguardando resposta do prestador |
| `aceito` | Prestador aceitou o serviço |
| `aguardando_cliente` | Prestador sugeriu nova data, aguardando cliente |
| `recusado` | Prestador recusou o serviço |
| `orcamento_enviado` | Prestador enviou orçamento para aprovação |
| `aguardando_pagamento` | Orçamento aprovado, aguardando pagamento do cliente |
| `confirmado` | Pagamento confirmado (em execução) |
| `aguardando_confirmacao_cliente` | Prestador marcou como concluído, aguardando validação |
| `concluido` | Cliente confirmou - serviço finalizado e pago |

### 🔄 Fluxo Completo do Contrato

#### 1. CRIAÇÃO DO AGENDAMENTO (INÍCIO)
- Status inicial: `pendente`
- Campos necessários: `status`, `cliente_id`, `prestador_id`, `servico_id`, `descricao`, `data_sugerida`, `valor` (nullable)

#### 2. AÇÃO DO PRESTADOR (Tela: `/dashboard/agendamentos/[id]`)

**Botões do Prestador:**
- ✅ **Aceitar Pedido** → `status = aceito`
- 🔄 **Sugerir Nova Data** → `status = aguardando_cliente`
- ❌ **Recusar** → `status = recusado`
- 💬 **Abrir Chat** → Abre chat vinculado ao agendamento

#### 3. ORÇAMENTO (SE NECESSÁRIO)
- Se serviço não tem valor definido, prestador pode criar orçamento
- Campos: `valor_orcamento`, `descricao_orcamento`, `condicoes_orcamento`
- Status: `orcamento_enviado`
- Cliente pode: Aprovar / Recusar / Negociar via chat
- Se aprovado: `orcamento_aprovado = true`, `status = aguardando_pagamento`

#### 4. PAGAMENTO (ESCROW)
- **Regra Crítica:** Só permite pagamento se `status = aguardando_pagamento`
- Cliente só vê botão de pagamento APÓS prestador aceitar
- Opções: Pix, Cartão ou Saldo da Carteira

**Fluxo de Pagamento com Carteira:**
- Mover saldo → estado `bloqueado` (escrow)

**Fluxo de Pagamento com Gateway:**
- Registrar crédito (+)
- Registrar débito para escrow (-)
- Status após confirmado: `confirmado`

#### 5. EXECUÇÃO DO SERVIÇO
- Chat liberado durante toda a execução
- Mensagens vinculadas ao `agendamento_id`

#### 6. FINALIZAÇÃO (Two-Step Completion)

**Prestador:**
- Botão: "Marcar como concluído"
- `concluido_prestador = true`
- `status = aguardando_confirmacao_cliente`

**Cliente:**
- Botão: "Confirmar conclusão"
- `concluido_cliente = true`
- `status = concluido`

#### 7. LIBERAÇÃO DO PAGAMENTO
Após `status = concluido`:
- Calcular comissão (4%)
- Transferir 96% → carteira do prestador
- Transferir 4% → conta da plataforma
- Registrar tudo em `Transacao`

### ⚠️ REGRAS CRÍTICAS

| Regra | Descrição |
|-------|-----------|
| ❌ | Não permitir pagamento antes da aprovação do prestador |
| ❌ | Não liberar dinheiro antes da confirmação do cliente |
| ❌ | Não permitir conclusão sem ambas as partes |
| ✅ | Tudo deve ser reversível até o pagamento |
| ✅ | Tudo deve ser auditável via HistoricoAgendamento |

---

---

## ✅ FASE 8: Busca Melhorada (CONCLUÍDA)

### Itens Implementados:
- [x] **Case-Insensitive** - Busca aceita maiúsculas e minúsculas
- [x] **Partial Match** - Encontra profissionais com parcial digitado (ex: "ele" encontra "eletricista")
- [x] **Multi-Campo** - Busca por nome, especialidade, nome fantasia, serviço e categoria
- [x] **Live Search** - Busca em tempo real a cada letra com debounce de 300ms
- [x] **Indicador de Carregamento** - Feedback visual durante a busca
- [x] **API de Busca** - Nova rota `/api/busca` para buscas em tempo real

### Arquivos Criados/Modificados:
- `src/app/api/busca/route.ts` - Nova API REST
- `src/app/buscar/page.tsx` - Busca case-insensitive no backend
- `src/app/buscar/BuscarContent.tsx` - Live search com debounce

---

## 🌳 FASE 7: Sistema MMN (Marketing Multinível) (EM ANDAMENTO)

### Tabela Comissao

```prisma
model Comissao {
  id              String   @id @default(cuid())
  user_id         String   // Quem recebe a comissão
  source_user_id  String   // Quem realizou a contratação
  nivel           Int      // 1, 2, 3 ou 4
  valor           Decimal  @db.Decimal(10, 2)
  agendamento_id  String
  percentual      Decimal  @db.Decimal(5, 2) // 8%, 4%, 2% ou 1%
  created_at      DateTime @default(now())
}
```

### Distribuição de Comissão (4% total)

| Nível | Percentual | Descrição |
|-------|------------|-----------|
| 1 | 8% | Indicação direta |
| 2 | 4% | Indicação indireta |
| 3 | 2% | Terceiro nível |
| 4 | 1% | Quarto nível |

### 📋 Tarefas - Fase 7

- [ ] Criar tabela `Comissao` no Prisma
- [ ] Implementar lógica de cálculo determinística (4% da venda)
- [ ] Implementar distribuição: 8%, 4%, 2%, 1% em até 4 níveis
- [ ] Disparo automático na mudança de status para "concluido"
- [ ] Integrar saldo gerado na `Carteira` dos patrocinadores
- [ ] Criar dashboard de ganhos de rede

---

## 📋 PLANO DE EXECUÇÃO - SISTEMA DE CONTRATOS E AGENDAMENTOS

### Fluxo Completo do Sistema de Contratos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. CONTRATAÇÃO                                                               │
│ ┌──────────────┐    ┌─────────────────┐    ┌────────────────────────────┐  │
│ │ Cliente       │───▶│ Escolhe Serviço │───▶│ Seleciona Data/Hora        │  │
│ │ Perfil Prest. │    │ do Prestador    │    │ (Consulta Agenda Prest.)  │  │
│ └──────────────┘    └─────────────────┘    └────────────────────────────┘  │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────────┐    │
│ │ Cria AGENDAMENTO (status: pendente)                              │    │
│ │ - cliente_id, prestador_id, servico_id                           │    │
│ │ - data_agendamento, valor_total                                  │    │
│ │ - Link para chat vinculado                                        │    │
│ └──────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. AGENDA vs AGENDAMENTO                                                    │
│                                                                              │
│ 📅 AGENDA = Disponibilidade do Prestador                                    │
│    - Permite criar blocos de disponibilidade                                │
│    - Mostra datas/horários disponíveis                                       │
│    - Reserva automática ao contratar                                        │
│                                                                              │
│ 📋 AGENDAMENTO = Contrato entre as partes                                  │
│    - Registro formal do serviço contratado                                  │
│    - Histórico de mensagens relacionadas                                    │
│    - Status do serviço (pendente → confirmado → concluído)                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. FLUXO APÓS CONTRATAÇÃO                                                  │
│                                                                              │
│ PRESTADOR (Agendamentos Recebidos):                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ Card com:                                                           │    │
│ │ - Dados do cliente                                                  │    │
│ │ - Serviço contratado                                                 │    │
│ │ - Data/Hora agendada                                                │    │
│ │ - Valor                                                             │    │
│ │ BOTÕES:                                                             │    │
│ │ ✓ Confirmar Solicitação                                             │    │
│ │ ✗ Recusar (com motivo)                                             │    │
│ │ 💬 Abrir Chat (negociação)                                         │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ CLIENTE (Meus Agendamentos):                                                │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ Card com:                                                           │    │
│ │ - Dados do prestador                                                │    │
│ │ - Serviço contratado                                                 │    │
│ │ - Status atual                                                      │    │
│ │ BOTÕES:                                                             │    │
│ │ - Aguardando resposta (se pendente)                                │    │
│ │ - Pagar Agora (se confirmado)                                      │    │
│ │ - Chat                                                              │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. SISTEMA DE PAGAMENTO (ESCROW)                                           │
│                                                                              │
│ OPÇÕES DE PAGAMENTO:                                                         │
│ 1. 💰 Saldo da Carteira do Cliente                                          │
│ 2. 💳 Gateway (Mercado Pago) - PIX ou Cartão                               │
│    - Cliente escolhe método no Mercado Pago                                 │
│    - Importante: Mercado Pago comunica via API quando valor for enviado    │
│                                                                              │
│ FLUXO DO DINHEIRO:                                                          │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ Cliente paga → Valor entra na conta WHODE                          │    │
│ │                                                                     │    │
│ │ Cria registro:                                                     │    │
│ │ - Débito na carteira do cliente                                    │    │
│ │ - Crédito pendente na carteira do prestador                        │    │
│ │ - Taxa (4%) para a plataforma                                      │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ 💡 O valor fica PENDENTE até serviço ser concluído                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. LIBERAÇÃO DO PAGAMENTO                                                   │
│                                                                              │
│ CONDIÇÕES PARA LIBERAÇÃO:                                                   │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ 1. Prestador notifica fim do serviço                               │    │
│ │ 2. Cliente confirma recebimento OU                                  │    │
│ │ 3. Disputa resolvida (se houver)                                   │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ APÓS CONDIÇÕES ATENDIDAS:                                                   │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ - Descontar taxa do WHODE (4%)                                     │    │
│ │ - Transferir 96% para carteira do prestador                       │    │
│ │ - Atualizar status do agendamento                                  │    │
│ │ - Registrar transação completa                                     │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ DISPUTA/RECLAMAÇÃO:                                                         │
│ - Cliente pode abrir disputa antes de confirmar                            │
│ - Valor fica retido até WHODE resolver                                     │
│ - Após resolução: valor vai para prestador OU retorna para cliente         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 6. AVALIAÇÕES OBRIGATÓRIAS                                                  │
│                                                                              │
│ APÓS CONCLUSÃO:                                                              │
│ ┌─────────────────────────────────────────────────────────────────────┐    │
│ │ AMBAS as partes DEVEM avaliar:                                     │    │
│ │                                                                     │    │
│ │ - Prestador avalia Cliente                                          │    │
│ │ - Cliente avalia Prestador                                          │    │
│ │                                                                     │    │
│ │ Sistema calcula nova média de avaliações                            │    │
│ └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Status do Agendamento (Estados)

| Status | Descrição | Próximo Status |
|--------|-----------|----------------|
| `pendente` | Contrato criado, aguardando resposta do prestador | `aceito`, `recusado` |
| `aceito` | Prestador confirmou o serviço | `confirmado` (após pagamento) |
| `recusado` | Prestador recusou | FIM |
| `confirmado` | Pagamento realizado, serviço em execução | `aguardando_confirmacao` |
| `aguardando_confirmacao` | Prestador marcou como concluído | `concluido`, `disputa` |
| `concluido` | Cliente confirmou - pago | FIM |
| `disputa` | Reclamação aberta | `concluido` (após resolução) |

### Tarefas do Plano de Execução

**FASE 1: Estrutura Base (Concluir antes de prosseguir)**
- [x] 1.1 Separar conceitos: Agenda (disponibilidade) vs Agendamento (contrato)
- [ ] 1.2 Criar tabela de Agenda/Disponibilidade do prestador
- [ ] 1.3 Criar API de consulta de disponibilidade
- [ ] 1.4 Integrar seleção de data/hora no fluxo de contratação

**FASE 2: Contratação**
- [x] 2.1 Revisar fluxo de criação de agendamento
- [x] 2.2 Garantir que links para chat funcionem
- [x] 2.3 Mostrar cards corretos para prestador e cliente
- [x] 2.4 Implementar botões de confirmar/recusar

> **CORREÇÕES REALIZADAS (21/03/2026):**
> - Atualizado frontend para usar APIs corretas (`/api/agendamento/[id]/aceitar/`, etc)
> - Adicionados novos statuses: `aceito`, `orcamento_enviado`, `aguardando_pagamento`, `aguardando_confirmacao`
> - Adicionada função getStatusLabel para exibir nomes amigáveis
> - Adicionados filtros de status no dropdown
> - Botões agora aparecem conforme o status e tipo de usuário

**FASE 3: Pagamento**
- [x] 3.1 Revisar integração com Mercado Pago (API existente)
- [x] 3.2 Implementar pagamento via saldo da carteira (existente)
- [x] 3.3 Criar registro de pagamento pendente (existente)
- [ ] 3.4 Configurar webhook para confirmações

**FASE 4: Conclusão**
- [x] 4.1 Implementar notificação de fim de serviço (API existente)
- [x] 4.2 Criar botão de confirmação do cliente (implementado)
- [ ] 4.3 Implementar sistema de disputas
- [x] 4.4 Criar lógica de liberação de pagamento (API existente)

**FASE 5: Avaliações**
- [ ] 5.1 Tornar avaliações obrigatórias
- [x] 5.2 Calcular média de avaliações (existente)

---

## 📋 MELHORIAS DE BACKLOG (Futuro)

### FuncionalidadesAvançadas:
- [ ] Lives/transmissões ao vivo
- [ ] Sistema de stories (24h)
- [ ] Chat em tempo real (WebSocket)
- [ ] Videochamadas

### Mobile:
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] App nativo (Expo/React Native)

---

## 📝 Notas

- Execute `npx prisma migrate dev` após adicionar novos modelos
- A página de itens salvos pode precisar de ajustes após regenerar o Prisma

---

## 🔗 Links Úteis

- Feed (Praça): `/praca`
- Itens Salvos: `/itens-salvos`
- Agenda: `/agenda` → `/dashboard/agendamentos`
- Detalhes Agendamento: `/dashboard/agendamentos/[id]`
- Perfil: `/perfil/[id]`
- Dashboard: `/dashboard`

---

## ⚠️ Comando para Testar

Após fazer pull das alterações, execute:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name add_postagem_salva
npx prisma migrate dev --name add_visualizacoes_postagem
npx prisma migrate dev --name add_campos_agendamento_and_historico
npm run dev
```

Depois accesse http://localhost:3000/praca
