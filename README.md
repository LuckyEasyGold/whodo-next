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
    <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge">
  </p>

  <br/>
  <img src="https://raw.githubusercontent.com/LuckyEasyGold/whodo-next/master/public/og-image.png" alt="WhoDo! Preview" width="780" />
</div>

---

## 📖 Sobre o Projeto

**WhoDo!** é uma plataforma de marketplace de serviços freelance e profissionais liberais que conecta prestadores de serviços com clientes de forma simples, moderna e eficiente.

> **Modelo Unificado de Usuário:** qualquer pessoa cadastrada pode tanto contratar serviços quanto oferecer os seus — seja como diarista, professor particular, músico, contador, advogado ou médico.

🌐 **Site em produção:** [whodo.newsdrop.net.br](https://whodo.newsdrop.net.br)

---

## ✨ Funcionalidades

| Funcionalidade | Status |
|---|---|
| 🔐 Autenticação segura (e-mail + senha + JWT assinado) | ✅ Completo |
| 👤 Perfil Público estilo Instagram | ✅ Completo |
| 🗂️ Portfólio com Lightbox (fotos e vídeos) | ✅ Completo |
| 🗺️ Busca com Mapa Interativo (Leaflet) | ✅ Completo |
| 🔍 Filtros dinâmicos (preço, nota, localização) | ✅ Completo |
| 📊 Dashboard do Usuário | ✅ Completo |
| ✏️ Edição de Perfil + CEP automático + Geocodificação | ✅ Completo |
| 🖼️ Upload de Portfólio (Supabase Storage) | ✅ Completo |
| 🔧 Módulo de Serviços (fixo ou orçamento) | ✅ Completo |
| 💰 Dashboard Financeiro (carteira + transações) | ✅ ~90% completo |
| 📅 Agendamentos | 🚧 Em desenvolvimento |
| 💬 Mensageria em tempo real | 🚧 Em desenvolvimento |
| 🔗 Login Social (Google, Facebook) | 🔜 Planejado |

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 16](https://nextjs.org) com App Router e Turbopack
- **Linguagem:** [TypeScript](https://www.typescriptlang.org)
- **Banco de Dados:** [Neon](https://neon.tech) — PostgreSQL serverless
- **Armazenamento de Arquivos:** [Supabase Storage](https://supabase.com/storage) — imagens de perfil e portfólio
- **ORM:** [Prisma](https://www.prisma.io)
- **Hospedagem:** [Vercel](https://vercel.com)
- **Autenticação:** Cookies `httpOnly` + **JWT assinado via [`jose`](https://github.com/panva/jose)** + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
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
DATABASE_URL="postgresql://usuario:senha@host/neondb?sslmode=require"

# Autenticação JWT (use uma chave longa e aleatória)
NEXTAUTH_SECRET="sua-chave-secreta-super-longa-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (armazenamento de imagens)
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon-aqui"
```

```bash
# 4. Aplique o schema no banco de dados
npx prisma db push

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
└── src/
    ├── app/
    │   ├── api/               # API Routes (backend)
    │   │   ├── auth/          # Login, logout, registro, sessão
    │   │   ├── servicos/      # CRUD de serviços
    │   │   ├── perfil/        # Atualização de perfil e foto
    │   │   └── portfolio/     # Álbuns e upload de mídia
    │   ├── buscar/            # Busca de profissionais + mapa
    │   ├── cadastro/          # Registro de usuário
    │   ├── dashboard/         # Área do usuário logado
    │   │   ├── perfil/        # Edição de perfil
    │   │   ├── portfolio/     # Gerenciamento de portfólio
    │   │   ├── servicos/      # Gerenciamento de serviços
    │   │   └── financeiro/    # Dashboard financeiro
    │   ├── login/             # Autenticação
    │   └── perfil/[id]/       # Perfil público
    ├── components/
    │   ├── landing/           # Seções da Landing Page
    │   ├── MapComponent.tsx   # Mapa interativo com cluster
    │   └── Navbar.tsx         # Cabeçalho com menu de usuário
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
- Relações com `Servico`, `PortfolioMedia`, `Avaliacao`, `Agendamento`, etc.

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
