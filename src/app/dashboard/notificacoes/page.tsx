'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Check, CheckCheck, Trash2, Calendar, MessageSquare, Star, AlertCircle, Info } from 'lucide-react'

type Notificacao = {
    id: number
    tipo: string
    titulo: string
    mensagem: string | null
    lida: boolean
    link: string | null
    created_at: string
}

export default function NotificacoesPage() {
    const router = useRouter()
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [carregando, setCarregando] = useState(true)
    const [filtro, setFiltro] = useState<'todas' | 'naoLidas'>('todas')

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(d => {
                if (!d.user) router.push('/login')
            })
    }, [router])

    useEffect(() => {
        const params = filtro === 'naoLidas' ? '?naoLidas=true' : ''
        fetch(`/api/notificacoes${params}`)
            .then(r => r.json())
            .then(d => {
                setNotificacoes(d.notificacoes || [])
                setCarregando(false)
            })
            .catch(() => setCarregando(false))
    }, [filtro])

    const marcarComoLida = async (id: number) => {
        try {
            await fetch(`/api/notificacoes/${id}/lida`, { method: 'PUT' })
            setNotificacoes(prev => prev.map(n => 
                n.id === id ? { ...n, lida: true } : n
            ))
        } catch (e) {
            console.error('Erro ao marcar como lida', e)
        }
    }

    const marcarTodasComoLidas = async () => {
        try {
            await fetch('/api/notificacoes?todas=true', { method: 'PUT' })
            setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
        } catch (e) {
            console.error('Erro ao marcar todas como lidas', e)
        }
    }

    const excluirNotificacao = async (id: number) => {
        try {
            await fetch(`/api/notificacoes?id=${id}`, { method: 'DELETE' })
            setNotificacoes(prev => prev.filter(n => n.id !== id))
        } catch (e) {
            console.error('Erro ao excluir', e)
        }
    }

    const getIconeTipo = (tipo: string) => {
        switch (tipo) {
            case 'agendamento':
                return <Calendar className="w-5 h-5 text-blue-500" />
            case 'mensagem':
                return <MessageSquare className="w-5 h-5 text-green-500" />
            case 'avaliacao':
                return <Star className="w-5 h-5 text-yellow-500" />
            case 'alerta':
            case 'erro':
                return <AlertCircle className="w-5 h-5 text-red-500" />
            default:
                return <Info className="w-5 h-5 text-gray-500" />
        }
    }

    const formatarData = (data: string) => {
        const d = new Date(data)
        const agora = new Date()
        const diff = agora.getTime() - d.getTime()
        const minutos = Math.floor(diff / 60000)
        const horas = Math.floor(diff / 3600000)
        const dias = Math.floor(diff / 86400000)

        if (minutos < 1) return 'Agora'
        if (minutos < 60) return `${minutos}m atrás`
        if (horas < 24) return `${horas}h atrás`
        if (dias < 7) return `${dias}d atrás`
        return d.toLocaleDateString('pt-BR')
    }

    if (carregando) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-slate-900">Notificações</h1>
                </div>
                <button
                    onClick={marcarTodasComoLidas}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Marcar todas como lidas
                </button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFiltro('todas')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filtro === 'todas' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setFiltro('naoLidas')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filtro === 'naoLidas' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                    Não lidas
                </button>
            </div>

            {/* Lista de Notificações */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {notificacoes.length === 0 ? (
                    <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Nenhuma notificação encontrada</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notificacoes.map((notificacao) => (
                            <div 
                                key={notificacao.id}
                                className={`p-4 hover:bg-slate-50 transition-colors ${
                                    !notificacao.lida ? 'bg-indigo-50/50' : ''
                                }`}
                            >
                                <div className="flex gap-4">
                                    {/* Ícone */}
                                    <div className="shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            {getIconeTipo(notificacao.tipo)}
                                        </div>
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`font-medium ${
                                                        !notificacao.lida ? 'text-slate-900' : 'text-slate-700'
                                                    }`}>
                                                        {notificacao.titulo}
                                                    </h3>
                                                    {!notificacao.lida && (
                                                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                    )}
                                                </div>
                                                {notificacao.mensagem && (
                                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                                        {notificacao.mensagem}
                                                    </p>
                                                )}
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {formatarData(notificacao.created_at)}
                                                </p>
                                            </div>

                                            {/* Ações */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                {!notificacao.lida && (
                                                    <button
                                                        onClick={() => marcarComoLida(notificacao.id)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Marcar como lida"
                                                    >
                                                        <CheckCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => excluirNotificacao(notificacao.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Link da notificação */}
                                        {notificacao.link && (
                                            <Link 
                                                href={notificacao.link}
                                                className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block font-medium"
                                            >
                                                Ver detalhes →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
