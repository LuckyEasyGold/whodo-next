'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LogOut, LayoutDashboard, UserCircle, Menu, Bell, Home, Search } from 'lucide-react'

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
                        <span className="text-xl md:text-2xl font-black tracking-tight text-white">
                            WhoDo<span className="text-blue-300">!</span>
                        </span>
                    </Link>

                    {/* Nav central */}
                    <div className="hidden md:flex flex-1 justify-center items-center gap-1 mx-2">
                        <Link href="/praca" className="flex items-center gap-1.5 px-2 md:px-4 py-2 text-sm font-medium text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            <Home size={18} />
                            <span>Início</span>
                        </Link>
                        <Link href="/buscar" className="flex items-center gap-1.5 px-2 md:px-4 py-2 text-sm font-medium text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            <Search size={18} />
                            <span>Profissionais</span>
                        </Link>
                    </div>

                    {/* Ações — direita */}
                    <div className="flex flex-1 md:flex-none justify-end items-center gap-2 flex-shrink-0">
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
                                        className="flex items-center p-1 rounded-full hover:bg-white/10 transition-all"
                                    >
                                        <img
                                            src={user.foto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                            alt={user.nome}
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                                        />
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
                                <Link href="/login" className="px-2 md:px-4 py-2 text-xs md:text-sm font-semibold text-white/80 hover:text-white transition-colors">
                                    Entrar
                                </Link>
                                <Link href="/cadastro" className="px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 whitespace-nowrap"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
                                >
                                    Cadastre-se
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
