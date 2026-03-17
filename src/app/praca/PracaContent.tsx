'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SidebarEsquerda from './components/SidebarEsquerda'
import FeedCentral from './components/FeedCentral'
import SidebarDireita from './components/SidebarDireita'
import MobileBottomNav from '@/components/MobileBottomNav'
import CriarPostagemModal from './components/CriarPostagemModal'

type Props = {
    usuarioLogado: any
    postagens: any[]
    sugestoesPerfis: any[]
    grupos: any[]
}

export default function PracaContent({ 
    usuarioLogado, 
    postagens, 
    sugestoesPerfis,
    grupos 
}: Props) {
    const [posts, setPosts] = useState(postagens)
    const [showCriarPost, setShowCriarPost] = useState(false)

    const handleNovaPostagem = (novaPostagem: any) => {
        setPosts([novaPostagem, ...posts])
    }

    const handleDeletePost = (postId: number) => {
        setPosts(posts.filter(post => post.id !== postId))
    }

    const handleUpdatePost = (updatedPost: any) => {
        setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post))
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 pt-16 pb-20 lg:pb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar Esquerda - Desktop apenas */}
                        <aside className="hidden lg:block lg:w-1/4">
                            <SidebarEsquerda 
                                usuario={usuarioLogado}
                                onNovaPostagem={handleNovaPostagem}
                                grupos={grupos}
                            />
                        </aside>

                        {/* Feed Central - Cards de Postagens */}
                        <section className="lg:w-2/4 w-full">
                            <FeedCentral 
                                postagens={posts}
                                usuarioLogadoId={usuarioLogado.id}
                                onDeletePost={handleDeletePost}
                                onUpdatePost={handleUpdatePost}
                            />
                        </section>

                        {/* Sidebar Direita - Desktop apenas */}
                        <aside className="hidden lg:block lg:w-1/4">
                            <SidebarDireita 
                                sugestoesPerfis={sugestoesPerfis}
                            />
                        </aside>
                    </div>
                </div>
            </main>
            
            {/* Footer - Desktop apenas */}
            <div className="hidden lg:block">
                <Footer />
            </div>

            {/* Barra de Navegação Inferior - Mobile apenas */}
            <MobileBottomNav 
                usuarioId={usuarioLogado.id}
                onCriarPostagem={() => setShowCriarPost(true)}
            />

            {/* Modal de Criar Postagem */}
            <CriarPostagemModal
                isOpen={showCriarPost}
                onClose={() => setShowCriarPost(false)}
                onPostCreated={handleNovaPostagem}
                usuarioId={usuarioLogado.id}
            />
        </>
    )
}
