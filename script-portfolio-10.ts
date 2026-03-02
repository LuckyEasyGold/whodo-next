import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function addPortfolioItem() {
    // Achar o usuario com ID = 10 (ou outro que tenha perfil completo)
    const user = await prisma.usuario.findUnique({ where: { email: 'vinicius@whodo.com' } })
    if (user && user.tipo === 'prestador') {
        await prisma.portfolioMedia.create({
            data: {
                prestador_id: user.id,
                url: 'https://images.unsplash.com/photo-1621544402532-22c6b1d667c5?w=400',
                tipo: 'imagem',
                descricao: 'Trabalho elétrico - Demonstração'
            }
        })
        console.log('Mock portfolio item added to vinicius.')
    } else {
        console.log('User vinicius not found or not prestador.')
    }
}

addPortfolioItem()
