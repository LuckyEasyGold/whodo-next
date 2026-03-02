'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, UserCircle, Briefcase, Image as ImageIcon, MessageSquare, Calendar, Wallet } from 'lucide-react'

export default function DashboardMobileNav() {
    const pathname = usePathname()

    const mobileItems = [
        { icon: BarChart3, label: 'Home', href: '/dashboard' },
        { icon: Briefcase, label: 'Serviços', href: '/dashboard/servicos' },
        { icon: Calendar, label: 'Agenda', href: '/dashboard/agendamentos' },
        { icon: Wallet, label: 'Financeiro', href: '/dashboard/financeiro' },
        { icon: ImageIcon, label: 'Portfólio', href: '/dashboard/portfolio' },
        { icon: UserCircle, label: 'Perfil', href: '/dashboard/perfil' },
    ]

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-2 overflow-x-auto z-50 h-16">
            <div className="flex justify-start gap-1 min-w-max">
                {mobileItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1 min-w-16 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                )
            })}
            </div>
        </div>
    )
}
