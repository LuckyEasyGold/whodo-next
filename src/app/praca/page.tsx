import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import PracaContent from './PracaContent'

export const metadata = {
    title: 'Praça - WhoDo!',
    description: 'O ponto de encontro da comunidade WhoDo!',
}

export default async function PracaPage() {
    const session = await getSession()
    
    if (!session) {
        return { redirect: { destination: '/login', permanent: false } }
    }

    // Buscar dados do usuário logado com contagens
    const usuarioLogado = await prisma.usuario.findUnique({
        where: { id: session.id },
        include: {
            _count: {
                select: {
                    servicos: true,
                    seguidores: true,
                    seguindo: true,
                    avaliacoesRecebidas: true
                }
            }
        }
    })

    // Buscar IDs de quem o usuário segue
    const seguindo = await prisma.seguidor.findMany({
        where: { seguidor_id: session.id },
        select: { seguido_id: true }
    })
    const seguindoIds = seguindo.map(s => s.seguido_id)

    // Buscar postagens do feed
    const postagens = await prisma.postagem.findMany({
        where: {
            OR: [
                { autorId: { in: seguindoIds } },
                { publico: true }
            ]
        },
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
                    compartilhamentos: true,
                    comentarios: true
                }
            },
            curtidas: {
                where: { usuarioId: session.id },
                select: { id: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
    })

    // Transformar para adicionar campo 'curtido'
    const postagensComCurtido = postagens.map(post => ({
        ...post,
        curtido: post.curtidas.length > 0
    }))

    // Buscar sugestões de perfis para seguir
    const sugestoesPerfis = await prisma.usuario.findMany({
        where: {
            NOT: { id: session.id },
            AND: [
                { NOT: { seguidores: { some: { seguidor_id: session.id } } } },
                { tipo: { notIn: ['admin', 'moderador', 'super_admin'] } }
            ]
        },
        select: {
            id: true,
            nome: true,
            foto_perfil: true,
            especialidade: true,
            _count: {
                select: { seguidores: true }
            }
        },
        take: 5
    })

    return (
        <PracaContent 
            usuarioLogado={JSON.parse(JSON.stringify(usuarioLogado))}
            postagens={JSON.parse(JSON.stringify(postagensComCurtido))}
            sugestoesPerfis={JSON.parse(JSON.stringify(sugestoesPerfis))}
        />
    )
}