'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Wallet, Image as ImageIcon, Briefcase, UserCircle, Settings, MessageSquare, BarChart3 } from 'lucide-react'

type DashboardSidebarProps = {
    usuario: {
        id: number
        nome: string
        foto_perfil: string | null
        tipo: string
        especialidade: string | null
    }
}

export default function DashboardSidebar({ usuario }: DashboardSidebarProps) {
    const pathname = usePathname()

    const sidebarItems = [
        { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
        { icon: UserCircle, label: 'Editar Perfil', href: '/dashboard/perfil' },
        { icon: ImageIcon, label: 'Portfólio', href: '/dashboard/portfolio' },
        { icon: Briefcase, label: 'Meus Serviços', href: '/dashboard/servicos' },
        { icon: Calendar, label: 'Agendamentos', href: '/dashboard/agendamentos' },
        { icon: Wallet, label: 'Financeiro', href: '/dashboard/financeiro' },
        { icon: MessageSquare, label: 'Mensagens', href: '/dashboard/mensagens' },
        { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
    ]

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 p-5 flex-shrink-0 min-h-[calc(100vh-4rem)]">
            {/* User card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-6">
                <img
                    src={usuario.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                    alt={usuario.nome}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{usuario.nome}</h3>
                    {usuario.especialidade && <span className="text-xs text-indigo-200 mt-0.5">{usuario.especialidade}</span>}
                </div>
            </div>

            <nav className="space-y-1 flex-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
