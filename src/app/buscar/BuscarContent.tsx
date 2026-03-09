'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin, Star, CheckCircle, SlidersHorizontal, Filter, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react'

import MapWrapper from '@/components/MapWrapper'

type Profissional = {
    id: number
    nome: string
    foto_perfil: string | null
    cidade: string | null
    estado: string | null
    latitude: any
    longitude: any
    especialidade: string | null
    avaliacao_media: any
    verificado: boolean
    emAvaliacao?: boolean
    servicos: { titulo: string; preco_base: any; categoria: { nome: string } }[]
    avaliacoesRecebidas: { nota: any }[]
    ranking: { posicao: number; totalContratos: number; titulo: string | null } | null
}

type Categoria = { id: number; nome: string; icone: string | null }

type Props = {
    profissionais: Profissional[]
    categorias: Categoria[]
    queryInicial: string
    categoriaInicial: string
    defaultCity: string
    vcQuisDizer?: string | null
}

export default function BuscarContent({ profissionais, categorias, queryInicial, categoriaInicial, defaultCity, vcQuisDizer }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [showFilters, setShowFilters] = useState(false)
    const [location, setLocation] = useState(searchParams.get('loc') || '')
    const [priceRange, setPriceRange] = useState(Number(searchParams.get('preco')) || 1000)
    const [distance, setDistance] = useState(Number(searchParams.get('dist')) || 10)
    const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0)
    const [onlyVerified, setOnlyVerified] = useState(searchParams.get('verificado') === 'true')

    // Paginação
    const itemsPerPage = 20
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(profissionais.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentItems = profissionais.slice(startIndex, startIndex + itemsPerPage)

    const aplicarFiltros = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (location) params.set('loc', location)
        else params.delete('loc')

        if (distance !== 10) params.set('dist', distance.toString())
        else params.delete('dist')

        if (minRating > 0) params.set('rating', minRating.toString())
        else params.delete('rating')

        if (priceRange !== 1000) params.set('preco', priceRange.toString())
        else params.delete('preco')

        if (onlyVerified) params.set('verificado', 'true')
        else params.delete('verificado')

        router.push(`/buscar?${params.toString()}`, { scroll: false })
    }

    return (
        <div>
            {/* Hero search */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-4 py-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                        Encontre o profissional perfeito
                    </h1>
                    <form className="relative" action="/buscar" method="GET">
                        <div className="flex gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={queryInicial}
                                    placeholder="O que você precisa?"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/10 rounded-xl text-white placeholder:text-white/40 border border-white/10 focus:border-white/30 focus:outline-none text-base"
                                />
                            </div>
                            <button type="submit" className="px-6 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg text-sm">
                                Buscar
                            </button>
                        </div>

                        {/* Category chips */}
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {categorias.slice(0, 6).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/buscar?categoria=${cat.id}`}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${categoriaInicial === String(cat.id)
                                        ? 'bg-white text-indigo-700'
                                        : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                                        }`}
                                >
                                    {cat.nome}
                                </Link>
                            ))}
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Mobile Filter Toggle Bar */}
                <div className="flex items-center justify-between gap-3 mb-4 lg:hidden">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                    >
                        <Filter size={16} />
                        Filtros
                        <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                    <span className="text-sm text-slate-400">{profissionais.length} profissionais</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Filters Sidebar */}
                    <div className={`w-full lg:w-72 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-20">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><Filter size={16} className="text-indigo-600" /> Filtrar</h2>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setLocation(''); setDistance(10); setMinRating(0); setPriceRange(1000); setOnlyVerified(false);
                                            router.push('/buscar')
                                        }}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                    >
                                        Limpar
                                    </button>
                                    <button onClick={() => setShowFilters(false)} className="lg:hidden text-slate-400 hover:text-slate-700">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Localização */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-sm">
                                        <MapPin size={14} className="text-indigo-600" /> Localização
                                    </h3>
                                    <div className="relative mb-2">
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Ex: São Paulo, Centro..."
                                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                        <MapPin size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                                    </div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">Distância:</span>
                                        <span className="font-medium text-slate-900">{distance} km</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="50"
                                        value={distance}
                                        onChange={(e) => setDistance(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>

                                {/* Avaliação */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-sm">
                                        <Star size={14} className="text-indigo-600" /> Avaliação Mínima
                                    </h3>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => setMinRating(0)} className={`flex-1 py-1.5 border rounded-lg text-xs font-medium transition-colors ${minRating === 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Qualquer</button>
                                        <button onClick={() => setMinRating(4)} className={`flex-1 py-1.5 border rounded-lg text-xs font-medium transition-colors ${minRating === 4 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>4.0+</button>
                                        <button onClick={() => setMinRating(4.5)} className={`flex-1 py-1.5 border rounded-lg text-xs font-medium transition-colors ${minRating === 4.5 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>4.5+</button>
                                    </div>
                                </div>

                                {/* Preço */}
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <h3 className="font-semibold text-slate-900 flex items-center gap-1 text-sm"><span className="text-indigo-600 font-bold">R$</span> Faixa de Preço</h3>
                                        <span className="font-medium text-slate-900">até R$ {priceRange}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50" max="2000" step="50"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>

                                {/* Outros */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={onlyVerified}
                                            onChange={(e) => setOnlyVerified(e.target.checked)}
                                            className="rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 w-4 h-4"
                                        />
                                        Apenas verificados
                                    </label>
                                </div>

                                <button
                                    onClick={() => { aplicarFiltros(); setShowFilters(false); }}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-indigo-200"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">Profissionais</h2>
                                    <p className="text-slate-500 text-sm mt-0.5"><span className="font-semibold text-slate-900">{profissionais.length}</span> resultados</p>
                                </div>
                                <select className="mt-3 sm:mt-0 pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                                    <option value="relevancia">Relevância</option>
                                    <option value="avaliacao">Melhor avaliação</option>
                                    <option value="distancia">Mais próximos</option>
                                    <option value="preco_asc">Menor preço</option>
                                </select>
                            </div>

                            {vcQuisDizer && (
                                <div className="mb-4 p-3 bg-indigo-50 text-indigo-800 rounded-lg flex items-center gap-2 text-sm">
                                    <Search size={16} className="text-indigo-500" />
                                    <span>
                                        Você quis dizer <Link href={`/buscar?q=${vcQuisDizer}`} className="font-bold underline cursor-pointer hover:text-indigo-600">{vcQuisDizer}</Link>?
                                    </span>
                                </div>
                            )}

                            {profissionais.length === 0 ? (
                                <div className="text-center py-20">
                                    <Search size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum profissional encontrado</h3>
                                    <p className="text-slate-500">Tente buscar com outros termos, ajustar os filtros ou aumentar o raio de distância.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
                                        {currentItems.map((p, i) => {
                                            const rating = Number(p.avaliacao_media || 0)
                                            const numAval = p.avaliacoesRecebidas.length
                                            const minPrice = p.servicos.length > 0
                                                ? Math.min(...p.servicos.map((s) => Number(s.preco_base)))
                                                : null

                                            return (
                                                <motion.div
                                                    key={p.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.04 }}
                                                >
                                                    <Link
                                                        href={`/perfil/${p.id}`}
                                                        className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-0.5 relative h-full"
                                                    >
                                                        {/* Badge verificado ou em avaliação */}
                                                        {p.verificado ? (
                                                            <span className="absolute top-2 right-2 z-10 bg-emerald-100/90 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                                                                <CheckCircle size={10} /> Verificado
                                                            </span>
                                                        ) : p.emAvaliacao ? (
                                                            <span className="absolute top-2 right-2 z-10 bg-amber-100/90 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Em avaliação</span>
                                                        ) : null}

                                                        <div className="p-3 flex flex-col items-center text-center gap-2 flex-1">
                                                            <img
                                                                src={p.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                                                alt={p.nome}
                                                                className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100 mt-4"
                                                            />
                                                            <div className="w-full min-w-0 mt-1">
                                                                {p.especialidade ? (
                                                                    // Perfil profissional preenchido: especialidade em destaque
                                                                    <>
                                                                        <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate leading-tight">
                                                                            {p.especialidade}
                                                                        </h3>
                                                                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.nome}</p>
                                                                    </>
                                                                ) : (
                                                                    // Sem perfil profissional: nome em destaque, título "Cliente"
                                                                    <>
                                                                        <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate leading-tight">
                                                                            {p.nome}
                                                                        </h3>
                                                                        <p className="text-[11px] text-slate-400 truncate mt-0.5">Cliente</p>
                                                                    </>
                                                                )}
                                                                {/* Badge de ranking de contratos */}
                                                                {p.ranking?.titulo && (
                                                                    <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                                        {p.ranking.titulo}
                                                                    </span>
                                                                )}
                                                                <div className="flex items-center justify-center gap-0.5 mt-1.5">
                                                                    {[1, 2, 3, 4, 5].map((j) => (
                                                                        <Star key={j} size={10} className={j <= Math.round(Number(p.avaliacao_media || 0)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                                                                    ))}
                                                                    <span className="text-[10px] font-bold text-slate-600 ml-1">{Number(p.avaliacao_media || 0).toFixed(1)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="px-3 py-2 bg-slate-50 flex items-center justify-between border-t border-slate-100 group-hover:bg-indigo-50/30 transition-colors">
                                                            <div className="flex items-center gap-0.5 text-[10px] text-slate-500 truncate">
                                                                <MapPin size={10} className="text-indigo-400 flex-shrink-0" />
                                                                <span className="truncate">{p.cidade || 'N/A'}</span>
                                                            </div>
                                                            {minPrice && (
                                                                <span className="text-[10px] font-extrabold text-indigo-600 flex-shrink-0 ml-1">R${minPrice.toFixed(0)}</span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            )
                                        })}
                                    </div>

                                    {/* Controles de Paginação */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-8 mb-10 pb-4">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>

                                            <div className="flex gap-1">
                                                {Array.from({ length: totalPages }).map((_, idx) => {
                                                    const page = idx + 1
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${currentPage === page
                                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                })}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Map Box */}
                            <div className="mt-10 pt-8 border-t border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-extrabold text-slate-900">Profissionais próximos no mapa</h2>
                                </div>
                                <MapWrapper profissionais={profissionais} centerCity={searchParams.get('loc') || location || defaultCity} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
