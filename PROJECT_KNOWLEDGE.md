# WhoDo! - Conhecimento do Projeto e Arquitetura

Este documento serve como mapa e registro da estrutura atual do projeto WhoDo, para evitar a necessidade de ler todo o código antes de futuras alterações.

## Tecnologias e Stack
- **Framework Front-end / Back-end**: Next.js (App Router, v16.1.6), React, TailwindCSS, Framer Motion
- **Banco de Dados / ORM**: PostgreSQL, Prisma ()
- **Autenticação**: NextAuth / JWT personalizado usando JOSE (cookies customizados com payload assinado) + bcryptjs
- **Mapas**: Leaflet / react-leaflet
- **Componentização UI**: Lucide React para Ícones

## Estrutura de Diretórios Principal (`src/app/`)
- `/api/...`: Rotas de backend API REST (admin, agendamento, auth, avaliacoes, mensagens, notificacoes, carteira, dados-bancarios, perfil, servicos, solicitacoes, transacao)
- `/buscar`: Página de busca principal de profissionais, usando filtros, mapa geolocalizado e aproximação.
- `/dashboard/...`: Painel logado do usuário. Sub-seções incluem: agendamentos, configurações, financeiro, mensagens, perfil, portfolio, servicos.
- `/prestador`: Visualização do perfil público do prestador.
- `/login`, `/cadastro`, `/redefinir-senha`: Fluxo de acesso e ingresso de usuários.

## Regras de Negócio Fundamentais
1. **Modelos Unificados de Usuário**: Não há tabela separada para Cliente e Prestador. Existe apenas `Usuario`. Ao cadastrar um `Serviço`, ele é exibido como Prestador na busca.
2. **Sistema de Serviços e Transações**: 
   - `Servico` pode ser Preço Fixo ou Sob Orçamento.
   - O fluxo gera `Solicitacao` -> `Orcamento` -> `Agendamento` -> `Transacao`.
   - Há uma `Carteira` virtual e `DadosBancarios` atrelados à conta do prestador/usuário.
3. **Autenticação Dupla (Customizada)**: Além de provedores OAuth sociais, existe a lógica local salva no cookie `whodo_session` configurada em `auth.ts` misturado com `NextAuth` accounts e session.
4. **Desativação de Conta vs Exclusão**: Preferencialmente utilizar alteração de `status` na tabela do Usuário (`ativo` -> `inativo`) para preservar o histórico financeiro e de transações sem quebrar foreign keys.

## Mapeamento de Tabela e Relacionamentos no Prisma
- **Usuario**: Informações de perfil, localização, sociais e de acesso. Relaciona-se cruzadamente consigo mesmo no sistema social `Seguidor`.
- **Categoria** e **Servico**: Entidades procuradas e vendidas na plataforma.
- **Portfólio**: Subdividido em `PortfolioAlbum`, `PortfolioMedia` e `PortfolioComentario`.
- **Comunicação e Operações**: `Mensagem`, `Notificacao`, `Avaliacao`.
- **Negociações**: `Solicitacao`, `Orcamento`, `Agendamento`, interligados para gerenciar o andamento comercial.

*Se for adicionar novas features ou mexer no fluxo de contratação, sempre analisar como elas impactam o loop: **Pesquisa > Perfil Ofertante > Solicitação > Conversa > Fechamento.** *
