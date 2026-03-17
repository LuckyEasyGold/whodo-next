import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/postagens/[id] - Buscar postagem específica
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getSession()
        
        if (!session) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            )
        }

        const postagemId = parseInt(id)

        const postagem = await prisma.postagem.findUnique({
            where: { id: postagemId },
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
                comentarios: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nome: true,
                                foto_perfil: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!postagem) {
            return NextResponse.json(
                { error: 'Postagem não encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            ...postagem,
            curtido: postagem.curtidas.length > 0
        })
    } catch (error) {
        console.error('Erro ao buscar postagem:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

// DELETE /api/postagens/[id] - Deletar postagem
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getSession()
        
        if (!session) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            )
        }

        const postagemId = parseInt(id)

        // Verificar se a postagem existe e pertence ao usuário
        const postagem = await prisma.postagem.findUnique({
            where: { id: postagemId }
        })

        if (!postagem) {
            return NextResponse.json(
                { error: 'Postagem não encontrada' },
                { status: 404 }
            )
        }

        if (postagem.autorId !== session.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para deletar esta postagem' },
                { status: 403 }
            )
        }

        // Deletar postagem (cascade vai deletar curtidas, comentários etc)
        await prisma.postagem.delete({
            where: { id: postagemId }
        })

        return NextResponse.json(
            { message: 'Postagem deletada com sucesso' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erro ao deletar postagem:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

// PUT /api/postagens/[id] - Editar postagem
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getSession()
        
        if (!session) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            )
        }

        const postagemId = parseInt(id)
        const body = await req.json()
        const { titulo, conteudo } = body

        // Verificar se a postagem existe e pertence ao usuário
        const postagem = await prisma.postagem.findUnique({
            where: { id: postagemId }
        })

        if (!postagem) {
            return NextResponse.json(
                { error: 'Postagem não encontrada' },
                { status: 404 }
            )
        }

        if (postagem.autorId !== session.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para editar esta postagem' },
                { status: 403 }
            )
        }

        // Atualizar postagem
        const updatedPostagem = await prisma.postagem.update({
            where: { id: postagemId },
            data: {
                titulo: titulo ?? postagem.titulo,
                conteudo: conteudo ?? postagem.conteudo,
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
                }
            }
        })

        return NextResponse.json(updatedPostagem)
    } catch (error) {
        console.error('Erro ao editar postagem:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}