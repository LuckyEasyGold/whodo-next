import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/postagens/[id]/comentarios - Criar comentário
export async function POST(
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
        const { conteudo } = body

        if (!conteudo || conteudo.trim() === '') {
            return NextResponse.json(
                { error: 'Conteúdo do comentário é obrigatório' },
                { status: 400 }
            )
        }

        // Verificar se a postagem existe
        const postagem = await prisma.postagem.findUnique({
            where: { id: postagemId }
        })

        if (!postagem) {
            return NextResponse.json(
                { error: 'Postagem não encontrada' },
                { status: 404 }
            )
        }

        // Criar comentário
        const comentario = await prisma.postagemComentario.create({
            data: {
                postagemId,
                usuarioId: session.id,
                conteudo: conteudo.trim()
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        foto_perfil: true
                    }
                }
            }
        })

        return NextResponse.json({
            ...comentario,
            autor: comentario.usuario
        })
    } catch (error) {
        console.error('Erro ao criar comentário:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

// GET /api/postagens/[id]/comentarios - Listar comentários
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

        const comentarios = await prisma.postagemComentario.findMany({
            where: { postagemId },
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
        })

        return NextResponse.json(comentarios)
    } catch (error) {
        console.error('Erro ao listar comentários:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
