'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User, Video, MessageSquare } from 'lucide-react'
import Link from 'next/link'

type Agendamento = {
  id: number
  data_agendamento: string
  status: string
  descricao: string | null
  endereco_servico: string | null
  valor_total: number
  valor_pago: boolean | null
  prestador_id: number
  cliente_id: number
  servico: { id: number; titulo: string }
  cliente: { id: number; nome: string; foto_perfil: string | null }
  prestador: { id: number; nome: string; foto_perfil: string | null; especialidade: string | null }
  arquivado: boolean
}

type Solicitacao = {
  id: number
  created_at: string
  status: string
  prestador_id: number | null
  cliente_id: number
  servico: { id: number; titulo: string } | null
  cliente: { id: number; nome: string; foto_perfil: string | null }
  prestador: { id: number; nome: string; foto_perfil: string | null } | null
}

export default function AgendaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar sessão do usuário
        const sessionRes = await fetch('/api/auth/me')
        if (!sessionRes.ok) {
          router.push('/login')
          return
        }
        const session = await sessionRes.json()
        setUserId(session?.user?.id)

        // Buscar agendamentos
        const agRes = await fetch('/api/agendamento?incluir_arquivados=true')
        if (agRes.ok) {
          const data = await agRes.json()
          setAgendamentos(data)
        }

        // Buscar solicitações
        const solRes = await fetch('/api/solicitacoes')
        if (solRes.ok) {
          const data = await solRes.json()
          setSolicitacoes(data)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  // Funções do calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []

    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getAgendamentosForDate = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    return agendamentos.filter(ag => {
      const agDate = new Date(ag.data_agendamento).toISOString().split('T')[0]
      return agDate === dateKey
    })
  }

  const getSolicitacoesForDate = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    return solicitacoes.filter(sol => {
      const solDate = new Date(sol.created_at).toISOString().split('T')[0]
      return solDate === dateKey
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const [loadingAction, setLoadingAction] = useState<number | null>(null)

  const handleDesarquivar = async (id: number) => {
    setLoadingAction(id)
    try {
      const res = await fetch(`/api/agendamento/${id}/acoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'desarquivar' })
      })
      if (res.ok) {
        setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, arquivado: false } : ag))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingAction(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
      case 'aceito':
      case 'em_negociacao':
        return 'bg-yellow-400' // Amarelo - aguardando confirmação
      case 'confirmado':
      case 'aceito_cliente':
        return 'bg-blue-500' // Azul - confirmado
      case 'cancelado':
      case 'recusado':
        return 'bg-red-500' // Vermelho - cancelado
      case 'concluido':
        return 'bg-green-500' // Verde - concluído
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente'
      case 'aceito': return 'Aceito'
      case 'em_negociacao': return 'Em Negociação'
      case 'confirmado': return 'Confirmado'
      case 'aceito_cliente': return 'Confirmado'
      case 'cancelado': return 'Cancelado'
      case 'recusado': return 'Recusado'
      case 'concluido': return 'Concluído'
      default: return status
    }
  }

  // Itens do dia selecionado
  const selectedDateItems = selectedDate ? {
    agendamentos: agendamentos.filter(ag => {
      const agDate = new Date(ag.data_agendamento).toISOString().split('T')[0]
      return agDate === selectedDate
    }),
    solicitacoes: solicitacoes.filter(sol => {
      const solDate = new Date(sol.created_at).toISOString().split('T')[0]
      return solDate === selectedDate
    })
  } : { agendamentos: [], solicitacoes: [] }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sua Agenda</h1>
              <p className="text-sm text-slate-500">Visualize seus agendamentos e solicitações</p>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-xs text-slate-600">Pendente / Em Negociação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-slate-600">Confirmado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-slate-600">Cancelado / Recusado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-slate-600">Concluído</span>
            </div>
          </div>

          {/* Calendário */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            {/* Navegação do mês */}
            <div className="flex items-center justify-between p-4 bg-indigo-600 text-white">
              <button onClick={prevMonth} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {dayNames.map(day => (
                <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7">
              {getDaysInMonth(currentDate).map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-24 bg-slate-50 border-b border-r border-slate-100"></div>
                }

                const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dayAgendamentos = getAgendamentosForDate(day)
                const daySolicitacoes = getSolicitacoesForDate(day)
                const isToday = new Date().toISOString().split('T')[0] === dateKey
                const isSelected = selectedDate === dateKey
                const hasItems = dayAgendamentos.length > 0 || daySolicitacoes.length > 0

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`h-24 border-b border-r border-slate-100 p-1 text-left transition-colors hover:bg-slate-50 
                      ${isSelected ? 'bg-indigo-50 ring-2 ring-indigo-500' : ''}
                      ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    
                    {/* Indicadores de eventos */}
                    <div className="mt-1 space-y-1">
                      {dayAgendamentos.slice(0, 2).map(ag => (
                        <div
                          key={`ag-${ag.id}`}
                          className={`text-[10px] px-1 py-0.5 rounded text-white truncate ${ag.arquivado ? 'bg-gray-400' : getStatusColor(ag.status)}`}
                          title={`${ag.servico?.titulo} - ${getStatusLabel(ag.status)}${ag.arquivado ? ' (Arquivado)' : ''}`}
                        >
                          {ag.servico?.titulo}
                        </div>
                      ))}
                      {dayAgendamentos.length > 2 && (
                        <div className="text-[10px] text-slate-500">+{dayAgendamentos.length - 2} mais</div>
                      )}
                      
                      {daySolicitacoes.slice(0, 1).map(sol => (
                        <div
                          key={`sol-${sol.id}`}
                          className="text-[10px] px-1 py-0.5 rounded bg-yellow-100 text-yellow-800 truncate"
                          title={`Solicitação: ${sol.servico?.titulo || 'Sem título'}`}
                        >
                          {sol.servico?.titulo || 'Solicitação'}
                        </div>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Detalhes do dia selecionado */}
          {selectedDate && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h3>
                <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              {selectedDateItems.agendamentos.length === 0 && selectedDateItems.solicitacoes.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Nenhum agendamento ou solicitação neste dia.</p>
              ) : (
                <div className="space-y-3">
                  {/* Agendamentos */}
                  {selectedDateItems.agendamentos.map(ag => {
                    const isPrestador = userId === ag.prestador_id
                    const outraPessoa = isPrestador ? ag.cliente : ag.prestador
                    
                    return (
                      <div key={ag.id} className={`flex items-center gap-3 p-3 rounded-xl ${ag.arquivado ? 'bg-gray-100 opacity-75' : 'bg-slate-50'}`}>
                        <div className={`w-2 h-12 rounded-full ${ag.arquivado ? 'bg-gray-400' : getStatusColor(ag.status)}`}></div>
                        <img
                          src={outraPessoa?.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                          alt={outraPessoa?.nome}
                          className={`w-10 h-10 rounded-full object-cover ${ag.arquivado ? 'grayscale' : ''}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold truncate ${ag.arquivado ? 'text-gray-600 line-through' : 'text-slate-900'}`}>
                            {ag.servico?.titulo} {ag.arquivado && '(Arquivado)'}
                          </p>
                          <p className="text-sm text-slate-500">
                            {isPrestador ? 'Cliente: ' : 'Profissional: '} {outraPessoa?.nome}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full text-white ${ag.arquivado ? 'bg-gray-400' : getStatusColor(ag.status)}`}>
                            {getStatusLabel(ag.status)}
                          </span>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(ag.data_agendamento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {ag.arquivado ? (
                          <button
                            onClick={() => handleDesarquivar(ag.id)}
                            disabled={loadingAction === ag.id}
                            className="text-xs font-semibold px-2 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            {loadingAction === ag.id ? '...' : 'Desarquivar'}
                          </button>
                        ) : (
                          <Link
                            href={`/dashboard/agendamentos/${ag.id}`}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          >
                            →
                          </Link>
                        )}
                      </div>
                    )
                  })}

                  {/* Solicitações */}
                  {selectedDateItems.solicitacoes.map(sol => {
                    const isPrestador = userId === sol.prestador_id
                    const outraPessoa = isPrestador ? sol.cliente : sol.prestador
                    
                    return (
                      <div key={sol.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="w-2 h-12 rounded-full bg-yellow-400"></div>
                        <img
                          src={outraPessoa?.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                          alt={outraPessoa?.nome}
                          className="w-10 h-10 rounded-full object-cover grayscale"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{sol.servico?.titulo || 'Solicitação'}</p>
                          <p className="text-sm text-slate-500">
                            {isPrestador ? 'Cliente: ' : 'Profissional: '} {outraPessoa?.nome || 'Aguardando'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">
                            Em Negociação
                          </span>
                        </div>
                        <Link
                          href={`/dashboard/mensagens/${sol.id}`}
                          className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
                        >
                          <MessageSquare size={18} />
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-yellow-500">{agendamentos.filter(a => a.status === 'pendente').length}</p>
              <p className="text-sm text-slate-500">Pendentes</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-blue-500">{agendamentos.filter(a => a.status === 'confirmado').length}</p>
              <p className="text-sm text-slate-500">Confirmados</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-green-500">{agendamentos.filter(a => a.status === 'concluido').length}</p>
              <p className="text-sm text-slate-500">Concluídos</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-red-500">{agendamentos.filter(a => a.status === 'cancelado').length}</p>
              <p className="text-sm text-slate-500">Cancelados</p>
            </div>
          </div>
        </div>
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>

      {userId && <MobileBottomNav usuarioId={userId} />}
    </>
  )
}
