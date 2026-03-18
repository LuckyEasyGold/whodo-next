import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando configuração da Conta Mestra da Plataforma...')

    const emailPlataforma = 'financeiro@whodo.app'

    let contaPlataforma = await prisma.usuario.findUnique({
        where: { email: emailPlataforma }
    })

    if (!contaPlataforma) {
        const senhaHash = await bcrypt.hash('WhoDoAdminFinanceiro2026!', 10)

        contaPlataforma = await prisma.usuario.create({
            data: {
                nome: 'Plataforma WhoDo',
                nome_fantasia: 'WhoDo Payments',
                email: emailPlataforma,
                senha: senhaHash,
                tipo: 'super_admin',
                verificado: true,
                status: 'ativo',
                email_verificado: true,
                carteira: {
                    create: {} // Utiliza os saldos default (0.00)
                }
            },
        })
        console.log('✅ Conta da Plataforma criada com sucesso!')
    } else {
        console.log('ℹ️ Conta da Plataforma já existe.')
        const carteira = await prisma.carteira.findUnique({
            where: { usuario_id: contaPlataforma.id }
        })

        if (!carteira) {
            await prisma.carteira.create({
                data: {
                    usuario_id: contaPlataforma.id,
                }
            })
            console.log('✅ Carteira da Plataforma vinculada com sucesso!')
        }
    }

    console.log(`\n======================================================`)
    console.log(`💰 CONTA DA PLATAFORMA PRONTA!`)
    console.log(`ID do Usuário: ${contaPlataforma.id}`)
    console.log(`Email: ${contaPlataforma.email}`)
    console.log(`======================================================\n`)
    console.log(`⚠️  Adicione a seguinte variável ao seu arquivo .env:`)
    console.log(`PLATFORM_ACCOUNT_ID=${contaPlataforma.id}\n`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })