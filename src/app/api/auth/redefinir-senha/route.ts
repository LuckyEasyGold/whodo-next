import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

import { apiRateLimiter } from '@/lib/rate-limit'

export async function POST(req: Request) {
    try {
        // Rate Limiting anti-bruteforce nas redefinições
        try {
            const ip = req.headers.get('x-forwarded-for') || 'unknown'
            await apiRateLimiter.consume(ip)
        } catch {
            return NextResponse.json(
                { error: 'Muitas tentativas. Tente novamente mais tarde.' },
                { status: 429 }
            )
        }

        const { token, senha } = await req.json()

        if (!token || !senha) {
            return NextResponse.json({ error: 'Token e nova senha são obrigatórios' }, { status: 400 })
        }

        if (senha.length < 6) {
            return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 })
        }

        // Buscar usuário que tem esse token e verificar se não expirou
        const user = await prisma.usuario.findFirst({
            where: {
                reset_token: token,
                reset_token_expires: {
                    gt: new Date() // Tem que ser MAIOR que a data/hora atual (ex: futuro)
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Token inválido ou expirado. Solicite a recuperação novamente.' },
                { status: 400 }
            )
        }

        // Hashear nova senha
        const hashedPassword = await bcrypt.hash(senha, 12)

        // Atualizar banco (zerar token também)
        await prisma.usuario.update({
            where: { id: user.id },
            data: {
                senha: hashedPassword,
                reset_token: null,
                reset_token_expires: null
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Password reset apply error:', error)
        return NextResponse.json(
            { error: 'Erro interno ao redefinir senha' },
            { status: 500 }
        )
    }
}
