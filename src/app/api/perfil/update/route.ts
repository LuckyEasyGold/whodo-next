import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { uploadImageToSupabase } from '@/lib/supabase'

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
        const cep = formData.get('cep') as string | null
        const endereco = formData.get('endereco') as string | null
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
            const safeFilename = foto.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
            const filename = `${session.id}-${Date.now()}-${safeFilename}`
            const filepath = `profile/${filename}`

            const { url, error } = await uploadImageToSupabase(foto, 'whodo-images', filepath)

            if (error) {
                console.error('Supabase upload error:', error)
                return NextResponse.json({ error: 'Erro ao fazer upload da imagem.' }, { status: 500 })
            }

            if (url) {
                fotoUrl = url
            }
        }

        // Geocode the address if it changed or exists
        let latitude = null
        let longitude = null
        if (endereco && cidade && estado) {
            try {
                // Formatting for Nominatim: "Street, City, State, Brazil"
                const q = encodeURIComponent(`${endereco}, ${cidade}, ${estado}, Br`)
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`, {
                    headers: {
                        'User-Agent': 'WhodoApp/1.0'
                    }
                })
                const geoData = await geoRes.json()
                if (geoData && geoData.length > 0) {
                    latitude = parseFloat(geoData[0].lat)
                    longitude = parseFloat(geoData[0].lon)
                } else {
                    // Fallback to exactly city and state
                    const qFallback = encodeURIComponent(`${cidade}, ${estado}, Br`)
                    const geoResFallback = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${qFallback}&limit=1`, {
                        headers: {
                            'User-Agent': 'WhodoApp/1.0'
                        }
                    })
                    const geoDataFallback = await geoResFallback.json()
                    if (geoDataFallback && geoDataFallback.length > 0) {
                        latitude = parseFloat(geoDataFallback[0].lat)
                        longitude = parseFloat(geoDataFallback[0].lon)
                    }
                }
            } catch (err) {
                console.error("Geocoding failed during profile update:", err)
            }
        }


        // Update the basic user info
        const updateData: any = {
            nome,
            nome_fantasia: nome_fantasia || null,
            documento: documento || null,
            telefone: telefone || null,
            cep: cep || null,
            endereco: endereco || null,
            cidade: cidade || null,
            estado: estado ? estado.toUpperCase() : null,
            latitude: latitude !== null ? latitude : undefined,
            longitude: longitude !== null ? longitude : undefined,
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
