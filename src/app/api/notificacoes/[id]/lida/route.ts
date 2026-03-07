import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PATCH /api/notificacoes/[id]/lida — marca a notificação como lida
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { id } = await params
        const notifId = parseInt(id)
        if (isNaN(notifId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        // Garante que a notificação pertence ao usuário logado
        const notif = await prisma.notificacao.findFirst({
            where: { id: notifId, usuario_id: session.id }
        })

        if (!notif) {
            return NextResponse.json({ error: 'Notificação não encontrada' }, { status: 404 })
        }

        await prisma.notificacao.update({
            where: { id: notifId },
            data: { lida: true }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}

// PATCH /api/notificacoes/todas/lida — marca TODAS como lidas
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Usamos id = 'todas' para marcar todas de uma vez
    const { id } = await params
    if (id !== 'todas') {
        return NextResponse.json({ error: 'Rota inválida' }, { status: 400 })
    }

    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.notificacao.updateMany({
        where: { usuario_id: session.id, lida: false },
        data: { lida: true }
    })

    return NextResponse.json({ success: true })
}
