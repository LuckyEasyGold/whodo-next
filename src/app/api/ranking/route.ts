import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/ranking — calcula o ranking de contratos por percentil para o usuário logado
// Títulos (do mais exclusivo ao mais comum):
//   Diamante  → top 5%
//   Ouro      → top 6–10%
//   Prata     → top 11–15%
//   Bronze    → top 16–20%
//   Expert    → top 21–30%
//   Empresário → top 31–40%
//   Negociador → top 41–50%
//   (sem título) → demais

export type TituloRanking =
    | '💎 Diamante'
    | '🥇 Ouro'
    | '🥈 Prata'
    | '🥉 Bronze'
    | '⭐ Expert'
    | '💼 Empresário'
    | '🤝 Negociador'
    | null

export function calcularTitulo(posicao: number, total: number): TituloRanking {
    if (total === 0) return null
    const percentil = posicao / total // 0 = maior, 1 = menor

    if (percentil <= 0.05) return '💎 Diamante'
    if (percentil <= 0.10) return '🥇 Ouro'
    if (percentil <= 0.15) return '🥈 Prata'
    if (percentil <= 0.20) return '🥉 Bronze'
    if (percentil <= 0.30) return '⭐ Expert'
    if (percentil <= 0.40) return '💼 Empresário'
    if (percentil <= 0.50) return '🤝 Negociador'
    return null
}

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
