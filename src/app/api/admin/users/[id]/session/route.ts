import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const ADMIN_TYPES = ['admin', 'super_admin']

// DELETE /api/admin/users/[id]/session — Clear all active sessions for a user
export async function DELETE(
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

        // Prevent clearing own session
        if (userId === session.id) {
            return NextResponse.json({ error: 'Não é possível encerrar sua própria sessão por aqui.' }, { status: 400 })
        }

        // Delete all NextAuth sessions (OAuth accounts)
        const deleted = await prisma.session.deleteMany({
            where: { userId }
        })

        return NextResponse.json({
            success: true,
            message: `${deleted.count} sessão(ões) encerrada(s) com sucesso.`
        })
    } catch (error) {
        console.error('Admin clear session error:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
