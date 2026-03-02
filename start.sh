#!/bin/bash

# Script de inicialização do WhoDo - Linux/Mac
# Para Windows, execute os comandos manualmente ou use o PowerShell

echo "🚀 Iniciando WhoDo..."
echo ""

# Verificar se XAMPP está rodando (opcional)
# echo "✓ Verifique se XAMPP está rodando (MySQL + Apache)"
# echo ""

echo "📦 Atualizando Prisma..."
npx prisma generate

echo ""
echo "🔄 Aplicando migrações do banco de dados..."
npx prisma migrate dev --name add-agendamento-financeiro

echo ""
echo "✅ Banco de dados atualizado!"
echo ""

echo "🎉 Iniciando servidor Next.js..."
echo "📍 Acesse em: http://localhost:3000"
echo ""

npm run dev
