import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/portfolio/albums — list all albums for the logged-in user
export async function GET() {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const albums = await prisma.portfolioAlbum.findMany({
        where: { usuario_id: session.id },
        orderBy: { created_at: 'desc' },
        include: {
            medias: {
                orderBy: { created_at: 'asc' },
                take: 1, // only the first media for cover preview
            },
            _count: { select: { medias: true } },
        },
    })

    return NextResponse.json({ albums })
}

// POST /api/portfolio/albums — create a new album
export async function POST(req: Request) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { nome, descricao } = await req.json()
    if (!nome?.trim()) return NextResponse.json({ error: 'Nome do álbum é obrigatório' }, { status: 400 })

    const album = await prisma.portfolioAlbum.create({
        data: {
            usuario_id: session.id,
            nome: nome.trim(),
            descricao: descricao?.trim() || null,
        },
        include: {
            medias: true,
            _count: { select: { medias: true } },
        },
    })

    return NextResponse.json({ album }, { status: 201 })
}
