'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react'

type PrestadorProps = {
    prestadores: {
        id: number
        nome: string
        foto_perfil: string | null
        cidade: string | null
        estado: string | null
        prestador: { especialidade: string | null; avaliacao_media: any; verificado: boolean } | null
        servicos: { titulo: string; preco_base: any; categoria: { nome: string } }[]
        avaliacoesRecebidas: { nota: any }[]
    }[]
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={14}
                    className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                />
            ))}
        </div>
    )
}

export default function TopProfessionals({ prestadores }: PrestadorProps) {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
                        Top profissionais
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        Os mais bem avaliados
                    </h2>
                    <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
                        Profissionais verificados com as melhores avaliações dos clientes
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prestadores.map((p, i) => {
                        const rating = Number(p.prestador?.avaliacao_media || 0)
                        const numAval = p.avaliacoesRecebidas.length

                        return (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Link
                                    href={`/prestador/${p.id}`}
                                    className="group block rounded-2xl overflow-hidden bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Header */}
                                    <div className="p-5 flex items-start gap-4">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={p.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                                alt={p.nome}
                                                className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all"
                                            />
                                            {p.prestador?.verificado && (
                                                <CheckCircle size={18} className="absolute -bottom-1 -right-1 text-emerald-500 fill-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                                {p.nome}
                                            </h3>
                                            <p className="text-sm text-slate-500 truncate">
                                                {p.prestador?.especialidade || 'Prestador'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <StarRating rating={rating} />
                                                <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
                                                <span className="text-xs text-slate-400">({numAval})</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services */}
                                    {p.servicos.length > 0 && (
                                        <div className="px-5 pb-2">
                                            <div className="flex flex-wrap gap-1.5">
                                                {p.servicos.map((s) => (
                                                    <span key={s.titulo} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                                                        {s.categoria.nome}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="px-5 py-3 bg-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <MapPin size={14} />
                                            <span>{p.cidade}, {p.estado}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                                            Ver perfil
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

                <div className="text-center mt-10">
                    <Link
                        href="/buscar"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Ver todos os profissionais
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
