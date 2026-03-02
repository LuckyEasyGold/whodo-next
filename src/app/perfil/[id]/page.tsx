import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProfileContent from './ProfileContent'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await prisma.usuario.findUnique({ where: { id: parseInt(id) }, select: { nome: true } })
    return { title: user ? `${user.nome} - WhoDo!` : 'Perfil - WhoDo!' }
}

export default async function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getSession()

    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(id) },
        include: {
            portfolio: { orderBy: { created_at: 'desc' } },
            servicos: { include: { categoria: true }, orderBy: { created_at: 'desc' } },
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

    if (!usuario) notFound()

    const isOwner = session?.id === usuario.id

    // Stats
    const totalServicos = usuario.servicos.length
    const totalAvaliacoes = usuario.avaliacoesRecebidas.length
    const mediaAvaliacao = totalAvaliacoes > 0
        ? usuario.avaliacoesRecebidas.reduce((acc, a) => acc + Number(a.nota), 0) / totalAvaliacoes
        : 0

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen bg-slate-50">
                <ProfileContent
                    usuario={JSON.parse(JSON.stringify(usuario))}
                    isOwner={isOwner}
                    stats={{
                        totalServicos,
                        totalAvaliacoes,
                        mediaAvaliacao: Math.round(mediaAvaliacao * 10) / 10,
                        seguidores: 0,
                        seguindo: 0,
                    }}
                />
            </main>
            <Footer />
        </>
    )
}
