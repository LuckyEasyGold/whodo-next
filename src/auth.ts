import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/auth"
import { cookies } from "next/headers"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login', // Redireciona de volta com erro em caso de falha
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false;

            try {
                // Intercepta o login bem sucedido pelo provedor
                // Verifica se o usuário já existe na nossa tabela Custom
                let dbUser = await prisma.usuario.findUnique({
                    where: { email: user.email }
                });

                // Se o usuário não existir, cria a base dele como 'usuario' comum
                if (!dbUser) {
                    dbUser = await prisma.usuario.create({
                        data: {
                            email: user.email,
                            nome: user.name || "Usuário",
                            foto_perfil: user.image || null,
                            status: 'ativo',
                            tipo: 'usuario',
                            email_verificado: true // Já verificado pelo Google/Facebook
                        }
                    });
                }

                // Removida a configuração do cookie daqui porque o NextAuth blockeia cookies().set() nos headers de sua própria Response interna.
                // O JWT customizado será gerado pela rota /api/auth/sync para garantir o funcionamento.

                // Permite que o NextAuth termine o fluxo silenciosamente em JWT mode
                return true;
            } catch (error) {
                console.error("Erro no interceptador do Login Social:", error);
                return false;
            }
        },
        async session({ session, user }) {
            return session; // Apenas para compatibilidade da Interface
        },
        async redirect({ url, baseUrl }) {
            // Se vier redirect para '/api/auth/sync', respeita ele!
            if (url.includes('/api/auth/sync')) return url;
            return baseUrl;
        }
    },
    session: {
        strategy: "jwt"
    }
})
