import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { id } = await params
        const mediaId = parseInt(id)

        const media = await prisma.portfolioMedia.findUnique({
            where: { id: mediaId }
        })

        if (!media) {
            return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
        }

        if (media.usuario_id !== session.id) {
            return NextResponse.json({ error: 'Você não tem permissão para excluir este item' }, { status: 403 })
        }

        // Excluir do DB
        await prisma.portfolioMedia.delete({
            where: { id: mediaId }
        })

        // Tenta excluir o arquivo físico (se for um arquivo local e não external URL)
        if (media.url.startsWith('/uploads/')) {
            try {
                const filepath = path.join(process.cwd(), 'public', media.url)
                await unlink(filepath)
            } catch (err) {
                console.error('File unlink error:', err)
                // We proceed since DB was deleted
            }
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Erro ao deletar portfólio:', error)
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { id } = await params
        const mediaId = parseInt(id)

        const body = await req.json()
        const { titulo, descricao, citacao } = body

        const media = await prisma.portfolioMedia.findUnique({
            where: { id: mediaId }
        })

        if (!media) {
            return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
        }

        if (media.usuario_id !== session.id) {
            return NextResponse.json({ error: 'Você não tem permissão para editar este item' }, { status: 403 })
        }

        const updated = await prisma.portfolioMedia.update({
            where: { id: mediaId },
            data: { titulo, descricao, citacao }
        })

        return NextResponse.json({ success: true, media: updated })

    } catch (error: any) {
        console.error('Erro ao editar portfólio:', error)
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
    }
}
