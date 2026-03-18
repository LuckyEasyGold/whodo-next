import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { Calendar, Clock, MapPin, User } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Agenda - WhoDo!',
    description: 'Seus compromissos e agendamentos no WhoDo!',
}

export default async function AgendaPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    // Buscar agendamentos do usuário (como cliente ou prestador)
    const agendamentos = await prisma.agendamento.findMany({
        where: {
            OR: [
                { cliente_id: session.id },
                { prestador_id: session.id }
            ]
        },
        include: {
            cliente: { select: { id: true, nome: true, foto_perfil: true } },
            prestador: { select: { id: true, nome: true, foto_perfil: true, especialidade: true } },
            servico: { select: { id: true, titulo: true } }
        },
        orderBy: { data_agendamento: 'asc' }
    })

    // Separar compromissos do futuro e do passado
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const proximos = agendamentos.filter(a => new Date(a.data_agendamento) >= hoje && a.status !== 'cancelado')
    const passados = agendamentos.filter(a => new Date(a.data_agendamento) < hoje || a.status === 'cancelado')

    // Buscar solicitações pendentes (Serviços recém-contratados em negociação)
    const solicitacoes = await prisma.solicitacao.findMany({
        where: {
            OR: [
                { cliente_id: session.id },
                { prestador_id: session.id }
            ],
            status: { notIn: ['concluido', 'cancelado'] }
        },
        include: {
            cliente: { select: { id: true, nome: true, foto_perfil: true } },
            prestador: { select: { id: true, nome: true, foto_perfil: true, especialidade: true } },
            servico: { select: { id: true, titulo: true } }
        },
        orderBy: { created_at: 'desc' }
    })

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Sua Agenda</h1>
                            <p className="text-sm text-slate-500">Acompanhe seus próximos serviços e compromissos</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {solicitacoes.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-yellow-500" /> Solicitações em Negociação
                                </h2>
                                <div className="space-y-4">
                                    {solicitacoes.map(sol => (
                                        <SolicitacaoCard key={sol.id} solicitacao={sol} usuarioId={session.id} />
                                    ))}
                                </div>
                            </section>
                        )}

                        <section>
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-indigo-500" /> Próximos Compromissos
                            </h2>
                            {proximos.length === 0 ? (
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center text-slate-500">
                                    Nenhum compromisso agendado para o futuro.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {proximos.map(ag => (
                                        <AgendamentoCard key={ag.id} agendamento={ag} usuarioId={session.id} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {passados.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-slate-800 mb-4 text-slate-400">
                                    Histórico
                                </h2>
                                <div className="space-y-4 opacity-75">
                                    {passados.map(ag => (
                                        <AgendamentoCard key={ag.id} agendamento={ag} usuarioId={session.id} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>

            <div className="hidden lg:block">
                <Footer />
            </div>

            <MobileBottomNav usuarioId={session.id} />
        </>
    )
}

function AgendamentoCard({ agendamento, usuarioId }: { agendamento: any, usuarioId: number }) {
    const isPrestador = agendamento.prestador_id === usuarioId
    const outraPessoa = isPrestador ? agendamento.cliente : agendamento.prestador

    const dataFormatada = new Date(agendamento.data_agendamento).toLocaleDateString('pt-BR', {
        weekday: 'short', day: '2-digit', month: 'short'
    })
    const horaFormatada = new Date(agendamento.data_agendamento).toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit'
    })

    const statusCores: Record<string, string> = {
        'pendente': 'bg-yellow-100 text-yellow-800',
        'confirmado': 'bg-blue-100 text-blue-800',
        'concluido': 'bg-green-100 text-green-800',
        'cancelado': 'bg-red-100 text-red-800',
    }

    const statusLabels: Record<string, string> = {
        'pendente': 'Pendente',
        'confirmado': 'Confirmado',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado',
    }

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-indigo-200 transition-colors">
            <div className="flex gap-4 items-start w-full">
                <img
                    src={outraPessoa?.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                    alt={outraPessoa?.nome}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{agendamento.servico?.titulo || 'Serviço Personalizado'}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                        <User size={14} className="shrink-0" />
                        <span className="truncate">{isPrestador ? 'Cliente: ' : 'Profissional: '} <span className="font-medium text-slate-700">{outraPessoa?.nome}</span></span>
                    </div>
                    {agendamento.endereco_servico && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                            <MapPin size={14} className="shrink-0" />
                            <span className="truncate">{agendamento.endereco_servico}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 mt-2 md:mt-0 shrink-0">
                <div className="text-left md:text-right">
                    <p className="font-bold text-indigo-600 capitalize">{dataFormatada}</p>
                    <p className="text-sm text-slate-500 flex items-center md:justify-end gap-1 mt-0.5">
                        <Clock size={14} /> {horaFormatada}
                    </p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusCores[agendamento.status] || 'bg-slate-100 text-slate-800'}`}>
                    {statusLabels[agendamento.status] || agendamento.status}
                </span>

                {/* Mostra o botão apenas se o usuário atual for o Cliente e o valor ainda não foi pago */}
                {!isPrestador && !agendamento.valor_pago && agendamento.status !== 'cancelado' && (
                    <Link
                        href={`/dashboard/agendamentos/${agendamento.id}`}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                        Ver Detalhes / Pagar
                    </Link>
                )}
            </div>
        </div>
    )
}

function SolicitacaoCard({ solicitacao, usuarioId }: { solicitacao: any, usuarioId: number }) {
    const isPrestador = solicitacao.prestador_id === usuarioId
    const outraPessoa = isPrestador ? solicitacao.cliente : solicitacao.prestador

    const dataFormatada = new Date(solicitacao.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
    })

    return (
        <div className="bg-white p-5 rounded-2xl border border-dashed border-yellow-300 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex gap-4 items-start w-full">
                <img
                    src={outraPessoa?.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                    alt={outraPessoa?.nome || 'Profissional'}
                    className="w-12 h-12 rounded-full object-cover shrink-0 grayscale opacity-80"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{solicitacao.servico?.titulo || 'Serviço sob orçamento'}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                        <User size={14} className="shrink-0" />
                        <span className="truncate">{isPrestador ? 'Cliente: ' : 'Profissional: '} <span className="font-medium text-slate-700">{outraPessoa?.nome || 'Aguardando aceite...'}</span></span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Solicitado em {dataFormatada}</p>
                </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap">
                    Em Negociação
                </span>
                <Link
                    href={`/dashboard/mensagens/${solicitacao.id}`}
                    className="text-sm text-indigo-600 font-medium hover:underline whitespace-nowrap"
                >
                    Ver chat
                </Link>
            </div>
        </div>
    )
}