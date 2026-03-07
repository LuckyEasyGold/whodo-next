// src/lib/security-logger.ts
export function logSecurityEvent(
    event: string,
    details: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        event,
        details,
        severity,
        ip: details.ip || 'unknown'
    };

    // Em produção, envie para serviço de logs (Datadog, LogRocket, etc)
    if (process.env.NODE_ENV === 'production') {
        console.error(`[SECURITY ${severity.toUpperCase()}] ${event}`, logEntry);
    } else {
        console.log(`[SECURITY] ${event}`, details);
    }
}
