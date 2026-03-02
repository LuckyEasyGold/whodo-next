import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BuscarContent from './BuscarContent'

export const metadata = {
    title: 'Buscar Profissionais - WhoDo!',
    description: 'Encontre profissionais qualificados perto de você no WhoDo!',
}

export default async function BuscarPage({ searchParams }: { searchParams: Promise<{ q?: string; categoria?: string; loc?: string; dist?: string; rating?: string; preco?: string; verificado?: string }> }) {
    const params = await searchParams
    const categorias = await prisma.categoria.findMany({ orderBy: { nome: 'asc' } })

    const where: any = {
        tipo: 'prestador',
        status: 'ativo',
    }

    if (params.q) {
        where.OR = [
            { nome: { contains: params.q } },
            { prestador: { especialidade: { contains: params.q } } },
            { servicos: { some: { titulo: { contains: params.q } } } },
        ]
    }

    if (params.categoria) {
        where.servicos = { some: { categoria_id: parseInt(params.categoria) } }
    }

    if (params.loc) {
        const currentOR = where.OR || []
        where.OR = [
            ...currentOR,
            { cidade: { contains: params.loc } },
            { estado: { contains: params.loc } }
        ]
    }

    if (params.verificado === 'true') {
        if (!where.prestador) where.prestador = {}
        where.prestador.verificado = true
    }

    if (params.rating) {
        if (!where.prestador) where.prestador = {}
        where.prestador.avaliacao_media = { gte: parseFloat(params.rating) }
    }

    if (params.preco) {
        if (!where.servicos) where.servicos = { some: {} }
        else if (!where.servicos.some) where.servicos.some = {}
        where.servicos.some.preco_base = { lte: parseFloat(params.preco) }
    }

    const profissionais = await prisma.usuario.findMany({
        where,
        include: {
            prestador: true,
            servicos: { include: { categoria: true }, take: 3 },
            avaliacoesRecebidas: { select: { nota: true } },
        },
        take: 30,
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
                />
            </main>
            <Footer />
        </>
    )
}
