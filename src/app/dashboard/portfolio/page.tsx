import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PortfolioContent from './PortfolioContent'

export const metadata = { title: 'Meu Portfólio - WhoDo!' }

export default async function PortfolioPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const albums = await prisma.portfolioAlbum.findMany({
        where: { usuario_id: session.id },
        orderBy: { created_at: 'desc' },
        include: {
            medias: { orderBy: { created_at: 'asc' } },
            _count: { select: { medias: true } },
        },
    })

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <PortfolioContent initialAlbums={JSON.parse(JSON.stringify(albums))} />
        </div>
    )
}
