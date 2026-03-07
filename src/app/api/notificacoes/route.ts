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
