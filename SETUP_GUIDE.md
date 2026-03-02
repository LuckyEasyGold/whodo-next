# 🚀 Guia de Inicialização - WhoDo

## Passo 1: Ativar XAMPP e MySQL

1. Abra **XAMPP Control Panel**
2. Clique em **Start** ao lado de **Apache** e **MySQL**
3. Aguarde até os dois estarem verdes
4. Abra a aba do MySQL e clique em **Admin** para confirmar que está funcionando

## Passo 2: Atualizar o Banco de Dados (Prisma Migrate)

Abra o terminal na pasta `/whodo-next` e execute:

```bash
# Criar/atualizar as tabelas no banco de dados
npx prisma migrate dev --name add-agendamento-financeiro

# Isso vai:
# 1. Atualizar o schema atual do Prisma
# 2. Criar as novas tabelas (agendamento, carteira, transacao, dados_bancarios)
# 3. Gerar o cliente TypeScript atualizado
```

## Passo 3: Iniciar o Servidor Next.js

```bash
# No terminal, na pasta /whodo-next
npm run dev
```

O servidor iniciará em: **http://localhost:3000**

## Passo 4: Testar as Funcionalidades

### Teste 1: Contratar Serviço
1. Abra `http://localhost:3000`
2. Faça login
3. Procure um prestador
4. Clique em **"Contratar"**
5. Selecione um serviço e agende

### Teste 2: Ver Agendamentos
- Acesse `/dashboard/agendamentos`
- Veja seus agendamentos como cliente ou prestador

### Teste 3: Finanças
- Acesse `/dashboard/financeiro`
- Teste depósito/saque
- Adicione dados bancários

## 🔧 Troubleshooting

### Erro: "Agendamento não existe"
**Solução:** Execute `npx prisma migrate dev` novamente

### Erro: "Não autenticado"
**Solução:** Faça logout e login novamente

### Erro: "Database connection failed"
**Solução:** Verifique se MySQL está rodando no XAMPP

### TypeScript errors no VS Code
**Solução:** 
```bash
npx prisma generate
```

## 📝 Banco de Dados Local

- **Host:** localhost
- **Porta:** 3306
- **Usuário:** root
- **Senha:** (vazio)
- **Database:** whodo

Acesse via **http://localhost/phpmyadmin**

---

**Pronto! Agora você pode testar o sistema completo! 🎉**
