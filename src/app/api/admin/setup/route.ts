import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, encrypt } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const ADMIN_TYPES = ['moderador', 'admin', 'super_admin']

// POST /api/admin/setup — Set password for first-access admin/moderator
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        // Must be logged in as admin type (but without password yet for first-access)
        if (!session || !ADMIN_TYPES.includes(session.tipo)) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const { senha, confirmarSenha } = await request.json()

        if (!senha || senha.length < 8) {
            return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres.' }, { status: 400 })
        }

        if (senha !== confirmarSenha) {
            return NextResponse.json({ error: 'As senhas não coincidem.' }, { status: 400 })
        }

        // Check that the user actually has no password (first access)
        const dbUser = await prisma.usuario.findUnique({
            where: { id: session.id },
            select: { id: true, nome: true, email: true, tipo: true, senha: true, foto_perfil: true }
        })

        if (!dbUser) {
            return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
        }

        if (dbUser.senha !== null) {
            return NextResponse.json({ error: 'Senha já definida. Use a recuperação de senha se precisar alterar.' }, { status: 400 })
        }

        const hash = await bcrypt.hash(senha, 10)

        await prisma.usuario.update({
            where: { id: dbUser.id },
            data: { senha: hash }
        })

        // Refresh session cookie to mark setup as complete
        const sessionData = {
            id: dbUser.id,
            nome: dbUser.nome,
            email: dbUser.email,
            tipo: dbUser.tipo,
            foto: dbUser.foto_perfil,
        }
        const token = await encrypt(sessionData)
        const cookieStore = await cookies()
        cookieStore.set('whodo_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return NextResponse.json({ success: true, message: 'Senha definida com sucesso!' })
    } catch (error) {
        console.error('Admin setup error:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
