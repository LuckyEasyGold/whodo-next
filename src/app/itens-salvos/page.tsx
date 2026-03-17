import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import FeedCentral from '@/app/praca/components/FeedCentral'
import { Bookmark } from 'lucide-react'

export const metadata = {
    title: 'Itens Salvos - WhoDo!',
    description: 'Suas postagens salvas no WhoDo!',
}

export default async function ItensSalvosPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    // Buscar IDs de quem o usuário segue (para manter o botão de seguir funcionando)
    const seguindo = await prisma.seguidor.findMany({
        where: { seguidor_id: session.id },
        select: { seguido_id: true }
    })
    const seguindoIds = seguindo.map(s => s.seguido_id)

    // Buscar postagens que foram salvas pelo usuário
    const postagensSalvas = await prisma.postagem.findMany({
        where: {
            salva: {
                some: { usuarioId: session.id }
            }
        },
        include: {
            autor: {
                select: { id: true, nome: true, foto_perfil: true, tipo: true, especialidade: true }
            },
            _count: {
                select: { curtidas: true, compartilhamentos: true, comentarios: true }
            },
            curtidas: {
                where: { usuarioId: session.id },
                select: { id: true }
            },
            salva: {
                where: { usuarioId: session.id },
                select: { id: true }
            },
            comentarios: {
                include: {
                    usuario: { select: { id: true, nome: true, foto_perfil: true } }
                },
                orderBy: { createdAt: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const postagensFormatadas = postagensSalvas.map(post => ({
        ...post,
        curtido: post.curtidas?.length > 0,
        salvo: post.salva?.length > 0,
        seguindo: seguindoIds.includes(post.autorId)
    }))

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Bookmark size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Itens Salvos</h1>
                            <p className="text-sm text-slate-500">Publicações que você guardou para ver depois</p>
                        </div>
                    </div>

                    <FeedCentral
                        postagens={JSON.parse(JSON.stringify(postagensFormatadas))}
                        usuarioLogadoId={session.id}
                    />
                </div>
            </main>

            <div className="hidden lg:block">
                <Footer />
            </div>

            <MobileBottomNav usuarioId={session.id} />
        </>
    )
}