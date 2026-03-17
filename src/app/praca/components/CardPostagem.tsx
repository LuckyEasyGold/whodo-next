'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
    Heart, MessageCircle, Repeat2, Send, MoreHorizontal, 
    ChevronDown, X, Maximize2, Bookmark, Edit2, Trash2, Share2, 
    ArrowRight, SendHorizontal, Eye, UserPlus, UserCheck, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useToast } from '@/components/Toast'

function getYoutubeEmbedId(url: string): string | null {
    if (!url) return null
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
    if (!url) return false
    return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
}

function formatarData(dataString: string) {
    if (!dataString) return ''
    const data = new Date(dataString)
    const agora = new Date()
    const diffEmSegundos = Math.floor((agora.getTime() - data.getTime()) / 1000)

    if (diffEmSegundos < 60) return 'agora mesmo'
    if (diffEmSegundos < 3600) return `${Math.floor(diffEmSegundos / 60)} min`
    if (diffEmSegundos < 86400) return `${Math.floor(diffEmSegundos / 3600)} h`
    if (diffEmSegundos < 604800) return `${Math.floor(diffEmSegundos / 86400)} d`

    return data.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: data.getFullYear() !== agora.getFullYear() ? 'numeric' : undefined
    })
}

type Props = {
    post: any
    usuarioLogadoId: number
    onLike: (postId: number) => void
    onShare: (postId: number) => void
    onDelete?: (postId: number) => void
    onUpdate?: (post: any) => void
}

export default function CardPostagem({ post, usuarioLogadoId, onLike, onShare, onDelete, onUpdate }: Props) {
    const { showToast } = useToast() || { showToast: null }
    const [showFullContent, setShowFullContent] = useState(false)
    const [showMediaModal, setShowMediaModal] = useState(false)
    const [mediaIndex, setMediaIndex] = useState(0)
    const [carouselIndex, setCarouselIndex] = useState(0)
    const [showAllComments, setShowAllComments] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [showOptionsMenu, setShowOptionsMenu] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [shareText, setShareText] = useState('')
    const [editTitulo, setEditTitulo] = useState(post.titulo || '')
    const [editConteudo, setEditConteudo] = useState(post.conteudo || '')
    const [comments, setComments] = useState<any[]>(post.comentarios || [])
    const contentRef = useRef<HTMLDivElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)

    const isAuthor = post.autor?.id === usuarioLogadoId
    const [isFollowing, setIsFollowing] = useState(post.seguindo || false)
    const [isFollowingLoading, setIsFollowingLoading] = useState(false)

    const handleFollow = async () => {
        if (isFollowingLoading || isAuthor) return
        setIsFollowingLoading(true)
        
        try {
            const res = await fetch('/api/seguidores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seguido_id: post.autor?.id })
            })
            const data = await res.json()
            if (data.following !== undefined) {
                setIsFollowing(data.following)
            }
        } catch (error) {
            console.error('Erro ao seguir:', error)
        } finally {
            setIsFollowingLoading(false)
        }
    }

    useEffect(() => {
        if (contentRef.current) {
            setIsOverflowing(contentRef.current.scrollHeight > 200)
        }
    }, [post.conteudo]);

    useEffect(() => {
        // Reseta o carrossel quando o post mudar
        setCarouselIndex(0);
    }, [post.id]);

    const handleDelete = async () => {
        try {
            await fetch(`/api/postagens/${post.id}`, {
                method: 'DELETE',
            })
            onDelete?.(post.id)
            setShowDeleteConfirm(false)
            setShowOptionsMenu(false)
        } catch (error) {
            console.error('Erro ao excluir:', error)
        }
    }

    const handleEdit = async () => {
        try {
            const res = await fetch(`/api/postagens/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo: editTitulo,
                    conteudo: editConteudo,
                }),
            })
            
            if (res.ok) {
                const updatedPost = await res.json()
                onUpdate?.(updatedPost)
                setShowEditModal(false)
                setShowOptionsMenu(false)
            }
        } catch (error) {
            console.error('Erro ao editar:', error)
        }
    }

    const handleComment = async () => {
        if (!commentText.trim()) return
        
        try {
            const res = await fetch(`/api/postagens/${post.id}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conteudo: commentText }),
            })
            
            if (res.ok) {
                const novoComentario = await res.json()
                setComments([...comments, novoComentario])
                setCommentText('')
            }
        } catch (error) {
            console.error('Erro ao comentar:', error)
        }
    }

    const handleShareAction = () => {
        if (!shareText.trim()) return
        
        try {
            fetch(`/api/postagens/${post.id}/compartilhar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensagem: shareText }),
            })
            
            onShare(post.id)
            setShowShareModal(false)
            setShareText('')
        } catch (error) {
            console.error('Erro ao compartilhar:', error)
        }
    }

    const openMediaModal = (index: number) => {
        setMediaIndex(index)
        setShowMediaModal(true)
        document.body.style.overflow = 'hidden'
    }

    // Função para renderizar o mosaico de mídias
    const renderMediaGrid = () => {
        const hasImages = Array.isArray(post.imagens) && post.imagens.length > 0;
        const isDirectVideo = post.videoUrl && isVideoFile(post.videoUrl);
        
        const mediaItems: { type: 'image' | 'video'; url: string }[] = [];
        if (hasImages) {
            post.imagens.forEach((url: string) => mediaItems.push({ type: 'image', url }))
        }
        if (isDirectVideo) {
            mediaItems.push({ type: 'video', url: post.videoUrl })
        }
        if (mediaItems.length === 0) return null;

        const handleNextMedia = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (carouselIndex < mediaItems.length - 1) {
                setCarouselIndex(prev => prev + 1);
            }
        };

        const handlePrevMedia = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (carouselIndex > 0) {
                setCarouselIndex(prev => prev - 1);
            }
        };
        
        const currentItem = mediaItems[carouselIndex];

        return (
            <div 
                className="mt-3 relative rounded-xl overflow-hidden group bg-slate-100 max-h-[500px] flex items-center justify-center aspect-square md:aspect-[16/9]"
                onClick={() => openMediaModal(carouselIndex)}
            >
                {currentItem.type === 'image' ? (
                    <img 
                        src={currentItem.url} 
                        alt={`Mídia ${carouselIndex + 1}`} 
                        className="w-full h-full object-cover cursor-pointer"
                    />
                ) : (
                    <video 
                        src={currentItem.url} 
                        className="w-full h-full object-cover"
                        controls
                        onClick={(e) => e.stopPropagation()}
                    />
                )}

                {/* Carousel Controls */}
                {mediaItems.length > 1 && (
                    <>
                        {carouselIndex > 0 && (
                            <button 
                                onClick={handlePrevMedia}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-opacity opacity-0 group-hover:opacity-100 z-10"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        {carouselIndex < mediaItems.length - 1 && (
                            <button 
                                onClick={handleNextMedia}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-opacity opacity-0 group-hover:opacity-100 z-10"
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}
                    </>
                )}

                {/* Dots Indicator */}
                {mediaItems.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {mediaItems.map((_, i) => (
                            <div 
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === carouselIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const renderYoutubeVideo = () => {
        if (!post.videoUrl || isVideoFile(post.videoUrl)) return null
        
        // Pega do banco o ID já processado ou extrai na hora
        const youtubeId = post.videoYoutubeId || getYoutubeEmbedId(post.videoUrl)
        
        if (youtubeId) {
            return (
                <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-slate-100">
                    <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={post.titulo || "Vídeo"}
                    />
                </div>
            )
        }
        
        return null
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Cabeçalho do Card */}
                <div className="p-4 pb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/perfil/${post.autor?.id}`}>
                            <img
                                src={post.autor?.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                alt={post.autor?.nome}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        </Link>
                        <div>
                            <Link href={`/perfil/${post.autor?.id}`}>
                                <h4 className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors">
                                    {post.autor?.nome}
                                </h4>
                            </Link>
                            <p className="text-xs text-slate-500">
                                {post.autor?.especialidade || 'Profissional'} · {formatarData(post.createdAt)}
                            </p>
                        </div>
                    </div>
                    
                    {/* Menu de opções e Seguir */}
                    <div className="flex items-center gap-2">
                        {!isAuthor && (
                            <button
                                onClick={handleFollow}
                                disabled={isFollowingLoading}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                    isFollowing
                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {isFollowingLoading ? (
                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isFollowing ? (
                                    <>
                                        <UserCheck size={14} />
                                        Seguindo
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={14} />
                                        Seguir
                                    </>
                                )}
                            </button>
                        )}
                        <div className="relative">
                            <button 
                                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <MoreHorizontal size={18} className="text-slate-600" />
                            </button>
                            
                            {showOptionsMenu && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[140px]">
                                    {isAuthor && (
                                        <>
                                            <button
                                                onClick={() => { setShowEditModal(true); setShowOptionsMenu(false) }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                <Edit2 size={16} />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => { setShowDeleteConfirm(true); setShowOptionsMenu(false) }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                                Excluir
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => { setShowShareModal(true); setShowOptionsMenu(false) }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <Share2 size={16} />
                                        Compartilhar
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            try {
                                                const res = await fetch(`/api/postagens/${post.id}/salvar`, { method: 'POST' })
                                                const data = await res.json()
                                                if (showToast) showToast(data.message)
                                            } catch (error) {
                                                console.error('Erro ao salvar:', error)
                                            }
                                            setShowOptionsMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <Bookmark size={16} fill={post.salvo ? 'currentColor' : 'none'} />
                                        {post.salvo ? 'Salvo' : 'Salvar'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mídia (no topo estilo Instagram) */}
                <div onClick={(e) => e.preventDefault()}>
                    {renderMediaGrid()}
                    {renderYoutubeVideo()}
                </div>

                {/* Rodapé do Card - Interações */}
                <div className="p-3 pb-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onLike(post.id)}
                                className={`flex items-center gap-1.5 transition-colors ${post.curtido ? 'text-red-500' : 'text-slate-700 hover:text-red-500'}`}
                            >
                                <Heart size={24} fill={post.curtido ? 'currentColor' : 'none'} />
                                <span className="text-sm font-medium">{post._count?.curtidas || 0}</span>
                            </button>
                            
                            <button
                                className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 transition-colors"
                            >
                                <MessageCircle size={24} />
                                <span className="text-sm font-medium">{comments.length}</span>
                            </button>
                            
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 transition-colors"
                            >
                                <SendHorizontal size={24} />
                                <span className="text-sm font-medium">{post._count?.compartilhamentos || 0}</span>
                            </button>
                        </div>
                        
                        <button
                            onClick={async () => {
                                try {
                                    const res = await fetch(`/api/postagens/${post.id}/salvar`, { method: 'POST' })
                                    const data = await res.json()
                                    if (showToast) showToast(data.message)
                                } catch (error) {
                                    console.error('Erro ao salvar:', error)
                                }
                            }}
                            className={`p-1.5 rounded-full transition-colors ${post.salvo ? 'text-indigo-600' : 'text-slate-700 hover:bg-slate-100'}`}
                        >
                            <Bookmark size={24} fill={post.salvo ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Visualizações */}
                    {(post.visualizacoes !== undefined && post.visualizacoes > 0) && (
                        <div className="flex items-center gap-1 text-slate-500 mt-2">
                            <Eye size={14} />
                            <span className="text-xs">{post.visualizacoes} visualizações</span>
                        </div>
                    )}

                    {/* Título e Conteúdo */}
                    {(post.titulo || post.conteudo) && (
                        <div className="mt-1">
                            <span className="font-semibold text-sm mr-1">{post.autor?.nome}</span>
                            {post.titulo && (
                                <span className="font-semibold text-sm">{post.titulo}</span>
                            )}
                            <p 
                                ref={contentRef}
                                className={`text-sm text-slate-800 mt-0.5 ${!showFullContent ? 'line-clamp-2' : ''}`}
                            >
                                {post.conteudo}
                            </p>
                        </div>
                    )}

                    {isOverflowing && !showFullContent && (
                        <button
                            onClick={() => setShowFullContent(true)}
                            className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                            Ver mais <ChevronDown size={14} />
                        </button>
                    )}

                    {/* Comentários Inline */}
                    <div className="mt-2">
                        {comments.length > 0 && (
                            <div className={`space-y-1 mt-1 ${showAllComments ? 'max-h-[280px] overflow-y-auto pr-1' : ''}`}>
                                {(showAllComments ? comments : comments.slice(-2)).map((comment: any) => (
                                    <div key={comment.id} className="text-sm flex gap-1.5 leading-snug">
                                        <span className="font-semibold shrink-0">{comment.usuario?.nome || comment.autor?.nome}</span>
                                        <span className="text-slate-800 break-words">{comment.conteudo}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {!showAllComments && comments.length > 2 && (
                            <button 
                                onClick={() => setShowAllComments(true)}
                                className="text-slate-500 text-sm mt-1 font-medium hover:text-slate-700"
                            >
                                ... mais
                            </button>
                        )}

                        {/* Input de comentário */}
                        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Adicione um comentário..."
                                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-slate-400 py-1"
                                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                            />
                            {commentText.trim() && (
                                <button 
                                    onClick={handleComment}
                                    className="text-indigo-600 text-sm font-semibold hover:text-indigo-800"
                                >
                                    Publicar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Data */}
                    <p className="text-slate-400 text-xs mt-1 uppercase">
                        {formatarData(post.createdAt)}
                    </p>
                </div>
            </div>

            {/* Modal de Compartilhar */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">Compartilhar</h3>
                            <button onClick={() => setShowShareModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <textarea
                            value={shareText}
                            onChange={(e) => setShareText(e.target.value)}
                            placeholder="Escreva uma mensagem..."
                            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                            rows={3}
                        />
                        
                        {/* Preview do post */}
                        <div className="flex gap-2 mt-3 p-2 bg-slate-50 rounded-lg">
                            {post.imagens?.[0] && (
                                <img src={post.imagens[0]} alt="" className="w-16 h-16 object-cover rounded" />
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{post.autor?.nome}</p>
                                <p className="text-xs text-slate-500 line-clamp-2">{post.conteudo}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button 
                                onClick={handleShareAction}
                                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium"
                            >
                                Compartilhar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Editar */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">Editar Publicação</h3>
                            <button onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <input
                            type="text"
                            value={editTitulo}
                            onChange={(e) => setEditTitulo(e.target.value)}
                            placeholder="Título (opcional)"
                            className="w-full border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-indigo-500"
                        />
                        
                        <textarea
                            value={editConteudo}
                            onChange={(e) => setEditConteudo(e.target.value)}
                            placeholder="O que você está pensando?"
                            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                            rows={4}
                        />

                        <div className="flex gap-2 mt-4">
                            <button 
                                onClick={handleEdit}
                                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm p-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-2">Excluir publicação?</h3>
                        <p className="text-slate-500 text-sm mb-4">
                            Esta ação não pode ser desfeita. A publicação será removida permanentemente.
                        </p>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 border py-2 rounded-lg font-medium"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Mídia (Lightbox) */}
            {showMediaModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setShowMediaModal(false)}
                >
                    {/* Botão fechar */}
                    <button
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-10"
                        onClick={() => setShowMediaModal(false)}
                    >
                        <X size={24} />
                    </button>

                    <div className="max-w-full max-h-full p-4">
                        {(() => {
                            const hasImages = Array.isArray(post.imagens) && post.imagens.length > 0
                            const isDirectVideo = post.videoUrl && isVideoFile(post.videoUrl)
                            const mediaItems = []
                            if (hasImages) post.imagens.forEach((url: string) => mediaItems.push({ type: 'image', url }))
                            if (isDirectVideo) mediaItems.push({ type: 'video', url: post.videoUrl })
                            
                            const item = mediaItems[mediaIndex]
                            if (!item) return null

                            return item.type === 'image' ? (
                                <img
                                    src={item.url}
                                    alt={`Mídia ${mediaIndex + 1}`}
                                    className="max-w-full max-h-[90vh] object-contain"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <video
                                    src={item.url}
                                    className="max-w-full max-h-[90vh]"
                                    controls
                                    autoPlay
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )
                        })()}
                    </div>
                </div>
            )}
        </>
    )
}
