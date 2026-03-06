'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LogOut, LayoutDashboard, UserCircle, Menu } from 'lucide-react'

type SessionUser = {
    id: number
    nome: string
    email: string
    tipo: string
    foto: string | null
}

export default function Navbar() {
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [user, setUser] = useState<SessionUser | null>(null)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(data => setUser(data.user))
            .catch(() => { })
    }, [])

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
        setUserMenuOpen(false)
        setMobileOpen(false)
        router.push('/')
        router.refresh()
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/80 via-indigo-950/60 to-transparent backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Desktop — barra com 3 colunas | Mobile — ícone | nome | foto/menu */}
                <div className="flex items-center h-16">

                    {/* Logo — esquerda */}
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                            <span className="text-white font-black text-sm tracking-tight">W</span>
                        </div>
                        {/* Nome em texto — visível no desktop, oculto no mobile */}
                        <span className="hidden md:block text-xl font-black tracking-tight">
                            <span className="text-indigo-400">Who</span><span className="text-purple-300">Do</span><span className="text-white">!</span>
                        </span>
                    </Link>

                    {/* Nome centralizado — só mobile */}
                    <div className="flex-1 flex justify-center md:hidden">
                        <Link href="/" className="text-lg font-black tracking-tight">
                            <span className="text-indigo-400">Who</span><span className="text-purple-300">Do</span><span className="text-white">!</span>
                        </Link>
                    </div>

                    {/* Desktop nav — centro */}
                    <div className="hidden md:flex flex-1 justify-center items-center gap-1">
                        <Link href="/" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Início
                        </Link>
                        <Link href="/buscar" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Encontrar Serviços
                        </Link>
                    </div>

                    {/* Desktop CTA / User menu — direita */}
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    <img
                                        src={user.foto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                        alt={user.nome}
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-400/50"
                                    />
                                    <span className="text-sm font-medium text-white/90 max-w-[120px] truncate">{user.nome.split(' ')[0]}</span>
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-slate-100">
                                                <p className="font-semibold text-slate-900 text-sm">{user.nome}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link href={`/perfil/${user.id}`} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all">
                                                    <UserCircle size={16} /> Meu Perfil
                                                </Link>
                                                {user.tipo === 'prestador' && (
                                                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all">
                                                        <LayoutDashboard size={16} /> Dashboard
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="border-t border-slate-100 py-1">
                                                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all">
                                                    <LogOut size={16} /> Sair
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
                                    Entrar
                                </Link>
                                <Link href="/cadastro" className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5">
                                    Cadastre-se grátis
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile — botão direito: foto se logado, hamburger se não */}
                    <div className="md:hidden flex-shrink-0">
                        {user ? (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="relative p-0.5 rounded-full ring-2 ring-indigo-400/60 hover:ring-indigo-400 transition-all"
                            >
                                <img
                                    src={user.foto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                    alt={user.nome}
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                                {mobileOpen && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                                        <X size={10} className="text-white" />
                                    </span>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
                            >
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 overflow-hidden bg-slate-900/95 backdrop-blur-xl"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {/* Avatar e nome no topo do menu mobile se logado */}
                            {user && (
                                <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-white/10">
                                    <img
                                        src={user.foto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                        alt={user.nome}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-400/50"
                                    />
                                    <div>
                                        <p className="font-semibold text-white text-sm">{user.nome}</p>
                                        <p className="text-xs text-white/50">{user.email}</p>
                                    </div>
                                </div>
                            )}

                            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-medium text-white/80 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                                Início
                            </Link>
                            <Link href="/buscar" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-medium text-white/80 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                                Encontrar Serviços
                            </Link>

                            {user ? (
                                <>
                                    <Link href={`/perfil/${user.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-white/80 rounded-xl hover:bg-white/10 transition-all">
                                        <UserCircle size={18} /> Meu Perfil
                                    </Link>
                                    {user.tipo === 'prestador' && (
                                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-white/80 rounded-xl hover:bg-white/10 transition-all">
                                            <LayoutDashboard size={18} /> Dashboard
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-red-400 rounded-xl hover:bg-red-950/30 transition-all">
                                        <LogOut size={18} /> Sair
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 flex flex-col gap-2">
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-3 text-base font-semibold text-indigo-300 border border-indigo-500/40 rounded-xl hover:bg-indigo-950/40 transition-all">
                                        Entrar
                                    </Link>
                                    <Link href="/cadastro" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-3 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg transition-all">
                                        Cadastre-se grátis
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
