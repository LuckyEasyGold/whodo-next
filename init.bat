@echo off
REM ====================================
REM WhoDo - Script de Inicializacao
REM Navega para a pasta correta e inicia tudo
REM ====================================

cd /d C:\projetos\whodo\whodo\whodo\whodo-next

echo.
echo ========================================
echo.  WhoDo - Inicializacao Completa
echo.
echo ========================================
echo.

echo 1️⃣  Verificando Prisma...
call npx prisma generate

echo.
echo 2️⃣  Criando / Atualizando Banco de Dados...
echo    (se pedir para criar arquivo .env, pressione ENTER)
call npx prisma migrate dev --name add-agendamento-financeiro

echo.
echo ✅ Banco de dados atualizado com sucesso!
echo.
echo ========================================
echo.
echo 3️⃣  INICIANDO SERVIDOR...
echo.
echo 🎉 Servidor iniciando em:
echo 📍 http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ========================================
echo.

call npm run dev
