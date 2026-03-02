'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, MapPin, CheckCircle, Clock, MessageSquare, Calendar, Settings, Grid3X3, Play, Tag, Briefcase, Heart, MessageCircle, ExternalLink } from 'lucide-react'

type Props = {
    usuario: {
        id: number
        nome: string
        email: string
        telefone: string | null
        foto_perfil: string | null
        cidade: string | null
        estado: string | null
        tipo: string
        prestador: { especialidade: string | null; sobre: string | null; avaliacao_media: any; verificado: boolean; disponibilidade: string | null } | null
        servicos: { id: number; titulo: string; descricao: string | null; preco_base: any; unidade_medida: string | null; categoria: { nome: string } }[]
        avaliacoesRecebidas: { id: number; nota: any; comentario: string | null; data_avaliacao: string; cliente: { nome: string; foto_perfil: string | null }; servico: { titulo: string } }[]
    }
    isOwner: boolean
    stats: { totalServicos: number; totalAvaliacoes: number; mediaAvaliacao: number; seguidores: number; seguindo: number }
}

type Tab = 'portfolio' | 'servicos' | 'avaliacoes'

// Placeholder portfolio items — will come from DB later
const portfolioItems = [
    { img: 'https://images.unsplash.com/photo-1621544402532-22c6b1d667c5?w=400', desc: 'Reparo completo em sistema hidráulico', likes: 42, comments: 7 },
    { img: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f5?w=400', desc: 'Instalação completa em apartamento novo', likes: 28, comments: 3 },
    { img: 'https://images.unsplash.com/photo-1600566753051-475254d7b3e0?w=400', desc: 'Dica rápida: como detectar vazamentos', likes: 87, comments: 12 },
    { img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400', desc: 'Sistema para restaurante', likes: 35, comments: 5 },
    { img: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3f8?w=400', desc: 'Ferramentas profissionais', likes: 56, comments: 8 },
    { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', desc: '15% de desconto esta semana!', likes: 102, comments: 24 },
]

const highlights = [
    { img: 'https://images.unsplash.com/photo-1621544402532-22c6b1d667c5?w=200', title: 'Antes/Depois' },
    { img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200', title: 'Reformas' },
    { img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200', title: 'Manutenção' },
    { img: 'https://images.unsplash.com/photo-1613497644182-913b0f7898fa?w=200', title: 'Dicas' },
]

export default function ProfileContent({ usuario, isOwner, stats }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('portfolio')
    const p = usuario
    const rating = Number(p.prestador?.avaliacao_media || 0)

    const tabs: { key: Tab; label: string; icon: any }[] = [
        { key: 'portfolio', label: 'Portfólio', icon: Grid3X3 },
        { key: 'servicos', label: 'Serviços', icon: Briefcase },
        { key: 'avaliacoes', label: 'Avaliações', icon: Star },
    ]

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Profile Header */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-4"
            >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Avatar with story ring */}
                    <div className="relative flex-shrink-0">
                        <div className="p-1 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                            <div className="p-0.5 rounded-full bg-white">
                                <img
                                    src={p.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                    alt={p.nome}
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                                />
                            </div>
                        </div>
                        {/* Online indicator */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                            <h1 className="text-2xl font-bold text-slate-900">{p.nome}</h1>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                {p.prestador?.verificado && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                        <CheckCircle size={12} /> Verificado
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                            {isOwner ? (
                                <>
                                    <Link href="/dashboard" className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all">
                                        <Settings size={14} className="inline mr-1.5 -mt-0.5" /> Editar perfil
                                    </Link>
                                    <Link href="/dashboard" className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all">
                                        Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all">
                                        <Calendar size={14} className="inline mr-1.5 -mt-0.5" /> Contratar
                                    </button>
                                    <button className="px-5 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
                                        <MessageSquare size={14} className="inline mr-1.5 -mt-0.5" /> Mensagem
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center justify-center sm:justify-start gap-8 mb-4">
                            <div className="text-center">
                                <span className="font-bold text-slate-900 block">{stats.totalServicos}</span>
                                <span className="text-xs text-slate-500">Serviços</span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-slate-900 block">{stats.seguidores}</span>
                                <span className="text-xs text-slate-500">Seguidores</span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-slate-900 block">{stats.seguindo}</span>
                                <span className="text-xs text-slate-500">Seguindo</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-slate-900">{rating.toFixed(1)}</span>
                                </div>
                                <span className="text-xs text-slate-500">{stats.totalAvaliacoes} avaliações</span>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            {p.prestador?.especialidade && (
                                <h2 className="font-bold text-slate-800 text-sm">{p.prestador.especialidade}</h2>
                            )}
                            {p.prestador?.sobre && (
                                <p className="text-sm text-slate-600 mt-1">{p.prestador.sobre}</p>
                            )}
                            {p.cidade && (
                                <p className="text-sm text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                                    <MapPin size={13} /> {p.cidade}, {p.estado}
                                </p>
                            )}
                            {p.prestador?.disponibilidade && (
                                <p className="text-sm text-slate-500 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                                    <Clock size={13} /> {p.prestador.disponibilidade}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Highlights */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4 overflow-x-auto">
                <div className="flex gap-4">
                    {highlights.map((h) => (
                        <div key={h.title} className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
                            <div className="p-0.5 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                                <div className="p-0.5 rounded-full bg-white">
                                    <img src={h.img} alt={h.title} className="w-16 h-16 rounded-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                            </div>
                            <span className="text-xs text-slate-600 mt-1.5 max-w-[70px] truncate text-center">{h.title}</span>
                        </div>
                    ))}
                    {isOwner && (
                        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
                            <div className="w-[68px] h-[68px] rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-indigo-500 transition-colors">
                                <span className="text-2xl text-slate-400 group-hover:text-indigo-500">+</span>
                            </div>
                            <span className="text-xs text-slate-500 mt-1.5">Novo</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Tabs */}
            <div className="bg-white rounded-t-2xl border border-slate-100 border-b-0">
                <div className="flex justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold border-b-2 transition-all ${activeTab === tab.key
                                    ? 'text-indigo-600 border-indigo-600'
                                    : 'text-slate-400 border-transparent hover:text-slate-600'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-2xl shadow-sm border border-slate-100 border-t-0 p-4 sm:p-6 mb-6">
                {activeTab === 'portfolio' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {portfolioItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative group rounded-xl overflow-hidden cursor-pointer aspect-square"
                            >
                                <img src={item.img} alt={item.desc} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all text-white font-semibold text-sm">
                                        <span className="flex items-center gap-1"><Heart size={16} /> {item.likes}</span>
                                        <span className="flex items-center gap-1"><MessageCircle size={16} /> {item.comments}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'servicos' && (
                    <div className="space-y-3">
                        {p.servicos.length === 0 ? (
                            <p className="text-center text-slate-400 py-10">Nenhum serviço cadastrado</p>
                        ) : (
                            p.servicos.map((s) => (
                                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{s.titulo}</h3>
                                        {s.descricao && <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{s.descricao}</p>}
                                        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">{s.categoria.nome}</span>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <span className="text-lg font-extrabold text-indigo-600">R$ {Number(s.preco_base).toFixed(0)}</span>
                                        {s.unidade_medida && <p className="text-xs text-slate-400">{s.unidade_medida}</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'avaliacoes' && (
                    <div className="space-y-4">
                        {p.avaliacoesRecebidas.length === 0 ? (
                            <p className="text-center text-slate-400 py-10">Nenhuma avaliação ainda</p>
                        ) : (
                            p.avaliacoesRecebidas.map((a) => (
                                <div key={a.id} className="p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={a.cliente.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                            alt={a.cliente.nome}
                                            className="w-9 h-9 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{a.cliente.nome}</h4>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} size={12} className={i <= Math.round(Number(a.nota)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                                                ))}
                                                <span className="text-xs text-slate-400 ml-1">{new Date(a.data_avaliacao).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {a.comentario && <p className="text-sm text-slate-600">{a.comentario}</p>}
                                    <p className="text-xs text-slate-400 mt-1">Serviço: {a.servico.titulo}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
