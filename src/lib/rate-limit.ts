// src/lib/rate-limit.ts
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Configuração em memória (sem dependência do Redis)
// Útil para single-instance ou edge functions com estado local efêmero

// Rate limit para autenticação: 5 tentativas por minuto
export const authRateLimiter = new RateLimiterMemory({
    points: 5,        // 5 requests
    duration: 60,     // per 60 seconds by IP
});

// Rate limit para API geral: 100 requisições por minuto
export const apiRateLimiter = new RateLimiterMemory({
    points: 100,      // 100 requests
    duration: 60,     // per 60 seconds by IP
});

// Rate limit para upload: 10 uploads por minuto
export const uploadRateLimiter = new RateLimiterMemory({
    points: 10,       // 10 requests
    duration: 60,     // per 60 seconds by IP
});

// Middleware helper
export async function rateLimitCheck(
    limiter: RateLimiterMemory,
    identifier: string
) {
    try {
        const rateLimiterRes = await limiter.consume(identifier, 1);
        return {
            success: true,
            headers: {
                "X-RateLimit-Limit": String(limiter.points),
                "X-RateLimit-Remaining": String(rateLimiterRes.remainingPoints),
                "X-RateLimit-Reset": String(new Date(Date.now() + rateLimiterRes.msBeforeNext).getTime()),
            }
        }
    } catch (rateLimiterRes: any) {
        return {
            success: false,
            headers: {
                "Retry-After": String(Math.round(rateLimiterRes.msBeforeNext / 1000) || 1),
                "X-RateLimit-Limit": String(limiter.points),
                "X-RateLimit-Remaining": String(rateLimiterRes.remainingPoints),
                "X-RateLimit-Reset": String(new Date(Date.now() + rateLimiterRes.msBeforeNext).getTime()),
            }
        }
    }
}
