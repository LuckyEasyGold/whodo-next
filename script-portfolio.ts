import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function addPortfolioItem() {
    const email = 'joao.silva@email.com'
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (user && user.tipo === 'prestador') {
        await prisma.portfolioMedia.create({
            data: {
                usuario_id: user.id,
                url: 'https://images.unsplash.com/photo-1621544402532-22c6b1d667c5?w=400',
                tipo: 'imagem',
                descricao: 'Trabalho elétrico - Demonstração'
            }
        })
        console.log('Mock portfolio item added.')
    }
}

addPortfolioItem()
