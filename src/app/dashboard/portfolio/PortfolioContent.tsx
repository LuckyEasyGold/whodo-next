'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FolderOpen, Plus, UploadCloud, Trash2, ArrowLeft,
    Edit, Save, X, Image as ImageIcon, Video, FileText, ChevronRight,
    ZoomIn, ExternalLink, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react'

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
    initialAlbums: Album[]
}

// ─── Circular upload spinner ───────────────────────────────────────────────
function UploadSpinner() {
    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e0e7ff" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="url(#uploadGrad)"
                    strokeWidth="6" strokeLinecap="round" strokeDasharray="213" strokeDashoffset="53"
                    className="animate-spin" style={{ animationDuration: '1.2s' }}
                />
                <defs>
                    <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>
            <UploadCloud size={22} className="text-indigo-500 z-10" />
        </div>
    )
}

// ─── TypeIcon helper ─────────────────────────────────────────────────────────
function TypeIcon({ tipo }: { tipo: string }) {
    if (tipo === 'video') return <Video size={13} className="text-purple-500" />
    if (tipo === 'documento') return <FileText size={13} className="text-blue-500" />
    return <ImageIcon size={13} className="text-emerald-500" />
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ items, startIndex, onClose }: {
    items: MediaItem[]
    startIndex: number
    onClose: () => void
}) {
    const [idx, setIdx] = useState(startIndex)
    const item = items[idx]
    const hasPrev = idx > 0
    const hasNext = idx < items.length - 1

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={onClose}
        >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <div>
                    {item.titulo && <p className="text-white font-semibold text-sm">{item.titulo}</p>}
                    <p className="text-white/50 text-xs">{idx + 1} / {items.length}</p>
                </div>
                <div className="flex items-center gap-2">
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
        </motion.div>
    )
}

// ─── Album Grid View ─────────────────────────────────────────────────────────
function AlbumGrid({ albums, onSelectAlbum, onCreateAlbum }: {
    albums: Album[]
    onSelectAlbum: (a: Album) => void
    onCreateAlbum: () => void
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-slate-900">Meus Álbuns</h2>
                <button onClick={onCreateAlbum} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                    <Plus size={18} /> Novo Álbum
                </button>
            </div>

            {albums.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
                    <FolderOpen className="mx-auto mb-3 text-slate-300" size={48} />
                    <p className="font-semibold text-slate-500 text-lg">Nenhum álbum ainda</p>
                    <p className="text-sm text-slate-400 mt-1 mb-4">Crie um álbum para organizar seus trabalhos</p>
                    <button onClick={onCreateAlbum} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all">
                        <Plus size={16} /> Criar primeiro álbum
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {albums.map((album, i) => (
                        <motion.div
                            key={album.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => onSelectAlbum(album)}
                            className="group cursor-pointer bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 overflow-hidden"
                        >
                            <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden relative">
                                {album.capa_url ? (
                                    <img src={album.capa_url} alt={album.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FolderOpen className="text-indigo-200" size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="text-white" size={20} />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{album.nome}</h3>
                                {album.descricao && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{album.descricao}</p>}
                                <p className="text-xs text-slate-400 mt-2">{album._count.medias} {album._count.medias === 1 ? 'item' : 'itens'}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Album Detail View ───────────────────────────────────────────────────────
function AlbumDetail({ album: initialAlbum, onBack, onDeleted }: {
    album: Album
    onBack: () => void
    onDeleted: () => void
}) {
    const [album, setAlbum] = useState(initialAlbum)
    const [uploading, setUploading] = useState(false)
    const [editingAlbum, setEditingAlbum] = useState(false)
    const [albumForm, setAlbumForm] = useState({ nome: album.nome, descricao: album.descricao || '' })
    const [savingAlbum, setSavingAlbum] = useState(false)
    const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null)
    const [mediaForm, setMediaForm] = useState({ titulo: '', descricao: '', citacao: '' })
    const [savingMedia, setSavingMedia] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [error, setError] = useState('')
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    // Only viewable items (images + videos) for lightbox navigation
    const viewableItems = album.medias.filter(m => m.tipo !== 'documento')

    const openLightbox = (item: MediaItem) => {
        const idx = viewableItems.findIndex(m => m.id === item.id)
        if (idx >= 0) setLightboxIndex(idx)
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        setUploading(true); setError('')
        const formData = new FormData()
        Array.from(e.target.files).forEach(f => formData.append('files', f))
        formData.append('album_id', album.id.toString())
        try {
            const res = await fetch('/api/portfolio/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Erro ao enviar')
            setAlbum(prev => ({
                ...prev,
                medias: [...prev.medias, ...data.uploaded],
                capa_url: prev.capa_url || data.uploaded.find((u: MediaItem) => u.tipo !== 'documento')?.url || null,
                _count: { medias: prev._count.medias + data.uploaded.length }
            }))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao enviar')
        } finally {
            setUploading(false); e.target.value = ''
        }
    }

    const handleSaveAlbum = async () => {
        setSavingAlbum(true)
        try {
            const res = await fetch(`/api/portfolio/albums/${album.id}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(albumForm),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setAlbum(prev => ({ ...prev, nome: data.album.nome, descricao: data.album.descricao }))
            setEditingAlbum(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar')
        } finally { setSavingAlbum(false) }
    }

    const handleSetCover = async (url: string) => {
        try {
            const res = await fetch(`/api/portfolio/albums/${album.id}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ capa_url: url }),
            })
            if (!res.ok) throw new Error('Erro ao definir capa')
            setAlbum(prev => ({ ...prev, capa_url: url }))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao definir capa')
        }
    }

    const openMediaEditor = (item: MediaItem) => {
        setEditingMedia(item)
        setMediaForm({ titulo: item.titulo || '', descricao: item.descricao || '', citacao: item.citacao || '' })
    }

    const handleSaveMedia = async () => {
        if (!editingMedia) return
        setSavingMedia(true)
        try {
            const res = await fetch(`/api/portfolio/${editingMedia.id}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mediaForm),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setAlbum(prev => ({
                ...prev,
                medias: prev.medias.map(m => m.id === editingMedia.id ? { ...m, ...mediaForm } : m)
            }))
            setEditingMedia(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar')
        } finally { setSavingMedia(false) }
    }

    const handleDeleteMedia = async (id: number) => {
        if (!confirm('Remover esta mídia do álbum?')) return
        setDeletingId(id)
        try {
            const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Erro ao remover')
            setAlbum(prev => ({
                ...prev,
                medias: prev.medias.filter(m => m.id !== id),
                _count: { medias: prev._count.medias - 1 }
            }))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao remover')
        } finally { setDeletingId(null) }
    }

    const handleDeleteAlbum = async () => {
        if (!confirm(`Deletar o álbum "${album.nome}" e todas as suas mídias?`)) return
        try {
            const res = await fetch(`/api/portfolio/albums/${album.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Erro ao deletar')
            onDeleted()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao deletar')
        }
    }

    return (
        <div className="space-y-6">
            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <Lightbox items={viewableItems} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors self-start">
                    <ArrowLeft size={18} /> Voltar
                </button>
                <div className="flex-1">
                    {editingAlbum ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                            <input
                                value={albumForm.nome}
                                onChange={e => setAlbumForm(p => ({ ...p, nome: e.target.value }))}
                                placeholder="Nome do álbum"
                                className="w-full text-xl font-bold border-b border-slate-200 pb-2 outline-none focus:border-indigo-400 text-slate-900 bg-transparent"
                            />
                            <textarea
                                value={albumForm.descricao}
                                onChange={e => setAlbumForm(p => ({ ...p, descricao: e.target.value }))}
                                placeholder="Descrição do álbum (opcional)"
                                rows={3}
                                className="w-full text-sm border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-400 resize-none text-slate-700"
                            />
                            <div className="flex gap-2">
                                <button onClick={handleSaveAlbum} disabled={savingAlbum} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-60">
                                    <Save size={14} /> {savingAlbum ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button onClick={() => setEditingAlbum(false)} className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all">
                                    <X size={14} /> Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900">{album.nome}</h2>
                                    {album.descricao && <p className="text-slate-500 mt-1 text-sm">{album.descricao}</p>}
                                    <p className="text-xs text-slate-400 mt-2">{album._count.medias} {album._count.medias === 1 ? 'item' : 'itens'}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => { setAlbumForm({ nome: album.nome, descricao: album.descricao || '' }); setEditingAlbum(true) }}
                                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Editar álbum">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={handleDeleteAlbum} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Deletar álbum">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">{error}</div>}

            {/* Upload Zone */}
            <div className="relative bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center hover:bg-slate-50 hover:border-indigo-300 transition-all">
                <input type="file" id="album-upload" multiple accept="image/*,video/mp4,video/quicktime,application/pdf,.docx,.txt"
                    className="hidden" onChange={handleUpload} disabled={uploading} />
                <label htmlFor="album-upload" className={`cursor-pointer flex flex-col items-center justify-center gap-3 ${uploading ? 'pointer-events-none' : ''}`}>
                    {uploading ? <UploadSpinner /> : (
                        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <UploadCloud size={28} />
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-slate-900">{uploading ? 'Enviando...' : 'Adicionar fotos, vídeos ou documentos'}</p>
                        <p className="text-xs text-slate-400 mt-1">{uploading ? 'Por favor aguarde' : 'PNG, JPG, MP4, PDF, DOCX'}</p>
                    </div>
                </label>
            </div>

            {/* Media Grid */}
            {album.medias.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {album.medias.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Thumbnail */}
                            <div className="relative group aspect-video bg-slate-100 overflow-hidden">
                                {item.tipo === 'documento' ? (
                                    <div className="flex flex-col items-center justify-center gap-2 h-full p-6">
                                        <FileText size={40} className="text-blue-400" />
                                        <a href={item.url} target="_blank" rel="noreferrer"
                                            className="text-xs text-indigo-600 hover:underline font-medium">Abrir documento</a>
                                    </div>
                                ) : item.tipo === 'video' ? (
                                    <video src={item.url} className="w-full h-full object-cover" muted playsInline
                                        onMouseOver={e => (e.target as HTMLVideoElement).play()}
                                        onMouseOut={e => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
                                    />
                                ) : (
                                    <img src={item.url} alt={item.titulo || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                )}

                                {/* Type badge */}
                                <div className="absolute top-2 left-2 bg-white/90 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                    <TypeIcon tipo={item.tipo} />
                                </div>

                                {/* Cover indicator */}
                                {album.capa_url === item.url && (
                                    <div className="absolute top-2 right-2 bg-amber-400 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        ★ Capa
                                    </div>
                                )}

                                {/* Hover overlay for images/videos */}
                                {item.tipo !== 'documento' && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                                        <div className="flex gap-1.5">
                                            {/* View full size */}
                                            <button onClick={() => openLightbox(item)}
                                                className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/20 text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-all backdrop-blur-sm">
                                                <ZoomIn size={12} /> Ver
                                            </button>
                                            {/* Set as cover */}
                                            {album.capa_url !== item.url && (
                                                <button onClick={() => handleSetCover(item.url)}
                                                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-amber-400/90 text-white text-xs font-semibold rounded-lg hover:bg-amber-500 transition-all backdrop-blur-sm"
                                                    title="Definir como capa do álbum">
                                                    ★ Capa
                                                </button>
                                            )}
                                            <button onClick={() => openMediaEditor(item)}
                                                className="py-1.5 px-2 bg-white/20 text-white text-xs rounded-lg hover:bg-white/30 transition-all backdrop-blur-sm">
                                                <Edit size={12} />
                                            </button>
                                            <button onClick={() => handleDeleteMedia(item.id)} disabled={deletingId === item.id}
                                                className="py-1.5 px-2 bg-red-500/80 text-white text-xs rounded-lg hover:bg-red-600 transition-all">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Document controls */}
                                {item.tipo === 'documento' && (
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button onClick={() => openMediaEditor(item)} className="p-1.5 bg-white text-slate-600 rounded-lg shadow hover:text-indigo-600 transition-colors"><Edit size={12} /></button>
                                        <button onClick={() => handleDeleteMedia(item.id)} className="p-1.5 bg-white text-slate-600 rounded-lg shadow hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
                                    </div>
                                )}
                            </div>

                            {/* Info below thumbnail */}
                            <div className="p-3">
                                {item.titulo ? (
                                    <p className="font-semibold text-slate-900 text-sm">{item.titulo}</p>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">
                                        Sem título{' '}
                                        <button onClick={() => openMediaEditor(item)} className="text-indigo-400 hover:text-indigo-600 underline not-italic">adicionar</button>
                                    </p>
                                )}
                                {item.descricao && (
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{item.descricao}</p>
                                )}
                                {item.citacao && (
                                    <blockquote className="mt-2 border-l-2 border-indigo-300 pl-2 text-xs italic text-slate-500 line-clamp-2">
                                        &ldquo;{item.citacao}&rdquo;
                                    </blockquote>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Media Editor Modal */}
            <AnimatePresence>
                {editingMedia && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingMedia(null)}
                    >
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 text-lg">Editar item</h3>
                                <button onClick={() => setEditingMedia(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} /></button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Título</label>
                                    <input value={mediaForm.titulo} onChange={e => setMediaForm(p => ({ ...p, titulo: e.target.value }))}
                                        placeholder="Ex: Show de encerramento"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição</label>
                                    <textarea value={mediaForm.descricao} onChange={e => setMediaForm(p => ({ ...p, descricao: e.target.value }))}
                                        placeholder="Descreva o trabalho realizado..."
                                        rows={3}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Citação do cliente (opcional)</label>
                                    <textarea value={mediaForm.citacao} onChange={e => setMediaForm(p => ({ ...p, citacao: e.target.value }))}
                                        placeholder='"Ficou perfeito!" — Cliente'
                                        rows={2}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button onClick={handleSaveMedia} disabled={savingMedia}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-60">
                                    <Save size={14} /> {savingMedia ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button onClick={() => setEditingMedia(null)}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all">
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Create Album Modal ───────────────────────────────────────────────────────
function CreateAlbumModal({ onClose, onCreate }: { onClose: () => void; onCreate: (a: Album) => void }) {
    const [form, setForm] = useState({ nome: '', descricao: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        if (!form.nome.trim()) { setError('Digite um nome para o álbum'); return }
        setLoading(true)
        try {
            const res = await fetch('/api/portfolio/albums', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            onCreate(data.album)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar álbum')
        } finally { setLoading(false) }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Plus size={20} className="text-indigo-600" /> Novo Álbum
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                </div>
                {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nome do Álbum *</label>
                        <input autoFocus value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="Ex: Programa de Rock 2024"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição (opcional)</label>
                        <textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                            placeholder="Conte um pouco sobre este trabalho..."
                            rows={3}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
                        />
                    </div>
                </div>
                <div className="flex gap-2 pt-1">
                    <button onClick={handleSubmit} disabled={loading}
                        className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-60">
                        {loading ? 'Criando...' : 'Criar Álbum'}
                    </button>
                    <button onClick={onClose}
                        className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all">
                        Cancelar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function PortfolioContent({ initialAlbums }: Props) {
    const [albums, setAlbums] = useState<Album[]>(initialAlbums)
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)

    const handleAlbumCreated = (album: Album) => {
        setAlbums(prev => [album, ...prev])
        setShowCreateModal(false)
        setSelectedAlbum(album)
    }

    const handleAlbumDeleted = () => {
        if (selectedAlbum) {
            setAlbums(prev => prev.filter(a => a.id !== selectedAlbum.id))
            setSelectedAlbum(null)
        }
    }

    return (
        <div>
            <AnimatePresence>
                {showCreateModal && (
                    <CreateAlbumModal onClose={() => setShowCreateModal(false)} onCreate={handleAlbumCreated} />
                )}
            </AnimatePresence>

            {selectedAlbum ? (
                <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} onDeleted={handleAlbumDeleted} />
            ) : (
                <AlbumGrid albums={albums} onSelectAlbum={setSelectedAlbum} onCreateAlbum={() => setShowCreateModal(true)} />
            )}
        </div>
    )
}
