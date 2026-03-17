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

## 💰 FASE 6: Monetização e Sistema MMN (NOVO)

- [ ] Criar tabela `Comissao` no Prisma (id, user_id, source_user_id, nivel, valor, agendamento_id).
- [ ] Lógica de cálculo determinística (4% da venda, distribuídos em 8%, 4%, 2%, 1% em até 4 níveis).
- [ ] Disparo automático de comissão na mudança de status do Agendamento para "concluído"/"pago".
- [ ] Integração do saldo gerado na `Carteira` do usuário.
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
