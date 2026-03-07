import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/auth"
import { cookies } from "next/headers"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
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

                // Criar a SESSÃO CUSTOMIZADA (mesma de login convencional)
                const sessionData = {
                    id: dbUser.id,
                    nome: dbUser.nome,
                    email: dbUser.email,
                    tipo: dbUser.tipo,
                    foto: dbUser.foto_perfil,
                };

                const sessionToken = await encrypt(sessionData);

                // Manter exatamente a mesma estrutura do seu login atual
                const cookieStore = await cookies();
                cookieStore.set('whodo_session', sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: '/',
                });

                // Permite que o NextAuth termine o fluxo também silenciosamente
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
            // Force redirection to home page after successful login
            return baseUrl;
        }
    },
    session: {
        strategy: "database"
    }
})
