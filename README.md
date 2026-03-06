# 🔧 WhoDo — Plataforma de Serviços e Profissionais

WhoDo é uma plataforma moderna para conectar prestadores de serviços a clientes. Profissionais criam perfis, cadastram seus serviços e recebem agendamentos e solicitações de orçamento. Clientes encontram profissionais próximos a si, visualizam portfólios e fazem contato diretamente pelo sistema.

> **Acesse o site em produção:** [whodo.newsdrop.net.br](https://whodo.newsdrop.net.br)

---

## 🚀 Infraestrutura e Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) com App Router e TypeScript |
| **Banco de Dados** | [Neon](https://neon.tech/) — PostgreSQL serverless |
| **Armazenamento de Arquivos** | [Supabase Storage](https://supabase.com/storage) — imagens de perfil e portfólio |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Autenticação** | Sistema próprio com cookies `httpOnly` + **JWT assinado via `jose`** |
| **Hospedagem** | [Vercel](https://vercel.com/) |
| **Domínio Customizado** | `whodo.newsdrop.net.br` (CNAME apontado via HostGator) |
| **Mapa** | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) |
| **Animações de UI** | [Framer Motion](https://www.framer.com/motion/) |
| **Ícones** | [Lucide React](https://lucide.dev/) |

---

## 📦 Módulos Implementados

### ✅ Autenticação (100%)
- Cadastro e login com e-mail e senha (bcrypt)
- Sessão segura via cookie `httpOnly` + **JWT criptografado** (biblioteca `jose`)
- Impossível adulteração de ID de sessão (vulnerabilidade IDOR corrigida)
- Logout que apaga o token de forma segura

### ✅ Perfil do Profissional (100%)
- Edição de dados básicos: nome, telefone, CEP, endereço, especialidade
- Preenchimento automático de endereço via CEP (ViaCEP)
- Geocodificação automática do endereço para posicionamento no mapa (Nominatim)
- Upload de foto de perfil com armazenamento no Supabase Storage
- Redes sociais: website, LinkedIn, Facebook, Instagram, YouTube, TikTok, Kwai

### ✅ Portfólio (100%)
- Criação de álbuns com nome e descrição
- Upload de múltiplas mídias (imagens e vídeos) armazenadas no Supabase
- Visualização em lightbox com navegação entre fotos

### ✅ Mapa de Profissionais (100%)
- Exibe prestadores clusterizados por proximidade em mapa interativo
- Ao abrir o site, o mapa lembra da última posição visualizada (localStorage)
- Filtro por categoria de serviço

### ✅ Módulo de Serviços (100%)
- Profissional pode criar, editar e excluir seus serviços
- Campos: Título, Categoria, Descrição, Preço Base e Tempo Estimado
- **Tipo de Cobrança:** `FIXO` (preço definido) ou `ORCAMENTO` (valor variável, o cliente solicita orçamento)
- Painel com listagem dos serviços, avaliações e agendamentos vinculados

### ✅ Dashboard Financeiro (~90%)
- Visualização de saldo da carteira
- Listagem de transações (entradas e saídas)
- Formulário para adicionar transações manuais

### 🔧 Agendamentos (Em desenvolvimento)
- Estrutura do banco de dados já existente (`Agendamento`, `Solicitacao`)
- Interface do dashboard parcialmente implementada

### 🔧 Mensagens (Em desenvolvimento)
- Estrutura do banco de dados já existente (`Mensagem`)
- Interface do dashboard ainda não implementada

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Neon](https://neon.tech/) (banco de dados)
- Conta no [Supabase](https://supabase.com/) (armazenamento de imagens)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/whodo-next.git
cd whodo-next
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o arquivo `.env`
Crie um arquivo `.env` na raiz do projeto:
```env
# Banco de dados (Neon PostgreSQL)
DATABASE_URL="postgresql://usuario:senha@host/neondb?sslmode=require"

# Autenticação (JWT)
NEXTAUTH_SECRET="sua-chave-secreta-super-longa-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (armazenamento de imagens)
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon-aqui"
```

### 4. Configure o banco de dados
```bash
npx prisma db push      # Cria as tabelas no Neon
npx prisma generate     # Gera o cliente Prisma
npx prisma db seed      # (Opcional) Popula com dados de exemplo
```

### 5. Rode o servidor de desenvolvimento
```bash
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000).

---

## 🔐 Segurança

- Senhas armazenadas com hash `bcrypt`
- Sessão em cookie `httpOnly` — não acessível via JavaScript do navegador
- Cookie assinado com **JWT (JSON Web Token)** usando `HS256` — qualquer adulteração invalida a sessão automaticamente
- Todas as rotas da API verificam a sessão antes de executar operações

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/           # Rotas da API (backend)
│   │   ├── auth/      # Login, logout, registro, sessão
│   │   ├── servicos/  # CRUD de serviços
│   │   ├── perfil/    # Atualização de perfil e foto
│   │   ├── portfolio/ # Álbuns e upload de mídia
│   │   └── ...
│   ├── dashboard/     # Páginas do painel do profissional
│   ├── buscar/        # Busca de profissionais + mapa
│   └── ...
├── components/        # Componentes reutilizáveis (Navbar, etc.)
└── lib/
    ├── auth.ts        # JWT: encrypt, decrypt, getSession
    ├── prisma.ts      # Instância do Prisma Client
    └── supabase.ts    # Cliente Supabase + função de upload
```
