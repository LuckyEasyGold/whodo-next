import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const ADMIN_TYPES = ['admin', 'super_admin']

export async function GET() {
    try {
        const session = await getSession()
        if (!session || !ADMIN_TYPES.includes(session.tipo)) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const now = new Date()
        const last7 = new Date(now)
        last7.setDate(last7.getDate() - 7)
        const last30 = new Date(now)
        last30.setDate(last30.getDate() - 30)

        const [
            total,
            ativos,
            inativos,
            verificados,
            perfilCompleto,
            ultimos7,
            ultimos30,
            comTelefone,
            comEspecialidade,
            comFoto,
        ] = await Promise.all([
            // Total (excluding system accounts)
            prisma.usuario.count({ where: { tipo: { notIn: ['super_admin'] } } }),
            prisma.usuario.count({ where: { status: 'ativo', tipo: { notIn: ['super_admin'] } } }),
            prisma.usuario.count({ where: { status: 'inativo', tipo: { notIn: ['super_admin'] } } }),
            prisma.usuario.count({ where: { email_verificado: true, tipo: { notIn: ['super_admin'] } } }),
            // Profile considered "complete" if has: telefone + cidade + especialidade
            prisma.usuario.count({
                where: {
                    tipo: { notIn: ['super_admin'] },
                    telefone: { not: null },
                    cidade: { not: null },
                    especialidade: { not: null },
                }
            }),
            prisma.usuario.count({
                where: {
                    tipo: { notIn: ['super_admin'] },
                    created_at: { gte: last7 }
                }
            }),
            prisma.usuario.count({
                where: {
                    tipo: { notIn: ['super_admin'] },
                    created_at: { gte: last30 }
                }
            }),
            prisma.usuario.count({ where: { telefone: { not: null }, tipo: { notIn: ['super_admin'] } } }),
            prisma.usuario.count({ where: { especialidade: { not: null }, tipo: { notIn: ['super_admin'] } } }),
            prisma.usuario.count({ where: { foto_perfil: { not: null }, tipo: { notIn: ['super_admin'] } } }),
        ])

        return NextResponse.json({
            total,
            ativos,
            inativos,
            verificados,
            perfilCompleto,
            ultimos7,
            ultimos30,
            comTelefone,
            comEspecialidade,
            comFoto,
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
