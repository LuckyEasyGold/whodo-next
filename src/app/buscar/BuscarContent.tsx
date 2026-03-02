'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin, Star, CheckCircle, SlidersHorizontal, Filter } from 'lucide-react'

import MapWrapper from '@/components/MapWrapper'

type Profissional = {
    id: number
    nome: string
    foto_perfil: string | null
    cidade: string | null
    estado: string | null
    latitude: any
    longitude: any
    prestador: { especialidade: string | null; avaliacao_media: any; verificado: boolean } | null
    servicos: { titulo: string; preco_base: any; categoria: { nome: string } }[]
    avaliacoesRecebidas: { nota: any }[]
}

type Categoria = { id: number; nome: string; icone: string | null }

type Props = {
    profissionais: Profissional[]
    categorias: Categoria[]
    queryInicial: string
    categoriaInicial: string
}

export default function BuscarContent({ profissionais, categorias, queryInicial, categoriaInicial }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [showFilters, setShowFilters] = useState(false)
    const [location, setLocation] = useState(searchParams.get('loc') || '')
    const [priceRange, setPriceRange] = useState(Number(searchParams.get('preco')) || 1000)
    const [distance, setDistance] = useState(Number(searchParams.get('dist')) || 10)
    const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0)
    const [onlyVerified, setOnlyVerified] = useState(searchParams.get('verificado') === 'true')

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
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-20">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-900">Filtrar Resultados</h2>
                                <button 
                                    onClick={() => {
                                        setLocation(''); setDistance(10); setMinRating(0); setPriceRange(1000); setOnlyVerified(false);
                                        router.push('/buscar')
                                    }}
                                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                >
                                    Limpar
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Localização */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <MapPin size={16} className="text-indigo-600" /> Localização
                                    </h3>
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Ex: São Paulo, Centro..."
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                        <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                                    </div>
                                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input type="checkbox" className="rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 w-4 h-4" />
                                        Mostrar apenas próximos
                                    </label>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600">Distância:</span>
                                            <span className="font-medium text-slate-900">{distance} km</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1" max="50"
                                            value={distance}
                                            onChange={(e) => setDistance(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    </div>
                                </div>

                                {/* Avaliação */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <Star size={16} className="text-indigo-600" /> Avaliação Mínima
                                    </h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => setMinRating(0)} className={`flex-1 py-2 border rounded-xl text-sm font-medium transition-colors ${minRating === 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Qualquer</button>
                                        <button onClick={() => setMinRating(4)} className={`flex-1 py-2 border rounded-xl text-sm font-medium transition-colors ${minRating === 4 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>4.0+</button>
                                        <button onClick={() => setMinRating(4.5)} className={`flex-1 py-2 border rounded-xl text-sm font-medium transition-colors ${minRating === 4.5 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>4.5+</button>
                                    </div>
                                </div>

                                {/* Preço */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="text-indigo-600 font-bold">$</span> Faixa de Preço
                                    </h3>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600">Até R$ {priceRange}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50" max="2000" step="50"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>

                                {/* Outros */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <SlidersHorizontal size={16} className="text-indigo-600" /> Outros Filtros
                                    </h3>
                                    <div className="space-y-3">
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
                                </div>
                                
                                <button 
                                    onClick={aplicarFiltros}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-indigo-200 mt-4"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="w-full lg:w-3/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900">Profissionais Disponíveis</h2>
                                    <p className="text-slate-500 mt-1">Exibindo <span className="font-semibold text-slate-900">{profissionais.length}</span> profissionais próximos de você</p>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center gap-3">
                                    <span className="text-sm text-slate-500 font-medium">Ordenar por:</span>
                                    <select className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow transition-colors appearance-none cursor-pointer">
                                        <option value="relevancia">Relevância</option>
                                        <option value="avaliacao">Melhor avaliação</option>
                                        <option value="distancia">Mais próximos</option>
                                        <option value="preco_asc">Menor preço</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex overflow-x-auto border-b border-slate-200 gap-6 mb-6 pb-px">
                                {['Todos', 'Disponíveis Hoje', 'Verificados', 'Melhor Avaliados'].map((tab, i) => (
                                    <button
                                        key={tab}
                                        className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${i === 0 ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {profissionais.length === 0 ? (
                                <div className="text-center py-20">
                                    <Search size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum profissional encontrado</h3>
                                    <p className="text-slate-500">Tente buscar com outros termos, ajustar os filtros ou aumentar o raio de distância.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                    {profissionais.map((p, i) => {
                                        const rating = Number(p.prestador?.avaliacao_media || 0)
                                        const numAval = p.avaliacoesRecebidas.length
                                        const minPrice = p.servicos.length > 0
                                            ? Math.min(...p.servicos.map((s) => Number(s.preco_base)))
                                            : null

                                        return (
                                            <motion.div
                                                key={p.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <Link
                                                    href={`/perfil/${p.id}`}
                                                    className="group block rounded-2xl overflow-hidden bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1 relative"
                                                >
                                                    {p.prestador?.verificado ? (
                                                        <span className="absolute top-3 right-3 z-10 bg-emerald-100/90 backdrop-blur-sm text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                            <CheckCircle size={12} /> Verificado
                                                        </span>
                                                    ) : (
                                                        <span className="absolute top-3 right-3 z-10 bg-amber-100/90 backdrop-blur-sm text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                            Novo
                                                        </span>
                                                    )}

                                                    <div className="p-5">
                                                        <div className="flex items-start gap-4">
                                                            <img
                                                                src={p.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                                                alt={p.nome}
                                                                className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-100"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                                                    {p.nome}
                                                                </h3>
                                                                <p className="text-sm text-slate-500 truncate">
                                                                    {p.prestador?.especialidade || 'Prestador de Serviço'}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <div className="flex items-center gap-0.5">
                                                                        {[1, 2, 3, 4, 5].map((j) => (
                                                                            <Star
                                                                                key={j}
                                                                                size={12}
                                                                                className={j <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-xs font-bold text-slate-700">{rating.toFixed(1)} <span className="text-slate-400 font-medium">({numAval})</span></span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {p.servicos.length > 0 && (
                                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                                {p.servicos.slice(0, 3).map((s) => (
                                                                    <span key={s.titulo} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                                                                        {s.titulo}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="px-5 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100 group-hover:bg-indigo-50/30 transition-colors">
                                                        <div className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                                                            <MapPin size={14} className="text-indigo-500" />
                                                            <span>{p.cidade || 'N/A'}, {p.estado || ''}</span>
                                                        </div>
                                                        {minPrice && (
                                                            <span className="text-sm font-extrabold text-indigo-600">
                                                                R$ {minPrice.toFixed(0)} <span className="text-xs font-medium text-slate-500">inicial</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Map Box */}
                            <div className="mt-10 pt-8 border-t border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-extrabold text-slate-900">Profissionais próximos no mapa</h2>
                                </div>
                                <MapWrapper profissionais={profissionais} centerCity={searchParams.get('loc') || location} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
