<div align="center">
  <h1>⚡ WhoDo!</h1>
  <p><strong>A plataforma que conecta quem precisa com quem sabe fazer.</strong></p>

  <p>
    <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js"></a>
    <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript"></a>
    <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma"></a>
    <a href="https://tailwindcss.com"><img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css"></a>
    <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge">
  </p>

  <br/>
  <img src="https://raw.githubusercontent.com/LuckyEasyGold/whodo-next/master/public/og-image.png" alt="WhoDo! Preview" width="780" />
</div>

---

## 📖 Sobre o Projeto

**WhoDo!** é uma plataforma de marketplace de serviços freelance e profissionais liberais que conecta prestadores de serviços com clientes de forma simples, moderna e eficiente.

> **Modelo Unificado de Usuário:** qualquer pessoa cadastrada pode tanto contratar serviços quanto oferecer os seus — seja como diarista, professor particular, músico, contador, advogado ou médico.

---

## ✨ Funcionalidades

| Funcionalidade | Status |
|---|---|
| 🔐 Autenticação (e-mail + senha) | ✅ Completo |
| 👤 Perfil Público estilo Instagram | ✅ Completo |
| 🗂️ Portfólio com Lightbox (fotos e vídeos) | ✅ Completo |
| 🗺️ Busca com Mapa Interativo (Leaflet) | ✅ Completo |
| 🔍 Filtros dinâmicos (preço, nota, localização) | ✅ Completo |
| 📊 Dashboard do Usuário | ✅ Completo |
| ✏️ Edição de Perfil + Redes Sociais | ✅ Completo |
| 🖼️ Upload de Portfólio com título e citação do cliente | ✅ Completo |
| 📅 Agendamentos | 🚧 Em desenvolvimento |
| 💬 Mensageria em tempo real | 🚧 Em desenvolvimento |
| 💰 Dashboard Financeiro | 🚧 Em desenvolvimento |
| 🔗 Login Social (Google, Facebook) | 🔜 Planejado |

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 16](https://nextjs.org) com App Router e Turbopack
- **Linguagem:** [TypeScript](https://www.typescriptlang.org)
- **ORM:** [Prisma](https://www.prisma.io) com MySQL (XAMPP em dev)
- **Estilo:** [Tailwind CSS](https://tailwindcss.com)
- **Animações:** [Framer Motion](https://www.framer.com/motion)
- **Mapas:** [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org)
- **Ícones:** [Lucide React](https://lucide.dev)
- **Autenticação:** JWT em HTTP-only Cookies + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

## 📦 Pré-requisitos

- **Node.js** >= 18
- **XAMPP** (ou qualquer MySQL >= 8)
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
# Edite o .env com suas credenciais de banco
```

### Configuração do `.env`

```env
DATABASE_URL="mysql://root:@localhost:3306/whodo"
JWT_SECRET="sua-chave-secreta-aqui"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

```bash
# 4. Aplique o schema no banco de dados
npx prisma db push

# 5. (Opcional) Popule com dados de exemplo
npx prisma db seed

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **[http://localhost:3000](http://localhost:3000)** 🚀

---

## 🗃️ Estrutura do Projeto

```
whodo-next/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.ts               # Dados de exemplo
├── public/
│   └── uploads/portfolio/    # Uploads locais (dev)
└── src/
    ├── app/
    │   ├── api/              # API Routes (auth, perfil, portfólio)
    │   ├── buscar/           # Página de busca com mapa
    │   ├── cadastro/         # Registro de usuário
    │   ├── dashboard/        # Área do usuário logado
    │   │   ├── perfil/       # Edição de perfil
    │   │   └── portfolio/    # Gerenciamento de portfólio
    │   ├── login/            # Autenticação
    │   └── perfil/[id]/      # Perfil público
    ├── components/
    │   ├── landing/          # Seções da Landing Page
    │   ├── MapComponent.tsx  # Mapa interativo com cluster
    │   └── MapWrapper.tsx    # Wrapper SSR-safe do mapa
    └── lib/
        ├── auth.ts           # Lógica de sessão JWT
        └── prisma.ts         # Cliente Prisma singleton
```

---

## 🗺️ Modelo de Dados (Resumo)

O núcleo da aplicação é o modelo unificado **`Usuario`**:

- Campos de perfil pessoal (nome, foto, sobre, especialidade)
- Campos de localização (cidade, estado, lat/lng)
- Redes sociais (LinkedIn, Instagram, YouTube, TikTok, etc.)
- Relações com `Servico`, `PortfolioMedia`, `Avaliacao`, etc.

---

## 🤝 Contribuindo

1. Faça um _fork_ do projeto
2. Crie sua branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">
  <p>Feito com ❤️ pela equipe <strong>WhoDo!</strong></p>
</div>
