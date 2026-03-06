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
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies()
    const session = cookieStore.get('whodo_session')?.value

    if (!session) return null

    try {
        const payload = await decrypt(session)
        if (!payload) return null
        return payload as unknown as SessionUser
    } catch {
        return null
    }
}
