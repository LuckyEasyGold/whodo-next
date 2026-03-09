import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

        await prisma.usuario.update({
            where: { id: session.id },
            data: { status: 'inativo' }
        })

        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
