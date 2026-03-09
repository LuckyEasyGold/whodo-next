import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

        const { senhaAtual, novaSenha } = await request.json()

        if (!novaSenha || novaSenha.length < 8) {
            return NextResponse.json({ error: 'A nova senha deve ter pelo menos 8 caracteres.' }, { status: 400 })
        }

        const dbUser = await prisma.usuario.findUnique({
            where: { id: session.id },
            select: { id: true, senha: true }
        })

        if (!dbUser) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })

        if (dbUser.senha) {
            // Conta normal, tem senha, compara a senha atual
            const match = await bcrypt.compare(senhaAtual, dbUser.senha)
            if (!match) {
                return NextResponse.json({ error: 'Senha atual incorreta.' }, { status: 400 })
            }
        } else {
            // Conta social q não tem senha, estamos definindo a primeira senha; então senhaAtual é opcional/ignorada
            // (Mas vamos prevenir que ele deixe em branco caso queiramos cobrar isso antes)
        }

        const hash = await bcrypt.hash(novaSenha, 10)

        await prisma.usuario.update({
            where: { id: dbUser.id },
            data: { senha: hash }
        })

        return NextResponse.json({ success: true, message: 'Senha atualizada com sucesso!' })
    } catch (e: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
