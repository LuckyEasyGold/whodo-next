import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import authOptions from '@/lib/auth-options'

export async function GET(req: Request) {
    try {
        // Valida se a sessão do NextAuth foi gerada com sucesso
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.redirect(new URL('/login?error=OauthSessionFailed', req.url))
        }

        // Busca o usuário recém-criado/verificado no signIn provider (auth.ts)
        const dbUser = await prisma.usuario.findUnique({
            where: { email: session.user.email }
        })

        if (!dbUser) {
            return NextResponse.redirect(new URL('/login?error=DatabaseUserMissing', req.url))
        }

        // Configura o payload estrito do nosso sistema (mesmo do tradicional)
        const sessionData = {
            id: dbUser.id,
            nome: dbUser.nome,
            email: dbUser.email,
            tipo: dbUser.tipo,
            foto: dbUser.foto_perfil,
        };

        const sessionToken = await encrypt(sessionData);

        // Aplica o Cookie de forma limpa, já que isso é um Route Handler padrão Next.js
        const cookieStore = await cookies();
        cookieStore.set('whodo_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        // Redireciona o usuário perfeitamente autenticado para o Dashboard/Home
        return NextResponse.redirect(new URL('/', req.url))

    } catch (e) {
        console.error('Erro crítico no sync final (Auth):', e)
        return NextResponse.redirect(new URL('/login?error=SyncCrash', req.url))
    }
}
