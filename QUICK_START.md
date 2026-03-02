# 📋 INSTRUÇÕES RÁPIDAS PARA INICIAR O WHODO

## ⚠️ IMPORTANTE: Estar na pasta CORRETA!

Você estava em:
```
C:\projetos\whodo\whodo\whodo
```

Mas precisa estar em:
```
C:\projetos\whodo\whodo\whodo\whodo-next
```

---

## 🚀 Pra rodar agora, faça isso (Copie e Cole):

### 1️⃣ Abra PowerShell e navegue para a pasta correta:
```powershell
cd C:\projetos\whodo\whodo\whodo\whodo-next
```

### 2️⃣ Verifique se XAMPP/MySQL está ligado
- Abra XAMPP Control Panel
- MySQL deve estar em VERDE

### 3️⃣ Rode a migração do Prisma:
```powershell
npx prisma migrate dev --name add-agendamento-financeiro
```

**Isso vai:**
- ✅ Criar todas as tabelas novas no banco
- ✅ Gerar tipos TypeScript corretos
- ✅ **Resolver todos os erros de TypeScript**

### 4️⃣ Inicie o servidor:
```powershell
npm run dev
```

Ou clique 2x em `start.bat`

---

## ✅ Pronto! Acesse:
**http://localhost:3000**

---

## 🧪 Teste Rápido (3 minutos):

1. Faça login
2. Vá em `/perfil/1` 
3. Clique "Contratar"
4. Vá em `/dashboard/agendamentos`
5. Vá em `/dashboard/financeiro`

---

## ❌ Se ainda tiver erro:

### Erro: "Could not find Prisma Schema"
**Solução:** Você está na pasta errada! Execute:
```powershell
cd C:\projetos\whodo\whodo\whodo\whodo-next
npx prisma migrate dev
```

### Erro: "Database connection failed"  
**Solução:** MySQL não está ligado. Abra XAMPP e ligue.

### Erro: TypeScript "propriedade não existe"
**Solução:** Execute:
```powershell
npx prisma generate
```

---

## 📂 Estrutura correta:
```
c:\projetos\whodo\whodo\whodo\
├── whodo-next/          ✅ Pasta do React/Next.js
│   ├── .env             ✅ Variáveis de ambiente
│   ├── prisma/
│   │   ├── schema.prisma  ✅ Schema aqui
│   │   └── seed.ts
│   ├── src/
│   ├── package.json
│   └── ...
├── (outros arquivos antigos)
```

## 🎯 Comando completo de uma linha:
```powershell
cd C:\projetos\whodo\whodo\whodo\whodo-next; npx prisma migrate dev --name add-agendamento-financeiro; npm run dev
```

---

**Qualquer dúvida, execute os comandos um por um! 🚀**
