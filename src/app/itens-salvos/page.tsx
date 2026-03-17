import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import MobileBottomNav from '@/components/MobileBottomNav'
import CardPostagem from '@/app/praca/components/CardPostagem'

export const metadata = {
    title: 'Itens Salvos - WhoDo!',
    description: 'Suas postagens salvas',
}

export default async function ItensSalvosPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    // Buscar postagens salvas pelo usuário
    const postagensSalvas = await prisma.postagemSalva.findMany({
        where: { usuarioId: session.id },
        include: {
            postagem: {
                include: {
                    autor: {
                        select: {
                            id: true,
                            nome: true,
                            foto_perfil: true,
                            tipo: true,
                            especialidade: true
                        }
                    },
                    _count: {
                        select: {
                            curtidas: true,
                            comentarios: true,
                            compartilhamentos: true
                        }
                    },
                    curtidas: {
                        where: { usuarioId: session.id },
                        select: { id: true }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const postagens = postagensSalvas.map(salva => ({
        ...salva.postagem,
        curtido: salva.postagem.curtidas.length > 0
    }))

    // Buscar dados do usuário logado
    const usuarioLogado = await prisma.usuario.findUnique({
        where: { id: session.id },
        select: { id: true }
    })

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 pt-16 pb-20 lg:pb-6">
                <div className="max-w-xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Itens Salvos</h1>

                    {postagens.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                            <p className="text-slate-500">
                                Você ainda não salvou nenhuma publicação.
                            </p>
                            <p className="text-sm text-slate-400 mt-2">
                                Explore a praça e salve publicações que você gostaria de ver depois!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {postagens.map((post) => (
                                <CardPostagem
                                    key={post.id}
                                    post={post}
                                    usuarioLogadoId={session.id}
                                    onLike={() => { }}
                                    onShare={() => { }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Barra de navegação inferior - mobile */}
            <MobileBottomNav usuarioId={session.id} />
        </>
    )
}
