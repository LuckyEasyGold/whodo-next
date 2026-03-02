'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, CheckCircle, Clock, Phone, Mail, MessageSquare, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
    prestador: {
        id: number
        nome: string
        email: string
        telefone: string | null
        foto_perfil: string | null
        cidade: string | null
        estado: string | null
        created_at: string
        prestador: {
            especialidade: string | null
            sobre: string | null
            avaliacao_media: any
            verificado: boolean
            disponibilidade: string | null
        } | null
        servicos: {
            id: number
            titulo: string
            descricao: string | null
            preco_base: any
            unidade_medida: string | null
            categoria: { nome: string }
        }[]
        avaliacoesRecebidas: {
            id: number
            nota: any
            comentario: string | null
            data_avaliacao: string
            cliente: { nome: string; foto_perfil: string | null }
            servico: { titulo: string }
        }[]
    }
    stats: { totalAvaliacoes: number; mediaAvaliacao: number }
}

export default function PrestadorProfile({ prestador, stats }: Props) {
    const p = prestador
    const rating = Number(p.prestador?.avaliacao_media || 0)

    return (
        <div>
            {/* Header banner */}
            <div className="relative h-48 sm:h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
                <div className="absolute top-4 left-4">
                    <Link href="/buscar" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                        <ArrowLeft size={16} />
                        Voltar
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 pb-12">
                {/* Profile card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 mb-6"
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={p.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                alt={p.nome}
                                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-xl"
                            />
                            {p.prestador?.verificado && (
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                                    <CheckCircle size={18} className="text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h1 className="text-2xl font-extrabold text-slate-900">{p.nome}</h1>
                                {p.prestador?.verificado && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                        <CheckCircle size={12} />
                                        Verificado
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 font-medium mb-3">{p.prestador?.especialidade}</p>

                            {/* Rating */}
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                                        />
                                    ))}
                                </div>
                                <span className="font-bold text-slate-900">{rating.toFixed(1)}</span>
                                <span className="text-sm text-slate-400">({stats.totalAvaliacoes} avaliações)</span>
                            </div>

                            {/* Info chips */}
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                {p.cidade && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm">
                                        <MapPin size={14} />
                                        {p.cidade}, {p.estado}
                                    </span>
                                )}
                                {p.prestador?.disponibilidade && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm">
                                        <Clock size={14} />
                                        {p.prestador.disponibilidade}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all">
                                <Calendar size={18} />
                                Solicitar Orçamento
                            </button>
                            <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">
                                <MessageSquare size={18} />
                                Enviar Mensagem
                            </button>
                        </div>
                    </div>

                    {/* About */}
                    {p.prestador?.sobre && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2">Sobre</h3>
                            <p className="text-slate-600 leading-relaxed">{p.prestador.sobre}</p>
                        </div>
                    )}
                </motion.div>

                {/* Services */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 mb-6"
                >
                    <h2 className="text-xl font-extrabold text-slate-900 mb-5">Serviços</h2>
                    {p.servicos.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">Nenhum serviço cadastrado ainda</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {p.servicos.map((s) => (
                                <div
                                    key={s.id}
                                    className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-slate-900">{s.titulo}</h3>
                                        <span className="text-lg font-extrabold text-indigo-600">
                                            R$ {Number(s.preco_base).toFixed(0)}
                                        </span>
                                    </div>
                                    {s.descricao && (
                                        <p className="text-sm text-slate-500 mb-2 line-clamp-2">{s.descricao}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                                            {s.categoria.nome}
                                        </span>
                                        {s.unidade_medida && (
                                            <span className="text-xs text-slate-400">{s.unidade_medida}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Reviews */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8"
                >
                    <h2 className="text-xl font-extrabold text-slate-900 mb-5">
                        Avaliações ({stats.totalAvaliacoes})
                    </h2>
                    {p.avaliacoesRecebidas.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">Nenhuma avaliação ainda</p>
                    ) : (
                        <div className="space-y-4">
                            {p.avaliacoesRecebidas.map((a) => (
                                <div key={a.id} className="p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={a.cliente.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                            alt={a.cliente.nome}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{a.cliente.nome}</h4>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i <= Math.round(Number(a.nota)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                                                    />
                                                ))}
                                                <span className="text-xs text-slate-400 ml-1">
                                                    {new Date(a.data_avaliacao).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {a.comentario && <p className="text-sm text-slate-600 leading-relaxed">{a.comentario}</p>}
                                    <p className="text-xs text-slate-400 mt-2">Serviço: {a.servico.titulo}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
