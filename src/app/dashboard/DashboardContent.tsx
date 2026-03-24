'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Wallet, Star, Users, Briefcase, UserCircle, Image, Settings, MessageSquare, Bell, LogOut, BarChart3, TrendingUp, Clock, ChevronRight, Plus } from 'lucide-react'
import OnboardingCard from '@/components/OnboardingCard'
import { getOnboardingData } from '@/data/onboardingTelas'

type Props = {
    usuario: {
        id: number
        nome: string
        foto_perfil: string | null
        tipo: string
        especialidade: string | null
        servicos: { id: number; titulo: string; preco_base: any; categoria: { nome: string } }[]
        avaliacoesRecebidas: { nota: any; data_avaliacao: string }[]
        notificacoes: { id: number; titulo: string; mensagem: string | null; lida: boolean; created_at: string }[]
        solicitacoesEnviadas: { id: number; descricao: string | null; status: string; created_at: string; servico: { titulo: string } }[]
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
    // Obter dados de onboarding
    const onboardingData = getOnboardingData('dashboard');

    const kpiCards = [
        { label: 'Serviços Ativos', value: String(stats.totalServicos), icon: Briefcase, color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', textColor: 'text-blue-600', href: '/dashboard/servicos' },
        { label: 'Avaliação Média', value: stats.mediaAvaliacao.toFixed(1), icon: Star, color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', textColor: 'text-amber-600', href: `/perfil/${usuario.id}?tab=avaliacoes` },
        { label: 'Total Avaliações', value: String(stats.totalAvaliacoes), icon: TrendingUp, color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600', href: `/perfil/${usuario.id}?tab=avaliacoes` },
        { label: 'Notificações', value: String(stats.totalNotificacoes), icon: Bell, color: 'from-purple-500 to-violet-600', bgLight: 'bg-purple-50', textColor: 'text-purple-600', href: '#' },
    ]

    return (
        <div className="max-w-6xl mx-auto w-full">
            {/* Card de Onboarding */}
            {onboardingData && (
                <OnboardingCard
                    rota="/dashboard"
                    nomeChave={onboardingData.chave}
                    titulo={onboardingData.titulo}
                    descricao={onboardingData.descricao}
                    links={onboardingData.links}
                />
            )}

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
                    >
                        <Link href={card.href} className="block bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-100/50 hover:border-indigo-100 transition-all cursor-pointer h-full">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${card.bgLight}`}>
                                    <card.icon size={20} className={card.textColor} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900">{card.value}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
                        </Link>
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
                        <Link href="/dashboard/servicos" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                            <Plus size={14} /> Adicionar
                        </Link>
                    </div>
                    {usuario.servicos.length === 0 ? (
                        <p className="text-center text-slate-400 py-6 text-sm">Nenhum serviço cadastrado</p>
                    ) : (
                        <div className="space-y-3">
                            {usuario.servicos.slice(0, 4).map((s) => (
                                <Link href={`/dashboard/servicos`} key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer">
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-slate-900 text-sm truncate">{s.titulo}</h4>
                                        <span className="text-xs text-slate-500">{s.categoria.nome}</span>
                                    </div>
                                    <span className="font-bold text-indigo-600 text-sm flex-shrink-0 ml-2">R$ {Number(s.preco_base).toFixed(0)}</span>
                                </Link>
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
                            {usuario.notificacoes.map((n: any) => (
                                <Link href={n.link || '#'} key={n.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:border-indigo-200 hover:bg-slate-50 ${n.lida ? 'border-slate-100' : 'border-indigo-200 bg-indigo-50/30'}`}>
                                    <div className="p-2 rounded-lg bg-indigo-50 flex-shrink-0">
                                        <Bell size={14} className="text-indigo-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-900 text-sm">{n.titulo}</p>
                                        {n.mensagem && <p className="text-xs text-slate-500 line-clamp-1">{n.mensagem}</p>}
                                        <p className="text-xs text-slate-400 mt-0.5">{new Date(n.created_at).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </Link>
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
                        {usuario.avaliacoesRecebidas.map((a: any, i) => (
                            <Link href={`/perfil/${usuario.id}?tab=avaliacoes`} key={i} className="flex-shrink-0 w-60 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-indigo-100 transition-all cursor-pointer block">
                                <div className="flex items-center gap-0.5 mb-2">
                                    {[1, 2, 3, 4, 5].map((j) => (
                                        <Star key={j} size={14} className={j <= Math.round(Number(a.nota)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400">{new Date(a.data_avaliacao).toLocaleDateString('pt-BR')}</p>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
