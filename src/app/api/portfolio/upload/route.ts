import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const formData = await req.formData()
        const files = formData.getAll('files') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
        }

        const uploadDir = path.join(process.cwd(), 'public/uploads/portfolio')
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // ignore
        }

        const uploadedItems = []

        for (const file of files) {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Basic detect type
            const isVideo = file.type.startsWith('video/')
            const tipo = isVideo ? 'video' : 'imagem'

            const filename = `${session.id}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`
            const filepath = path.join(uploadDir, filename)

            await writeFile(filepath, buffer)
            const url = `/uploads/portfolio/${filename}`

            const record = await prisma.portfolioMedia.create({
                data: {
                    usuario_id: session.id,
                    url,
                    tipo
                }
            })

            uploadedItems.push(record)
        }

        return NextResponse.json({ success: true, uploaded: uploadedItems }, { status: 201 })

    } catch (error: any) {
        console.error('Upload portfólio error:', error)
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
    }
}
