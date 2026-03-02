import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BuscarContent from './BuscarContent'

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

    // Base: show all users that are not explicitly blocked/inactive
    const where: any = {
        NOT: { status: 'inativo' }
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

    if (params.verificado === 'true') {
        where.verificado = true
    }

    if (params.rating) {
        where.avaliacao_media = { gte: parseFloat(params.rating) }
    }

    if (params.preco) {
        const precoFilter = { servicos: { some: { preco_base: { lte: parseFloat(params.preco) } } } }
        if (where.AND) where.AND.push(precoFilter)
        else where.AND = [precoFilter]
    }

    const profissionais = await prisma.usuario.findMany({
        where,
        include: {
            servicos: { include: { categoria: true }, take: 3 },
            avaliacoesRecebidas: { select: { nota: true } },
        },
        take: 100,
    })

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen bg-slate-50">
                <BuscarContent
                    profissionais={JSON.parse(JSON.stringify(profissionais))}
                    categorias={JSON.parse(JSON.stringify(categorias))}
                    queryInicial={params.q || ''}
                    categoriaInicial={params.categoria || ''}
                    defaultCity={defaultCity}
                />
            </main>
            <Footer />
        </>
    )
}
