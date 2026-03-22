'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react'

type Servico = {
  id: number
  titulo: string
  descricao: string | null
  preco_base: number
  cobranca_tipo: string
  usuario: { id: number; nome: string; foto_perfil: string | null }
}

type AgendamentoExistente = {
  id: number
  data_agendamento: string
  status: string
}

function AgendarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const servicoId = searchParams.get('servico')
  const prestadorId = searchParams.get('prestador')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [servico, setServico] = useState<Servico | null>(null)
  const [agendamentosExistentes, setAgendamentosExistentes] = useState<AgendamentoExistente[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [descricao, setDescricao] = useState('')
  const [endereco, setEndereco] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [agendamentoId, setAgendamentoId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!servicoId || !prestadorId) {
        setError('Parâmetros inválidos')
        setLoading(false)
        return
      }

      try {
        // Buscar sessão
        const sessionRes = await fetch('/api/auth/me')
        if (!sessionRes.ok) {
          router.push('/login')
          return
        }
        const session = await sessionRes.json()
        setUserId(session?.user?.id)

        // Buscar dados do serviço
        const servicoRes = await fetch(`/api/servicos/${servicoId}`)
        if (!servicoRes.ok) {
          setError('Serviço não encontrado')
          setLoading(false)
          return
        }
        const servicoData = await servicoRes.json()
        setServico(servicoData)

        // Buscar agendamentos existentes do prestador (para mostrar ocupado)
        const agRes = await fetch(`/api/agendamento?prestador_id=${prestadorId}`)
        if (agRes.ok) {
          const agData = await agRes.json()
          setAgendamentosExistentes(agData)
        }
      } catch (err) {
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [servicoId, prestadorId, router])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    const days: (number | null)[] = []
    for (let i = 0; i < startingDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }

  const isDateOccupied = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return agendamentosExistentes.some(ag => {
      const agDate = new Date(ag.data_agendamento).toISOString().split('T')[0]
      return agDate === dateStr && ag.status !== 'cancelado'
    })
  }

  const isDatePast = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentDate.getMonth() &&
           selectedDate.getFullYear() === currentDate.getFullYear()
  }

  // Horários disponíveis (8h às 18h, intervalo de 1h)
  const horariosDisponiveis = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  async function confirmarAgendamento() {
    if (!selectedDate || !selectedTime || !servico || !userId) return
    
    setConfirmando(true)
    setError('')

    try {
      const dataHora = new Date(selectedDate)
      const [hora, minuto] = selectedTime.split(':')
      dataHora.setHours(parseInt(hora), parseInt(minuto), 0, 0)

      const res = await fetch('/api/agendamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prestador_id: prestadorId,
          servico_id: parseInt(servicoId!),
          data_agendamento: dataHora.toISOString(),
          descricao: descricao,
          endereco_servico: endereco,
          valor_total: servico.preco_base
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao criar agendamento')
      }

      const agendamento = await res.json()
      setAgendamentoId(agendamento.id)
      setSucesso(true)
      
      // Redirecionar para mensagens após 2 segundos
      setTimeout(() => {
        router.push(`/dashboard/mensagens?conversa=${agendamento.solicitacao_id}`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao confirmar agendamento')
    } finally {
      setConfirmando(false)
    }
  }

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

  if (error && !servico) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 pt-20 pb-20">
          <div className="max-w-md mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-900 mb-2">Erro</h2>
              <p className="text-red-700">{error}</p>
              <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
                Voltar
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (sucesso) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 pt-20 pb-20">
          <div className="max-w-md mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Agendamento Confirmado!</h2>
              <p className="text-slate-600 mb-6">
                Seu agendamento foi criado com sucesso. O profissional receberá uma notificação.
              </p>
              
              {selectedDate && (
                <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-indigo-600 font-medium">Data e Hora</p>
                  <p className="text-lg font-bold text-indigo-900">
                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {selectedTime}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => router.push('/agenda')} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold">
                  Ver Agenda
                </button>
                <button onClick={() => router.push('/dashboard')} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold">
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          {/* Cabeçalho */}
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 mb-4 hover:text-slate-900">
            <ChevronLeft size={20} /> Voltar
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Escolha a Data e Hora</h1>
              <p className="text-sm text-slate-500">Selecione quando deseja agendar o serviço</p>
            </div>
          </div>

          {/* Info do Serviço */}
          {servico && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <div className="flex gap-4">
                <img
                  src={servico.usuario.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  alt={servico.usuario.nome}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{servico.titulo}</h3>
                  <p className="text-sm text-slate-500">{servico.usuario.nome}</p>
                  <p className="text-lg font-bold text-indigo-600 mt-1">R$ {Number(servico.preco_base).toFixed(0)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Calendário */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="flex items-center justify-between p-4 bg-indigo-600 text-white">
              <button onClick={prevMonth} className="p-2 hover:bg-white/20 rounded-lg"><ChevronLeft size={20} /></button>
              <h2 className="text-lg font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <button onClick={nextMonth} className="p-2 hover:bg-white/20 rounded-lg"><ChevronRight size={20} /></button>
            </div>
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {dayNames.map(day => <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {getDaysInMonth(currentDate).map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} className="h-16 bg-slate-50 border-b border-r border-slate-100"></div>
                
                const occupied = isDateOccupied(day)
                const past = isDatePast(day)
                const selected = isDateSelected(day)
                const disabled = occupied || past

                return (
                  <button
                    key={day}
                    disabled={disabled}
                    onClick={() => {
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 10, 0)
                      setSelectedDate(date)
                      setSelectedTime(null)
                    }}
                    className={`h-16 border-b border-r border-slate-100 text-sm transition-colors
                      ${disabled ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'hover:bg-indigo-50 cursor-pointer'}
                      ${selected ? 'bg-indigo-100 ring-2 ring-indigo-500' : ''}
                      ${occupied ? 'bg-red-50' : ''}`}
                  >
                    <span className={disabled ? 'text-slate-300' : selected ? 'text-indigo-700 font-bold' : 'text-slate-700'}>{day}</span>
                    {occupied && !past && <span className="block text-[10px] text-red-500">Ocupado</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Horários */}
          {selectedDate && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock size={18} /> Horários disponíveis
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {horariosDisponiveis.map(hora => (
                  <button
                    key={hora}
                    onClick={() => setSelectedTime(hora)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors
                      ${selectedTime === hora 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detalhes adicionais */}
          {selectedTime && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
              <h3 className="font-bold text-slate-900 mb-4">Detalhes do Agendamento</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações (opcional)</label>
                <textarea
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  placeholder="Descreva o que precisa..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço (opcional)</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={e => setEndereco(e.target.value)}
                  placeholder="Onde será realizado o serviço?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Confirmar */}
          {selectedDate && selectedTime && (
            <button
              onClick={confirmarAgendamento}
              disabled={confirmando}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {confirmando ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Confirmando...
                </span>
              ) : (
                `Confirmar Agendamento - R$ ${Number(servico?.preco_base || 0).toFixed(2)}`
              )}
            </button>
          )}
        </div>
      </main>

      {userId && <MobileBottomNav usuarioId={userId} />}
    </>
  )
}

export default function AgendarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
      <AgendarContent />
    </Suspense>
  )
}
