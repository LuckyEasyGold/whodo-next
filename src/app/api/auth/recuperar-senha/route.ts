import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import jwt from 'jsonwebtoken'

// Necessitamos do rate limiter já configurado do projeto
import { apiRateLimiter } from '@/lib/rate-limit'

export async function POST(req: Request) {
    try {
        // Rate Limiting para evitar spam de emails
        try {
            const ip = req.headers.get('x-forwarded-for') || 'unknown'
            await apiRateLimiter.consume(ip)
        } catch {
            return NextResponse.json(
                { error: 'Muitas tentativas. Tente novamente mais tarde.' },
                { status: 429 }
            )
        }

        const { email } = await req.json()
        if (!email) {
            return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
        }

        // Verifica se usuário existe
        const user = await prisma.usuario.findUnique({
            where: { email },
            select: { id: true, nome: true, email: true }
        })

        if (!user) {
            // Retorna sucesso igual por segurança (não revelar se o email existe)
            return NextResponse.json({ success: true })
        }

        // Gera Token Unico válido por 1Hora
        const resetToken = jwt.sign(
            { id: user.id },
            process.env.NEXTAUTH_SECRET || 'whodo-secret',
            { expiresIn: '1h' }
        )

        // Salva token no banco
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1H
        await prisma.usuario.update({
            where: { id: user.id },
            data: {
                reset_token: resetToken,
                reset_token_expires: expiresAt
            }
        })

        // Constrói link apontando pro FrontEnd
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const resetLink = `${baseUrl}/redefinir-senha?token=${resetToken}`

        // Envia E-mail via Resend
        await sendPasswordResetEmail(user.email, resetLink, user.nome)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Password reset request error:', error)
        return NextResponse.json(
            { error: 'Erro interno ao processar solicitação' },
            { status: 500 }
        )
    }
}
