'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal, ChevronDown, X, Maximize2 } from 'lucide-react'

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

function isVideoFile(url: string): boolean {
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
}

type Props = {
    post: any
    usuarioLogadoId: number
    onLike: (postId: number) => void
    onShare: (postId: number) => void
}

export default function CardPostagem({ post, usuarioLogadoId, onLike, onShare }: Props) {
    const [showFullContent, setShowFullContent] = useState(false)
    const [showMediaModal, setShowMediaModal] = useState(false)
    const [mediaIndex, setMediaIndex] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useEffect(() => {
        if (contentRef.current) {
            const lineHeight = parseInt(getComputedStyle(contentRef.current).lineHeight || '20')
            const maxHeight = lineHeight * 10 // 10 linhas máximo
            setIsOverflowing(contentRef.current.scrollHeight > maxHeight)
        }
    }, [post.conteudo])

    // Obter todas as mídias (imagens + vídeos locais)
    const getMediaItems = () => {
        const items: { type: 'image' | 'video'; url: string }[] = []

        if (post.imagens) {
            post.imagens.forEach((url: string) => {
                items.push({ type: 'image', url })
            })
        }

        if (post.videoUrl) {
            // Se for URL do YouTube/Instagram, não adiciona aqui (tratado separadamente)
            // Se for arquivo de vídeo local
            if (isVideoFile(post.videoUrl)) {
                items.push({ type: 'video', url: post.videoUrl })
            }
        }

        return items
    }

    const mediaItems = getMediaItems()
    const hasMedia = mediaItems.length > 0 || post.videoUrl

    // Funções para navegação no modal
    const openMediaModal = (index: number) => {
        setMediaIndex(index)
        setShowMediaModal(true)
    }

    const closeMediaModal = () => {
        setShowMediaModal(false)
    }

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

    // Função para renderizar o mosaico de mídias
    const renderMediaGrid = () => {
        if (!hasMedia) return null

        // Se tem apenas 1 mídia
        if (mediaItems.length === 1 && !post.videoUrl) {
            return (
                <div
                    className="mt-3 rounded-xl overflow-hidden cursor-pointer relative group"
                    onClick={() => openMediaModal(0)}
                >
                    <img
                        src={mediaItems[0].url}
                        alt="Mídia"
                        className="w-full max-h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 drop-shadow-lg" />
                    </div>
                </div>
            )
        }

        // Se tem 2 mídias
        if (mediaItems.length === 2) {
            return (
                <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                    {mediaItems.map((item, i) => (
                        <div
                            key={i}
                            className="relative cursor-pointer group"
                            onClick={() => openMediaModal(i)}
                        >
                            {item.type === 'image' ? (
                                <img
                                    src={item.url}
                                    alt={`Mídia ${i + 1}`}
                                    className="w-full h-40 sm:h-48 object-cover"
                                />
                            ) : (
                                <video
                                    src={item.url}
                                    className="w-full h-40 sm:h-48 object-cover"
                                    controls
                                />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 drop-shadow-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        // Se tem 3 mídias (1 grande + 2 pequenas)
        if (mediaItems.length === 3) {
            return (
                <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                    <div
                        className="row-span-2 relative cursor-pointer group"
                        onClick={() => openMediaModal(0)}
                    >
                        <img
                            src={mediaItems[0].url}
                            alt="Mídia 1"
                            className="w-full h-full min-h-[160px] sm:min-h-[192px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 drop-shadow-lg" />
                        </div>
                    </div>
                    {mediaItems.slice(1, 3).map((item, i) => (
                        <div
                            key={i + 1}
                            className="relative cursor-pointer group"
                            onClick={() => openMediaModal(i + 1)}
                        >
                            {item.type === 'image' ? (
                                <img
                                    src={item.url}
                                    alt={`Mídia ${i + 2}`}
                                    className="w-full h-20 sm:h-24 object-cover"
                                />
                            ) : (
                                <video
                                    src={item.url}
                                    className="w-full h-20 sm:h-24 object-cover"
                                    controls
                                />
                            )}
                            {/* Indicador de mais imagens */}
                            {i === 1 && mediaItems.length > 3 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">+{mediaItems.length - 3}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 drop-shadow-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        // Se tem 4+ mídias (grid 2x2 com indicador)
        return (
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                {mediaItems.slice(0, 4).map((item, i) => (
                    <div
                        key={i}
                        className="relative cursor-pointer group"
                        onClick={() => openMediaModal(i)}
                    >
                        {item.type === 'image' ? (
                            <img
                                src={item.url}
                                alt={`Mídia ${i + 1}`}
                                className="w-full h-32 sm:h-40 object-cover"
                            />
                        ) : (
                            <video
                                src={item.url}
                                className="w-full h-32 sm:h-40 object-cover"
                                controls
                            />
                        )}
                        {/* Indicador de mais imagens */}
                        {i === 3 && mediaItems.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">+{mediaItems.length - 4}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 drop-shadow-lg" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Função para renderizar vídeo do YouTube
    const renderYoutubeVideo = () => {
        if (!post.videoUrl) return null

        const ytId = getYoutubeEmbedId(post.videoUrl)
        if (ytId) {
            return (
                <div className="mt-3 rounded-xl overflow-hidden aspect-video">
                    <iframe
                        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube"
                    />
                </div>
            )
        }
        return null
    }

    return (
        <>
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2 px-4">{post.titulo}</h3>
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

                    {/* Mosaico de mídias */}
                    {renderMediaGrid()}

                    {/* Vídeo YouTube (tratado separadamente) */}
                    {renderYoutubeVideo()}
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

            {/* Modal de Mídia (Lightbox) */}
            {showMediaModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={closeMediaModal}
                >
                    {/* Botão fechar */}
                    <button
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-10"
                        onClick={closeMediaModal}
                    >
                        <X size={24} />
                    </button>

                    {/* Contador */}
                    {mediaItems.length > 1 && (
                        <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                            {mediaIndex + 1} / {mediaItems.length}
                        </div>
                    )}

                    {/* Mídia */}
                    <div
                        className="max-w-full max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {mediaItems[mediaIndex]?.type === 'image' ? (
                            <img
                                src={mediaItems[mediaIndex].url}
                                alt={`Mídia ${mediaIndex + 1}`}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                            />
                        ) : (
                            <video
                                src={mediaItems[mediaIndex].url}
                                className="max-w-full max-h-[85vh] rounded-lg"
                                controls
                                autoPlay
                            />
                        )}
                    </div>

                    {/* Navegação */}
                    {mediaItems.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 text-white hover:bg-white/20 rounded-full p-3 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1))
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <button
                                className="absolute right-4 text-white hover:bg-white/20 rounded-full p-3 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setMediaIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0))
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    )
}
