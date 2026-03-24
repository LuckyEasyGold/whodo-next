# Plano de Implementação - Sistema de Onboarding/Tour Virtual

## Objetivo
Criar um sistema que detecta a primeira vez que o usuário acessa cada tela do dashboard e exibe cards de orientação resumidos com link para página de ajuda completa.

---

## 1. Estrutura de Dados

### localStorage
Chave: `whodo_telas_visitadas`
Valor: `string[]` - array com rotas visitadas

Exemplo:
```json
["/dashboard", "/dashboard/perfil", "/dashboard/agendamentos"]
```

---

## 2. Componente React: OnboardingCard

### Localização
`src/components/OnboardingCard.tsx`

### Props
- `rota`: string - rota da tela atual
- `titulo`: string - título do card
- `descricao`: string - texto resumido
- `links`: Array de { texto, url } - links de "Saiba mais..."

### Appearance
- Estilo: folha de papel (sombra, borda suave, fundo branco)
- Posição: canto superior direito ou flutuante
- Botão para fechar (não mostrar novamente)
- Ícone de ajuda (?)

---

## 3. Página de Ajuda

### Rota
`/ajuda` (pública)

### Estrutura
- **Sidebar (esquerda):** Lista de tópicos
- **Conteúdo (direita):** Orientações detalhadas por tela

### Tópicos por tela:
1. Dashboard Principal
2. Meus Agendamentos
3. Detalhes do Agendamento
4. Mensagens
5. Notificações
6. Meu Perfil
7. Configurações
8. Portfólio
9. Meus Serviços
10. Criar/Editar Serviço
11. Financeiro

---

## 4. Integração nas Telas

Cada tela do dashboard terá um componente que:
1. Verifica se é a primeira visita (localStorage)
2. Se for primeira vez, mostra o OnboardingCard
3. Após fechar, marca como visitada

---

## 5. Telas e Conteúdo Inicial

### /dashboard
- **Título:** Bem-vindo ao seu Dashboard!
- **Descrição:** Aqui você tem uma visão geral da sua atividade na plataforma. Acompanhe seus agendamentos, mensagens e receitas...
- **Link:** "Saiba mais sobre o Dashboard..."

### /dashboard/agendamentos
- **Título:** Meus Agendamentos
- **Descrição:** Gerencie todos os seus agendamentos aqui. Você pode aceitar, recusar ou negociar serviços com clientes...
- **Link:** "Como funcionam os agendamentos..."

### /dashboard/agendamentos/[id]
- **Título:** Detalhes do Agendamento
- **Descrição:** Veja todas as informações deste agendamento. Você pode iniciar o serviço, marcar como concluído ou entrar em contato...
- **Link:** "Entenda o fluxo completo de agendamento..."

### /dashboard/mensagens
- **Título:** Mensagens
- **Descrição:** Communicate com seus clientes ou prestadores de serviço. Tire dúvidas, negocie termos e acompanhe propostas...
- **Link:** "Como usar o chat..."

### /dashboard/notificações
- **Título:** Notificações
- **Descrição:** Fique por dentro de tudo que acontece na plataforma. Novas mensagens, status de agendamentos e promoções...
- **Link:** "Configurar notificações..."

### /dashboard/perfil
- **Título:** Meu Perfil
- **Descrição:** Complete seu perfil para attracts mais clientes. Adicione foto, descrição, especialidade e localização...
- **Link:** "Dicas para um perfil atrativo..."

### /dashboard/configuracoes
- **Título:** Configurações
- **Descrição:** Gerencie suas configurações de conta, privacidade, notificações e métodos de pagamento...
- **Link:** "Ver todas as opções..."

### /dashboard/portfolio
- **Título:** Portfólio
- **Descrição:** Mostre seus melhores trabalhos! Adicione fotos e vídeos dos serviços que você realiza...
- **Link:** "Dicas para um portfólio profissional..."

### /dashboard/servicos
- **Título:** Meus Serviços
- **Descrição:** Gerencie os serviços que você oferece. Você pode criar novos serviços, editar preços e descrições...
- **Link:** "Como criar serviços atrativos..."

### /dashboard/servicos/novo
- **Título:** Criar Serviço
- **Descrição:** Adicione um novo serviço ao seu catálogo. Defina preço, descrição, categoria e tempo estimado...
- **Link:** "Ver exemplo de serviço bem detalhado..."

### /dashboard/financeiro
- **Título:** Financeiro
- **Descrição:** Acompanhe suas receitas, saldo disponível e histórico de transações. Solicite saques quando quiser...
- **Link:** "Entenda como funcionam os pagamentos..."

---

## 6. Implementação

### Passo 1: Criar componente OnboardingCard
### Passo 2: Criar hook useOnboarding
### Passo 3: Criar página /ajuda
### Passo 4: Integrar em cada tela do dashboard
