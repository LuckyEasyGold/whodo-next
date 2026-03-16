import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { calcularTitulo } from '@/lib/ranking'

// GET /api/ranking — calcula o ranking de contratos por percentil para o usuário logado
export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Conta contratos concluídos por usuário (como prestador)
        const ranking = await prisma.agendamento.groupBy({
            by: ['prestador_id'],
            where: { status: 'concluido' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        })

        const total = ranking.length
        const minhaPos = ranking.findIndex(r => r.prestador_id === session.id)
        const meuTotal = minhaPos >= 0 ? ranking[minhaPos]._count.id : 0

        // posicao é 1-indexed
        const titulo = minhaPos >= 0 ? calcularTitulo(minhaPos + 1, total) : null

        return NextResponse.json({
            titulo,
            totalContratos: meuTotal,
            posicao: minhaPos >= 0 ? minhaPos + 1 : null,
            totalUsuariosRanking: total,
        })
    } catch (error) {
        console.error('Erro ao calcular ranking:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
