<div align="center">
  <h1>⚡ WhoDo!</h1>
  <p><strong>A plataforma que conecta quem precisa com quem sabe fazer.</strong></p>

  <p>
    <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js"></a>
    <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript"></a>
    <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma"></a>
    <a href="https://neon.tech"><img alt="Neon" src="https://img.shields.io/badge/Neon-PostgreSQL-00E699?style=for-the-badge&logo=postgresql"></a>
    <a href="https://supabase.com"><img alt="Supabase" src="https://img.shields.io/badge/Supabase-Storage-3ECF8E?style=for-the-badge&logo=supabase"></a>
    <a href="https://vercel.com"><img alt="Vercel" src="https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel"></a>
    
  </p>

  <br/>
  <img src="https://github.com/LuckyEasyGold/whodo-next/blob/main/public/uploads/profile/whodo2.jpeg" alt="WhoDo! Preview" width="780" />
  <img src="https://github.com/LuckyEasyGold/whodo-next/blob/main/public/uploads/profile/whodo1.jpeg" alt="WhoDo! Preview" width="780" />
  <img src="https://github.com/LuckyEasyGold/whodo-next/blob/main/public/uploads/profile/whodo3.jpeg" alt="WhoDo! Preview" width="780" />
  <img src="https://github.com/LuckyEasyGold/whodo-next/blob/main/public/uploads/profile/whodo1.png" alt="WhoDo! Preview" width="780" />
  <img src="https://github.com/LuckyEasyGold/whodo-next/blob/main/public/uploads/profile/whodo2.png" alt="WhoDo! Preview" width="780" />
  
</div>

---

## 📖 Sobre o Projeto

**WhoDo!** é uma plataforma de serviceplace de freelance e profissionais liberais que conecta prestadores de serviços com clientes de forma simples, moderna e eficiente.

> **Modelo Unificado de Usuário:** qualquer pessoa cadastrada pode tanto contratar serviços quanto oferecer os seus — seja como diarista, professor particular, músico, contador, advogado ou médico.

🌐 **Site em produção:** [whodo.newsdrop.net.br](https://whodo.newsdrop.net.br)

---

## ✨ Funcionalidades

| Funcionalidade | Status |
|---|---|
| 🔐 Autenticação segura (e-mail + senha + JWT) | ✅ Completo |
| 🔗 Login Social (Google, Facebook via NextAuth) | ✅ Completo |
| 👤 Perfil Público estilo Instagram | ✅ Completo |
| 🗂️ Portfólio com Lightbox interativa e Comentários | ✅ Completo |
| 👥 Sistema de Seguir e Seguidores | ✅ Completo |
| ⭐ Sistema de Avaliações e Reviews (1 a 5 Estrelas) | ✅ Completo |
| 🗺️ Busca Inteligente com Paginação e Mapa (Leaflet) | ✅ Completo |
| 🔍 Filtros dinâmicos (preço, nota, localização) | ✅ Completo |
| ⚡ **Busca em Tempo Real (Live Search)** | ✅ Completo |
| 🔤 **Busca Case-Insensitive** | ✅ Completo |
| 📝 **Busca por Partial Match** | ✅ Completo |
| 📊 Dashboard do Usuário | ✅ Completo |
| ✏️ Edição de Perfil + CEP automático + Geocodificação | ✅ Completo |
| 🖼️ Upload de Portfólio (Supabase Storage) | ✅ Completo |
| 🔧 Módulo de Serviços (fixo ou orçamento) | ✅ Completo |
| 💰 Dashboard Financeiro (carteira + transações) | ✅ ~90% completo |
| 💬 Mensageria instantânea (Chat) integrado ao Perfil | ✅ Completo |
| 📅 Agendamentos de serviços | ✅ Completo |
| 📣 Feed Social (Praça) com postagens | ✅ Completo |
| ❤️ Curtidas e comentários em postagens | ✅ Completo |
| 📈 Sistema de Ranking de Prestadores | ✅ Completo |
| 🔔 Sistema de Notificações | ✅ Completo |

---

## 🚀 Últimas Novidades

O WhoDo! continua evoluindo com foco em usabilidade e conversão:

- **Busca Melhorada (Live Search):** Busca em tempo real a cada letra digitada, aceita maiúsculas/minúsculas, encontra profissionais com partes do nome, busca por nome, especialidade, serviço ou categoria.
- **Feed Social (Praça):** Nova funcionalidade de postagens onde usuários podem compartilhar conteúdo, receber curtidas e comentários.
- **Dashboard Financeiro:** Sistema completo de carteira virtual, transações e dados bancários para saques.
- **Agendamentos aprimorados:** Fluxo completo de solicitação → aceite → confirmação → conclusão.
- **Ranking de Prestadores:** Sistema de ranking baseado em avaliações e atividades.
- *Próximas melhorias:* Sistema de Marketing Multinível (MMN), App Mobile nativo e melhorias no fluxo de contratação.

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 16](https://nextjs.org) com App Router e Turbopack
- **Linguagem:** [TypeScript](https://www.typescriptlang.org)
- **Banco de Dados:** [Neon](https://neon.tech) — PostgreSQL serverless
- **Armazenamento de Arquivos:** [Supabase Storage](https://supabase.com/storage) — imagens de perfil e portfólio
- **ORM:** [Prisma](https://www.prisma.io)
- **Hospedagem:** [Vercel](https://vercel.com)
- **Autenticação:** Cookies `httpOnly` + **JWT assinado via [`jose`](https://github.com/panva/jose)** + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) + [NextAuth.js](https://next-auth.js.org)
- **Animações:** [Framer Motion](https://www.framer.com/motion)
- **Mapas:** [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org)
- **Ícones:** [Lucide React](https://lucide.dev)

---

## 📦 Pré-requisitos

- **Node.js** >= 18
- Conta no **[Neon](https://neon.tech)** (banco de dados PostgreSQL)
- Conta no **[Supabase](https://supabase.com)** (armazenamento de imagens)
- **npm** ou **yarn**

---

## 🚀 Instalação e Execução Local

```bash
# 1. Clone o repositório
git clone https://github.com/LuckyEasyGold/whodo-next.git
cd whodo-next

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Configuração do `.env`

```env
# Banco de dados (Neon PostgreSQL)
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/whodo?sslmode=require"

# Autenticação JWT (use uma chave longa e aleatória)
NEXTAUTH_SECRET="sua-chave-secreta-super-longa-aqui"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Google
AUTH_GOOGLE_ID="seu-google-client-id"
AUTH_GOOGLE_SECRET="seu-google-client-secret"

# OAuth Facebook
AUTH_FACEBOOK_ID="seu-facebook-app-id"
AUTH_FACEBOOK_SECRET="seu-facebook-app-secret"

# Supabase (armazenamento de imagens)
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon-aqui"

# Email (SMTP - opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
```

```bash
# 4. Aplique o schema no banco de dados
npx prisma migrate dev --name init

# 5. Gere o cliente Prisma
npx prisma generate

# 6. (Opcional) Popule com dados de exemplo
npx prisma db seed

# 7. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **[http://localhost:3000](http://localhost:3000)** 🚀

---

## 🗃️ Estrutura do Projeto

```
whodo-next/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.ts                # Dados de exemplo
├── .agent/
│   └── skills/
│       └── whodo_core_arquitect/
│           └── skill.md       # Skill do agente MCP
├── public/                    # Arquivos estáticos
└── src/
    ├── app/
    │   ├── api/               # API Routes (backend)
    │   │   ├── admin/         # Scripts administrativos
    │   │   ├── agendamento/   # API de agendamentos
    │   │   ├── auth/          # Login, logout, registro, sessão
    │   │   ├── avaliacoes/    # Sistema de avaliações
    │   │   ├── carteira/      # Carteira virtual
    │   │   ├── dados-bancarios/ # Dados bancários
    │   │   ├── mensagens/    # Chat entre usuários
    │   │   ├── notificacoes/  # Sistema de notificações
    │   │   ├── perfil/       # Atualização de perfil
    │   │   ├── portfolio/    # Álbuns e upload de mídia
    │   │   ├── postagens/    # Feed social (Praça)
    │   │   ├── ranking/      # Sistema de ranking
    │   │   ├── servicos/     # CRUD de serviços
    │   │   └── solicitacoes/ # Solicitações de serviço
    │   ├── buscar/            # Busca de profissionais + mapa
    │   ├── cadastro/          # Registro de usuário
    │   ├── dashboard/         # Área do usuário logado
    │   │   ├── agendamentos/ # Gerenciamento de agendamentos
    │   │   ├── configuracoes/ # Configurações da conta
    │   │   ├── financeiro/    # Dashboard financeiro
    │   │   ├── mensagens/     # Caixa de mensagens
    │   │   ├── perfil/       # Edição de perfil
    │   │   ├── portfolio/    # Gerenciamento de portfólio
    │   │   └── servicos/     # Gerenciamento de serviços
    │   ├── login/             # Autenticação
    │   └── [username]/       # Perfil público do prestador
    ├── components/
    │   ├── ui/               # Componentes de UI
    │   └── ...
    └── lib/
        ├── auth.ts            # JWT: encrypt, decrypt, getSession
        ├── prisma.ts          # Cliente Prisma singleton
        └── supabase.ts        # Cliente Supabase + upload de imagens
```

---

## 🗺️ Modelo de Dados (Resumo)

O núcleo da aplicação é o modelo unificado **`Usuario`**:

- Campos de perfil pessoal (nome, foto, sobre, especialidade)
- Campos de localização (cidade, estado, lat/lng) com geocodificação automática
- Redes sociais (LinkedIn, Instagram, YouTube, TikTok, Kwai, etc.)
- Sistema de carteira virtual e dados bancários

### Principais Entidades:

- **Usuario:** Modelo unificado (cliente + prestador)
- **Servico:** Serviços oferecidos pelo prestador
- **Categoria:** Categorias de serviços
- **PortfolioMedia/PortfolioAlbum:** Portfólio do prestador
- **Agendamento:** Agendamentos de serviços
- **Carteira:** Carteira virtual do usuário
- **Avaliacao:** Avaliações e notas
- **Mensagem:** Conversas entre usuários
- **Postagem:** Feed social (Praça)

---

## 📚 Documentação Adicional

Para documentação completa, incluindo FAQ, guia de troubleshooting e referências avançadas, consulte:

- **[WHODO_KNOWLEDGE_BASE.md](./WHODO_KNOWLEDGE_BASE.md)** — Base de conhecimento unificada com tudo sobre o projeto

---

## 🤝 Contribuindo

1. Faça um _fork_ do projeto
2. Crie sua branch: `git checkout -b funcionalidade/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'funcionalidade: adiciona nova funcionalidade'`
4. Push: `git push origin funcionalidade/nova-funcionalidade`
5. Abra um Pull Request



---

<div align="center">
  <p>Feito com ❤️ pela equipe <strong>WhoDo!</strong></p>
</div>
