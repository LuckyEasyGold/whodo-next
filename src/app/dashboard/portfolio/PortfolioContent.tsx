'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Trash2, Loader2, Image as ImageIcon, Video, X, Save, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PortfolioItem = {
    id: number
    url: string
    tipo: string
    titulo: string | null
    descricao: string | null
    citacao: string | null
}

type Props = {
    initialMedia: PortfolioItem[]
}

export default function PortfolioContent({ initialMedia }: Props) {
    const router = useRouter()
    const [media, setMedia] = useState<PortfolioItem[]>(initialMedia)
    const [uploading, setUploading] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [error, setError] = useState('')

    // Editor Modal State
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
    const [editForm, setEditForm] = useState({ titulo: '', descricao: '', citacao: '' })
    const [savingDetails, setSavingDetails] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const files = Array.from(e.target.files)
        setUploading(true)
        setError('')

        const formData = new FormData()
        files.forEach(file => {
            formData.append('files', file)
        })

        try {
            const res = await fetch('/api/portfolio/upload', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao enviar arquivos')
            }

            setMedia([...data.uploaded, ...media])
            router.refresh()

            // Auto open the first uploaded item to edit its details
            if (data.uploaded.length > 0) {
                openEditor(data.uploaded[0])
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja remover este item?')) return

        setDeletingId(id)
        setError('')

        try {
            const res = await fetch(`/api/portfolio/${id}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Erro ao remover item')
            }

            setMedia(media.filter(m => m.id !== id))
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setDeletingId(null)
        }
    }

    const openEditor = (item: PortfolioItem) => {
        setEditingItem(item)
        setEditForm({
            titulo: item.titulo || '',
            descricao: item.descricao || '',
            citacao: item.citacao || ''
        })
        document.body.style.overflow = 'hidden'
    }

    const closeEditor = () => {
        setEditingItem(null)
        document.body.style.overflow = 'auto'
    }

    const handleSaveDetails = async () => {
        if (!editingItem) return
        setSavingDetails(true)
        try {
            const res = await fetch(`/api/portfolio/${editingItem.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            })

            if (!res.ok) throw new Error('Erro ao salvar detalhes')

            const { media: updatedMedia } = await res.json()

            // Update local state
            setMedia(media.map(m => m.id === updatedMedia.id ? updatedMedia : m))
            closeEditor()
            router.refresh()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setSavingDetails(false)
        }
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {error}
                </div>
            )}

            {/* Upload Zone */}
            <div className="bg-white rounded-2xl border border-slate-100 border-dashed p-8 text-center hover:bg-slate-50 transition-colors">
                <input
                    type="file"
                    id="portfolio-upload"
                    multiple
                    accept="image/*,video/mp4,video/quicktime"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <label
                    htmlFor="portfolio-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-3"
                >
                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        {uploading ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-lg">
                            {uploading ? 'Enviando...' : 'Clique para enviar fotos ou vídeos'}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">PNG, JPG, MP4 até 10MB</p>
                    </div>
                </label>
            </div>

            {/* Media Grid */}
            {media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {media.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-2xl overflow-hidden group bg-slate-100 border border-slate-200 cursor-pointer"
                            onClick={() => openEditor(item)}
                        >
                            {item.tipo === 'video' ? (
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                                <img src={item.url} alt={item.titulo || 'Portfolio item'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            )}

                            {/* Label Preview */}
                            {(item.titulo || item.citacao) && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 pointer-events-none">
                                    {item.titulo && <span className="block text-white text-xs font-bold truncate">{item.titulo}</span>}
                                    {item.citacao && <span className="block text-white/80 text-[10px] truncate italic">&quot;{item.citacao}&quot;</span>}
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openEditor(item); }}
                                    className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors tooltip"
                                    title="Editar Detalhes"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    disabled={deletingId === item.id}
                                    className="p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 tooltip"
                                    title="Remover"
                                >
                                    {deletingId === item.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                </button>
                            </div>

                            {/* Type Icon indicator */}
                            <div className="absolute top-2 left-2 p-1.5 bg-black/60 rounded-lg text-white backdrop-blur-sm pointer-events-none">
                                {item.tipo === 'video' ? <Video size={14} /> : <ImageIcon size={14} />}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 px-4 rounded-2xl border border-slate-100 bg-white">
                    <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Seu portfólio está vazio</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">
                        Mostre a qualidade do seu trabalho. Clientes com portfólio completo têm 3x mais chances de serem contatados.
                    </p>
                </div>
            )}

            {/* Modal de Edição (Lightbox Style) */}
            <AnimatePresence>
                {editingItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
                    >
                        <button onClick={closeEditor} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 rounded-full">
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row w-full max-w-5xl h-full max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
                            {/* Mídia Container */}
                            <div className="flex-1 flex items-center justify-center bg-slate-900 relative p-4">
                                {editingItem.tipo === 'video' ? (
                                    <video src={editingItem.url} controls autoPlay className="max-w-full max-h-full rounded-xl object-contain shadow-lg" />
                                ) : (
                                    <img src={editingItem.url} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain shadow-lg" />
                                )}
                            </div>

                            {/* Formulário */}
                            <div className="w-full md:w-[400px] flex flex-col bg-white overflow-y-auto border-l border-slate-100">
                                <div className="p-6">
                                    <h2 className="text-xl font-extrabold text-slate-900 mb-6">Detalhes do Projeto</h2>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Título do Projeto</label>
                                            <input
                                                type="text"
                                                value={editForm.titulo}
                                                onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                                                placeholder="Ex: Reforma de Cozinha"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contexto / Descrição</label>
                                            <textarea
                                                value={editForm.descricao}
                                                onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                                                rows={4}
                                                placeholder="Conte um pouco sobre as técnicas usadas, o problema que resolveu..."
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white resize-none"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Citação do Cliente (Opcional)</label>
                                            <textarea
                                                value={editForm.citacao}
                                                onChange={(e) => setEditForm({ ...editForm, citacao: e.target.value })}
                                                rows={3}
                                                placeholder="Ex: Trabalho excelente, muito atencioso com os detalhes!"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
                                    <button
                                        onClick={handleSaveDetails}
                                        disabled={savingDetails}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
                                    >
                                        {savingDetails ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {savingDetails ? 'Salvando...' : 'Salvar Detalhes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
