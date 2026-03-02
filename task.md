# WhoDo! — Migração Next.js

## Fase 1: Setup do Projeto
- [x] Criar projeto Next.js com TypeScript + Tailwind
- [x] Instalar dependências (Prisma, NextAuth, Framer Motion, Lucide)
- [x] Configurar Prisma com MySQL local

## Fase 2: Database
- [x] Criar schema Prisma mapeando tabelas existentes
- [x] Criar seed com dados de teste
- [ ] Executar db push e seed (precisa MySQL rodando)

## Fase 3: Páginas
- [x] Layout global (navbar, footer, theme)
- [x] Landing page (`/`) — hero, categorias, como funciona, top profissionais, depoimentos, CTA
- [x] Login (`/login`)
- [x] Cadastro (`/cadastro`)
- [x] Perfil do prestador (`/perfil/[id]`) - Instagram style
- [x] Dashboard do prestador (`/dashboard`)
- [x] Busca (`/buscar`) - Integrar mapa com Leaflet e filtros avançados (preço, raio, nota)
- [x] Arrumar links de "Ver Perfil" nos cards para apontar para `/perfil/[id]`

## Fase 4: API Routes
- [x] Auth login API (`/api/auth/login`)
- [x] Auth cadastro API (`/api/auth/cadastro`)

## Fase 5: Verificação
- [x] Testar landing page no browser — ✅ funcionando
- [x] Testar login page — ✅ funcionando
- [x] Testar cadastro page — ✅ funcionando
- [ ] Conectar MySQL e testar com dados reais
- [ ] Testar responsividade mobile

## Fase 6: Refatoração de Arquitetura (Modelo Único)
- [x] Atualizar `schema.prisma` (Remover Cliente/Prestador, expandir Usuario, atualizar PortfolioMedia).
- [x] Corrigir rotas de Autenticação (`/api/auth/cadastro` e `/login`) para remover tipo de conta.
- [x] Atualizar script de Seed (`prisma/seed.ts`).
- [x] Atualizar Perfil Público (`/perfil/[id]`) para exibir os novos campos e links sociais.
- [x] Refazer lógica de Portfólio (Adicionar campos, LightBox nativo com foto grande, texto, citação e botão excluir).
- [x] Atualizar Dashboard (`/dashboard/perfil`) para o novo formulário completo.

## Fase 7: Agendamento e Módulos Finais
- [x] Financeiro: Visão agrupada de ganhos baseada em serviços concluídos.
- [x] Agendamento: Criar, confirmar, concluir e cancelar agendamentos.
- [x] Mensageria: Sistema de chat próprio usando Polling e banco de dados.
- [x] Botão "Contratar" funcional no perfil dos prestadores.
- [x] Modal de agendamento com seleção de serviço e data/hora.
- [x] Página de finanças com depósito, saque e dados bancários.
- [x] Sistema de carteira com saldo disponível e pendente.
- [x] Transações com status (pendente, concluído, falhado).

## Próximos Passos (Para Melhorias Futuras)
- [ ] Sistema de avaliações pós-serviço.
- [ ] Notificações em tempo real com WebSockets.
- [ ] Sistema de recomendações baseado em IA.
- [ ] Integração com gateway de pagamento (Stripe, MercadoPago).
- [ ] Testes automatizados (Jest, Cypress).
- [ ] Deploy em produção (Vercel, AWS, etc).
