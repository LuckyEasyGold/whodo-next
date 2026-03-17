import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/postagens/[id]/compartilhar - Compartilhar postagem
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
        const body = await req.json().catch(() => ({}))
        const { mensagem } = body

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

        // Criar registro de compartilhamento
        const compartilhamento = await prisma.postagemCompartilhamento.create({
            data: {
                postagemId,
                usuarioId: session.id
            }
        })

        // Retornar sucesso
        return NextResponse.json({
            success: true,
            message: 'Postagem compartilhada com sucesso',
            compartilhamentoId: compartilhamento.id
        })
    } catch (error) {
        console.error('Erro ao compartilhar postagem:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
