import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { uploadImageToSupabase } from '@/lib/supabase'

export async function POST(req: Request) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

        const formData = await req.formData()
        const files = formData.getAll('files') as File[]
        const albumIdRaw = formData.get('album_id')
        const albumId = albumIdRaw ? parseInt(albumIdRaw.toString()) : null

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
        }

        const uploadedItems = []

        for (const file of files) {
            const isVideo = file.type.startsWith('video/')
            const isDocument = file.type === 'application/pdf' || !!file.name.match(/\.(pdf|docx?|xlsx?|pptx?|txt)$/i)
            const tipo = isVideo ? 'video' : isDocument ? 'documento' : 'imagem'

            const safeFilename = file.name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')   // remove accents
                .replace(/[^\w.\-]/g, '-')          // replace unsafe chars with dash
                .replace(/-{2,}/g, '-')             // collapse multiple dashes
            const filename = `${session.id}-${Date.now()}-${safeFilename}`
            const filepath = `portfolio/${filename}`

            const { url, error } = await uploadImageToSupabase(file, 'whodo-images', filepath)

            if (error || !url) {
                console.error('Supabase upload error for portfolio file:', error)
                return NextResponse.json({ error: 'Erro ao fazer upload do arquivo' }, { status: 500 })
            }

            const record = await prisma.portfolioMedia.create({
                data: {
                    usuario_id: session.id,
                    album_id: albumId,
                    url,
                    tipo,
                }
            })

            // Update album cover if it has none yet
            if (albumId && tipo !== 'documento') {
                await prisma.portfolioAlbum.updateMany({
                    where: { id: albumId, capa_url: null },
                    data: { capa_url: url }
                })
            }

            uploadedItems.push(record)
        }

        return NextResponse.json({ success: true, uploaded: uploadedItems }, { status: 201 })

    } catch (error: unknown) {
        console.error('Upload portfólio error:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
