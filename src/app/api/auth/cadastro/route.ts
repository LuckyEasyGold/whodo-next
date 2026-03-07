import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { authRateLimiter, rateLimitCheck } from '@/lib/rate-limit'
import { sendVerificationEmail } from '@/lib/email'
import { randomUUID } from 'crypto'

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

        const { nome, email, senha, telefone, tipo, cidade, estado } = await request.json()

        if (!nome || !email || !senha) {
            return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 })
        }

        // Verificar se email já existe
        const existe = await prisma.usuario.findUnique({ where: { email } })
        if (existe) {
            return NextResponse.json({ error: 'Este e-mail já está cadastrado' }, { status: 409 })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const tokenVerificacao = randomUUID()

        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                telefone: telefone || null,
                tipo: 'usuario',
                cidade: cidade || null,
                estado: estado || null,
                status: 'ativo',
                email_verificado: false,
                token_verificacao: tokenVerificacao,
            },
        })

        // Envia email de verificação assincronamente (sem prender a requisição)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const verifyLink = `${appUrl}/api/auth/verificar-email?token=${tokenVerificacao}`
        sendVerificationEmail(email, verifyLink, nome).catch(err => {
            console.error('Erro ao chamar sendVerificationEmail:', err)
        })

        // Auto-login após cadastro
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
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return NextResponse.json({ user: sessionData }, { status: 201 })
    } catch (error) {
        console.error('Cadastro error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
