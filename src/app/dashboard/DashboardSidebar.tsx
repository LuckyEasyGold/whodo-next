'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Calendar, Wallet, Image as ImageIcon, Briefcase,
    UserCircle, Settings, MessageSquare, BarChart3,
    ChevronDown, Globe, Linkedin, Instagram, Facebook, Youtube
} from 'lucide-react'
import { useState } from 'react'

type DashboardSidebarProps = {
    usuario: {
        id: number
        nome: string
        foto_perfil: string | null
        tipo: string
        especialidade: string | null
        website?: string | null
        linkedin?: string | null
        instagram?: string | null
        facebook?: string | null
        youtube?: string | null
        tiktok?: string | null
        kwai?: string | null
        _count?: {
            servicos?: number
            seguidores?: number
            seguindo?: number
            portfolioAlbuns?: number
            notificacoes?: number
            postagensSalvas?: number
            mensagensRecebidas?: number
            mensagensEnviadas?: number
        }
    }
}

export default function DashboardSidebar({ usuario }: DashboardSidebarProps) {
    const pathname = usePathname()
    const [showMoreLinks, setShowMoreLinks] = useState(false)

    // Links sociais baseados nos campos do schema
    const linksSociais = [
        { url: usuario.website, icon: Globe },
        { url: usuario.linkedin, icon: Linkedin },
        { url: usuario.instagram, icon: Instagram },
        { url: usuario.facebook, icon: Facebook },
        { url: usuario.youtube, icon: Youtube },
        { url: usuario.tiktok, icon: Globe },
        { url: usuario.kwai, icon: Globe },
    ].filter(link => link.url)

    const sidebarItems = [
        { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
        { icon: UserCircle, label: 'Editar Perfil', href: '/dashboard/perfil' },
        { icon: ImageIcon, label: 'Portfólio', href: '/dashboard/portfolio' },
        { icon: Briefcase, label: 'Meus Serviços', href: '/dashboard/servicos' },
        { icon: Calendar, label: 'Agendamentos', href: '/dashboard/agendamentos' },
        { icon: Wallet, label: 'Financeiro', href: '/dashboard/financeiro' },
        { icon: MessageSquare, label: 'Mensagens', href: '/dashboard/mensagens' },
    ]

    const linksExtras = [
        { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações', count: null },
    ]

    return (
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
                        {usuario.especialidade && (
                            <span className="text-xs text-indigo-500">{usuario.especialidade}</span>
                        )}

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
                                <span className="block font-bold text-slate-900">{usuario._count?.servicos || 0}</span>
                                <span className="text-[10px] text-slate-500">Serviços</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-slate-900">{usuario._count?.seguidores || 0}</span>
                                <span className="text-[10px] text-slate-500">Seguidores</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-slate-900">{usuario._count?.seguindo || 0}</span>
                                <span className="text-[10px] text-slate-500">Seguindo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu de Navegação */}
            <nav className="p-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors group ${isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'hover:bg-slate-50 text-slate-700 hover:text-indigo-600'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'} />
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    )
                })}

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
                            {linksExtras.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors group ${isActive
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'hover:bg-slate-50 text-slate-700 hover:text-indigo-600'
                                            }`}
                                    >
                                        <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'} />
                                        <span className="text-sm font-medium">
                                            {item.label}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}
