'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import CardPostagem from './CardPostagem'

type Props = {
    postagens: any[]
    usuarioLogadoId: number
}

export default function FeedCentral({ postagens, usuarioLogadoId }: Props) {
    const [posts, setPosts] = useState(postagens)

    const handleLike = (postId: number) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, curtido: !post.curtido, _count: { ...post._count, curtidas: post.curtido ? post._count.curtidas - 1 : post._count.curtidas + 1 } }
                : post
        ))
    }

    const handleShare = (postId: number) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, _count: { ...post._count, compartilhamentos: post._count.compartilhamentos + 1 } }
                : post
        ))
        // Aqui você pode adicionar lógica de compartilhamento
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
                    />
                ))
            )}
        </div>
    )
}