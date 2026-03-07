import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

export type SessionUser = {
    id: number
    nome: string
    email: string
    tipo: string
    foto: string | null
}

const secretKey = process.env.NEXTAUTH_SECRET
if (!secretKey) throw new Error("NEXTAUTH_SECRET is not set")

const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .setAudience("whodo-app")
        .setIssuer("whodo-auth")
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
            audience: "whodo-app",
            issuer: "whodo-auth",
        })
        return payload
    } catch (error) {
        return null
    }
}

const COOKIE_NAME = "whodo_session";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
};

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value

    if (!sessionCookie) return null

    try {
        const payload = await decrypt(sessionCookie)
        if (!payload) return null

        // Verifica se token não está expirado (double check)
        if (payload.exp && (payload.exp as number) * 1000 < Date.now()) {
            return null;
        }

        return payload as unknown as SessionUser
    } catch {
        return null
    }
}
