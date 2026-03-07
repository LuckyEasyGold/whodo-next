'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, CheckCircle, Clock, MessageSquare, Calendar, Settings, Grid3X3, Play, Briefcase, ExternalLink, X, Trash2, Globe, Linkedin, Facebook, Instagram, Youtube, UserCheck, MessageCircle, ArrowLeft, FileText, ChevronLeft, ChevronRight as ChevronRightIcon, Video, Send, Loader2 } from 'lucide-react'
import ContratarModal from './ContratarModal'
import AvaliarModal from './AvaliarModal'

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ items, startIndex, onClose, isVisitor }: {
    items: MediaItem[]
    startIndex: number
    onClose: () => void
    isVisitor?: boolean
}) {
    const [idx, setIdx] = useState(startIndex)
    const item = items[idx]
    const hasPrev = idx > 0
    const hasNext = idx < items.length - 1

    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState<any[]>([])
    const [isLoadingComments, setIsLoadingComments] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [isPosting, setIsPosting] = useState(false)

    // Load comments when item changes
    useEffect(() => {
        if (!showComments || !item) return
        let active = true
        setIsLoadingComments(true)
        fetch(`/api/portfolio/comentarios/${item.id}`)
            .then(res => res.json())
            .then(data => {
                if (active && data.comentarios) setComments(data.comentarios)
            })
            .finally(() => { if (active) setIsLoadingComments(false) })
        return () => { active = false }
    }, [item, showComments])

    const handlePostComment = async () => {
        if (!newComment.trim() || isPosting) return
        setIsPosting(true)
        try {
            const res = await fetch(`/api/portfolio/comentarios/${item.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: newComment })
            })
            const data = await res.json()
            if (res.ok && data.comentario) {
                setComments(prev => [...prev, data.comentario])
                setNewComment('')
            } else {
                alert(data.error || 'Erro ao publicar comentário')
            }
        } catch (error) {
            alert('Erro de conexão ao publicar comentário')
        } finally {
            setIsPosting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex overflow-hidden"
            onClick={onClose}
        >
            {/* Left side: Media & Info */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${showComments ? 'w-full md:w-2/3 lg:w-3/4' : 'w-full'}`}>
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <div>
                        {item.titulo && <p className="text-white font-semibold text-sm">{item.titulo}</p>}
                        <p className="text-white/50 text-xs">{idx + 1} / {items.length}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isVisitor && (
                            <button onClick={() => setShowComments(!showComments)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${showComments ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
                                <MessageCircle size={16} /> Comentários
                            </button>
                        )}
                        <a href={item.url} target="_blank" rel="noreferrer"
                            className="p-2 text-white/70 hover:text-white rounded-full transition-colors" title="Abrir em nova aba">
                            <ExternalLink size={20} />
                        </a>
                        <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Media area */}
                <div className="flex-1 flex items-center justify-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
                    {/* Prev button */}
                    {hasPrev && (
                        <button onClick={() => setIdx(i => i - 1)}
                            className="absolute left-3 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm">
                            <ChevronLeft size={28} />
                        </button>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div key={item.id}
                            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center w-full h-full px-16"
                        >
                            {item.tipo === 'video' ? (
                                <video src={item.url} controls autoPlay
                                    className="max-w-full max-h-full rounded-xl shadow-2xl"
                                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                                />
                            ) : (
                                <img src={item.url} alt={item.titulo || ''}
                                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Next button */}
                    {hasNext && (
                        <button onClick={() => setIdx(i => i + 1)}
                            className="absolute right-3 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm">
                            <ChevronRightIcon size={28} />
                        </button>
                    )}
                </div>

                {/* Bottom info */}
                {(item.descricao || item.citacao) && (
                    <div className="flex-shrink-0 px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                        {item.descricao && <p className="text-white/80 text-sm">{item.descricao}</p>}
                        {item.citacao && (
                            <p className="text-white/50 text-xs italic mt-1">&ldquo;{item.citacao}&rdquo;</p>
                        )}
                    </div>
                )}

                {/* Thumbnail strip */}
                {items.length > 1 && (
                    <div className="flex-shrink-0 flex gap-2 justify-center pb-4 px-4 overflow-x-auto" onClick={e => e.stopPropagation()}>
                        {items.map((it, i) => (
                            <button key={it.id} onClick={() => setIdx(i)}
                                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? 'border-indigo-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                                {it.tipo === 'video' ? (
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                        <Video size={16} className="text-white" />
                                    </div>
                                ) : it.tipo === 'documento' ? (
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                        <FileText size={16} className="text-white" />
                                    </div>
                                ) : (
                                    <img src={it.url} alt="" className="w-full h-full object-cover" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right side: Comments Panel */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="w-full md:w-1/3 lg:w-1/4 h-full bg-white flex flex-col border-l border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white text-slate-800">
                            <h3 className="font-bold text-slate-900">Comentários</h3>
                            <button onClick={() => setShowComments(false)} className="text-slate-400 hover:text-slate-600 md:hidden"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                            {isLoadingComments ? (
                                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-indigo-400" size={24} /></div>
                            ) : comments.length === 0 ? (
                                <p className="text-center text-sm text-slate-400 py-8">Nenhum comentário ainda. Seja o primeiro!</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                        <img src={comment.usuario.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'} className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200" />
                                        <div>
                                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                                <p className="text-xs font-bold text-slate-900 mb-1">{comment.usuario.nome_fantasia || comment.usuario.nome}</p>
                                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{comment.texto}</p>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1 ml-1">
                                                {new Date(comment.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex gap-2 relative">
                                <textarea
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="Adicionar comentário..."
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none pr-12 text-slate-800"
                                    rows={1}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handlePostComment()
                                        }
                                    }}
                                />
                                <button
                                    onClick={handlePostComment}
                                    disabled={isPosting || !newComment.trim()}
                                    className="absolute right-2 top-2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isPosting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-center">Pressione Enter para enviar</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

type MediaItem = {
    id: number
    url: string
    tipo: string
    titulo: string | null
    descricao: string | null
    citacao: string | null
}

type Album = {
    id: number
    nome: string
    descricao: string | null
    capa_url: string | null
    _count: { medias: number }
    medias: MediaItem[]
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

        portfolioAlbuns: Album[]
        servicos: { id: number; titulo: string; descricao: string | null; preco_base: any; unidade_medida: string | null; cobranca_tipo: string; categoria: { nome: string } }[]
        avaliacoesRecebidas: { id: number; nota: any; comentario: string | null; data_avaliacao: string; cliente: { nome: string; foto_perfil: string | null }; servico: { titulo: string } }[]
    }
    isOwner: boolean
    initialIsFollowing: boolean
    stats: { totalServicos: number; totalAvaliacoes: number; mediaAvaliacao: number; seguidores: number; seguindo: number }
}

type Tab = 'portfolio' | 'servicos' | 'avaliacoes'



export default function ProfileContent({ usuario, isOwner, initialIsFollowing, stats }: Props) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('portfolio')
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [showContratarModal, setShowContratarModal] = useState(false)
    const [showAvaliarModal, setShowAvaliarModal] = useState(false)
    const [isChatLoading, setIsChatLoading] = useState(false)
    const [avaliacoes, setAvaliacoes] = useState(usuario.avaliacoesRecebidas || [])

    // Follower State
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [followersCount, setFollowersCount] = useState(stats.seguidores)
    const [isFollowLoading, setIsFollowLoading] = useState(false)

    // Only viewable items (images + videos) for lightbox navigation
    const viewableItems = selectedAlbum?.medias.filter((m: MediaItem) => m.tipo !== 'documento') || []

    async function handleFollow() {
        if (!usuario.id) return
        setIsFollowLoading(true)
        // Optimistic update
        const pastFollowing = isFollowing
        setIsFollowing(!pastFollowing)
        setFollowersCount(c => pastFollowing ? c - 1 : c + 1)

        try {
            const res = await fetch('/api/seguidores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seguido_id: usuario.id })
            })
            const data = await res.json()
            if (!res.ok) {
                // Revert if error
                setIsFollowing(pastFollowing)
                setFollowersCount(c => pastFollowing ? c + 1 : c - 1)
                alert(data.error || 'Erro ao seguir usuário')
            } else {
                // Sync with actual server state
                setIsFollowing(data.following)
            }
        } catch (err) {
            console.error(err)
            // Revert on catch
            setIsFollowing(pastFollowing)
            setFollowersCount(c => pastFollowing ? c + 1 : c - 1)
        } finally {
            setIsFollowLoading(false)
        }
    }

    async function handleIniciarChat() {
        if (!p.id) return
        setIsChatLoading(true)
        try {
            const res = await fetch('/api/mensagens/iniciar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prestador_id: p.id })
            })
            const data = await res.json()
            if (res.ok && data.solicitacao_id) {
                router.push(`/dashboard/mensagens?conversa=${data.solicitacao_id}`)
            } else {
                alert(data.error || 'Erro ao iniciar conversa')
            }
        } catch (error) {
            console.error(error)
            alert('Erro de conexão ao iniciar conversa')
        } finally {
            setIsChatLoading(false)
        }
    }

    const p = usuario
    const rating = Number(p.avaliacao_media || 0)

    const tabs: { key: Tab; label: string; icon: any }[] = [
        { key: 'portfolio', label: 'Portfólio', icon: Grid3X3 },
        { key: 'servicos', label: 'Serviços', icon: Briefcase },
        { key: 'avaliacoes', label: 'Avaliações', icon: Star },
    ]

    const openMedia = (item: MediaItem) => {
        const idx = viewableItems.findIndex((m: MediaItem) => m.id === item.id)
        if (idx >= 0) {
            setLightboxIndex(idx)
            document.body.style.overflow = 'hidden'
        }
    }

    const closeLightbox = () => {
        setLightboxIndex(null)
        document.body.style.overflow = 'auto'
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Modal de Portfolio Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <Lightbox items={viewableItems} startIndex={lightboxIndex} onClose={closeLightbox} isVisitor={!isOwner} />
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
                                    <button
                                        onClick={handleFollow}
                                        disabled={isFollowLoading}
                                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${isFollowing
                                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/25'
                                            }`}
                                    >
                                        <UserCheck size={14} className="inline mr-1.5 -mt-0.5" />
                                        {isFollowing ? 'Seguindo' : 'Seguir'}
                                    </button>
                                    <button onClick={() => setShowContratarModal(true)} className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 transition-all">
                                        <Calendar size={14} className="inline mr-1.5 -mt-0.5" /> Contratar
                                    </button>
                                    <button
                                        onClick={handleIniciarChat}
                                        disabled={isChatLoading}
                                        className="px-5 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center h-[38px]"
                                    >
                                        <MessageSquare size={14} className="mr-1.5" />
                                        {isChatLoading ? 'Carreg...' : 'Mensagem'}
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
                                <span className="font-bold text-slate-900 block">{followersCount}</span>
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
                            {/* Social Links Formatted Output */}
                            {(p.website || p.linkedin || p.instagram || p.facebook || p.youtube || p.tiktok || p.kwai || p.perfil_academico) && (
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                                    {p.website && <a href={p.website} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors tooltip" title="Website"><Globe size={18} /></a>}
                                    {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="LinkedIn"><Linkedin size={18} /></a>}
                                    {p.instagram && <a href={`https://instagram.com/${p.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Instagram"><Instagram size={18} /></a>}
                                    {p.facebook && <a href={p.facebook} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Facebook"><Facebook size={18} /></a>}
                                    {p.youtube && <a href={p.youtube} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="YouTube"><Youtube size={18} /></a>}
                                    {p.perfil_academico && <a href={p.perfil_academico} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Perfil Acadêmico/Lattes"><UserCheck size={18} /></a>}
                                </div>
                            )}

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
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Tabs */}
            <div className="bg-white rounded-t-2xl border border-slate-100 border-b-0">
                <div className="flex justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${activeTab === tab.key
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-slate-400 border-transparent hover:text-slate-600'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-2xl shadow-sm border border-slate-100 border-t-0 p-4 sm:p-6 mb-6">
                {activeTab === 'portfolio' && (
                    <div>
                        {!selectedAlbum ? (
                            // Album grid
                            p.portfolioAlbuns?.length ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {p.portfolioAlbuns.map((album: Album, i: number) => (
                                        <motion.div
                                            key={album.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => setSelectedAlbum(album)}
                                            className="cursor-pointer group rounded-xl overflow-hidden border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all bg-white"
                                        >
                                            <div className="aspect-square bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
                                                {album.capa_url ? (
                                                    <img src={album.capa_url} alt={album.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Grid3X3 className="text-indigo-200" size={32} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                            </div>
                                            <div className="p-3">
                                                <p className="font-bold text-slate-900 text-sm truncate">{album.nome}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{album._count.medias} {album._count.medias === 1 ? 'item' : 'itens'}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-400">Nenhum trabalho no portfólio ainda.</p>
                                </div>
                            )
                        ) : (
                            // Album content view
                            <div>
                                <button onClick={() => setSelectedAlbum(null)} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-sm font-semibold mb-4 transition-colors">
                                    <ArrowLeft size={16} /> Voltar
                                </button>
                                <div className="mb-4">
                                    <h3 className="text-xl font-extrabold text-slate-900">{selectedAlbum.nome}</h3>
                                    {selectedAlbum.descricao && <p className="text-sm text-slate-500 mt-1">{selectedAlbum.descricao}</p>}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {selectedAlbum.medias.map((item: MediaItem, i: number) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => item.tipo !== 'documento' && openMedia(item)}
                                            className={`relative group rounded-xl overflow-hidden aspect-square bg-slate-100 ${item.tipo !== 'documento' ? 'cursor-pointer' : ''}`}
                                        >
                                            {item.tipo === 'video' ? (
                                                <video src={item.url} className="w-full h-full object-cover" muted playsInline
                                                    onMouseOver={e => (e.target as HTMLVideoElement).play()}
                                                    onMouseOut={e => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
                                                />
                                            ) : item.tipo === 'documento' ? (
                                                <a href={item.url} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2 h-full p-4">
                                                    <FileText size={32} className="text-blue-400" />
                                                    <span className="text-xs text-slate-600 text-center font-medium">{item.titulo || 'Documento'}</span>
                                                </a>
                                            ) : (
                                                <img src={item.url} alt={item.titulo || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            )}
                                            {item.tipo !== 'documento' && (
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 transition-all">
                                                    {item.titulo && <span className="block text-white text-xs font-bold truncate">{item.titulo}</span>}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
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
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">Avaliações</h3>
                            {!isOwner && (
                                <button onClick={() => setShowAvaliarModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all">
                                    <Star size={14} className="inline mr-1" /> Avaliar
                                </button>
                            )}
                        </div>

                        {avaliacoes.length === 0 ? (
                            <p className="text-center text-slate-400 py-10">Nenhuma avaliação ainda</p>
                        ) : (
                            avaliacoes.map((a) => (
                                <div key={a.id} className="p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={a.cliente?.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                            alt={a.cliente?.nome || 'Usuário'}
                                            className="w-9 h-9 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{a.cliente?.nome || 'Anônimo'}</h4>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} size={12} className={i <= Math.round(Number(a.nota)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                                                ))}
                                                <span className="text-xs text-slate-400 ml-1">{new Date(a.data_avaliacao).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {a.comentario && <p className="text-sm text-slate-600 border-l-2 border-indigo-200 pl-3 italic mt-3 mb-2">{a.comentario}</p>}
                                    <p className="text-xs font-semibold text-indigo-500 mt-2 bg-indigo-50 inline-block px-2 py-1 rounded-md">Serviço: {a.servico?.titulo || 'Serviço excluído'}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modal de Contratar */}
            <ContratarModal
                usuario={usuario}
                isOpen={showContratarModal}
                onClose={() => setShowContratarModal(false)}
            />

            {/* Modal de Avaliar */}
            <AvaliarModal
                usuarioId={usuario.id}
                servicos={usuario.servicos.map(s => ({ id: s.id, titulo: s.titulo }))}
                isOpen={showAvaliarModal}
                onClose={() => setShowAvaliarModal(false)}
                onAvaliacaoCriada={(novaAvaliacao) => {
                    setAvaliacoes(prev => [novaAvaliacao, ...prev])
                }}
            />
        </div>
    )
}
