import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/postagens/[id]/curtir - Curtir/descurtir postagem
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession()
        
        if (!session) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            )
        }

        const postagemId = parseInt(params.id)

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

        // Verificar se já curtiu
        const curtidaExistente = await prisma.curtida.findUnique({
            where: {
                usuarioId_postagemId: {
                    usuarioId: session.id,
                    postagemId: postagemId
                }
            }
        })

        if (curtidaExistente) {
            // Descurtir
            await prisma.curtida.delete({
                where: { id: curtidaExistente.id }
            })
            
            return NextResponse.json({ curtido: false })
        } else {
            // Curtir
            await prisma.curtida.create({
                data: {
                    usuarioId: session.id,
                    postagemId: postagemId
                }
            })
            
            return NextResponse.json({ curtido: true })
        }
    } catch (error) {
        console.error('Erro ao curtir/descurtir:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}