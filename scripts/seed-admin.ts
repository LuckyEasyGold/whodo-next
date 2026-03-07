/**
 * Script: seed-admin.ts
 * Creates the TecWareWhodo! super_admin account if it doesn't exist.
 * Run with: npx ts-node --project tsconfig.json -e "require('./scripts/seed-admin.ts')"
 * Or with tsx: npx tsx scripts/seed-admin.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const ADMIN_EMAIL = 'sadmin@whodo.app'
    const ADMIN_NAME = 'TecWareWhodo!'

    console.log('🔍 Verificando conta super_admin...')

    const existing = await prisma.usuario.findFirst({
        where: { tipo: 'super_admin' }
    })

    if (existing) {
        console.log(`✅ Conta super_admin já existe: ${existing.nome} (${existing.email})`)
        console.log('   Nenhuma alteração necessária.')
        return
    }

    const admin = await prisma.usuario.create({
        data: {
            nome: ADMIN_NAME,
            email: ADMIN_EMAIL,
            tipo: 'super_admin',
            status: 'ativo',
            email_verificado: true,
            senha: null, // Will be set on first access via /admin/setup
        }
    })

    console.log('✅ Conta super_admin criada com sucesso!')
    console.log(`   Nome: ${admin.nome}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Tipo: ${admin.tipo}`)
    console.log(`   ID: ${admin.id}`)
    console.log('')
    console.log('ℹ️  Para logar: acesse /login e use:')
    console.log(`   Usuário (nome): ${ADMIN_NAME}`)
    console.log(`   Senha: (não definida — você será redirecionado para /admin/setup)`)
}

main()
    .catch((e) => {
        console.error('❌ Erro ao criar conta admin:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
