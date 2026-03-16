'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
    Calendar, Briefcase, MessageCircle, 
    Wrench, LayoutDashboard, Bell, Star, Bookmark,
    Newspaper, Settings, MoreHorizontal, ChevronDown,
    Globe, Github, Linkedin, Instagram, Facebook, Plus
} from 'lucide-react'
import CriarPostagemModal from './CriarPostagemModal'

type Props = {
    usuario: any
    onNovaPostagem: (post: any) => void
}

export default function SidebarEsquerda({ usuario, onNovaPostagem }: Props) {
    const [showCriarPost, setShowCriarPost] = useState(false)
    const [showMoreLinks, setShowMoreLinks] = useState(false)

    // Links sociais baseados nos campos do schema
    const linksSociais = [
        { url: usuario.website, icon: Globe },
        { url: usuario.linkedin, icon: Linkedin },
        { url: usuario.instagram, icon: Instagram },
        { url: usuario.facebook, icon: Facebook },
        { url: usuario.youtube, icon: Globe },
        { url: usuario.tiktok, icon: Globe },
        { url: usuario.kwai, icon: Globe },
    ].filter(link => link.url)

    const linksMenu = [
        { href: '/agenda', icon: Calendar, label: 'Agenda', count: null },
        { href: '/portfolio', icon: Briefcase, label: 'Portfólio', count: null },
        { href: '/mensagens', icon: MessageCircle, label: 'Mensagens', count: 3 },
        { href: '/servicos', icon: Wrench, label: 'Serviços', count: usuario._count?.servicos || 0 },
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', count: null },
        { href: '/notificacoes', icon: Bell, label: 'Notificações', count: 5 },
        { href: '/itens-salvos', icon: Bookmark, label: 'Itens Salvos', count: 12 },
    ]

    const linksExtras = [
        { href: '/configuracoes', icon: Settings, label: 'Configurações', count: null },
        { href: '/ajuda', icon: MoreHorizontal, label: 'Ajuda', count: null },
    ]

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-20">
                {/* Card do Perfil */}
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-start gap-3 group">
                        <Link href={`/perfil/${usuario.id}`} className="relative">
                            <img
                                src={usuario.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                alt={usuario.nome}
                                className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all"
                            />
                        </Link>
                        <div className="flex-1">
                            <Link href={`/perfil/${usuario.id}`}>
                                <h2 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                                    {usuario.nome}
                                </h2>
                            </Link>
                            <p className="text-xs text-slate-500">@{usuario.nome?.toLowerCase().replace(/\s/g, '')}</p>
                            
                            {/* Ícones de Links Sociais */}
                            {linksSociais.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                    {linksSociais.map((link, index) => {
                                        const IconComponent = link.icon
                                        return (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                                            >
                                                <IconComponent size={14} />
                                            </a>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                <div className="text-center">
                                    <span className="block font-bold text-slate-900">{usuario._count?.servicos}</span>
                                    <span className="text-[10px] text-slate-500">Serviços</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-slate-900">{usuario._count?.seguidores}</span>
                                    <span className="text-[10px] text-slate-500">Seguidores</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-slate-900">{usuario._count?.seguindo}</span>
                                    <span className="text-[10px] text-slate-500">Seguindo</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botão Criar Postagem */}
                    <button
                        onClick={() => setShowCriarPost(true)}
                        className="w-full mt-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        Criar Publicação
                    </button>
                </div>

                {/* Menu de Navegação */}
                <nav className="p-2">
                    {linksMenu.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className="text-slate-400 group-hover:text-indigo-600" />
                                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">
                                    {item.label}
                                </span>
                            </div>
                            {item.count && (
                                <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                    {item.count}
                                </span>
                            )}
                        </Link>
                    ))}

                    {/* Notícias */}
                    <Link
                        href="https://www.newsdrop.net.br"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                        <Newspaper size={18} className="text-slate-400 group-hover:text-indigo-600" />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">
                            Notícias e Dicas
                        </span>
                    </Link>

                    {/* Links Extras (colapsável) */}
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        <button
                            onClick={() => setShowMoreLinks(!showMoreLinks)}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            <span>Mais itens</span>
                            <ChevronDown size={16} className={`transition-transform ${showMoreLinks ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showMoreLinks && (
                            <div className="mt-1 space-y-1">
                                {linksExtras.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                    >
                                        <item.icon size={18} className="text-slate-400 group-hover:text-indigo-600" />
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">
                                            {item.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Modal de Criar Postagem */}
            <CriarPostagemModal
                isOpen={showCriarPost}
                onClose={() => setShowCriarPost(false)}
                onPostCreated={onNovaPostagem}
                usuarioId={usuario.id}
            />
        </>
    )
}