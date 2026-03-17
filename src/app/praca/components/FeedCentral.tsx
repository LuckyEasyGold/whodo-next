'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import CardPostagem from './CardPostagem'

type Props = {
    postagens: any[]
    usuarioLogadoId: number
    onDeletePost?: (postId: number) => void
    onUpdatePost?: (post: any) => void
}

export default function FeedCentral({ postagens, usuarioLogadoId, onDeletePost, onUpdatePost }: Props) {
    const [posts, setPosts] = useState(postagens)

    const handleLike = async (postId: number) => {
        // Atualização otimista
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, curtido: !post.curtido, _count: { ...post._count, curtidas: post.curtido ? post._count.curtidas - 1 : post._count.curtidas + 1 } }
                : post
        ))

        // Chamar API
        try {
            await fetch(`/api/postagens/${postId}/curtir`, {
                method: 'POST',
            })
        } catch (error) {
            // Reverter em caso de erro
            setPosts(postagens)
        }
    }

    const handleShare = async (postId: number) => {
        // Encontrar o post
        const post = posts.find(p => p.id === postId)
        if (!post) return

        // Compartilhar via API
        try {
            await fetch(`/api/postagens/${postId}/compartilhar`, {
                method: 'POST',
            })
        } catch (error) {
            console.error('Erro ao compartilhar:', error)
        }
    }

    const handleDelete = (postId: number) => {
        setPosts(posts.filter(post => post.id !== postId))
        onDeletePost?.(postId)
    }

    const handleUpdate = (updatedPost: any) => {
        setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post))
        onUpdatePost?.(updatedPost)
    }


    return (
        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                    <Users size={48} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                        Nenhuma postagem no feed
                    </h3>
                    <p className="text-slate-500 text-sm">
                        Siga mais profissionais ou seja o primeiro a postar!
                    </p>
                </div>
            ) : (
                posts.map((post) => (
                    <CardPostagem
                        key={post.id}
                        post={post}
                        usuarioLogadoId={usuarioLogadoId}
                        onLike={handleLike}
                        onShare={handleShare}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                ))
            )}
        </div>
    )
}
