'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Bell, User, LogOut, LayoutDashboard, UserCircle } from 'lucide-react'

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
        router.push('/')
        router.refresh()
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-105 transition-transform">
                            W
                        </div>
                        <span className="text-xl font-extrabold gradient-text tracking-tight">WhoDo!</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">
                            Início
                        </Link>
                        <Link href="/buscar" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">
                            Encontrar Serviços
                        </Link>
                    </div>

                    {/* Desktop CTA / User menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
                                >
                                    <img
                                        src={user.foto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                        alt={user.nome}
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200"
                                    />
                                    <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.nome.split(' ')[0]}</span>
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
                                                    <UserCircle size={16} />
                                                    Meu Perfil
                                                </Link>
                                                {user.tipo === 'prestador' && (
                                                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all">
                                                        <LayoutDashboard size={16} />
                                                        Dashboard
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="border-t border-slate-100 py-1">
                                                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all">
                                                    <LogOut size={16} />
                                                    Sair
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                    Entrar
                                </Link>
                                <Link href="/cadastro" className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5">
                                    Cadastre-se grátis
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-slate-200/50 overflow-hidden bg-white/95 backdrop-blur-xl"
                    >
                        <div className="px-4 py-4 space-y-1">
                            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                Início
                            </Link>
                            <Link href="/buscar" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                Encontrar Serviços
                            </Link>

                            {user ? (
                                <>
                                    <Link href={`/perfil/${user.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 rounded-xl hover:bg-indigo-50 transition-all">
                                        <UserCircle size={18} /> Meu Perfil
                                    </Link>
                                    {user.tipo === 'prestador' && (
                                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 rounded-xl hover:bg-indigo-50 transition-all">
                                            <LayoutDashboard size={18} /> Dashboard
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all">
                                        <LogOut size={18} /> Sair
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 flex flex-col gap-2">
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-3 text-base font-semibold text-indigo-600 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all">
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
