'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    Home, Search, PlusSquare, Calendar, User, 
    Bookmark, MessageCircle, Bell
} from 'lucide-react'

type Props = {
    onCriarPostagem?: () => void
    usuarioId: number
}

export default function MobileBottomNav({ onCriarPostagem, usuarioId }: Props) {
    const pathname = usePathname()
    const [showCriar, setShowCriar] = useState(false)

    const navItems = [
        { href: '/praca', icon: Home, label: 'Início' },
        { href: '/buscar', icon: Search, label: 'Buscar' },
        { href: '#', icon: PlusSquare, label: 'Criar', action: () => setShowCriar(true) },
        { href: '/agenda', icon: Calendar, label: 'Agenda' },
        { href: `/perfil/${usuarioId}`, icon: User, label: 'Perfil' },
    ]

    return (
        <>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1">
                <nav className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={item.action ? (e) => { e.preventDefault(); item.action() } : undefined}
                                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                                    isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <Icon size={24} />
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Menu Flutuante de Criar (Similar ao Instagram) */}
            {showCriar && (
                <div className="lg:hidden fixed inset-0 z-50" onClick={() => setShowCriar(false)}>
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 rounded-xl p-2 w-48 shadow-xl">
                        <button
                            onClick={() => {
                                setShowCriar(false)
                                onCriarPostagem?.()
                            }}
                            className="flex items-center gap-3 w-full p-3 text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <PlusSquare size={20} />
                            <span className="text-sm font-medium">Publicação</span>
                        </button>
                        <Link
                            href="/dashboard/servicos"
                            onClick={() => setShowCriar(false)}
                            className="flex items-center gap-3 w-full p-3 text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Calendar size={20} />
                            <span className="text-sm font-medium">Serviço</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}
