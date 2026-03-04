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
                data: {
                    tipo: 'prestador',
                    especialidade: 'Eletricista',
                    sobre: 'Trabalho na área há 10 anos.',
                    avaliacao_media: 0,
                    verificado: false
                }
            })
            console.log('User updated to prestador.')
        }
    } else {
        console.log('User not found.')
    }
}

resetUser()
