import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/notificacoes — lista notificações do usuário logado
export async function GET(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const apenasNaoLidas = searchParams.get('naoLidas') === 'true'
        const limite = Math.min(parseInt(searchParams.get('limite') || '20'), 50)

        const notificacoes = await prisma.notificacao.findMany({
            where: {
                usuario_id: session.id,
                ...(apenasNaoLidas ? { lida: false } : {}),
            },
            orderBy: { created_at: 'desc' },
            take: limite,
        })

        const totalNaoLidas = await prisma.notificacao.count({
            where: { usuario_id: session.id, lida: false }
        })

        return NextResponse.json({ notificacoes, totalNaoLidas })
    } catch (error) {
        console.error('Erro ao buscar notificações:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}

// PUT /api/notificacoes?todas=true — marca todas como lidas
export async function PUT(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const marcarTodas = searchParams.get('todas') === 'true'

        if (marcarTodas) {
            await prisma.notificacao.updateMany({
                where: { usuario_id: session.id, lida: false },
                data: { lida: true }
            })
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Parâmetro inválido' }, { status: 400 })
    } catch (error) {
        console.error('Erro ao marcar notificações:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}

// DELETE /api/notificacoes?id= — excluir uma notificação
export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
        }

        await prisma.notificacao.deleteMany({
            where: {
                id: parseInt(id),
                usuario_id: session.id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Erro ao excluir notificação:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
