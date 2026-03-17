import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/postagens/[id]/visualizacoes - Registrar visualização
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const postagemId = parseInt(id)

        if (!postagemId || isNaN(postagemId)) {
            return NextResponse.json(
                { error: 'ID de postagem inválido' },
                { status: 400 }
            )
        }

        // Incrementar visualização
        const postagem = await prisma.postagem.update({
            where: { id: postagemId },
            data: {
                visualizacoes: { increment: 1 }
            }
        })

        return NextResponse.json({
            success: true,
            visualizacoes: postagem.visualizacoes
        })
    } catch (error) {
        console.error('Erro ao registrar visualização:', error)
        return NextResponse.json(
            { error: 'Erro ao registrar visualização' },
            { status: 500 }
        )
    }
}

// GET /api/postagens/[id]/visualizacoes - Buscar visualizações
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const postagemId = parseInt(id)

        if (!postagemId || isNaN(postagemId)) {
            return NextResponse.json(
                { error: 'ID de postagem inválido' },
                { status: 400 }
            )
        }

        const postagem = await prisma.postagem.findUnique({
            where: { id: postagemId },
            select: { visualizacoes: true }
        })

        if (!postagem) {
            return NextResponse.json(
                { error: 'Postagem não encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            visualizacoes: postagem.visualizacoes
        })
    } catch (error) {
        console.error('Erro ao buscar visualizações:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar visualizações' },
            { status: 500 }
        )
    }
}
