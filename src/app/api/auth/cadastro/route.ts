import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const { nome, email, senha, telefone, tipo, cidade, estado } = await request.json()

        if (!nome || !email || !senha) {
            return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 })
        }

        // Verificar se email já existe
        const existe = await prisma.usuario.findUnique({ where: { email } })
        if (existe) {
            return NextResponse.json({ error: 'Este e-mail já está cadastrado' }, { status: 409 })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                telefone: telefone || null,
                tipo: 'usuario',
                cidade: cidade || null,
                estado: estado || null,
                status: 'ativo',
                email_verificado: false,
            },
        })

        // Auto-login após cadastro
        const sessionData = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            foto: usuario.foto_perfil,
        }

        const cookieStore = await cookies()
        cookieStore.set('whodo_session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return NextResponse.json({ user: sessionData }, { status: 201 })
    } catch (error) {
        console.error('Cadastro error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
