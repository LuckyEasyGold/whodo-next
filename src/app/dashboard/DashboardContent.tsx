'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Wallet, Star, Users, Briefcase, UserCircle, Image, Settings, MessageSquare, Bell, LogOut, BarChart3, TrendingUp, Clock, ChevronRight, Plus } from 'lucide-react'

type Props = {
    usuario: {
        id: number
        nome: string
        foto_perfil: string | null
        tipo: string
        prestador: { especialidade: string | null } | null
        servicos: { id: number; titulo: string; preco_base: any; categoria: { nome: string } }[]
        avaliacoesRecebidas: { nota: any; data_avaliacao: string }[]
        notificacoes: { id: number; titulo: string; mensagem: string | null; lida: boolean; created_at: string }[]
        solicitacoes: { id: number; descricao: string | null; status: string; created_at: string; servico: { titulo: string } }[]
    }
    stats: { totalServicos: number; totalAvaliacoes: number; mediaAvaliacao: number; totalNotificacoes: number }
}

const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: UserCircle, label: 'Meu Perfil', href: '' },
    { icon: Image, label: 'Portfólio', href: '#' },
    { icon: Briefcase, label: 'Meus Serviços', href: '#' },
    { icon: Calendar, label: 'Agendamentos', href: '#' },
    { icon: Wallet, label: 'Financeiro', href: '#' },
    { icon: Users, label: 'Minha Rede', href: '#' },
    { icon: MessageSquare, label: 'Mensagens', href: '#' },
    { icon: Settings, label: 'Configurações', href: '#' },
]

export default function DashboardContent({ usuario, stats }: Props) {
    const kpiCards = [
        { label: 'Serviços Ativos', value: String(stats.totalServicos), icon: Briefcase, color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
        { label: 'Avaliação Média', value: stats.mediaAvaliacao.toFixed(1), icon: Star, color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', textColor: 'text-amber-600' },
        { label: 'Total Avaliações', value: String(stats.totalAvaliacoes), icon: TrendingUp, color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600' },
        { label: 'Notificações', value: String(stats.totalNotificacoes), icon: Bell, color: 'from-purple-500 to-violet-600', bgLight: 'bg-purple-50', textColor: 'text-purple-600' },
    ]

    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Sidebar — desktop only */}
            <aside className="hidden lg:block w-64 bg-white border-r border-slate-100 p-5 flex-shrink-0">
                {/* User card */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-6">
                    <img
                        src={usuario.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                        alt={usuario.nome}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{usuario.nome}</h3>
                        <p className="text-xs text-slate-500 truncate">{usuario.prestador?.especialidade || 'Prestador'}</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href === '' ? `/perfil/${usuario.id}` : item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 text-sm">Bem-vindo de volta, {usuario.nome.split(' ')[0]}! 👋</p>
                    </div>
                    <Link
                        href={`/perfil/${usuario.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-indigo-100 transition-all"
                    >
                        <UserCircle size={16} />
                        Ver meu perfil
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {kpiCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-100/50 transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${card.bgLight}`}>
                                    <card.icon size={20} className={card.textColor} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900">{card.value}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-slate-100 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-900">Meus Serviços</h2>
                            <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                <Plus size={14} /> Adicionar
                            </button>
                        </div>
                        {usuario.servicos.length === 0 ? (
                            <p className="text-center text-slate-400 py-6 text-sm">Nenhum serviço cadastrado</p>
                        ) : (
                            <div className="space-y-3">
                                {usuario.servicos.slice(0, 4).map((s) => (
                                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all">
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-slate-900 text-sm truncate">{s.titulo}</h4>
                                            <span className="text-xs text-slate-500">{s.categoria.nome}</span>
                                        </div>
                                        <span className="font-bold text-indigo-600 text-sm flex-shrink-0 ml-2">R$ {Number(s.preco_base).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Notifications / Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl border border-slate-100 p-6"
                    >
                        <h2 className="font-bold text-slate-900 mb-4">Atividade Recente</h2>
                        {usuario.notificacoes.length === 0 ? (
                            <p className="text-center text-slate-400 py-6 text-sm">Sem atividade recente</p>
                        ) : (
                            <div className="space-y-3">
                                {usuario.notificacoes.map((n) => (
                                    <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${n.lida ? 'border-slate-100' : 'border-indigo-200 bg-indigo-50/30'}`}>
                                        <div className="p-2 rounded-lg bg-indigo-50 flex-shrink-0">
                                            <Bell size={14} className="text-indigo-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900 text-sm">{n.titulo}</p>
                                            {n.mensagem && <p className="text-xs text-slate-500 line-clamp-1">{n.mensagem}</p>}
                                            <p className="text-xs text-slate-400 mt-0.5">{new Date(n.created_at).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Recent Reviews */}
                {usuario.avaliacoesRecebidas.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-slate-100 p-6"
                    >
                        <h2 className="font-bold text-slate-900 mb-4">Últimas Avaliações</h2>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {usuario.avaliacoesRecebidas.map((a, i) => (
                                <div key={i} className="flex-shrink-0 w-60 p-4 rounded-xl border border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-0.5 mb-2">
                                        {[1, 2, 3, 4, 5].map((j) => (
                                            <Star key={j} size={14} className={j <= Math.round(Number(a.nota)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400">{new Date(a.data_avaliacao).toLocaleDateString('pt-BR')}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Mobile nav */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex justify-around z-40">
                    {[
                        { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
                        { icon: UserCircle, label: 'Perfil', href: `/perfil/${usuario.id}` },
                        { icon: Briefcase, label: 'Serviços', href: '#' },
                        { icon: MessageSquare, label: 'Mensagens', href: '#' },
                        { icon: Settings, label: 'Config', href: '#' },
                    ].map((item) => (
                        <Link key={item.label} href={item.href} className="flex flex-col items-center gap-0.5 py-1 text-slate-500 hover:text-indigo-600 transition-colors">
                            <item.icon size={20} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
