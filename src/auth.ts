import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
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
    // Sem PrismaAdapter por enquanto - vamos testar assim
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false

            try {
                // Verificar se usuário já existe
                let dbUser = await prisma.usuario.findUnique({
                    where: { email: user.email }
                })

                // Se não existe, criar
                if (!dbUser) {
                    dbUser = await prisma.usuario.create({
                        data: {
                            email: user.email,
                            nome: user.name || "Usuário",
                            foto_perfil: user.image || null,
                            status: 'ativo',
                            tipo: 'usuario',
                            email_verificado: true
                        }
                    })
                }

                // Criar/actualizar conta OAuth
                if (account) {
                    await prisma.account.upsert({
                        where: {
                            provider_providerAccountId: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId
                            }
                        },
                        create: {
                            userId: dbUser.id,
                            type: account.type || 'oauth',
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refresh_token: account.refresh_token,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                        },
                        update: {
                            refresh_token: account.refresh_token,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                        }
                    })
                }

                return true
            } catch (error) {
                console.error("Erro no login OAuth:", error)
                return false
            }
        },
        async jwt({ token, user, account }) {
            // Adicionar ID do usuário ao token
            if (user?.email) {
                const dbUser = await prisma.usuario.findUnique({
                    where: { email: user.email },
                    select: { id: true }
                })
                if (dbUser) {
                    token.id = dbUser.id
                }
            }
            return token
        },
        async session({ session, token }) {
            // Adicionar ID do usuário à sessão
            if (token?.id) {
                (session.user as any).id = token.id
            }
            return session
        }
    },
    session: {
        strategy: "jwt"
    }
})
