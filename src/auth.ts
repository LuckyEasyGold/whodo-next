import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// Debug
console.log("Prisma client:", prisma ? "definido" : "undefined")

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
    events: {
        async createUser({ user }) {
            // Enviar email de boas-vindas quando usuário é criado via OAuth
            if (user.email) {
                console.log("Novo usuário criado via OAuth:", user.email)
            }
        },
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user?.email) {
                // Adicionar ID do usuário na sessão
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
