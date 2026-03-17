import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/postagens - Criar nova postagem
export async function POST(req: NextRequest) {
    try {
        const session = await getSession()

        // Verifica se usuário está logado
        if (!session) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { titulo, conteudo, imagens, videoUrl, publico } = body

        // Validação básica
        if (!conteudo || conteudo.trim() === '') {
            return NextResponse.json(
                { error: 'Conteúdo é obrigatório' },
                { status: 400 }
            )
        }

        // Criar postagem no banco
        const postagem = await prisma.postagem.create({
            data: {
                titulo: titulo || null,
                conteudo,
                imagens: Array.isArray(imagens) ? imagens : [],
                videoUrl: videoUrl || null,
                publico: publico ?? true,
                autorId: session.id
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
                }
            }
        })

        return NextResponse.json(postagem, { status: 201 })
    } catch (error) {
        console.error('Erro ao criar postagem:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

// GET /api/postagens - Listar postagens (feed)
export async function GET(req: NextRequest) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            )
        }

        // Parâmetros de query (opcional)
        const { searchParams } = new URL(req.url)
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 20
        const skip = (page - 1) * limit

        // Buscar quem o usuário segue
        const seguindo = await prisma.seguidor.findMany({
            where: { seguidor_id: session.id },
            select: { seguido_id: true }
        })
        const seguindoIds = seguindo.map(s => s.seguido_id)

        // Buscar postagens
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
                        comentarios: true,
                        compartilhamentos: true
                    }
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
                        usuario: {
                            select: { id: true, nome: true, foto_perfil: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        })

        // Verificar quais autores o usuário segue
        const autoresIds = postagens.map(p => p.autorId)
        const seguidoresData = await prisma.seguidor.findMany({
            where: {
                AND: [
                    { seguidor_id: session.id },
                    { seguido_id: { in: autoresIds } }
                ]
            },
            select: { seguido_id: true }
        })
        const seguindoMap = new Set(seguidoresData.map(s => s.seguido_id))

        // Transformar para adicionar campos 'curtido', 'salvo', 'seguindo'
        const postagensFormatadas = postagens.map(post => ({
            ...post,
            // @ts-ignore - relaciones no incluyen en el tipo
            curtido: (post as any).curtidas?.length > 0,
            salvo: (post as any).salva?.length > 0,
            seguindo: seguindoMap.has(post.autorId),
            visualizacoes: post.visualizacoes
        }))

        // Contar total para paginação
        const total = await prisma.postagem.count({
            where: {
                OR: [
                    { autorId: { in: seguindoIds } },
                    { publico: true }
                ]
            }
        })

        return NextResponse.json({
            postagens: postagensFormatadas,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Erro ao buscar postagens:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
