'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal, ChevronDown } from 'lucide-react'

function getYoutubeEmbedId(url: string): string | null {
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

function isInstagram(url: string) { return /instagram\.com/.test(url) }

type Props = {
    post: any
    usuarioLogadoId: number
    onLike: (postId: number) => void
    onShare: (postId: number) => void
}

export default function CardPostagem({ post, usuarioLogadoId, onLike, onShare }: Props) {
    const [showFullContent, setShowFullContent] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useEffect(() => {
        if (contentRef.current) {
            const lineHeight = parseInt(getComputedStyle(contentRef.current).lineHeight || '20')
            const maxHeight = lineHeight * 10 // 10 linhas máximo
            setIsOverflowing(contentRef.current.scrollHeight > maxHeight)
        }
    }, [post.conteudo])

    const formatarData = (data: string) => {
        const agora = new Date()
        const postDate = new Date(data)
        const diffMs = agora.getTime() - postDate.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins} min`
        if (diffHours < 24) return `${diffHours} h`
        if (diffDays < 7) return `${diffDays} d`
        return postDate.toLocaleDateString('pt-BR')
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:border-indigo-200 transition-all">
            {/* Cabeçalho do Card */}
            <div className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <Link href={`/perfil/${post.autor.id}`}>
                        <img
                            src={post.autor.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                            alt={post.autor.nome}
                            className="w-10 h-10 rounded-lg object-cover"
                        />
                    </Link>
                    <div>
                        <Link
                            href={`/perfil/${post.autor.id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                            {post.autor.nome}
                        </Link>
                        <p className="text-xs text-slate-500">
                            {post.autor.especialidade || (post.autor.tipo === 'prestador' ? 'Prestador' : 'Cliente')} · {formatarData(post.createdAt)}
                        </p>
                    </div>
                </div>
                <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreHorizontal size={18} className="text-slate-400" />
                </button>
            </div>

            {/* Título da postagem */}
            {post.titulo && (
                <h3 className="text-lg font-bold text-slate-900 mb-2">{post.titulo}</h3>
            )}

            {/* Conteúdo do Card */}
            <div className="px-4 pb-2">
                <div
                    ref={contentRef}
                    className={`text-slate-700 whitespace-pre-wrap break-words ${!showFullContent ? 'max-h-[200px] overflow-hidden' : ''
                        }`}
                    style={{ lineHeight: '1.5' }}
                >
                    {post.conteudo}
                </div>

                {isOverflowing && !showFullContent && (
                    <button
                        onClick={() => setShowFullContent(true)}
                        className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                    >
                        Ver mais <ChevronDown size={14} />
                    </button>
                )}

                {/* Imagens da postagem */}
                {post.imagens && post.imagens.length > 0 && (
                    <div className={`mt-3 grid gap-1 rounded-xl overflow-hidden ${post.imagens.length === 1 ? 'grid-cols-1' : post.imagens.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                        {post.imagens.slice(0, 4).map((url: string, i: number) => (
                            <div key={i} className={`relative ${post.imagens.length === 3 && i === 0 ? 'col-span-2' : ''}`}>
                                <img
                                    src={url}
                                    alt={`Imagem ${i + 1}`}
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Vídeo embed */}
                {post.videoUrl && (() => {
                    const ytId = getYoutubeEmbedId(post.videoUrl)
                    if (ytId) return (
                        <div className="mt-3 rounded-xl overflow-hidden aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${ytId}`}
                                className="w-full h-full"
                                allowFullScreen
                                title="YouTube"
                            />
                        </div>
                    )
                    if (isInstagram(post.videoUrl)) return (
                        <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                            <iframe
                                src={`${post.videoUrl.split('?')[0].replace(/\/$/, '')}/embed`}
                                className="w-full"
                                style={{ minHeight: 400 }}
                                allowFullScreen
                                title="Instagram"
                            />
                        </div>
                    )
                    return null
                })()}
            </div>

            {/* Rodapé do Card - Interações */}
            <div className="px-4 py-3 border-t border-slate-100 mt-2">
                {/* Estatísticas */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>{post._count?.curtidas || 0} curtidas</span>
                    <span>{post._count?.comentarios || 0} comentários · {post._count?.compartilhamentos || 0} compartilhamentos</span>
                </div>

                {/* Botões de ação */}
                <div className="grid grid-cols-4 gap-1">
                    <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${post.curtido
                            ? 'text-red-600 bg-red-50'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Heart size={18} fill={post.curtido ? 'currentColor' : 'none'} />
                        <span className="hidden sm:inline">Gostei</span>
                    </button>

                    <button className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <MessageCircle size={18} />
                        <span className="hidden sm:inline">Comentar</span>
                    </button>

                    <button
                        onClick={() => onShare(post.id)}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <Repeat2 size={18} />
                        <span className="hidden sm:inline">Compartilhar</span>
                    </button>

                    <button className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Send size={18} />
                        <span className="hidden sm:inline">Enviar</span>
                    </button>
                </div>
            </div>
        </div>
    )
}