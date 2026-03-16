'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LogOut, LayoutDashboard, UserCircle, Menu, Bell } from 'lucide-react'

type SessionUser = {
    id: number
    nome: string
    email: string
    tipo: string
    foto: string | null
}

type Notificacao = {
    id: number
    tipo: string
    titulo: string
    mensagem: string | null
    lida: boolean
    link: string | null
    created_at: string
}

export default function Navbar() {
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [user, setUser] = useState<SessionUser | null>(null)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [totalNaoLidas, setTotalNaoLidas] = useState(0)
    const notifRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(data => setUser(data.user))
            .catch(() => { })
    }, [])

    // Carrega notificações quando o usuário está logado e atualiza a cada 30s
    useEffect(() => {
        if (!user) return
        const carregar = () => {
            fetch('/api/notificacoes?limite=15')
                .then(r => r.json())
                .then(data => {
                    if (data.notificacoes) {
                        setNotificacoes(data.notificacoes)
                        setTotalNaoLidas(data.totalNaoLidas)
                    }
                })
                .catch(() => { })
        }
        carregar()
        const intervalo = setInterval(carregar, 30000)
        return () => clearInterval(intervalo)
    }, [user])

    // Fecha dropdown de notificações ao clicar fora
    useEffect(() => {
        function fecharFora(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false)
            }
        }
        document.addEventListener('mousedown', fecharFora)
        return () => document.removeEventListener('mousedown', fecharFora)
    }, [])

    async function marcarComoLida(notif: Notificacao) {
        if (!notif.lida) {
            await fetch(`/api/notificacoes/${notif.id}/lida`, { method: 'PATCH' })
            setNotificacoes(prev => prev.map(n => n.id === notif.id ? { ...n, lida: true } : n))
            setTotalNaoLidas(prev => Math.max(0, prev - 1))
        }
        setNotifOpen(false)
        if (notif.link) router.push(notif.link)
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
        setUserMenuOpen(false)
        setMobileOpen(false)
        router.push('/')
        router.refresh()
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#1e3a5f' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Barra principal: logo | nav central | ações */}
                <div className="flex items-center h-16">

                    {/* Logo e nome */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                        <img
                            src="/logo.png"
                            alt="WhoDo"
                            className="h-10 w-auto group-hover:scale-105 transition-transform"
                            style={{ filter: 'brightness(0) invert(1)' }}
                        />
                        <span className="hidden md:block text-2xl font-black tracking-tight text-white">
                            WhoDo<span className="text-blue-300">!</span>
                        </span>
                    </Link>

                    {/* Nome centralizado — só mobile */}
                    <div className="flex-1 flex justify-center md:hidden">
                        <Link href="/" className="text-xl font-black tracking-tight text-white">
                            WhoDo<span className="text-blue-300">!</span>
                        </Link>
                    </div>

                    {/* Nav central — desktop */}
                    <div className="hidden md:flex flex-1 justify-center items-center gap-1">
                        <Link href="/praca" className="px-4 py-2 text-sm font-medium text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Início
                        </Link>
                        <Link href="/buscar" className="px-4 py-2 text-sm font-medium text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Profissionais
                        </Link>
                    </div>

                    {/* Ações — direita (desktop) */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                        {user ? (
                            <div className="flex items-center gap-2">

                                {/* Sino de notificações */}
                                <div ref={notifRef} className="relative">
                                    <button
                                        onClick={() => setNotifOpen(!notifOpen)}
                                        className="relative p-2 rounded-xl hover:bg-white/10 transition-all text-white/80 hover:text-white"
                                        title="Notificações"
                                    >
                                        <Bell size={20} />
                                        {totalNaoLidas > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse">
                                                {totalNaoLidas > 99 ? '99+' : totalNaoLidas}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {notifOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                                            >
                                                {/* Cabeçalho */}
                                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                                        <Bell size={14} className="text-indigo-600" /> Notificações
                                                        {totalNaoLidas > 0 && (
                                                            <span className="ml-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{totalNaoLidas}</span>
                                                        )}
                                                    </p>
                                                    {totalNaoLidas > 0 && (
                                                        <button
                                                            onClick={async () => {
                                                                await fetch('/api/notificacoes/todas/lida', { method: 'PATCH' })
                                                                setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
                                                                setTotalNaoLidas(0)
                                                            }}
                                                            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                                                        >
                                                            Marcar todas
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Lista */}
                                                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                                    {notificacoes.length === 0 ? (
                                                        <div className="px-4 py-8 text-center text-sm text-slate-400">
                                                            <Bell size={28} className="mx-auto mb-2 text-slate-300" />
                                                            Nenhuma notificação ainda
                                                        </div>
                                                    ) : notificacoes.map(n => (
                                                        <button
                                                            key={n.id}
                                                            onClick={() => marcarComoLida(n)}
                                                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${!n.lida ? 'bg-indigo-50/50' : ''}`}
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                {!n.lida && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />}
                                                                <div className={`flex-1 min-w-0 ${n.lida ? 'pl-4' : ''}`}>
                                                                    <p className={`text-sm truncate ${!n.lida ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>
                                                                        {n.titulo}
                                                                    </p>
                                                                    {n.mensagem && (
                                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.mensagem}</p>
                                                                    )}
                                                                    <p className="text-[10px] text-slate-400 mt-1">
                                                                        {new Date(n.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Avatar + menu do usuário */}
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

                    {/* Botão mobile direito */}
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
                                {totalNaoLidas > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                                        {totalNaoLidas > 9 ? '9+' : totalNaoLidas}
                                    </span>
                                )}
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

            {/* Menu mobile */}
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

                            {/* Notificações no mobile — mostra as 5 primeiras não lidas */}
                            {user && totalNaoLidas > 0 && (
                                <div className="mx-1 mb-2 bg-indigo-900/40 rounded-xl overflow-hidden border border-indigo-500/20">
                                    <div className="px-3 py-2 flex items-center justify-between">
                                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                                            <Bell size={12} /> {totalNaoLidas} notificação{totalNaoLidas > 1 ? 'ões' : ''} não lida{totalNaoLidas > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    {notificacoes.filter(n => !n.lida).slice(0, 3).map(n => (
                                        <button
                                            key={n.id}
                                            onClick={() => { marcarComoLida(n); setMobileOpen(false) }}
                                            className="w-full text-left px-3 py-2 border-t border-indigo-500/20 hover:bg-indigo-800/30 transition-colors"
                                        >
                                            <p className="text-xs font-semibold text-white truncate">{n.titulo}</p>
                                            {n.mensagem && <p className="text-[10px] text-white/50 truncate">{n.mensagem}</p>}
                                        </button>
                                    ))}
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
