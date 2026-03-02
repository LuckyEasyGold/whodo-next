import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/portfolio/albums/[id] — get a single album with all its media
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { id } = await params
    const album = await prisma.portfolioAlbum.findUnique({
        where: { id: parseInt(id) },
        include: { medias: { orderBy: { created_at: 'asc' } } },
    })

    if (!album) return NextResponse.json({ error: 'Álbum não encontrado' }, { status: 404 })
    if (album.usuario_id !== session.id) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

    return NextResponse.json({ album })
}

// PATCH /api/portfolio/albums/[id] — edit album name/description/cover
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { id } = await params
    const { nome, descricao, capa_url } = await req.json()

    const existing = await prisma.portfolioAlbum.findUnique({ where: { id: parseInt(id) } })
    if (!existing) return NextResponse.json({ error: 'Álbum não encontrado' }, { status: 404 })
    if (existing.usuario_id !== session.id) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

    const updated = await prisma.portfolioAlbum.update({
        where: { id: parseInt(id) },
        data: {
            ...(nome !== undefined && { nome: nome.trim() }),
            ...(descricao !== undefined && { descricao: descricao?.trim() || null }),
            ...(capa_url !== undefined && { capa_url }),
        },
    })

    return NextResponse.json({ album: updated })
}

// DELETE /api/portfolio/albums/[id] — delete album (cascades to media)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { id } = await params
    const existing = await prisma.portfolioAlbum.findUnique({ where: { id: parseInt(id) } })
    if (!existing) return NextResponse.json({ error: 'Álbum não encontrado' }, { status: 404 })
    if (existing.usuario_id !== session.id) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

    // Delete all media files in the album first
    await prisma.portfolioMedia.deleteMany({ where: { album_id: parseInt(id) } })
    await prisma.portfolioAlbum.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ ok: true })
}
