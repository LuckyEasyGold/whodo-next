# 🧪 Guia de Testes - WhoDo

## Requisitos
- Servidor MySQL rodando (XAMPP)
- Database `vini5607_whodo` criada
- Node.js 18+

## ✅ Checklist de Testes

### 1. Iniciar a Aplicação
```bash
cd c:\projetos\whodo\whodo\whodo\whodo-next
npm run dev
```

Acesse: **http://localhost:3000**

### 2. Autenticação
#### Teste Login
```
Email: carlos@whodo.com
Senha: 123456
```

**Esperado**: Login bem-sucedido e redirecionamento para `/dashboard`

### 3. Dashboard - Meus Serviços (NOVO!)
1. Acesse: `/dashboard/servicos`
2. Verifyque se os serviços do prestador aparecem
3. Clique em um serviço para expandir
4. Verifque:
   - ✅ Total de agendamentos
   - ✅ Contagem por status (pendente/confirmado/concluído/cancelado)
   - ✅ Últimas avaliações
   - ✅ Últimos agendamentos
   - ✅ Botão "Ver agendamentos"

### 4. Agendamentos
1. Acesse: `/dashboard/agendamentos`
2. Teste filtro de status
3. Teste atualizar status (Prestador: Confirmar/Concluir)

### 5. Financeiro
1. Acesse: `/dashboard/financeiro`
2. Visuablize saldo
3. Monte depósito (test)
4. Teste saque (test)
5. Verifque histórico de transações

### 6. Perfis & Contratar (Featurum Hire)
1. Acesse: `/buscar` ou busque um prestador
2. Clique em "Contratar"
3. Teste o modal de contratação
4. Selecione serviço
5. Preencha data/hora/localização
6. Submit - verifque se agendamento foi criado

### 7. APIs Rest (Curl/Postman)

#### Listar Serviços Prestador
```bash
curl -H "Cookie: auth-token=YOUR_TOKEN" \
  http://localhost:3000/api/servicos
```

**Resposta esperada**:
```json
[
  {
    "id": 1,
    "titulo": "Encanamento",
    "preco_base": "150.00",
    "categoria": { "nome": "Encanador" },
    "estatisticas": {
      "totalAgendamentos": 5,
      "confirmados": 3,
      "concluidos": 2,
      "pendentes": 0,
      "cancelados": 0,
      "totalAvaliacoes": 2,
      "mediaAvaliacoes": 4.5
    }
  }
]
```

#### Listar Agendamentos
```bash
curl -H "Cookie: auth-token=YOUR_TOKEN" \
  http://localhost:3000/api/agendamento
```

#### Criar Transação (e-Deposit)
```bash
curl -X POST http://localhost:3000/api/transacao \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "deposito",
    "valor": 100,
    "metodo_pagamento": "pix",
    "chave_pix": "meuemail@example.com"
  }'
```

#### Obter Dados Bancários
```bash
curl -H "Cookie: auth-token=YOUR_TOKEN" \
  http://localhost:3000/api/dados-bancarios
```

## 🐛 Possíveis Problemas & Soluções

### Erro: "Não autenticado"
- Verifque se o cookie `auth-token` está sendo enviado
- Tente fazer login novamente
- Verifque em DevTools > Application > Cookies

### Erro: "Serviço não encontrado"
- Verifque se o ID do serviço está correto
- Verifque se o prestador realmente tem este serviço

### Erro: "Propriedade não existe"
- Rode: `npx prisma generate`
- Reinice o servidor dev

### Banco de dados vazio
- Rode: `npx pristma migrate reset --force`
- Isso irá recriar as tabelas e popular com dados de teste (seed.ts)

## 📊 Dados de Teste

O seed.ts cria automaticamente:
- **10 Categorias** (Encanador, Eletricista, Pintor, etc)
- **2 Prestadores** com serviços
- **2 Clientes** para teste
- **Serviços** associados a prestadores
- **Agendamentos de teste** com vários status

## 🎯 Fluxo Completo de Teste

1. **Login como Prestador**
   - Email: `carlos@whodo.com`
   - Senha: `123456`

2. **Ver Meus Serviços**
   - URL: `/dashboard/servicos`
   - Deve listar todos serviços do prestador

3. **Visualizar Agendamentos**
   - Clique em "Ver agendamentos" em um serviço
   - Ou acesse: `/dashboard/agendamentos`
   - Veja status de cada agendamento

4. **Gerenciar Financeiro**
   - Acesse: `/dashboard/financeiro`
   - Deposite fundos
   - Retire fundos

5. **Logout**
   - URL: `/api/auth/logout`
   - Deve redirecionar para `/login`

## ✨ Features Implementadas

| Feature | Status | Endpoint | UI |
|---------|--------|----------|-----|
| Agendamentos | ✅ | `/api/agendamento` | ✅ |
| Carteira/Saldo | ✅ | `/api/carteira` | ✅ |
| Transações | ✅ | `/api/transacao` | ✅ |
| Dados Bancários | ✅ | `/api/dados-bancarios` | ✅ |
| **Meus Serviços** | ✅ | `/api/servicos` | ✅ |
| Contratar | ✅ | Modal em perfis | ✅ |
| Dashboard | ✅ | `/dashboard` | ✅ |
| Portfolio | ✅ | `/dashboard/portfolio` | ⏳ |
| Mensagens | ❌ | `/api/mensagens` | ❌ |
| Notificações | ❌ | `/api/notificacoes` | ❌ |

## 🚀 Próximas Fases

### Fase 2 - AI Training Data
- Endpoint para exportar dados de serviços e agendamentos
- Formato JSON/CSV para treinamento
- Agregação histórica por período

### Fase 3 - Funcionalidades Avançadas
- Portfolio avançado com múltiplos álbuns
- Sistema de mensageme chat
- Notificações push
- Avaliações e comentários

### Fase 4 - Optimizações
- Caching com Redis
- Paginação de tabelas grandes
- Busca full-text
- Gráficos e analytics

---

**Última Atualização**: Março 2, 2026
**Versão**: 1.0.0-beta
