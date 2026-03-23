# Auditoria de Banco de Dados - Whodo

## Visão Geral
Este documento acompanha a auditoria entre o schema.prisma e os bancos de dados (Neon e Supabase).

### Bancos de Dados
- **Neon** (Banco SQL principal): `postgresql://neondb_owner:*@ep-spring-leaf-acdz47fe-pooler.sa-east-1.aws.neon.tech/neondb`
- **Supabase** (Storage apenas): `https://sybwkfkjmbvfgwmqlxhq.supabase.co` (apenas para armazenamento de arquivos, não SQL)

---

## Resultado da Auditoria - Banco Neon

### Tabelas do Schema Prisma (25 modelos)

| # | Modelo | Tabela no BD | Registros | Status |
|---|--------|--------------|-----------|--------|
| 1 | Usuario | usuarios | 76 | ✅ Com dados |
| 2 | PortfolioMedia | portfolio_media | 30 | ✅ Com dados |
| 3 | PortfolioAlbum | portfolio_albums | 10 | ✅ Com dados |
| 4 | Categoria | categorias | 15 | ✅ Com dados |
| 5 | Servico | servicos | 54 | ✅ Com dados |
| 6 | Avaliacao | avaliacoes | 8 | ✅ Com dados |
| 7 | Solicitacao | solicitacoes | 37 | ✅ Com dados |
| 8 | Orcamento | orcamentos | 0 | ❌ VAZIA |
| 9 | Mensagem | mensagens | 58 | ✅ Com dados |
| 10 | Notificacao | notificacoes | 100 | ✅ Com dados |
| 11 | Agendamento | agendamentos | 4 | ✅ Com dados |
| 12 | HistoricoAgendamento | historico_agendamentos | 6 | ✅ Com dados |
| 13 | Carteira | carteiras | 11 | ✅ Com dados |
| 14 | Transacao | transacoes | 3 | ✅ Com dados |
| 15 | DadosBancarios | dados_bancarios | 1 | ✅ Com dados |
| 16 | Account | accounts | 0 | ❌ VAZIA |
| 17 | Session | sessions | 0 | ❌ VAZIA |
| 18 | VerificationToken | verification_tokens | 0 | ❌ VAZIA |
| 19 | Seguidor | seguidores | 36 | ✅ Com dados |
| 20 | PortfolioComentario | portfolio_comentarios | 0 | ❌ VAZIA |
| 21 | Postagem | postagens | 6 | ✅ Com dados |
| 22 | PostagemCurtida | postagem_curtidas | 0 | ❌ VAZIA |
| 23 | PostagemComentario | postagem_comentarios | 6 | ✅ Com dados |
| 24 | PostagemCompartilhamento | postagem_compartilhamentos | 1 | ✅ Com dados |
| 25 | PostagemSalva | postagens_salvas | 2 | ✅ Com dados |

---

## Resumo

- **Total de tabelas**: 25
- **Tabelas com dados**: 19
- **Tabelas vazias**: 6

### Tabelas Vazias Identificadas
1. `orcamentos` - 0 registros
2. `accounts` - 0 registros (NextAuth)
3. `sessions` - 0 registros (NextAuth)
4. `verification_tokens` - 0 registros (NextAuth)
5. `portfolio_comentarios` - 0 registros
6. `postagem_curtidas` - 0 registros

---

## Observações sobre Tabelas Vazias

### Tabelas do NextAuth (Esperado)
- `accounts`, `sessions`, `verification_tokens`: Estas tabelas são usadas pelo NextAuth para autenticação. Estar vazias é normal se você estiver usando outro método de autenticação ou se os tokens ainda não foram gerados.

### Tabelas de Funcionalidades Específicas
- `orcamentos`: 可能 ainda não foi utilizada a funcionalidade de orçamentos
- `portfolio_comentarios`: 可能 ainda não há comentários em portfólios
- `postagem_curtidas`: 可能 as postagens não têm curtidas ainda

---

## Histórico de Atualizações

### 2026-03-22 22:09 - Auditoria Concluída
- Conexão com banco Neon estabelecida com sucesso
- Todas as 25 tabelas verificadas
- 6 tabelas vazias identificadas
- Próximo passo: Criar documentação das tabelas com comentários

### 2026-03-22 22:03 - Início da Auditoria
- Schema.prisma lido com sucesso (25 modelos)
- Configuração do Prisma verificada
- Variáveis de ambiente confirmadas: Neon (SQL principal), Supabase (Storage apenas)
