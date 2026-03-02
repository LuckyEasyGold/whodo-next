@echo off
REM Script de inicialização do WhoDo - Windows

echo.
echo ========================================
echo.  WhoDo - Script de Inicializacao
echo.
echo ========================================

echo.
echo 1️⃣  Verifique se XAMPP esta ativo:
echo    - MySQL em verde
echo    - Apache em verde (opcional)

echo.
echo 2️⃣  Gerando schema Prisma...
call npx prisma generate

echo.
echo 3️⃣  Aplicando migrações do banco de dados...
call npx prisma migrate dev --name add-agendamento-financeiro

echo.
echo ✅ Banco de dados atualizado com sucesso!

echo.
echo 4️⃣  Iniciando servidor...
echo.
echo 🎉 SERVIDOR INICIANDO!
echo 📍 Acesse em: http://localhost:3000
echo.

call npm run dev
