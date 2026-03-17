import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/postagens/[id]/salvar - Salvar/Desselvar postagem
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

        // Verificar se já está salva
        const existente = await prisma.postagemSalva.findUnique({
            where: {
                postagemId_usuarioId: {
                    postagemId,
                    usuarioId: session.id
                }
            }
        })

        if (existente) {
            // Remover (dessalvar)
            await prisma.postagemSalva.delete({
                where: { id: existente.id }
            })
            return NextResponse.json({ salvo: false, message: 'Postagem removida dos salvos' })
        } else {
            // Salvar
            await prisma.postagemSalva.create({
                data: {
                    postagemId,
                    usuarioId: session.id
                }
            })
            return NextResponse.json({ salvo: true, message: 'Postagem salva com sucesso' })
        }
    } catch (error) {
        console.error('Erro ao salvar postagem:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

// GET /api/postagens/[id]/salvar - Verificar se está salva
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

        const salva = await prisma.postagemSalva.findUnique({
            where: {
                postagemId_usuarioId: {
                    postagemId,
                    usuarioId: session.id
                }
            }
        })

        return NextResponse.json({ salvo: !!salva })
    } catch (error) {
        console.error('Erro ao verificar salvamento:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
