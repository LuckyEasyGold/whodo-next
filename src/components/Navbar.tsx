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

    // Cor da marca: azul navy #1e3a5f (mesmo tom do logo)
    return (
        <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#1e3a5f' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Barra principal: logo | nav central | ações */}
                <div className="flex items-center h-16">

                    {/* ── Logo e nome ─────────────────────────────── */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                        {/* Logo branco via CSS filter (inverte o azul para branco) */}
                        <img
                            src="/logo.png"
                            alt="WhoDo"
                            className="h-10 w-auto group-hover:scale-105 transition-transform"
                            style={{ filter: 'brightness(0) invert(1)' }}
                        />
                        {/* Texto — desktop apenas */}
                        <span className="hidden md:block text-2xl font-black tracking-tight text-white">
                            WhoDo<span className="text-blue-300">!</span>
                        </span>
                    </Link>

                    {/* ── Nome centralizado — só mobile ────────────── */}
                    <div className="flex-1 flex justify-center md:hidden">
                        <Link href="/" className="text-xl font-black tracking-tight text-white">
                            WhoDo<span className="text-blue-300">!</span>
                        </Link>
                    </div>

                    {/* ── Nav central — desktop ────────────────────── */}
                    <div className="hidden md:flex flex-1 justify-center items-center gap-1">
                        <Link href="/" className="px-4 py-2 text-sm font-medium text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Início
                        </Link>
                        <Link href="/buscar" className="px-4 py-2 text-sm font-medium text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Encontrar Serviços
                        </Link>
                    </div>

                    {/* ── Ações — direita (desktop) ─────────────────── */}
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    <img
                                        src={user.foto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                        alt={user.nome}
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
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
                                                <Link href={`/perfil/${user.id}`} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all">
                                                    <UserCircle size={16} /> Meu Perfil
                                                </Link>
                                                {user.tipo === 'prestador' && (
                                                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all">
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
                                <Link href="/cadastro" className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
                                >
                                    Cadastre-se grátis
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ── Botão mobile direito ──────────────────────── */}
                    <div className="md:hidden flex-shrink-0">
                        {user ? (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="relative p-0.5 rounded-full ring-2 ring-white/30 hover:ring-white/60 transition-all"
                            >
                                <img
                                    src={user.foto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                    alt={user.nome}
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                                {mobileOpen && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                        <X size={10} className="text-[#1e3a5f]" />
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

            {/* ── Menu mobile ─────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ backgroundColor: '#162e4d' }}
                        className="md:hidden border-t border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {/* Avatar e nome do usuário no topo do menu */}
                            {user && (
                                <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-white/10">
                                    <img
                                        src={user.foto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                        alt={user.nome}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                                    />
                                    <div>
                                        <p className="font-semibold text-white text-sm">{user.nome}</p>
                                        <p className="text-xs text-white/40">{user.email}</p>
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
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-red-300 rounded-xl hover:bg-white/5 transition-all">
                                        <LogOut size={18} /> Sair
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 flex flex-col gap-2">
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-3 text-base font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all">
                                        Entrar
                                    </Link>
                                    <Link href="/cadastro" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-3 text-base font-semibold text-[#1e3a5f] rounded-xl bg-white hover:bg-blue-50 transition-all">
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
