# Plano de Implementação - Página da Praça

> **Última atualização:** Março de 2026
> **Status:** FASE 7 Em Andamento

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
