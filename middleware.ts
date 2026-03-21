import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Rotas que são SEMPRE públicas (não requerem login)
        const publicRoutes = [
            "/",              // Home (Obrigatório ser pública para o Google)
            "/login",
            "/cadastro",
            "/buscar",        // Busca pública de profissionais
            "/api/auth",      // Rotas de autenticação
            "/termos",        // Termos de uso (Recomendado)
            "/privacidade"    // Política de privacidade (Recomendado)
        ];
    // Permitir APIs de autenticação SEMPRE
        if (pathname.startsWith("/api/auth")) {
            return NextResponse.next();
        }

    // Verifica se a rota atual começa com alguma das rotas públicas
        const isPublic = publicRoutes.some(
            (route) => pathname === route || pathname.startsWith(route)
        );

    // 2. Verifica se o usuário tem o cookie de sessão
        const hasSession = 
        request.cookies.has("whodo_session") || 
        request.cookies.has("__Secure-next-auth.session-token") ||
        request.cookies.has("next-auth.session-token");

    // 3. Lógica de Redirecionamento

    // Se tentar acessar rota protegida sem sessão -> Login
        if (!isPublic && !hasSession) {
            const loginUrl = new URL("/login", request.url);
            // Opcional: Salvar a URL de retorno
            // loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

    // Se já estiver logado e tentar acessar login/cadastro -> Dashboard
        if (hasSession && (pathname === "/login" || pathname === "/cadastro")) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

    return NextResponse.next();
}
 // Aplica o middleware em todas as rotas, exceto arquivos estáticos,imagens, favicon e API interna do Next
    export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)"

    ],
};