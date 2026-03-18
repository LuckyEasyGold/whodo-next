# Plano de Implementação - Página da Praça

> **Última atualização:** Março de 2026
> **Status:** FASE 4 Concluída / Iniciando MMN

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

---

## ✅ FASE 5: Otimizações e Imagens (CONCLUÍDA)

### Itens Implementados:
- [x] Utilitário de compressão de imagens via Canvas HTML5 (`src/lib/imageCompression.ts`)
- [x] Paginação infinita completa na Praça (via componente `LoadMorePosts`)
- [x] Controle de estado para carregamento seguro (hasMore e loading states)

---

## 💰 FASE 6: Motor Financeiro e Pagamentos (EM ANDAMENTO)

- [x] Configurar Conta Mestra da Plataforma (Usuário Mestre) para concentrar os ganhos.
- [x] Integração com Gateway de Pagamento (Mercado Pago) para gerar PIX.
- [x] Criação de Webhook para receber confirmação de pagamento em tempo real e executar o Split (96% e 4%).
- [x] Modal de Checkout na interface (`CheckoutModal.tsx` e `BotaoPagarPix.tsx`).
- [ ] **[PONTO DE PARADA]** Implementar o Fluxo Direto de Contratação na Tela de Detalhes do Agendamento (`/dashboard/agendamentos/[id]`):
  - [ ] Para o Prestador: Criar botões de **Aceitar Pedido**, **Sugerir Nova Data** e **Recusar**.
  - [ ] Para o Cliente: Exibir botão de **Pagar via Pix / Cartão** apenas após o prestador Aceitar.
  - [ ] Para Ambos: Adicionar botão secundário **"Abrir Chat"** nos detalhes para comunicação opcional.
- [ ] Permitir pagamento de contratos usando o próprio saldo da Carteira do usuário.

### 💡 Detalhamento do Fluxo de Pagamento (Escrow)
> **Princípio:** O WhoDo atua como intermediário central (escrow) em todas as transações para garantir segurança, controle e auditoria. O fluxo é sempre `Cliente -> WhoDo -> Prestador`.

1.  **Gatilho:** Prestador aceita o serviço, o `Agendamento` muda para status `confirmado`. O valor acordado se torna um pagamento pendente.
2.  **Ação do Cliente (Pagamento):** O cliente é direcionado para pagar. O sistema verifica o saldo em sua `Carteira`.
    *   **Cenário A: Saldo suficiente na Carteira:**
        *   O cliente aprova o pagamento. O valor é movido do `saldo` para um estado `bloqueado` (escrow) na plataforma. Uma `Transacao` interna registra essa movimentação.
    *   **Cenário B: Sem saldo suficiente (Pagamento Externo):**
        *   O cliente paga via gateway (ex: Mercado Pago).
        *   O webhook do gateway confirma o pagamento ao WhoDo.
        *   **Registro Duplo para Clareza:** Para o histórico do cliente, o sistema registrará **duas transações**:
            1.  **Crédito:** Uma entrada no valor do pagamento (`+R$ 100,00 de Depósito via Gateway`).
            2.  **Débito para Escrow:** Uma saída imediata do mesmo valor para a custódia do agendamento (`-R$ 100,00 para Pagamento do Serviço #123`).
3.  **Liberação para o Prestador (Settlement):**
    *   Após a finalização do serviço (`Agendamento` com status `concluído`), o sistema é acionado.
    *   A comissão da plataforma (ex: 4%) é calculada.
    *   O valor restante (ex: 96%) é transferido da custódia (escrow) para o `saldo` disponível na `Carteira` do prestador. Cada passo é registrado na tabela `Transacao`.

---

## 🌳 FASE 7: Sistema MMN (Marketing Multinível)

- [ ] Criar tabela `Comissao` no Prisma (id, user_id, source_user_id, nivel, valor, agendamento_id).
- [ ] Lógica de cálculo determinística (4% da venda, distribuídos em 8%, 4%, 2%, 1% em até 4 níveis).
- [ ] Disparo automático de comissão na mudança de status do Agendamento para "concluído"/"pago".
- [ ] Integração do saldo gerado na `Carteira` dos patrocinadores (tirando do lucro da plataforma).
- [ ] Dashboard de ganhos de rede para o usuário acompanhar indicações.

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
npm run dev
```

Depois accesse http://localhost:3000/praca
