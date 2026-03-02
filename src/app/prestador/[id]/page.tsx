import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PrestadorProfile from './PrestadorProfile'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await prisma.usuario.findUnique({ where: { id: parseInt(id) }, select: { nome: true } })
    return { title: user ? `${user.nome} - WhoDo!` : 'Perfil - WhoDo!' }
}

export default async function PrestadorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const prestador = await prisma.usuario.findUnique({
        where: { id: parseInt(id), tipo: 'prestador' },
        include: {
            prestador: true,
            servicos: { include: { categoria: true } },
            avaliacoesRecebidas: {
                include: {
                    cliente: { select: { nome: true, foto_perfil: true } },
                    servico: { select: { titulo: true } },
                },
                orderBy: { data_avaliacao: 'desc' },
                take: 10,
            },
        },
    })

    if (!prestador) notFound()

    const stats = await prisma.avaliacao.aggregate({
        where: { prestador_id: prestador.id },
        _count: true,
        _avg: { nota: true },
    })

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen bg-slate-50">
                <PrestadorProfile
                    prestador={JSON.parse(JSON.stringify(prestador))}
                    stats={{ totalAvaliacoes: stats._count, mediaAvaliacao: Number(stats._avg.nota || 0) }}
                />
            </main>
            <Footer />
        </>
    )
}
