import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

        const { novoEmail } = await request.json()

        if (!novoEmail || !novoEmail.includes('@')) {
            return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
        }

        const emailExists = await prisma.usuario.findUnique({
            where: { email: novoEmail }
        })

        if (emailExists) {
            return NextResponse.json({ error: 'Este e-mail já está em uso por outra conta.' }, { status: 400 })
        }

        const dbUser = await prisma.usuario.update({
            where: { id: session.id },
            data: { email: novoEmail, email_verificado: false }
        })

        // Refresh session cookie to update the email
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

        return NextResponse.json({ success: true, message: 'E-mail atualizado com sucesso!' })
    } catch (e: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
