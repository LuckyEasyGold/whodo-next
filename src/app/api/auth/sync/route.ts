import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
    try {
        // Pega a sessão do NextAuth
        const session = await auth()

        // Debug - ver o que está na sessão
        console.log("Session no sync:", JSON.stringify(session))

        // Verificar se tem email - pode estar em diferentes lugares
        const email = session?.user?.email

        if (!email) {
            console.log("Email não encontrado na sessão")
            return NextResponse.redirect(new URL('/login?error=OauthSessionFailed', req.url))
        }

        // Busca o usuário no banco
        const dbUser = await prisma.usuario.findUnique({
            where: { email }
        })

        if (!dbUser) {
            console.log("Usuário não encontrado no banco:", email)
            return NextResponse.redirect(new URL('/login?error=DatabaseUserMissing', req.url))
        }

        // Configura o payload do nosso sistema
        const sessionData = {
            id: dbUser.id,
            nome: dbUser.nome,
            email: dbUser.email,
            tipo: dbUser.tipo,
            foto: dbUser.foto_perfil,
        }

        const sessionToken = await encrypt(sessionData)

        // Aplica o Cookie
        const cookieStore = await cookies()
        cookieStore.set('whodo_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        // Redireciona para home
        return NextResponse.redirect(new URL('/', req.url))

    } catch (e) {
        console.error('Erro crítico no sync final (Auth):', e)
        return NextResponse.redirect(new URL('/login?error=SyncCrash', req.url))
    }
}
