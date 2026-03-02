import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import DashboardContent from './DashboardContent'

export const metadata = { title: 'Dashboard - WhoDo!' }

export default async function DashboardPage() {
    const session = await getSession()

    // Redirect to login if not authenticated
    if (!session) redirect('/login')

    const usuario = await prisma.usuario.findUnique({
        where: { id: session.id },
        include: {
            prestador: true,
            servicos: { include: { categoria: true }, orderBy: { created_at: 'desc' } },
            avaliacoesRecebidas: { orderBy: { data_avaliacao: 'desc' }, take: 5 },
            notificacoes: { orderBy: { created_at: 'desc' }, take: 5 },
            solicitacoes: { orderBy: { created_at: 'desc' }, take: 5, include: { servico: true } },
        },
    })

    if (!usuario) redirect('/login')

    const totalAvaliacoes = await prisma.avaliacao.count({ where: { prestador_id: session.id } })
    const avgAvaliacao = await prisma.avaliacao.aggregate({ where: { prestador_id: session.id }, _avg: { nota: true } })

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen bg-slate-50">
                <DashboardContent
                    usuario={JSON.parse(JSON.stringify(usuario))}
                    stats={{
                        totalServicos: usuario.servicos.length,
                        totalAvaliacoes,
                        mediaAvaliacao: Number(avgAvaliacao._avg.nota || 0),
                        totalNotificacoes: usuario.notificacoes.filter(n => !n.lida).length,
                    }}
                />
            </main>
        </>
    )
}
