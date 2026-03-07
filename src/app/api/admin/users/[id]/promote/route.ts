import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// Role hierarchy: super_admin > admin > moderador > usuario
const ROLE_HIERARCHY: Record<string, number> = {
    usuario: 1,
    moderador: 2,
    admin: 3,
    super_admin: 4,
}

// PATCH /api/admin/users/[id]/promote — Promote/demote user role and reset their password
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const { id } = await params
        const userId = parseInt(id)
        if (isNaN(userId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const { novoTipo } = await request.json()
        const validTypes = ['usuario', 'moderador', 'admin']
        if (!validTypes.includes(novoTipo)) {
            return NextResponse.json({ error: 'Tipo inválido. Use: usuario, moderador ou admin' }, { status: 400 })
        }

        const myLevel = ROLE_HIERARCHY[session.tipo] ?? 0
        const targetLevel = ROLE_HIERARCHY[novoTipo] ?? 0

        // Only super_admin can promote to admin
        if (novoTipo === 'admin' && session.tipo !== 'super_admin') {
            return NextResponse.json({ error: 'Apenas o super_admin pode promover a admin.' }, { status: 403 })
        }

        // Cannot promote beyond your own level
        if (targetLevel >= myLevel) {
            return NextResponse.json({ error: 'Você não pode promover alguém ao seu nível ou acima.' }, { status: 403 })
        }

        const target = await prisma.usuario.findUnique({ where: { id: userId } })
        if (!target) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        if (target.tipo === 'super_admin') {
            return NextResponse.json({ error: 'Não é possível modificar uma conta super_admin.' }, { status: 403 })
        }

        // Promote and RESET password (they must set a new one on next login)
        const updated = await prisma.usuario.update({
            where: { id: userId },
            data: {
                tipo: novoTipo,
                senha: null, // forces first-access password setup
            },
            select: { id: true, nome: true, email: true, tipo: true }
        })

        // Clear all their active sessions to force re-login through setup flow
        await prisma.session.deleteMany({ where: { userId } })

        return NextResponse.json({
            success: true,
            usuario: updated,
            message: `${updated.nome} foi promovido(a) a ${novoTipo}. A senha foi zerada — eles deverão criar uma nova no próximo login.`
        })
    } catch (error) {
        console.error('Admin promote error:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
