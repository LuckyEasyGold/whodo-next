// src/middleware.ts - MITIGAÇÃO CVE-2025-29927
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logSecurityEvent } from '@/lib/security-logger';

export function middleware(request: NextRequest) {
    // BLOQUEIO DE EMERGÊNCIA - Remove header de ataque antes de processar
    const headers = new Headers(request.headers);

    // Remove qualquer variação do header de ataque
    headers.delete('x-middleware-subrequest');
    headers.delete('x-middleware-subrequest-id');
    headers.delete('X-Middleware-Subrequest');

    const maliciousHeader = request.headers.get('x-middleware-subrequest');
    if (maliciousHeader) {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        logSecurityEvent('MIDDLEWARE_BYPASS_ATTEMPT', { ip, headers: request.headers }, 'critical');
        return new NextResponse('Acesso negado - Security violation detected', {
            status: 403,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Seu middleware de autenticação normal aqui...

    return NextResponse.next({
        request: {
            headers,
        },
    });
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
