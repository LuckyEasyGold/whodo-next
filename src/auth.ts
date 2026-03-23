import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID as string,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET as string,
        })
    ],
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Verificar se o usuário já existe no banco pelo email
            if (user.email) {
                const existingUser = await prisma.usuario.findUnique({
                    where: { email: user.email }
                })

                // Se o usuário existe mas não tem conta OAuth vinculada, vinculamos
                if (existingUser) {
                    // Verificar se já existe conta vinculada a este provider
                    const existingAccount = await prisma.account.findFirst({
                        where: {
                            provider: account?.provider,
                            providerAccountId: account?.providerAccountId
                        }
                    })

                    // Se não existe conta vinculada, cria
                    if (!existingAccount) {
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                type: account?.type || 'oauth',
                                provider: account?.provider || 'google',
                                providerAccountId: account?.providerAccountId || '',
                                refresh_token: account?.refresh_token,
                                access_token: account?.access_token,
                                expires_at: account?.expires_at,
                                token_type: account?.token_type,
                                scope: account?.scope,
                                id_token: account?.id_token,
                            }
                        })
                    }
                    return true
                }
            }
            return true
        },
        async session({ session, token }) {
            // Adicionar ID do usuário na sessão
            if (session.user?.email && token.sub) {
                const dbUser = await prisma.usuario.findUnique({
                    where: { email: session.user.email },
                    select: { id: true }
                })
                if (dbUser && session.user) {
                    (session.user as any).id = dbUser.id
                }
            }
            return session
        }
    },
    session: {
        strategy: "jwt"
    }
})
