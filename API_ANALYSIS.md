# Análise de APIs Não Detectadas como Chamadas

## Tabela Resumo

| # | API | O que deveria fazer | Status |
|---|-----|---------------------|--------|
| 1 | `/api/admin/scripts/boas-vindas/route.ts` | Enviar email de boas-vindas para todos os usuários | **POTENCIAL** - Script admin, chamar manualmente |
| 2 | `/api/admin/users/route.ts` | Listar usuários para admin | **REDUNDANTE** - `/api/admin/users?params` faz a mesma coisa |
| 3 | `/api/auth/sync/route.ts` | Sincronizar sessão OAuth | **FUNCIONANDO** - Chamado internamente pelo NextAuth |
| 4 | `/api/auth/verificar-email/route.ts` | Verificar email via token | **FUNCIONANDO** - Chamado via link no email |
| 5 | `/api/notificacoes/route.ts` | Listar notificações do usuário | **FALTANDO CHAMADA** - Precisa ser chamada no frontend |
| 6 | `/api/notificacoes/[id]/lida/route.ts` | Marcar notificação como lida | **FALTANDO CHAMADA** - Precisa ser chamada no frontend |
| 7 | `/api/ranking/route.ts` | Mostrar ranking do usuário | **FALTANDO CHAMADA** - Não implementado no frontend |
| 8 | `/api/suporte/chat/route.ts` | Chat com IA de suporte | **FALTANDO CHAMADA** - Não implementado no frontend |
| 9 | `/api/busca/route.ts` | Buscar profissionais | **CHAMADA DIFERENTE** - É chamada com query params |
| 10 | `/api/mensagens/[solicitacaoId]/route.ts` | Chat de uma solicitação | **CHAMADA DIFERENTE** - É chamada com variável dinâmica |
| 11 | `/api/portfolio/[id]/route.ts` | Editar/excluir item do portfolio | **CHAMADA DIFERENTE** - Usada no portfolio content |
| 12 | `/api/portfolio/comentarios/[mediaId]/route.ts` | Comentários no portfolio | **CHAMADA DIFERENTE** - Detectada parcialmente |
| 13 | `/api/admin/users/[id]/promote/route.ts` | Promover usuário a admin | **FALTANDO UI** - Não há botão na interface admin |
| 14 | `/api/admin/users/[id]/session/route.ts` | Encerrar sessões de usuário | **FALTANDO UI** - Não há botão na interface admin |
| 15 | `/api/admin/users/[id]/status/route.ts` | Ativar/inativar usuário | **FALTANDO UI** - Não há botão na interface admin |
| 16 | `/api/auth/[...nextauth]/route.ts` | Handler NextAuth | ✅ **INTERNAL** - É interno do NextAuth |

---

## Análise Detalhada

### 1. `/api/admin/scripts/boas-vindas/route.ts`
**O que faz:** Script admin para enviar email de boas-vindas para todos os usuários cadastrados. Requer parâmetro `?secret=WHODO123` para proteção.

**Status:** **POTENCIALMENTE UTILIZÁVEL** - É um script de administração que precisa ser chamado manualmente pelo admin. Não é uma API de uso comum no dia-a-dia.

**Recomendação:** Pode manter, é útil para onboarding de novos usuários em massa.

---

### 2. `/api/admin/users/route.ts`
**O que faz:** Lista usuários com filtros (search, status, tipo) para o painel admin com paginação.

**Status:** **REDUNDANTE** - Já existe `/api/admin/users?search=...&status=...&tipo=...&page=1` sendo chamada no `AdminDashboard.tsx`.

**Recomendação:** **REMOVER** - Esta API é redundante. A mesma funcionalidade já existe via query string.

---

### 3. `/api/auth/sync/route.ts`
**O que faz:** Sincroniza sessão após login OAuth, criando o cookie `whodo_session`.

**Status:** **FUNCIONANDO** - É chamada internamente pelo fluxo do NextAuth após login com Google/Discord/etc. Não aparece como fetch() porque é um redirect.

**Recomendação:** Manter, é essencial para OAuth.

---

### 4. `/api/auth/verificar-email/route.ts`
**O que faz:** Verifica email através de token na URL (`?token=xxx`). Usado no fluxo de cadastro.

**Status:** **FUNCIONANDO** - É chamada via redirect do navegador quando o usuário clica no link do email. Não aparece como fetch() porque é um redirect.

**Recomendação:** Manter, é essencial para verificação de email.

---

### 5. `/api/notificacoes/route.ts`
**O que faz:** Lista notificações do usuário logado com suporte a filtros (`?naoLidas=true&limite=20`).

**Status:** **FALTANDO CHAMADA** - API útil mas não está sendo chamada em nenhum lugar do frontend.

**Recomendação:** Precisa implementar chamada no componente de notificações (navbar ou painel).

---

### 6. `/api/notificacoes/[id]/lida/route.ts`
**O que faz:** Marca uma notificação como lida (PATCH) ou todas como lidas (DELETE com `id=todas`).

**Status:** **FALTANDO CHAMADA** - API existe mas não está sendo chamada quando o usuário clica em uma notificação.

**Recomendação:** Implementar chamada quando o usuário visualizar uma notificação.

---

### 7. `/api/ranking/route.ts`
**O que faz:** Calcula ranking de prestadores por número de contratos concluídos e retorna posição do usuário.

**Status:** **FALTANDO IMPLEMENTAÇÃO** - API existe mas não há página/componente que exiba o ranking.

**Recomendação:** Criar página de ranking ou adicionar no perfil do usuário.

---

### 8. `/api/suporte/chat/route.ts`
**O que faz:** Chat com IA que responde dúvidas sobre a plataforma. Suporta múltiplos provedores (OpenAI, Gemini, DeepSeek, etc).

**Status:** **FALTANDO IMPLEMENTAÇÃO** - API completa e sofisticada mas não está conectada a nenhum frontend.

**Recomendação:** Criar widget de suporte no site que utilize esta API.

---

### 9. `/api/busca/route.ts`
**O que faz:** Busca profissionais com filtros (query, categoria, localização, rating, preço).

**Status:** **CHAMADA DIFERENTE** - É chamada como `/api/busca?q=...&categoria=...&loc=...` mas o script detectou apenas a forma sem parâmetros.

**Recomendação:** **OK** - A API está sendo usada corretamente no `BuscarContent.tsx`.

---

### 10. `/api/mensagens/[solicitacaoId]/route.ts`
**O que faz:** GET (lista mensagens) e POST (envia mensagem) de uma conversa de solicitação.

**Status:** **CHAMADA DIFERENTE** - É chamada com variável dinâmica como `/api/mensagens/${solicitacaoId}` mas o script detectou como `/api/mensagens/${conversaAtiva}`.

**Recomendação:** **OK** - A API está sendo usada no `mensagens/page.tsx`.

---

### 11. `/api/portfolio/[id]/route.ts`
**O que faz:** DELETE (remove mídia) e PATCH (edita título/descrição/citação) de item do portfolio.

**Status:** **CHAMADA DIFERENTE** - Usada no `PortfolioContent.tsx` mas não detectada corretamente.

**Recomendação:** **OK** - A API está sendo usada.

---

### 12. `/api/portfolio/comentarios/[mediaId]/route.ts`
**O que faz:** GET (lista comentários) e POST (adiciona comentário) em mídias do portfolio.

**Status:** **CHAMADA DIFERENTE** - Chamada parcialmente no `ProfileContent.tsx` como `/api/portfolio/comentarios/${item.id}`.

**Recomendação:** **OK** - A API está sendo usada.

---

### 13. `/api/admin/users/[id]/promote/route.ts`
**O que faz:** Promove/rebaixa usuário a diferentes papéis (usuario, moderador, admin).

**Status:** **FALTANDO UI** - API existe mas não há botão na interface admin para promover usuários.

**Recomendação:** Adicionar botão "Promover" na lista de usuários do AdminDashboard.

---

### 14. `/api/admin/users/[id]/session/route.ts`
**O que faz:** Encerra todas as sessões ativas de um usuário (força logout).

**Status:** **FALTANDO UI** - API existe mas não há botão na interface admin para encerrar sessões.

**Recomendação:** Adicionar botão "Encerrar Sessões" na lista de usuários do AdminDashboard.

---

### 15. `/api/admin/users/[id]/status/route.ts`
**O que faz:** Ativa ou inativa uma conta de usuário.

**Status:** **FALTANDO UI** - API existe mas não há botão na interface admin para ativar/inativar.

**Recomendação:** Adicionar botão de ativar/inativar na lista de usuários do AdminDashboard.

---

### 16. `/api/auth/[...nextauth]/route.ts`
**O que faz:** Handler principal do NextAuth para OAuth/logins.

**Status:** ✅ **INTERNO** - É interno do NextAuth, não precisa de chamada explícita.

**Recomendação:** Manter, é essencial.

---

## Conclusão

| Categoria | Quantidade |
|-----------|------------|
| ✅ OK (funcionando) | 8 |
| ⚠️ Potencial mas não usado | 1 |
| 🔴 Redundante (pode remover) | 1 |
| ❌ Falta chamada no frontend | 4 |
| ❌ Falta UI no admin | 3 |

**APIs para remover:** 1
- `/api/admin/users/route.ts` (redundante)

**APIs para implementar chamadas:** 4
- `/api/notificacoes`
- `/api/notificacoes/[id]/lida`
- `/api/ranking`
- `/api/suporte/chat`

**APIs para implementar UI (Admin):** 3
- Promover usuário
- Encerrar sessões
- Ativar/inativar usuário
