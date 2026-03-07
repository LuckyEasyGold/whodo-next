import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')

        if (!token) {
            return NextResponse.redirect(new URL('/login?error=TokenInválido', request.url))
        }

        const usuario = await prisma.usuario.findFirst({
            where: { token_verificacao: token }
        })

        if (!usuario) {
            return NextResponse.redirect(new URL('/login?error=TokenInvalidoOuExpirado', request.url))
        }

        if (usuario.email_verificado) {
            return NextResponse.redirect(new URL('/login?info=EmailJaVerificado', request.url))
        }

        await prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                email_verificado: true,
                token_verificacao: null
            }
        })

        return NextResponse.redirect(new URL('/login?success=EmailConfirmado', request.url))
    } catch (error) {
        console.error('Error in email verification:', error)
        return NextResponse.redirect(new URL('/login?error=ErroInterno', request.url))
    }
}
