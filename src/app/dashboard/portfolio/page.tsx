import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PortfolioContent from './PortfolioContent'

export const metadata = { title: 'Portfólio - WhoDo!' }

export default async function DashboardPortfolioPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const portfolio = await prisma.portfolioMedia.findMany({
        where: { usuario_id: session.id },
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-900">Meu Portfólio</h1>
                <p className="text-slate-500 text-sm mt-1">Adicione fotos e vídeos dos seus melhores trabalhos para atrair mais clientes.</p>
            </div>

            <PortfolioContent initialMedia={JSON.parse(JSON.stringify(portfolio))} />
        </div>
    )
}
