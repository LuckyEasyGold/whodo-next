# Mapeamento de Telas da Plataforma WhoDo

Este documento lista todas as telas/páginas que o usuário pode interagir na plataforma.

---

## 🌐 Telas Públicas (Acesso sem autenticação)

| # | Rota | Descrição |
|---|------|-----------|
| 1 | `/` | Página inicial |
| 2 | `/login` | Login de usuário |
| 3 | `/cadastro` | Cadastro de nova conta |
| 4 | `/recuperar-senha` | Recuperação de senha |
| 5 | `/redefinir-senha` | Redefinição de senha |
| 6 | `/buscar` | Buscar profissionais e serviços |
| 7 | `/perfil/[id]` | Ver perfil público de um prestador |
| 8 | `/praca` | Feed principal / Praça (postagens) |
| 9 | `/blog` | Blog da plataforma |
| 10 | `/carreiras` | Vagas e carreiras |
| 11 | `/contato` | Página de contato |
| 12 | `/privacidade` | Política de privacidade |
| 13 | `/lgpd` | Lei Geral de Proteção de Dados |
| 14 | `/sobre` | Sobre a plataforma |
| 15 | `/termos` | Termos de uso |
| 16 | `/itens-salvos` | Itens salvos (requer auth) |

---

## 🔐 Telas do Dashboard (Requer autenticação)

| # | Rota | Descrição |
|---|------|-----------|
| 1 | `/dashboard` | Dashboard principal do usuário |
| 2 | `/dashboard/agendamentos` | Lista de agendamentos |
| 3 | `/dashboard/agendamentos/[id]` | Detalhes de um agendamento específico |
| 4 | `/dashboard/mensagens` | Mensagens e chat |
| 5 | `/dashboard/notificacoes` | Notificações |
| 6 | `/dashboard/perfil` | Meu perfil |
| 7 | `/dashboard/configuracoes` | Configurações da conta |
| 8 | `/dashboard/portfolio` | Gerenciar portfólio |
| 9 | `/dashboard/servicos` | Meus serviços oferecidos |
| 10 | `/dashboard/servicos/novo` | Criar novo serviço |
| 11 | `/dashboard/servicos/[id]/editar` | Editar serviço existente |
| 12 | `/dashboard/financeiro` | Financeiro e carteira |

---

## 📅 Telas de Agenda

| # | Rota | Descrição |
|---|------|-----------|
| 1 | `/agenda` | Calendário / Agenda visual |
| 2 | `/agenda/agendar` | Agendar um novo serviço |

---

## ⚙️ Telas de Admin

| # | Rota | Descrição |
|---|------|-----------|
| 1 | `/admin` | Dashboard administrativo |
| 2 | `/admin/setup` | Configuração inicial da plataforma |

---

## 📊 Resumo

- **Telas Públicas:** 16 páginas
- **Dashboard (Autenticado):** 12 páginas  
- **Agenda:** 2 páginas
- **Admin:** 2 páginas
- **Total:** 32 páginas interactivas

---

## 🔄 Fluxo Principal do Agendamento (Correção recente)

O fluxo de agendamento passa por estas telas:

1. `/buscar` - Usuário busca por profissionais
2. `/perfil/[id]` - Visualiza perfil do prestador
3. `/agenda/agendar` - Realiza o agendamento
4. `/dashboard/agendamentos` - Lista de agendamentos
5. `/dashboard/agendamentos/[id]` - Detalhes e ações do agendamento
6. `/dashboard/mensagens` - Chat para negociação

### Correção implementada

O problema identificado era que o fluxo de negociação ficava travado quando:
- Cliente recebia orçamento (status: `orcamento_enviado`)
- Cliente propunha novos termos (status: `negociacao`)
- **PROBLEMA:** Prestador não tinha como responder

**Solução implementada:**
- Adicionada ação `responder_negociacao` no backend
- Adicionado botão "Enviar Nova Proposta" no frontend para o prestador
- Agora o prestador pode enviar nova proposta e o status volta para `orcamento_enviado`
