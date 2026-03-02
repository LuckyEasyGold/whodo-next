'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, UserCircle, Briefcase, MessageSquare, Settings } from 'lucide-react'

export default function DashboardMobileNav() {
    const pathname = usePathname()

    const mobileItems = [
        { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
        { icon: UserCircle, label: 'Perfil', href: '/dashboard/perfil' },
        { icon: Briefcase, label: 'Serviços', href: '/dashboard/servicos' },
        { icon: MessageSquare, label: 'Mensagens', href: '/dashboard/mensagens' },
        { icon: Settings, label: 'Config', href: '/dashboard/configuracoes' },
    ]

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex justify-around z-50 h-16">
            {mobileItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                )
            })}
        </div>
    )
}
