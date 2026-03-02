import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function resetUser() {
    const email = 'joao.silva@email.com'
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (user) {
        console.log('User found:', user.email, 'Type:', user.tipo)
        if (user.tipo !== 'prestador') {
            await prisma.usuario.update({
                where: { id: user.id },
                data: { tipo: 'prestador' }
            })
            // Create prestador record if it doesn't exist
            const p = await prisma.prestador.findUnique({ where: { usuario_id: user.id } })
            if (!p) {
                await prisma.prestador.create({
                    data: {
                        usuario_id: user.id,
                        especialidade: 'Eletricista',
                        sobre: 'Trabalho na área há 10 anos.',
                        avaliacao_media: 0,
                        verificado: false
                    }
                })
            }
            console.log('User updated to prestador.')
        }
    } else {
        console.log('User not found.')
    }
}

resetUser()
