---
title: WhoDo Knowledge Base
description: Base de conhecimento unificada do projeto WhoDo - marketplace de serviços
version: 2.2.0
last_updated: 2026-03-23
tags: [whodo, marketplace, serviceplace, nextjs, typescript, prisma]
---

# WhoDo Knowledge Base

> **Nota:** Este arquivo substitui todos os arquivos .md anteriores do diretório raiz. Use-o como referência completa do projeto.

---

## 1. Visão Geral do Projeto

### 1.1 O Que é o WhoDo?

**WhoDo!** é uma plataforma de serviceplace de freelance e profissionais liberais que conecta prestadores de serviços com clientes de forma simples, moderna e eficiente.

🌐 **Site em produção:** [whodo.newsdrop.net.br](https://whodo.newsdrop.net.br)

### 1.2 Modelo de Negócio

> **Modelo Unificado de Usuário:** qualquer pessoa cadastrada pode tanto contratar serviços quanto oferecer os seus — seja como diarista, professor particular, músico, contador, advogado ou médico.

### 1.3 Stack Tecnológica

| Tecnologia | Descrição |
|------------|-----------|
| **Framework** | Next.js 16 (App Router com Turbopack) |
| **Linguagem** | TypeScript |
| **Banco de Dados** | PostgreSQL (Neon serverless) |
| **ORM** | Prisma |
| **Armazenamento** | Supabase Storage |
| **Autenticação** | JWT customizado (jose) + NextAuth (OAuth) |
| **Hospedagem** | Vercel |
| **Estilização** | Tailwind CSS |
| **Animações** | Framer Motion |
| **Mapas** | Leaflet + React-Leaflet |
| **Ícones** | Lucide React |

---

## 2. Funcionalidades Implementadas

### 2.1 Autenticação e Segurança

| Funcionalidade | Status |
|----------------|--------|
| Cadastro com e-mail e senha | ✅ Completo |
| Login com Google (OAuth) | ✅ Completo |
| Login com Facebook (OAuth) | ✅ Completo |
| JWT com cookie httpOnly | ✅ Completo |
| Recuperação de senha | ✅ Completo |
| Verificação de e-mail | ✅ Completo |

### 2.2 Perfil e Redes Sociais

| Funcionalidade | Status |
|----------------|--------|
| Perfil público estilo Instagram | ✅ Completo |
| Edição de perfil completo | ✅ Completo |
| Upload de foto de perfil | ✅ Completo |
| CEP automático + Geocodificação | ✅ Completo |
| Sistema de Seguir e Seguidores | ✅ Completo |
| Links sociais (Instagram, LinkedIn, etc) | ✅ Completo |

### 2.3 Portfólio

| Funcionalidade | Status |
|----------------|--------|
| Upload de imagens/vídeos | ✅ Completo |
| Lightbox interativa | ✅ Completo |
| Comentários no portfólio | ✅ Completo |
| Álbuns organizados | ✅ Completo |

### 2.4 Busca e Descoberta

| Funcionalidade | Status |
|----------------|--------|
| Busca inteligente de profissionais | ✅ Completo (Melhorado!) |
| Mapa com Leaflet | ✅ Completo |
| Filtros dinâmicos (preço, nota, localização) | ✅ Completo |
| Paginação otimizada | ✅ Completo |
| Profissional Verificado | ✅ Completo |
| **Busca Case-Insensitive** | ✅ Completo |
| **Partial Match** | ✅ Completo |
| **Live Search (busca em tempo real)** | ✅ Completo |
| **Busca por múltiplos campos** | ✅ Completo |

### 2.5 Sistema de Serviços

| Funcionalidade | Status |
|----------------|--------|
| Cadastro de serviços | ✅ Completo |
| Preço Fixo | ✅ Completo |
| Sob Orçamento | ✅ Completo |
| Destaque de serviços | ✅ Completo |
| Categorias de serviços | ✅ Completo |

### 2.6 Avaliações

| Funcionalidade | Status |
|----------------|--------|
| Sistema de notas (1-5 estrelas) | ✅ Completo |
| Comentários em avaliações | ✅ Completo |
| Média de avaliações no perfil | ✅ Completo |

### 2.7 Mensagens e Chat

| Funcionalidade | Status |
|----------------|--------|
| Chat em tempo real | ✅ Completo |
| Integração com perfil do prestador | ✅ Completo |
| Notificações de novas mensagens | ✅ Completo |

### 2.8 Agendamentos

| Funcionalidade | Status |
|----------------|--------|
| Solicitação de serviço | ✅ Completo |
| Agendamento de data/hora | ✅ Completo |
| Aceite/Recusa de agendamento | ✅ Completo |
| Máquina de estados completa (11 estados) | ✅ Completo |
| API unificada `/api/agendamento/[id]/acoes` | ✅ Completo |
| Sugestão de nova data pelo prestador | ✅ Completo |
| Fluxo de orçamento (enviar/aprovar/recusar) | ✅ Completo |
| Iniciar Serviço (PAGO → EM_ANDAMENTO) | ✅ Completo |
| Two-Step Completion (prestador + cliente) | ✅ Completo |
| Cancelamento por ambas as partes | ✅ Completo |
| Histórico de auditoria (HistoricoAgendamento) | ✅ Completo |

### 2.9 Financeiro

| Funcionalidade | Status |
|----------------|--------|
| Carteira virtual | ✅ ~90% completo |
| Transações financeiras | ✅ ~90% completo |
| Dados bancários para saque | ✅ Completo |
| Dashboard financeiro | ✅ ~90% completo |

### 2.10 Página Social (Praça)

| Funcionalidade | Status |
|----------------|--------|
| Feed de postagens | ✅ Completo |
| Curtir postagens | ✅ Completo |
| Comentar postagens | ✅ Completo |
| Compartilhar postagens | ✅ Completo |

---

## 3. Instalação e Configuração

### 3.1 Pré-requisitos

- **Node.js** >= 18
- Conta no **[Neon](https://neon.tech)** (banco de dados PostgreSQL)
- Conta no **[Supabase](https://supabase.com)** (armazenamento de imagens)
- **npm** ou **yarn**

### 3.2 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados (Neon PostgreSQL)
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/whodo?sslmode=require"

# NextAuth (obrigatório)
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Google
AUTH_GOOGLE_ID="seu-google-client-id"
AUTH_GOOGLE_SECRET="seu-google-client-secret"

# OAuth Facebook
AUTH_FACEBOOK_ID="seu-facebook-app-id"
AUTH_FACEBOOK_SECRET="seu-facebook-app-secret"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anonima"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
```

### 3.3 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/LuckyEasyGold/whodo-next.git
cd whodo-next

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Copie .env.example para .env e preencha

# 4. Execute as migrações do banco
npx prisma migrate dev --name init

# 5. Gere o cliente Prisma
npx prisma generate

# 6. Inicie o servidor
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

---

## 4. Estrutura do Banco de Dados

### 4.1 Modelo de Dados Principal

#### Usuario
Tabela principal que armazena todos os usuários (clientes e prestadores).

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
  cidade          String?
  estado          String?
  cep             String?
  latitude        Decimal?
  longitude       Decimal?
  // Campos de redes sociais
  website         String?
  linkedin        String?
  facebook        String?
  instagram       String?
  youtube         String?
  tiktok          String?
  kwai            String?
  // Timestamps
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt
  // Relacionamentos
  servicos        Servico[]
  agendamentos    Agendamento[]
  carteira        Carteira?
  dadosBancarios  DadosBancarios?
  // ... relacionamentos sociais
}
```

#### Servico
Serviços oferecidos pelos prestadores.

```prisma
model Servico {
  id             Int       @id @default(autoincrement())
  usuario_id     Int
  categoria_id   Int
  titulo         String
  descricao      String?
  preco_base     Decimal   @default(0)
  unidade_medida String?
  cobranca_tipo  String    @default("FIXO")  // FIXO, ORCAMENTO
  tempo_estimado String?
  destaque       Boolean   @default(false)
  status         String    @default("ativo")
  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt
}
```

#### Categoria
Categorias de serviços (ex: Construção, Beleza, Educação).

```prisma
model Categoria {
  id        Int       @id @default(autoincrement())
  nome      String
  descricao String?
  icone     String?
  imagem    String?
}
```

#### Agendamento
Agendamentos de serviços entre cliente e prestador.

```prisma
model Agendamento {
  id                Int       @id @default(autoincrement())
  servico_id        Int
  cliente_id        Int
  prestador_id      Int
  data_agendamento  DateTime
  hora_inicio       String?
  hora_fim          String?
  status            String    @default("pendente")  // pendente, confirmado, concluido, cancelado
  valor             Decimal?
  observacoes       String?
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt
}
```

#### Carteira
Carteira virtual do usuário para transações.

```prisma
model Carteira {
  id          Int     @id @default(autoincrement())
  usuario_id  Int     @unique
  saldo       Decimal @default(0)
  bloqueado   Decimal @default(0)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}
```

### 4.2 Fluxo de Dados

```
Busca → Perfil do Prestador → Serviço → Solicitação → 
  → Chat/Negociação → Agendamento → Conclusão → 
    → Transação → Avaliação → Carteira
```

---

## 5. Arquitetura da API

### 5.1 Estrutura das Rotas

```
src/app/api/
├── admin/
│   ├── scripts/          # Scripts administrativos
│   ├── setup/            # Configuração inicial
│   ├── stats/           # Estatísticas
│   └── users/           # Gerenciamento de usuários
├── agendamento/
│   ├── route.ts          # GET (listar) / POST (criar)
│   └── [id]/
│       ├── route.ts      # GET / PUT / DELETE por ID
│       └── acoes/
│           └── route.ts  # POST — endpoint unificado de ações
│                         # acao: aceitar | recusar | sugerir_data
│                         # acao: enviar_orcamento | aprovar_orcamento | recusar_orcamento
│                         # acao: iniciar_servico | concluir_servico
│                         # acao: confirmar_conclusao | recusar_conclusao | cancelar
├── auth/
│   ├── [...nextauth]/   # NextAuth handler
│   ├── login/           # Login tradicional
│   ├── cadastro/        # Novo cadastro
│   ├── logout/          # Logout
│   ├── sync/            # Sincronizar OAuth com DB
│   ├── recuperar-senha/  # Recuperação de senha
│   └── verificar-email/ # Verificação de e-mail
├── avaliacoes/          # Sistema de avaliações
├── busca/               # API de busca em tempo real (live search)
├── carteira/            # Carteira do usuário
├── dados-bancarios/     # Dados bancários
├── mensagens/
│   ├── [solicitacaoId]/ # Mensagens por solicitação
│   └── iniciar/          # Iniciar conversa
├── notificacoes/        # Sistema de notificações
├── perfil/
│   ├── update/          # Atualizar perfil
│   ├── senha/           # Alterar senha
│   └── email/           # Alterar e-mail
├── portfolio/
│   ├── upload/          # Upload de mídia
│   ├── albums/          # Gerenciar álbuns
│   └── comentarios/     # Comentários
├── postagens/           # Feed social (praça)
├── ranking/            # Ranking de prestadores
├── servicos/           # CRUD de serviços
├── solicitacoes/       # Solicitações de serviço
├── suporte/
│   └── chat/            # Chat de suporte
└── transacao/           # Transações financeiras
```

### 5.2 Padrão de Resposta

**Sucesso (200):**
```json
{
  "data": { ... }
}
```

**Erro (400/401/500):**
```json
{
  "error": "Mensagem de erro"
}
```

### 5.3 Autenticação em APIs

Todas as rotas protegidas devem verificar a sessão:

```typescript
import { getSession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    )
  }
  
  // Use session.id para obter o ID do usuário
  const userId = session.id
  
  // ...
}
```

---

## 6. Regras de Negócio

### 6.1 Usuários

- **Modelo Unificado:** Todo usuário pode ser cliente e prestador
- **Cadastro Social:** Ao fazer login com Google/Facebook, cria automaticamente um registro na tabela Usuario
- **Verificação:** Usuários verificados são aqueles que já fecharam pelo menos uma transação na plataforma
- **Desativação:** Nunca excluir usuários, apenas alterar status para "inativo"

### 6.2 Tipos de Usuário

| Tipo | Descrição |
|------|-----------|
| `usuario` | Usuário comum |
| `moderador` | Pode moderar conteúdo |
| `admin` | Acesso administrativo |
| `super_admin` | Acesso total ao sistema |

### 6.3 Serviços

- **Preço Fixo (FIXO):** O prestador define um valor cerrado
- **Sob Orçamento (ORCAMENTO):** O valor será negociado via chat

### 6.4 Agendamentos — Máquina de Estados

Endpoint unificado: `POST /api/agendamento/[id]/acoes` com campo `acao` no body.

| Status | Descrição | Ação que chega aqui |
|--------|-----------|---------------------|
| `pendente` | Aguardando resposta do prestador | criação |
| `aceito` | Prestador aceitou | `aceitar` |
| `aguardando_cliente` | Prestador sugeriu nova data | `sugerir_data` |
| `orcamento_enviado` | Prestador enviou orçamento | `enviar_orcamento` |
| `negociacao` | Cliente recusou e propôs novos termos | `recusar_orcamento` |
| `aguardando_pagamento` | Orçamento aprovado, aguardando pagamento | `aprovar_orcamento` |
| `confirmado` | Pagamento confirmado | webhook/pagar-com-saldo |
| `em_andamento` | Prestador iniciou a execução | `iniciar_servico` |
| `aguardando_confirmacao_cliente` | Prestador concluiu, aguardando cliente | `concluir_servico` |
| `conclusao_recusada` | Cliente recusou a conclusão | `recusar_conclusao` |
| `concluido` | Cliente confirmou + pagamento liberado | `confirmar_conclusao` |
| `cancelado` | Cancelado por qualquer parte | `cancelar` |
| `avaliado` | Avaliado por ambas as partes | `avaliar` |

**Regras críticas:**
- Pagamento (`canPay`) só disponível nos status `aceito` (sem orçamento) ou `aguardando_pagamento`
- Split financeiro: 96% prestador / 4% plataforma — liberado apenas no `confirmar_conclusao`
- Toda transição gera registro em `HistoricoAgendamento`

### 6.5 Fluxo de Pagamento e Escrow

- **Intermediário Central (Escrow):** O WhoDo atua como o intermediário financeiro em todas as transações. O dinheiro pago por um cliente por um serviço **não vai** diretamente para o prestador. Ele é mantido em custódia (escrow) pela plataforma.
- **Liberação de Pagamento:** O valor só é liberado e transferido para a carteira do prestador após o `Agendamento` ser marcado como `concluído`, garantindo a segurança para ambas as partes.
- **Fontes de Pagamento:** O cliente pode pagar por um serviço de duas formas:
    1.  **Saldo da Carteira:** Usando fundos que ele já possui em sua carteira WhoDo.
    2.  **Gateway Externo:** Usando um meio de pagamento como PIX ou Cartão de Crédito (ex: via Mercado Pago).
- **Registro de Transações:** Independentemente da fonte, toda movimentação financeira é registrada. Pagamentos externos, para fins de clareza no extrato do cliente, são registrados como uma entrada de fundos na carteira seguida de um pagamento imediato para a custódia do serviço.
- **Comissão da Plataforma:** No momento da liberação do pagamento para o prestador, a comissão acordada do WhoDo é automaticamente deduzida.

---

## 7. FAQ (Perguntas Frequentes)

### Cadastro e Login

#### Pergunta: Qual a diferença entre cadastrar como cliente ou profissional?
**Resposta:** O cadastro é o mesmo, mas a partir do momento que cadastrar um serviço, você será visto também como Profissional. Isso porque todo profissional também é um cliente.

#### Pergunta: Posso ser cliente e profissional ao mesmo tempo?
**Resposta:** Sim, na verdade todo profissional é cliente de alguém. O sistema é unificado.

#### Pergunta: O cadastro é gratuito?
**Resposta:** Sim, não há custo nenhum para se cadastrar e pesquisar na plataforma. Só haverá um custo caso feche um contrato dentro da plataforma, onde a plataforma intermediará a transação.

#### Pergunta: Por que preciso informar CPF/CNPJ?
**Resposta:** Em vários casos, esses documentos são necessários para o contrato de prestação de serviços, seja de um MEI, empresa prestadora, ou quem contrata.

#### Pergunta: O login com Google e Facebook funciona?
**Resposta:** Sim, está funcionando. Mas o cadastro completo precisa ser preenchido no perfil, informando os dados solicitados.

#### Pergunta: Não recebi o e-mail de confirmação, o que faço?
**Resposta:** Se entrou com login social, não será necessário e-mail de confirmação, pois a plataforma entende que seu e-mail já foi validado. Caso contrário, aguarde alguns minutos e verifique a caixa de spam. Se ainda não receber, entre em contato com o suporte.

#### Pergunta: Como altero minha senha?
**Resposta:** Dentro do Dashboard, vá em Configurações e encontrará a opção de alterar senha.

#### Pergunta: Posso mudar meu e-mail cadastrado depois?
**Resposta:** Seu cadastro é vinculado ao seu e-mail principal. No Dashboard > Configurações, você pode migrar para uma nova conta levando todo seu histórico junto.

---

### Busca e Contratação

#### Pergunta: Como funciona o sistema de busca por proximidade?
**Resposta:** Ao definir sua localização no mapa, os profissionais mais próximos aparecem primeiro nos resultados.

#### Pergunta: O que significa "Profissional Verificado"?
**Resposta:** Quando um profissional efetua um contrato dentro da plataforma, isso prova que são reais, não apenas perfis para preencher cadastro.

#### Pergunta: Como filtro profissionais por preço?
**Resposta:** Na página de pesquisa, há um filtro do lado esquerdo para definir um valor máximo. No mobile, o botão está acima da lista.

#### Pergunta: Posso ver o portfólio do profissional antes de contratar?
**Resposta:** Sim, ao entrar no perfil do profissional, todo seu portfólio está disponível para consulta.

#### Pergunta: Qual a diferença entre "Preço Fixo" e "Sob Orçamento"?
**Resposta:** Preço Fixo é quando o profissional já define um valor. Sob Orçamento é quando o preço precisa ser combinado caso a caso.

#### Pergunta: Como solicito um orçamento?
**Resposta:** Diretamente no perfil do profissional, clique no botão "Contratar" ou "Solicitar".

#### Pergunta: Posso negociar o valor do serviço?
**Resposta:** Sim, você pode usar o sistema de mensagens para entrar em contato e negociar antes do fechamento.

#### Pergunta: Como sei se o profissional está disponível?
**Resposta:** Envie uma mensagem diretamente ao profissional para confirmar a disponibilidade.

---

### Para Profissionais (Prestadores)

#### Pergunta: Como crio um serviço na plataforma?
**Resposta:** Acesse seu Dashboard e vá na aba "Serviços". Lá você pode cadastrar seus serviços.

#### Pergunta: Quantos serviços posso cadastrar?
**Resposta:** Atualmente não há limite fixo. Você pode adicionar quantas especialidades ou variações forem necessárias.

#### Pergunta: Como defino o preço do meu serviço?
**Resposta:** Ao criar ou editar um serviço, escolha entre "Fixo" (com preço definido) ou "Sob Orçamento".

#### Pergunta: O que colocar na descrição?
**Resposta:** Seja claro sobre o que fará, tempo de execução, se material está incluso e seu diferencial.

#### Pergunta: Como funciona o sistema de seguidores?
**Resposta:** Clientes podem "Seguir" seu perfil. Você aparecerá na lista de favoritos deles.

#### Pergunta: Como adiciono fotos ao meu portfólio?
**Resposta:** Vá no Dashboard > Portfólio e faça upload das imagens.

#### Pergunta: Posso criar álbuns diferentes?
**Resposta:** No momento, as fotos formam uma vitrine unificada no perfil.

#### Pergunta: Como sou notificado de novos agendamentos?
**Resposta:** Você receberá uma notificação no site e também por e-mail.

#### Pergunta: Posso recusar um agendamento?
**Resposta:** Sim, os pedidos aparecem como Solicitações. Você pode aceitar ou recusar.

---

### Agendamentos

#### Pergunta: Como funciona o processo de agendamento?
**Resposta:** O cliente localiza o profissional, escolhe o serviço e inicia a Solicitação. Se o profissional aceitar, o serviço entra na fase ativa.

#### Pergunta: Posso cancelar um agendamento?
**Resposta:** Sim, pelo menos 24 horas antes. Use a própria tela da solicitação para cancelar.

#### Pergunta: Como remarca um serviço?
**Resposta:** Entre em contato via chat e combinem uma nova data em comum acordo.

#### Pergunta: Onde vejo meus agendamentos como cliente?
**Resposta:** No Dashboard, na seção "Solicitações" ou "Agendamentos".

---

## 8. Troubleshooting

### Erro: "Não autenticado"
**Solução:** Faça logout e login novamente para gerar novo token JWT.

### Erro: "Usuário ou senha inválidos"
**Solução:** Verifique suas credenciais. Se usando login social, o cadastro completo precisa estar preenchido.

### Erro: "Database connection failed"
**Solução:** Verifique a variável DATABASE_URL no arquivo .env e se o banco Neon está ativo.

### Erro: "Agendamento não existe"
**Solução:** Execute `npx prisma migrate dev` para atualizar o banco.

### TypeScript errors no VS Code
**Solução:** Execute `npx prisma generate` para gerar os tipos atualizados.

### Erro ao fazer upload de imagem
**Solução:** Verifique as variáveis do Supabase (SUPABASE_URL e SUPABASE_ANON_KEY).

---

## 9. Glossário

| Termo | Definição |
|-------|-----------|
| **Serviceplace** | Plataforma que conecta prestadores de serviços a clientes |
| **Prestador** | Profissional que oferece serviços na plataforma |
| **Cliente** | Usuário que contrata serviços |
| **Carteira** | Sistema financeiro virtual do usuário |
| **Verificado** | Usuário que já realizou pelo menos uma transação |
| **FIXO** | Tipo de serviço com preço definido |
| **ORCAMENTO** | Tipo de serviço que precisa de negociação |

---

## 10. Referências Rápidas

### Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `prisma/schema.prisma` | Schema completo do banco de dados |
| `src/auth.ts` | Configuração do NextAuth |
| `src/lib/auth.ts` | Funções de JWT (encrypt, decrypt, getSession) |
| `middleware.ts` | Controle de acesso às rotas |
| `.env` | Variáveis de ambiente |

### Atalhos Úteis

```bash
# Migrar banco
npx prisma migrate dev --name nome-da-migracao

# Resetar banco (CUIDADO!)
npx prisma migrate reset

# Gerar cliente
npx prisma generate

# Studio Prisma
npx prisma studio
```

---

*Este documento é mantido atualizado pela equipe de desenvolvimento do WhoDo.*
