'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, CheckCircle, Clock, MessageSquare, Calendar, Settings, Grid3X3, Play, Briefcase, ExternalLink, X, Trash2, Globe, Linkedin, Facebook, Instagram, Youtube, UserCheck, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PortfolioMedia = {
    id: number
    url: string
    tipo: string
    titulo: string | null
    descricao: string | null
    citacao: string | null
}

type Props = {
    usuario: {
        id: number
        nome: string
        nome_fantasia: string | null
        email: string
        telefone: string | null
        foto_perfil: string | null
        cidade: string | null
        estado: string | null
        tipo: string

        // Profissional
        especialidade: string | null
        sobre: string | null
        avaliacao_media: any
        verificado: boolean
        disponibilidade: string | null

        // Socials
        website: string | null
        linkedin: string | null
        facebook: string | null
        instagram: string | null
        youtube: string | null
        tiktok: string | null
        kwai: string | null
        perfil_academico: string | null

        portfolio: PortfolioMedia[]
        servicos: { id: number; titulo: string; descricao: string | null; preco_base: any; unidade_medida: string | null; categoria: { nome: string } }[]
        avaliacoesRecebidas: { id: number; nota: any; comentario: string | null; data_avaliacao: string; cliente: { nome: string; foto_perfil: string | null }; servico: { titulo: string } }[]
    }
    isOwner: boolean
    stats: { totalServicos: number; totalAvaliacoes: number; mediaAvaliacao: number; seguidores: number; seguindo: number }
}

type Tab = 'portfolio' | 'servicos' | 'avaliacoes'

const highlights = [
    { img: 'https://images.unsplash.com/photo-1621544402532-22c6b1d667c5?w=200', title: 'Antes/Depois' },
    { img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200', title: 'Reformas' },
    { img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200', title: 'Manutenção' },
    { img: 'https://images.unsplash.com/photo-1613497644182-913b0f7898fa?w=200', title: 'Dicas' },
]

export default function ProfileContent({ usuario, isOwner, stats }: Props) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('portfolio')
    const [selectedMedia, setSelectedMedia] = useState<PortfolioMedia | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const p = usuario
    const rating = Number(p.avaliacao_media || 0)

    const tabs: { key: Tab; label: string; icon: any }[] = [
        { key: 'portfolio', label: 'Portfólio', icon: Grid3X3 },
        { key: 'servicos', label: 'Serviços', icon: Briefcase },
        { key: 'avaliacoes', label: 'Avaliações', icon: Star },
    ]

    const handleDelete = async (id: number) => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Erro ao deletar')

            setSelectedMedia(null)
            setShowDeleteConfirm(false)
            router.refresh()
        } catch (error) {
            alert('Falha ao excluir item')
        } finally {
            setIsDeleting(false)
        }
    }

    const openModal = (item: PortfolioMedia) => {
        setSelectedMedia(item)
        setShowDeleteConfirm(false)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setSelectedMedia(null)
        document.body.style.overflow = 'auto'
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Modal de Portfolio Lightbox */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
                    >
                        <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 rounded-full">
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row w-full max-w-6xl h-full max-h-[90vh] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Mídia Container */}
                            <div className="flex-1 flex items-center justify-center bg-black relative">
                                {selectedMedia.tipo === 'video' ? (
                                    <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <img src={selectedMedia.url} alt={selectedMedia.titulo || 'Mídia'} className="max-w-full max-h-full object-contain" />
                                )}
                            </div>

                            {/* Informações da Mídia */}
                            <div className="w-full md:w-96 flex flex-col bg-white overflow-y-auto">
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                        <img src={p.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm leading-tight">{p.nome_fantasia || p.nome}</p>
                                            {p.especialidade && <p className="text-xs text-slate-500">{p.especialidade}</p>}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        {selectedMedia.titulo && (
                                            <h2 className="text-xl font-bold text-slate-900 mb-3">{selectedMedia.titulo}</h2>
                                        )}
                                        {selectedMedia.descricao && (
                                            <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">{selectedMedia.descricao}</p>
                                        )}
                                        {selectedMedia.citacao && (
                                            <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-500 mb-6">
                                                <p className="text-sm italic text-slate-700">"{selectedMedia.citacao}"</p>
                                                <span className="block mt-2 text-xs font-semibold text-slate-500">— Feedback do Cliente</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ações do Dono */}
                                    {isOwner && (
                                        <div className="mt-8 pt-4 border-t border-slate-100">
                                            {showDeleteConfirm ? (
                                                <div className="bg-red-50 p-4 rounded-xl">
                                                    <p className="text-sm text-red-800 font-medium mb-3 text-center">Tem certeza que deseja excluir esta mídia para sempre?</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            disabled={isDeleting}
                                                            onClick={() => handleDelete(selectedMedia.id)}
                                                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors"
                                                        >
                                                            {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                                                        </button>
                                                        <button
                                                            disabled={isDeleting}
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="flex-1 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold p-2 rounded-lg hover:bg-red-50 transition-colors w-full justify-center">
                                                    <Trash2 size={18} />
                                                    Remover do Portfólio
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                    alt={p.nome_fantasia || p.nome}
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                                />
                            </div>
                        </div>
                        {/* Online indicator */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h1 className="text-2xl font-bold text-slate-900">{p.nome_fantasia || p.nome}</h1>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                {p.verificado && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                        <CheckCircle size={12} /> Verificado
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Nome real caso use Nome Fantasia */}
                        {p.nome_fantasia && (
                            <p className="text-sm text-slate-500 mb-3 font-medium">{p.nome}</p>
                        )}
                        {!p.nome_fantasia && <div className="mb-3" />}

                        {/* Action buttons */}
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                            {isOwner ? (
                                <>
                                    <Link href="/dashboard/perfil" className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all">
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
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8 mb-4">
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

                        {/* Bio & Links Gerais */}
                        <div>
                            {p.especialidade && (
                                <h2 className="font-bold text-slate-800 text-sm mb-1">{p.especialidade}</h2>
                            )}
                            {p.sobre && (
                                <p className="text-sm text-slate-600 mb-2 whitespace-pre-line">{p.sobre}</p>
                            )}

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                                {p.cidade && (
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                        <MapPin size={12} className="text-slate-400" /> {p.cidade}, {p.estado}
                                    </span>
                                )}
                                {p.disponibilidade && (
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                        <Clock size={12} className="text-slate-400" /> {p.disponibilidade}
                                    </span>
                                )}
                            </div>

                            {/* Social Links Formatted Output */}
                            {(p.website || p.linkedin || p.instagram || p.facebook || p.youtube || p.tiktok || p.kwai || p.perfil_academico) && (
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                                    {p.website && <a href={p.website} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors tooltip" title="Website"><Globe size={18} /></a>}
                                    {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="LinkedIn"><Linkedin size={18} /></a>}
                                    {p.instagram && <a href={`https://instagram.com/${p.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Instagram"><Instagram size={18} /></a>}
                                    {p.facebook && <a href={p.facebook} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Facebook"><Facebook size={18} /></a>}
                                    {p.youtube && <a href={p.youtube} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="YouTube"><Youtube size={18} /></a>}
                                    {p.perfil_academico && <a href={p.perfil_academico} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Perfil Acadêmico/Lattes"><UserCheck size={18} /></a>}
                                </div>
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
                        {p.portfolio?.length ? (
                            p.portfolio.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => openModal(item)}
                                    className="relative group rounded-xl overflow-hidden cursor-pointer aspect-square bg-slate-100"
                                >
                                    {item.tipo === 'video' ? (
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            muted
                                            playsInline
                                            onMouseOver={e => (e.target as HTMLVideoElement).play()}
                                            onMouseOut={e => {
                                                const v = e.target as HTMLVideoElement;
                                                v.pause();
                                                v.currentTime = 0;
                                            }}
                                        />
                                    ) : (
                                        <img src={item.url} alt={item.titulo || 'Portfolio'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-all">
                                        {item.titulo && <span className="block text-white text-xs font-bold truncate">{item.titulo}</span>}
                                    </div>
                                    <div className="absolute top-2 left-2 p-1.5 bg-black/50 rounded-lg text-white backdrop-blur-sm pointer-events-none">
                                        {item.tipo === 'video' ? <Play size={14} className="fill-white" /> : <Grid3X3 size={14} />}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-slate-400">Nenhum item no portfólio ainda.</p>
                            </div>
                        )}
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
