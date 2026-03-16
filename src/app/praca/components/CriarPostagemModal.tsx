'use client'

import { useState, useRef } from 'react'
import { X, Image as ImageIcon, XCircle, Link as LinkIcon, Youtube, Video, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
    isOpen: boolean
    onClose: () => void
    onPostCreated: (post: any) => void
    usuarioId: number
}

// Detecta se a URL é um embed de YouTube ou Instagram
function detectarTipoVideo(url: string): 'youtube' | 'instagram' | 'outro' | null {
    if (!url) return null
    if (/youtube\.com|youtu\.be/.test(url)) return 'youtube'
    if (/instagram\.com/.test(url)) return 'instagram'
    if (/\.(mp4|webm|mov)$/i.test(url)) return 'outro'
    return null
}

// Converte URL do YouTube para embed
function obterYoutubeEmbedId(url: string): string | null {
    const regexps = [
        /youtu\.be\/([^?&#]+)/,
        /youtube\.com\/watch\?v=([^&#]+)/,
        /youtube\.com\/shorts\/([^?&#]+)/,
        /youtube\.com\/embed\/([^?&#]+)/,
    ]
    for (const re of regexps) {
        const m = url.match(re)
        if (m) return m[1]
    }
    return null
}

// Converte URL do Instagram para embed
function obterInstagramEmbedUrl(url: string): string {
    const base = url.split('?')[0].replace(/\/$/, '')
    return `${base}/embed`
}

export default function CriarPostagemModal({ isOpen, onClose, onPostCreated, usuarioId }: Props) {
    const [titulo, setTitulo] = useState('')
    const [conteudo, setConteudo] = useState('')
    const [imagens, setImagens] = useState<string[]>([])
    const [videoUrl, setVideoUrl] = useState('')
    const [videoInputVisivel, setVideoInputVisivel] = useState(false)
    const [uploadando, setUploadando] = useState(false)
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState('')
    const inputFileRef = useRef<HTMLInputElement>(null)

    if (!isOpen) return null

    const tipoVideo = detectarTipoVideo(videoUrl)
    const youtubeId = tipoVideo === 'youtube' ? obterYoutubeEmbedId(videoUrl) : null
    const instagramEmbedUrl = tipoVideo === 'instagram' ? obterInstagramEmbedUrl(videoUrl) : null

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return
        if (imagens.length + files.length > 4) {
            setErro('Máximo de 4 imagens por postagem')
            return
        }
        setUploadando(true)
        setErro('')
        try {
            const urls: string[] = []
            for (const file of files) {
                const ext = file.name.split('.').pop()
                const nome = `postagens/${usuarioId}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
                const { data, error } = await supabase.storage
                    .from('whodo-images')
                    .upload(`postagens/${nome}`, file, { cacheControl: '3600', upsert: false })
                if (error) throw error
                const { data: urlData } = supabase.storage.from('whodo-images').getPublicUrl(data.path)
                urls.push(urlData.publicUrl)
            }
            setImagens(prev => [...prev, ...urls])
        } catch (err: any) {
            setErro('Erro ao fazer upload da imagem: ' + (err.message || 'tente novamente'))
        } finally {
            setUploadando(false)
            if (inputFileRef.current) inputFileRef.current.value = ''
        }
    }

    const removerImagem = (index: number) => {
        setImagens(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!conteudo.trim()) return
        setLoading(true)
        setErro('')

        try {
            const res = await fetch('/api/postagens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo,
                    conteudo,
                    imagens,
                    videoUrl: videoUrl.trim() || null,
                    publico: true
                })
            })

            if (res.ok) {
                const novaPostagem = await res.json()
                onPostCreated(novaPostagem)
                onClose()
                setTitulo('')
                setConteudo('')
                setImagens([])
                setVideoUrl('')
                setVideoInputVisivel(false)
            } else {
                const data = await res.json()
                setErro(data.error || 'Erro ao publicar')
            }
        } catch (error) {
            setErro('Erro ao criar postagem. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                    <h2 className="text-lg font-bold text-slate-900">Criar publicação</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    {/* Título */}
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título (opcional)"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold"
                        maxLength={200}
                    />

                    {/* Textarea */}
                    <textarea
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                        placeholder="Compartilhe algo com a comunidade..."
                        className="w-full p-3 border border-slate-200 rounded-xl min-h-[120px] focus:outline-none focus:border-indigo-500 resize-none text-slate-800"
                        maxLength={1000}
                    />
                    <div className="text-xs text-slate-400 text-right">{conteudo.length}/1000</div>

                    {/* Preview de Imagens */}
                    {imagens.length > 0 && (
                        <div className={`grid gap-2 ${imagens.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {imagens.map((url, i) => (
                                <div key={i} className="relative rounded-xl overflow-hidden">
                                    <img
                                        src={url}
                                        alt={`Imagem ${i + 1}`}
                                        className="w-full h-40 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removerImagem(i)}
                                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Campo de Link de Vídeo */}
                    {videoInputVisivel && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="Cole o link do YouTube ou Instagram..."
                                    className="flex-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setVideoUrl(''); setVideoInputVisivel(false) }}
                                    className="p-2 text-slate-400 hover:text-slate-600"
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>

                            {/* Preview YouTube */}
                            {youtubeId && (
                                <div className="rounded-xl overflow-hidden aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeId}`}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title="YouTube preview"
                                    />
                                </div>
                            )}

                            {/* Preview Instagram */}
                            {instagramEmbedUrl && (
                                <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200 p-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Video size={16} className="text-pink-500" />
                                        <span>Link do Instagram detectado</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 break-all">{videoUrl}</p>
                                </div>
                            )}

                            {videoUrl && !youtubeId && !instagramEmbedUrl && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <LinkIcon size={12} />
                                    Link não reconhecido como YouTube ou Instagram
                                </p>
                            )}
                        </div>
                    )}

                    {/* Erro */}
                    {erro && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{erro}</p>
                    )}

                    {/* Rodapé com ações */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                            {/* Upload de Imagem */}
                            <button
                                type="button"
                                onClick={() => inputFileRef.current?.click()}
                                disabled={uploadando || imagens.length >= 4}
                                title="Adicionar imagem (máx. 4)"
                                className="p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {uploadando ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                            </button>
                            <input
                                ref={inputFileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                            />

                            {/* Adicionar vídeo/link */}
                            <button
                                type="button"
                                onClick={() => setVideoInputVisivel(!videoInputVisivel)}
                                title="Adicionar link de vídeo (YouTube / Instagram)"
                                className={`p-2 rounded-lg transition-colors ${videoInputVisivel ? 'bg-red-50 text-red-500' : 'text-slate-500 hover:bg-red-50 hover:text-red-500'}`}
                            >
                                <Youtube size={20} />
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!conteudo.trim() || loading || uploadando}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    Publicando...
                                </span>
                            ) : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
