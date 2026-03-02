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

        const nome = formData.get('nome') as string
        const nome_fantasia = formData.get('nome_fantasia') as string | null
        const documento = formData.get('documento') as string | null
        const telefone = formData.get('telefone') as string | null
        const cidade = formData.get('cidade') as string | null
        const estado = formData.get('estado') as string | null

        const especialidade = formData.get('especialidade') as string | null
        const sobre = formData.get('sobre') as string | null
        const disponibilidade = formData.get('disponibilidade') as string | null

        const website = formData.get('website') as string | null
        const linkedin = formData.get('linkedin') as string | null
        const facebook = formData.get('facebook') as string | null
        const instagram = formData.get('instagram') as string | null
        const youtube = formData.get('youtube') as string | null
        const tiktok = formData.get('tiktok') as string | null
        const kwai = formData.get('kwai') as string | null
        const perfil_academico = formData.get('perfil_academico') as string | null
        const foto = formData.get('foto') as File | null

        let fotoUrl = undefined

        if (foto && foto.size > 0) {
            const bytes = await foto.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Make sure the upload directory exists
            const uploadDir = path.join(process.cwd(), 'public/uploads/profile')
            try {
                await mkdir(uploadDir, { recursive: true })
            } catch (e) {
                // ignore if already exists
            }

            // Create a unique filename
            const filename = `${session.id}-${Date.now()}-${foto.name.replace(/\s+/g, '-')}`
            const filepath = path.join(uploadDir, filename)

            await writeFile(filepath, buffer)
            fotoUrl = `/uploads/profile/${filename}`
        }

        // Update the basic user info
        const updateData: any = {
            nome,
            nome_fantasia: nome_fantasia || null,
            documento: documento || null,
            telefone: telefone || null,
            cidade: cidade || null,
            estado: estado ? estado.toUpperCase() : null,
            especialidade: especialidade || null,
            sobre: sobre || null,
            disponibilidade: disponibilidade || null,
            website: website || null,
            linkedin: linkedin || null,
            facebook: facebook || null,
            instagram: instagram || null,
            youtube: youtube || null,
            tiktok: tiktok || null,
            kwai: kwai || null,
            perfil_academico: perfil_academico || null,
        }

        if (fotoUrl) {
            updateData.foto_perfil = fotoUrl
        }

        await prisma.usuario.update({
            where: { id: session.id },
            data: updateData
        })

        return NextResponse.json({ success: true, foto_perfil: fotoUrl })

    } catch (error: any) {
        console.error('Erro ao atualizar perfil:', error)
        return NextResponse.json({ error: 'Erro interno ao atualizar perfil' }, { status: 500 })
    }
}
