import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/email"

// Verificar se as variáveis necessárias existem
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
if (!authSecret) {
    console.warn("AVISO: AUTH_SECRET ou NEXTAUTH_SECRET não está definido!")
}

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
            if (!user.email) return false;

            try {
                let dbUser = await prisma.usuario.findUnique({
                    where: { email: user.email }
                });

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
                    });

                    sendWelcomeEmail(dbUser.email, dbUser.nome).catch(err => {
                        console.error('Erro ao enviar boas-vindas social:', err);
                    });
                }

                return true;
            } catch (error) {
                console.error("Erro no interceptador do Login Social:", error);
                return false;
            }
        },
        async session({ session, user }) {
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.includes('/api/auth/sync')) return url;
            return baseUrl;
        }
    },
    session: {
        strategy: "jwt"
    }
})
