import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { encrypt } from '@/lib/auth'
import { authRateLimiter, rateLimitCheck } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitResult = await rateLimitCheck(authRateLimiter, ip);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: "Muitas tentativas. Tente novamente em 1 minuto." },
                { status: 429, headers: rateLimitResult.headers as any }
            );
        }

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

        const ADMIN_TYPES = ['moderador', 'admin', 'super_admin']

        if (!usuario) {
            return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
        }

        // Admin first-access: no password set yet — allow login and direct to setup
        if (!usuario.senha && ADMIN_TYPES.includes(usuario.tipo)) {
            const sessionData = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                foto: usuario.foto_perfil,
            }
            const sessionToken = await encrypt(sessionData)
            const cookieStore = await cookies()
            cookieStore.set('whodo_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 1, // 1 day only for setup flow
                path: '/',
            })
            return NextResponse.json({ user: sessionData, needsSetup: true })
        }

        if (!usuario.senha) {
            return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if (!senhaValida) {
            return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
        }

        // Criar sessão de segurança usando JWT
        const sessionData = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            foto: usuario.foto_perfil,
        }

        const sessionToken = await encrypt(sessionData)

        const cookieStore = await cookies()
        cookieStore.set('whodo_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return NextResponse.json({ user: sessionData })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
