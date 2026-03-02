import { cookies } from 'next/headers'

export type SessionUser = {
    id: number
    nome: string
    email: string
    tipo: string
    foto: string | null
}

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies()
    const session = cookieStore.get('whodo_session')
    if (!session) return null
    try {
        return JSON.parse(session.value) as SessionUser
    } catch {
        return null
    }
}
