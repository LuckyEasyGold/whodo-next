import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BuscarContent from './BuscarContent'
import { calcularTitulo } from '@/lib/ranking'

export const metadata = {
    title: 'Buscar Profissionais - WhoDo!',
    description: 'Encontre profissionais qualificados perto de você no WhoDo!',
}

export default async function BuscarPage({ searchParams }: { searchParams: Promise<{ q?: string; categoria?: string; loc?: string; dist?: string; rating?: string; preco?: string; verificado?: string }> }) {
    const params = await searchParams
    const session = await getSession()
    const categorias = await prisma.categoria.findMany({ orderBy: { nome: 'asc' } })

    // Smart map centering: logged in user's city, or last searched city from params
    let defaultCity = params.loc || ''
    if (!defaultCity && session) {
        const me = await prisma.usuario.findUnique({ where: { id: session.id }, select: { cidade: true } })
        if (me?.cidade) defaultCity = me.cidade
    }

    // Nunca mostrar contas de sistema (admin, moderador, super_admin)
    const where: any = {
        NOT: [
            { status: 'inativo' },
            { tipo: { in: ['admin', 'moderador', 'super_admin'] } },
        ]
    }

    if (params.q) {
        where.AND = [
            {
                OR: [
                    { nome: { contains: params.q } },
                    { especialidade: { contains: params.q } },
                    { nome_fantasia: { contains: params.q } },
                    { servicos: { some: { titulo: { contains: params.q } } } },
                ]
            }
        ]
    }

    if (params.categoria) {
        const catFilter = { servicos: { some: { categoria_id: parseInt(params.categoria) } } }
        if (where.AND) where.AND.push(catFilter)
        else where.AND = [catFilter]
    }

    if (params.loc) {
        const locFilter = {
            OR: [
                { cidade: { contains: params.loc } },
                { estado: { contains: params.loc } }
            ]
        }
        if (where.AND) where.AND.push(locFilter)
        else where.AND = [locFilter]
    }

    // Filtro de verificado agora é aplicado após calcular o valor real (abaixo)

    if (params.rating) {
        where.avaliacao_media = { gte: parseFloat(params.rating) }
    }

    if (params.preco) {
        const precoFilter = { servicos: { some: { preco_base: { lte: parseFloat(params.preco) } } } }
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
        take: 100,
    })

    // Calcula ranking global por contratos concluídos
    const rankingGlobal = await prisma.agendamento.groupBy({
        by: ['prestador_id'],
        where: { status: 'concluido' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
    })
    const totalNoRanking = rankingGlobal.length

    const rankingMap: Record<number, { posicao: number; totalContratos: number; titulo: string | null }> = {}
    rankingGlobal.forEach((r, idx) => {
        rankingMap[r.prestador_id] = {
            posicao: idx + 1,
            totalContratos: r._count.id,
            titulo: calcularTitulo(idx + 1, totalNoRanking),
        }
    })

    // Recalcula verificado: deve ter ao menos 1 serviço + 1 contrato concluído
    const profissionais = profissionaisRaw.map(p => {
        const temServico = p._count.servicos > 0
        const rankInfo = rankingMap[p.id]
        const temContrato = rankInfo ? rankInfo.totalContratos > 0 : false

        // Regra de "Em avaliação": email não verificado e não tem conta social
        const temContaSocial = p.accounts && p.accounts.length > 0
        const emAvaliacao = !p.email_verificado && !temContaSocial

        return {
            ...p,
            verificado: temServico && temContrato,
            emAvaliacao,
            ranking: rankInfo || null,
        }
    })

    const resultado = params.verificado === 'true'
        ? profissionais.filter(p => p.verificado)
        : profissionais

    let vcQuisDizer: string | null = null
    if (params.q) {
        const { encontrarComErroDeDigitacao } = await import('@/lib/string-utils')
        const dicionario = categorias.map(c => c.nome.toLowerCase()).concat([
            'faxineira', 'diarista', 'pedreiro', 'eletricista', 'encanador',
            'pintor', 'manicure', 'cabeleireiro', 'montador', 'marido de aluguel',
            'mecanico', 'jardineiro', 'programador', 'professor', 'fotografo', 'babá', 'cozinheira'
        ])
        vcQuisDizer = encontrarComErroDeDigitacao(params.q, dicionario)
    }

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen bg-slate-50">
                <BuscarContent
                    profissionais={JSON.parse(JSON.stringify(resultado))}
                    categorias={JSON.parse(JSON.stringify(categorias))}
                    queryInicial={params.q || ''}
                    categoriaInicial={params.categoria || ''}
                    defaultCity={defaultCity}
                    vcQuisDizer={vcQuisDizer}
                />
            </main>
            <Footer />
        </>
    )
}
