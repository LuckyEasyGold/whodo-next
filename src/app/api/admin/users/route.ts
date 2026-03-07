import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const ADMIN_TYPES = ['admin', 'super_admin']
const PAGE_SIZE = 20

export async function GET(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || !ADMIN_TYPES.includes(session.tipo)) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const status = searchParams.get('status') || ''
        const tipo = searchParams.get('tipo') || ''
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))

        const where: any = {
            tipo: { notIn: ['super_admin'] }, // never show system accounts
        }

        if (search) {
            where.OR = [
                { nome: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { telefone: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (status) {
            where.status = status
        }

        if (tipo && tipo !== 'todos') {
            where.tipo = tipo
        }

        const [usuarios, totalCount] = await Promise.all([
            prisma.usuario.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
                select: {
                    id: true,
                    nome: true,
                    nome_fantasia: true,
                    email: true,
                    telefone: true,
                    cidade: true,
                    estado: true,
                    tipo: true,
                    status: true,
                    email_verificado: true,
                    verificado: true,
                    especialidade: true,
                    foto_perfil: true,
                    created_at: true,
                    // NEVER include: senha, reset_token, token_verificacao
                }
            }),
            prisma.usuario.count({ where }),
        ])

        return NextResponse.json({
            usuarios,
            total: totalCount,
            pagina: page,
            totalPaginas: Math.ceil(totalCount / PAGE_SIZE),
        })
    } catch (error) {
        console.error('Admin users list error:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
