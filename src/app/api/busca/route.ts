import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const q = searchParams.get('q') || ''
        const categoria = searchParams.get('categoria') || ''
        const loc = searchParams.get('loc') || ''
        const rating = searchParams.get('rating') || '0'
        const preco = searchParams.get('preco') || '1000'
        const verificado = searchParams.get('verificado') === 'true'

        // Nunca mostrar contas de sistema (admin, moderador, super_admin)
        const where: any = {
            NOT: [
                { status: 'inativo' },
                { tipo: { in: ['admin', 'moderador', 'super_admin'] } },
            ]
        }

        // Busca com case-insensitive e partial match
        if (q) {
            where.AND = [
                {
                    OR: [
                        { nome: { contains: q, mode: 'insensitive' } },
                        { especialidade: { contains: q, mode: 'insensitive' } },
                        { nome_fantasia: { contains: q, mode: 'insensitive' } },
                        { servicos: { some: { titulo: { contains: q, mode: 'insensitive' } } } },
                        { servicos: { some: { categoria: { nome: { contains: q, mode: 'insensitive' } } } } },
                    ]
                }
            ]
        }

        if (categoria) {
            const catFilter = { servicos: { some: { categoria_id: parseInt(categoria) } } }
            if (where.AND) where.AND.push(catFilter)
            else where.AND = [catFilter]
        }

        if (loc) {
            const locFilter = {
                OR: [
                    { cidade: { contains: loc, mode: 'insensitive' } },
                    { estado: { contains: loc, mode: 'insensitive' } }
                ]
            }
            if (where.AND) where.AND.push(locFilter)
            else where.AND = [locFilter]
        }

        if (rating) {
            where.avaliacao_media = { gte: parseFloat(rating) }
        }

        if (preco) {
            const precoFilter = { servicos: { some: { preco_base: { lte: parseFloat(preco) } } } }
            if (where.AND) where.AND.push(precoFilter)
            else where.AND = [precoFilter]
        }

        const profissionaisRaw = await prisma.usuario.findMany({
            where,
            include: {
                servicos: { include: { categoria: true }, take: 3 },
                avaliacoesRecebidas: { select: { nota: true } },
                accounts: { select: { id: true } },
                _count: {
                    select: { servicos: true }
                }
            },
            take: 50, // Limite menor para busca rápida
        })

        // Calcula ranking
        const rankingGlobal = await prisma.agendamento.groupBy({
            by: ['prestador_id'],
            where: { status: 'concluido' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        })

        const rankingMap: Record<number, number> = {}
        rankingGlobal.forEach((r) => {
            rankingMap[r.prestador_id] = r._count.id
        })

        // Formata resultados
        const profissionais = profissionaisRaw.map(p => {
            const temServico = p._count.servicos > 0
            const temContrato = rankingMap[p.id] > 0
            const temContaSocial = p.accounts && p.accounts.length > 0
            const emAvaliacao = !p.email_verificado && !temContaSocial

            return {
                id: p.id,
                nome: p.nome,
                foto_perfil: p.foto_perfil,
                cidade: p.cidade,
                estado: p.estado,
                especialidade: p.especialidade,
                nome_fantasia: p.nome_fantasia,
                avaliacao_media: p.avaliacao_media,
                verificado: temServico && temContrato,
                emAvaliacao,
                servicos: p.servicos.map(s => ({
                    titulo: s.titulo,
                    preco_base: s.preco_base,
                    categoria: s.categoria.nome
                })),
                _count: p._count
            }
        })

        // Filtro de verificado
        const resultado = verificado
            ? profissionais.filter(p => p.verificado)
            : profissionais

        return NextResponse.json(resultado)
    } catch (error) {
        console.error('Erro na busca:', error)
        return NextResponse.json({ error: 'Erro ao buscar profissionais' }, { status: 500 })
    }
}
