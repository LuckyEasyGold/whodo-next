import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const ADMIN_TYPES = ['admin', 'super_admin']

// PATCH /api/admin/users/[id]/status — Change user status to ativo/inativo
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session || !ADMIN_TYPES.includes(session.tipo)) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const { id } = await params
        const userId = parseInt(id)
        if (isNaN(userId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const { status } = await request.json()
        if (!['ativo', 'inativo'].includes(status)) {
            return NextResponse.json({ error: 'Status inválido. Use: ativo ou inativo' }, { status: 400 })
        }

        const target = await prisma.usuario.findUnique({ where: { id: userId } })
        if (!target) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        // Prevent modifying super_admin accounts
        if (target.tipo === 'super_admin') {
            return NextResponse.json({ error: 'Não é possível modificar uma conta super_admin.' }, { status: 403 })
        }

        const updated = await prisma.usuario.update({
            where: { id: userId },
            data: { status },
            select: { id: true, nome: true, status: true }
        })

        // If deactivating, also clear their sessions
        if (status === 'inativo') {
            await prisma.session.deleteMany({ where: { userId } })
        }

        return NextResponse.json({ success: true, usuario: updated })
    } catch (error) {
        console.error('Admin status change error:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
