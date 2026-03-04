import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const { email, senha } = await request.json()

        if (!email || !senha) {
            return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 })
        }

        // Busca por email ou nome
        const usuario = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { email: email },
                    { nome: email },
                ],
                status: 'ativo',
            },
        })

        if (!usuario || !usuario.senha) {
            return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if (!senhaValida) {
            return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
        }

        // Criar sessão simples via cookie
        const sessionData = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            foto: usuario.foto_perfil,
        }

        const cookieStore = await cookies()
        cookieStore.set('whodo_session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return NextResponse.json({ user: sessionData })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
