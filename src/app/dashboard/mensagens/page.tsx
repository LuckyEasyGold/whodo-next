'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Send, MessageSquare, Clock, CheckCheck, ChevronRight } from 'lucide-react'

type Participante = { id: number; nome: string; foto_perfil: string | null }
type UltimaMensagem = { conteudo: string; created_at: string; remetente_id: number; lida: boolean }

type Conversa = {
    id: number
    status: string
    created_at: string
    cliente: Participante
    servico: {
        id: number
        titulo: string
        cobranca_tipo?: string
        usuario_id?: number
        usuario?: Participante
    }
    mensagens: UltimaMensagem[]
    // Campo extra que vem da API /api/mensagens/[id] dentro de `solicitacao`
    prestador?: Participante
}

type Mensagem = {
    id: number
    conteudo: string
    created_at: string
    remetente: Participante
}

export default function MensagensPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [userId, setUserId] = useState<number | null>(null)
    const [conversas, setConversas] = useState<Conversa[]>([])
    const [conversaAtiva, setConversaAtiva] = useState<number | null>(null)
    const [mensagens, setMensagens] = useState<Mensagem[]>([])
    const [solicitacaoInfo, setSolicitacaoInfo] = useState<Conversa | null>(null)
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [carregando, setCarregando] = useState(true)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(d => setUserId(d.user?.id || null))
    }, [])

    useEffect(() => {
        buscarConversas()
    }, [])

    useEffect(() => {
        // Abre conversa da URL se existir
        const conversa = searchParams.get('conversa')
        if (conversa) setConversaAtiva(parseInt(conversa))
    }, [searchParams])

    useEffect(() => {
        if (conversaAtiva) buscarMensagens(conversaAtiva)
    }, [conversaAtiva])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mensagens])

    async function buscarConversas() {
        setCarregando(true)
        try {
            const r = await fetch('/api/solicitacoes')
            const data = await r.json()
            setConversas(Array.isArray(data) ? data : [])
        } finally {
            setCarregando(false)
        }
    }

    async function buscarMensagens(solicitacaoId: number) {
        const r = await fetch(`/api/mensagens/${solicitacaoId}`)
        const data = await r.json()
        if (data.mensagens) {
            setMensagens(data.mensagens)
            // A API retorna solicitacao + prestador separado; normalizamos para o formato Conversa
            if (data.solicitacao) {
                const sol = data.solicitacao
                // Busca o prestador do servico (usuario_id) nas conversas da lista
                const conversaExistente = conversas.find(c => c.id === solicitacaoId)
                setSolicitacaoInfo(conversaExistente || {
                    ...sol,
                    mensagens: [],
                    prestador: sol.prestador || null,
                })
            }
        }
    }

    async function enviarMensagem(e: React.FormEvent) {
        e.preventDefault()
        if (!texto.trim() || !conversaAtiva || enviando) return
        setEnviando(true)
        try {
            const r = await fetch(`/api/mensagens/${conversaAtiva}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conteudo: texto.trim() })
            })
            if (r.ok) {
                const nova = await r.json()
                setMensagens(prev => [...prev, nova])
                setTexto('')
                buscarConversas()
            }
        } finally {
            setEnviando(false)
        }
    }

    function formatarHora(dateStr: string) {
        const d = new Date(dateStr)
        const hoje = new Date()
        if (d.toDateString() === hoje.toDateString()) {
            return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }

    // Retorna o outro participante da conversa (não o usuário logado)
    function getInterlocutor(conversa: Conversa): Participante {
        if (!userId) return conversa.cliente
        // prestador pode vir direto se vier da API de mensagens
        if (conversa.prestador) {
            return conversa.cliente?.id === userId ? conversa.prestador : conversa.cliente
        }
        // ou via servico.usuario se vier da listagem de solicitações
        const prestador = conversa.servico?.usuario
        if (prestador) {
            return conversa.cliente?.id === userId ? prestador : conversa.cliente
        }
        // fallback seguro
        return conversa.cliente || { id: 0, nome: 'Usuário', foto_perfil: null }
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-50">
            {/* Coluna esquerda: lista de conversas */}
            <div className="w-full md:w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100">
                    <h1 className="text-lg font-bold text-slate-900">Mensagens</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Suas conversas e solicitações</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {carregando ? (
                        <div className="flex items-center justify-center h-32 text-slate-400">
                            <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
                        </div>
                    ) : conversas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                            <MessageSquare size={40} className="text-slate-300 mb-3" />
                            <p className="text-sm text-slate-500">Nenhuma conversa ainda</p>
                            <p className="text-xs text-slate-400 mt-1">Encontre um profissional e solicite um serviço!</p>
                        </div>
                    ) : (
                        conversas.map(c => {
                            const interlocutor = getInterlocutor(c)
                            const ultima = c.mensagens[0]
                            const ativa = conversaAtiva === c.id
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => setConversaAtiva(c.id)}
                                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${ativa ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
                                >
                                    <img
                                        src={interlocutor.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                        alt={interlocutor.nome}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{interlocutor.nome}</p>
                                            {ultima && <span className="text-xs text-slate-400 ml-1 flex-shrink-0">{formatarHora(ultima.created_at)}</span>}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{c.servico.titulo}</p>
                                        {ultima && (
                                            <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                                                {ultima.remetente_id === userId && <CheckCheck size={10} className="text-indigo-400 flex-shrink-0" />}
                                                {ultima.conteudo}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Área do chat */}
            <div className="flex-1 flex flex-col min-w-0">
                {!conversaAtiva ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                            <MessageSquare size={36} className="text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-700">Selecione uma conversa</h2>
                        <p className="text-sm text-slate-400 mt-2 max-w-xs">
                            Escolha uma conversa na lista ao lado para começar a trocar mensagens
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header do chat */}
                        {solicitacaoInfo && (
                            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
                                {(() => {
                                    const interlocutor = getInterlocutor(solicitacaoInfo as any)
                                    return (
                                        <>
                                            <Link href={`/perfil/${interlocutor.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                                <img
                                                    src={interlocutor.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                                    className="w-9 h-9 rounded-full object-cover"
                                                    alt={interlocutor.nome}
                                                />
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900">{interlocutor.nome}</p>
                                                    <p className="text-xs text-slate-500">
                                                        Serviço: <span className="font-medium text-indigo-600">{(solicitacaoInfo as any).titulo || solicitacaoInfo.servico?.titulo}</span>
                                                    </p>
                                                </div>
                                            </Link>
                                            <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${solicitacaoInfo.status === 'pendente' ? 'bg-amber-100 text-amber-700' :
                                                solicitacaoInfo.status === 'em_negociacao' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {solicitacaoInfo.status === 'pendente' ? 'Aguardando' :
                                                    solicitacaoInfo.status === 'em_negociacao' ? 'Em negociação' : 'Concluído'}
                                            </span>
                                        </>
                                    )
                                })()}
                            </div>
                        )}

                        {/* Mensagens */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {mensagens.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-slate-400 text-sm">Nenhuma mensagem. Seja o primeiro a falar!</p>
                                </div>
                            ) : (
                                mensagens.map(msg => {
                                    const minha = msg.remetente.id === userId
                                    return (
                                        <div key={msg.id} className={`flex items-end gap-2 ${minha ? 'flex-row-reverse' : ''}`}>
                                            {!minha && (
                                                <Link href={`/perfil/${msg.remetente.id}`} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                                                    <img
                                                        src={msg.remetente.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                                        className="w-7 h-7 rounded-full object-cover"
                                                        alt={msg.remetente.nome}
                                                    />
                                                </Link>
                                            )}
                                            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${minha
                                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm'
                                                : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'
                                                }`}>
                                                <p className="leading-relaxed">{msg.conteudo}</p>
                                                <p className={`text-[10px] mt-1 ${minha ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                                                    {formatarHora(msg.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Campo de envio */}
                        <form onSubmit={enviarMensagem} className="bg-white border-t border-slate-200 p-4">
                            <div className="flex items-center gap-3">
                                <input
                                    value={texto}
                                    onChange={e => setTexto(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    disabled={enviando}
                                />
                                <button
                                    type="submit"
                                    disabled={!texto.trim() || enviando}
                                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25"
                                >
                                    {enviando ? (
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div >
    )
}
