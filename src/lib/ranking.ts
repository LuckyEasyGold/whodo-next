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
