'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SidebarEsquerda from './components/SidebarEsquerda'
import FeedCentral from './components/FeedCentral'
import SidebarDireita from './components/SidebarDireita'

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

    const handleNovaPostagem = (novaPostagem: any) => {
        setPosts([novaPostagem, ...posts])
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar Esquerda - Perfil e Links */}
                        <aside className="lg:w-1/4">
                            <SidebarEsquerda 
                                usuario={usuarioLogado}
                                onNovaPostagem={handleNovaPostagem}
                                grupos={grupos}
                            />
                        </aside>

                        {/* Feed Central - Cards de Postagens */}
                        <section className="lg:w-2/4">
                            <FeedCentral 
                                postagens={posts}
                                usuarioLogadoId={usuarioLogado.id}
                            />
                        </section>

                        {/* Sidebar Direita - Anúncios e Sugestões */}
                        <aside className="lg:w-1/4">
                            <SidebarDireita 
                                sugestoesPerfis={sugestoesPerfis}
                            />
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}