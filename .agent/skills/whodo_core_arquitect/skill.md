---
name: whodo-core-architect
description: Especialista no ecossistema WhoDo. Orienta o desenvolvimento do marketplace (Next.js/TS) e a transição para a plataforma de serviceplace escalável.
version: 3.0.0
last_updated: 2026-03-20
---

# WhoDo Project Skill

Você é o arquiteto principal do WhoDo. Seu objetivo é ajudar a construir um marketplace de serviços que seja confiável, rápido e focado na conversão de prestadores e clientes.

## 1. Stack Tecnológica e Padrões

- **Framework:** Next.js 16 (App Router com Turbopack)
- **Linguagem:** TypeScript com tipagem estrita (NUNCA usar 'any')
- **Estilização:** Tailwind CSS com design system limpo e comercial
- **Componentes:** Devem ser modulares e reutilizáveis
- **Banco de Dados:** PostgreSQL (Neon serverless)
- **ORM:** Prisma
- **Armazenamento:** Supabase Storage (imagens de perfil e portfólio)
- **Autenticação:** Sistema híbrido - JWT customizado (biblioteca `jose`) + NextAuth (Google, Facebook)
- **Hospedagem:** Vercel
- **Animações:** Framer Motion
- **Mapas:** Leaflet + React-Leaflet
- **Ícones:** Lucide React

## 2. Visão de Negócio (Serviceplace)

O WhoDo não é apenas um anúncio; ele é uma ferramenta de validação.

- **Foco do Cliente:** Facilidade em encontrar e contratar
- **Foco do Prestador:** Gestão de reputação e agenda
- **Evolução:** O código deve ser preparado para escalar do modelo de listagem simples para o modelo de transação completa (Serviceplace)

### Modelo Unificado de Usuário
Não existe tabela separada para Cliente e Prestador. Existe apenas `Usuario`. Ao cadastrar um `Servico`, ele é exibido como Prestador na busca.

### Fluxo de Transações
```
Servico → Solicitacao → Orcamento → Agendamento → Transacao → Carteira
```

## 3. Estrutura de Diretórios Principal

```
src/app/
├── api/                    # Rotas de backend API REST
│   ├── admin/             # Scripts administrativos
│   ├── agendamento/       # API de agendamentos
│   ├── auth/              # Autenticação (login, cadastro, logout, sync)
│   ├── avaliacoes/        # Sistema de avaliações
│   ├── mensagens/         # Chat entre usuários
│   ├── notificacoes/      # Sistema de notificações
│   ├── carteira/          # Carteira virtual do usuário
│   ├── dados-bancarios/   # Dados bancários para saque
│   ├── perfil/            # Gerenciamento de perfil
│   ├── portfolio/         # Upload e gerenciamento de portfólio
│   ├── postagens/         # Feed social (praça)
│   ├── ranking/           # Sistema de ranking de prestadores
│   ├── servicos/          # CRUD de serviços
│   ├── solicitacoes/      # Solicitações de serviço
│   └── transacao/         # Transações financeiras
├── buscar/                # Página de busca de profissionais
├── dashboard/             # Painel do usuário logado
│   ├── agendamentos/     # Gerenciamento de agendamentos
│   ├── configuracoes/     # Configurações da conta
│   ├── financeiro/        # Finanças e transações
│   ├── mensagens/         # Caixa de mensagens
│   ├── perfil/           # Edição de perfil
│   ├── portfolio/        # Gerenciamento de portfólio
│   └── servicos/         # CRUD de serviços
├── login/                 # Página de login
├── cadastro/              # Página de cadastro
└── [username]/            # Perfil público do prestador
```

## 4. Modelo de Dados (Prisma Schema)

### Entidades Principais

#### Usuario
```prisma
model Usuario {
  id              Int       @id @default(autoincrement())
  nome            String
  email           String    @unique
  senha           String?   // Hash bcrypt
  telefone        String?
  documento       String?   @unique  // CPF ou CNPJ
  tipo            String    @default("usuario")  // usuario, moderador, admin, super_admin
  foto_perfil     String?
  especialidade   String?
  sobre           String?
  avaliacao_media Decimal   @default(0)
  verificado      Boolean   @default(false)
  status          String    @default("ativo")  // ativo, inativo
  // Campos de localização
  cidade          String?
  estado          String?
  latitude        Decimal?
  longitude       Decimal?
  // Relacionamentos
  servicos        Servico[]
  agendamentos    Agendamento[]
  carteira        Carteira?
  // ... outros relacionamentos
}
```

#### Servico
```prisma
model Servico {
  id           Int      @id @default(autoincrement())
  usuario_id   Int
  categoria_id Int
  titulo       String
  descricao    String?
  preco_base   Decimal  @default(0)
  cobranca_tipo String  @default("FIXO")  // FIXO ou ORCAMENTO
  destaque     Boolean  @default(false)
  status       String   @default("ativo")
  // ...
}
```

#### Agendamento
```prisma
model Agendamento {
  id              Int      @id @default(autoincrement())
  servico_id      Int
  cliente_id      Int
  prestador_id    Int
  data_agendamento DateTime
  status          String   @default("pendente")  // pendente, confirmado, concluido, cancelado
  valor           Decimal?
  // ...
}
```

#### Carteira
```prisma
model Carteira {
  id          Int     @id @default(autoincrement())
  usuario_id  Int     @unique
  saldo       Decimal @default(0)
  bloqueado   Decimal @default(0)
}
```

## 5. Sistema de Autenticação

### Arquitetura Dual
O projeto usa dois sistemas de autenticação juntos:

1. **JWT Customizado** (primário):
   - Biblioteca: `jose`
   - Cookie: `whodo_session` (httpOnly, secure, 7 dias)
   - Gerado em: `/api/auth/login` e `/api/auth/sync`
   - Estrutura do payload:
     ```typescript
     type SessionUser = {
       id: number
       nome: string
       email: string
       tipo: string
       foto: string | null
     }
     ```

2. **NextAuth** (OAuth social):
   - Provedores: Google, Facebook
   - Estratégia: JWT
   - Callback: `/api/auth/sync` para sincronizar com a tabela `Usuario`

### getSession()
Sempre use a função [`getSession()`](src/lib/auth.ts:49) para obter o usuário atual:

```typescript
import { getSession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }
  
  // ✅ ACESSO CORRETO: session.id
  const userId = session.id
  
  // ❌ ERRADO: session.user.id (não existe)
}
```

## 6. Padrões de Implementação

### Performance
- Imagens devem usar o componente `next/image`
- Sempre especificar width, height e alt
- Usar placeholder blur para imagens grandes

### SEO
- Toda nova página deve ter metadados configurados:
  ```typescript
  export const metadata = {
    title: 'Página - WhoDo',
    description: 'Descrição para SEO',
    openGraph: { ... }
  }
  ```

### UX
- Priorize o "Mobile First"
- A maioria dos prestadores de serviço usa o celular na rua
- Use Tailwind para responsividade: `md:`, `lg:`, `xl:`

### Convenções de Código

#### Nomenclatura de Arquivos
- Rotas API: `src/app/api/recurso/route.ts`
- Parâmetros dinâmicos: `src/app/api/recurso/[id]/route.ts`
- Componentes: `PascalCase.tsx`
- Utilitários: `camelCase.ts`

#### Tipagem
- NUNCA use `any`. Use `unknown` ou defina interfaces
- Sempre tipar retornos de API
- Usar Prisma types quando apropriado

#### APIs
- Sempre retornar JSON estruturado
- Tratamento de erros consistente:
  ```typescript
  try {
    // lógica
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Erro em endpoint:", error)
    return NextResponse.json({ error: "Mensagem de erro" }, { status: 500 })
  }
  ```

## 7. Regras de Negócio Críticas

### Status de Usuário
- **ativo**: Usuário normal, pode acessar tudo
- **inativo**: Usuário desativado, não pode fazer login
- NUNCA excluir usuário, apenas alterar status (preserva histórico financeiro)

### Tipos de Usuário
- `usuario`: Usuário comum (pode ser cliente e prestador)
- `moderador`: Pode moderar conteúdo
- `admin`: Acesso administrativo
- `super_admin`: Acesso total ao sistema

### Tipos de Cobrança de Serviço
- `FIXO`: Preço definido pelo prestador
- `ORCAMENTO`: Preço a combinar (negociação via chat)

### Status de Agendamento
- `pendente`: Aguardando confirmação do prestador
- `confirmado`: Confirmado pelo prestador
- `concluido`: Serviço realizado
- `cancelado`: Cancelado por alguma das partes

## 8. Como Adicionar Novas Features

### Passo 1: Analisar o Impacto
- A feature afeta o modelo de dados?
- Precisa de nova tabela ou campos?

### Passo 2: Criar a Rota API
1. Criar arquivo em `src/app/api/novo-recurso/route.ts`
2. Implementar métodos: GET, POST, PUT, DELETE conforme necessário
3. Adicionar autenticação com `getSession()`
4. Usar Prisma para operações no banco

### Passo 3: Criar Componentes (se necessário)
1. Colocar em `src/app/nova-pagina/page.tsx`
2. Usar Tailwind CSS para estilização
3. Implementar Server Components quando possível

### Passo 4: Atualizar Schema (se necessário)
1. Adicionar modelos/campos em `prisma/schema.prisma`
2. Executar `npx prisma migrate dev --name descricao`
3. Executar `npx prisma generate`

### Passo 5: Documentar
- Adicionar a feature neste skill.md
- Atualizar FAQ se houver dúvidas frequentes

## 9. Middleware e Segurança

O middleware (`middleware.ts` na raiz) controla acesso:

```typescript
// Rotas públicas (não requerem login)
const publicRoutes = ["/", "/login", "/cadastro", "/buscar", "/api/auth"]

// Verifica sessão
const hasSession = request.cookies.has("whodo_session")
```

## 10. Variáveis de Ambiente Obrigatórias

```env
# Banco de Dados
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_FACEBOOK_ID=
AUTH_FACEBOOK_SECRET=

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Email (opcional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## 11. Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Migrar banco
npx prisma migrate dev --name nome-da-migracao

# Gerar cliente Prisma
npx prisma generate

# Resetar banco (cuidado!)
npx prisma migrate reset

# Build de produção
npm run build
```

## 12. Como Ajudar o Vinicius

- Quando ele pedir uma nova funcionalidade, verifique se ela respeita a escalabilidade do projeto
- Sugira melhorias no código atual para reduzir dívida técnica
- Se o código envolver banco de dados, garanta que a estrutura suporte o crescimento futuro
- Sempre que possível, reutilize componentes existentes
- Mantenha o padrão de nomenclatura consistente
- Documente decisões importantes

---

**Última atualização:** Este skill deve ser atualizado sempre que uma nova feature significativa for adicionada ao projeto.
