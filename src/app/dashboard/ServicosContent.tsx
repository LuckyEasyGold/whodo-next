'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, DollarSign, Calendar, Star, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'

interface Servico {
  id: number
  titulo: string
  descricao?: string
  preco_base: number
  categoria?: { nome: string }
  estatisticas: {
    totalAgendamentos: number
    pendentes: number
    confirmados: number
    concluidos: number
    cancelados: number
    totalAvaliacoes: number
    mediaAvaliacoes: number | string
  }
  agendamentos?: any[]
  avaliacoes?: any[]
}

export default function ServicosContent() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServicos()
  }, [])

  const fetchServicos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/servicos')
      if (!response.ok) throw new Error('Erro ao carregar serviços')
      const data = await response.json()
      setServicos(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        <p className="font-semibold">Erro ao carregar serviços</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchServicos}
          className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (servicos.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-900">Nenhum serviço</h3>
        <p className="text-gray-600 mt-1">Você ainda não criou nenhum serviço.</p>
        <Link
          href="/dashboard/servicos/novo"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Criar novo serviço
        </Link>
      </div>
    )
  }

  const totalGanho = servicos.reduce((sum, s) => {
    const concluidos = s.agendamentos?.filter((a: any) => a.status === 'concluido') || []
    return sum + concluidos.reduce((s: number, a: any) => s + parseFloat(a.valor_total), 0)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Resumo geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Serviços</p>
              <p className="text-2xl font-bold text-gray-900">{servicos.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900">
                {servicos.reduce((sum, s) => sum + s.estatisticas.totalAgendamentos, 0)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Concluído</p>
              <p className="text-2xl font-bold text-gray-900">
                {servicos.reduce((sum, s) => sum + s.estatisticas.concluidos, 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avaliação Média</p>
              <p className="text-2xl font-bold text-gray-900">
                {servicos.length > 0
                  ? (
                      servicos.reduce((sum, s) => {
                        const avg = typeof s.estatisticas.mediaAvaliacoes === 'string'
                          ? parseFloat(s.estatisticas.mediaAvaliacoes)
                          : s.estatisticas.mediaAvaliacoes
                        return sum + (isNaN(avg) ? 0 : avg)
                      }, 0) / servicos.length
                    ).toFixed(1)
                  : '0'}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Lista de serviços */}
      <div className="space-y-4">
        {servicos.map((servico) => (
          <div key={servico.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header do serviço */}
            <button
              onClick={() => setExpandedId(expandedId === servico.id ? null : servico.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900">{servico.titulo}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>{servico.categoria?.nome}</span>
                  <span>•</span>
                  <span className="font-semibold text-gray-900">
                    R$ {parseFloat(String(servico.preco_base)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                    {servico.estatisticas.totalAgendamentos} agendamentos
                  </span>
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">
                    {servico.estatisticas.mediaAvaliacoes} ⭐
                  </span>
                </div>

                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition ${
                    expandedId === servico.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Descrição */}
            {servico.descricao && (
              <div className="px-6 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                {servico.descricao}
              </div>
            )}

            {/* Detalhes expandidos */}
            {expandedId === servico.id && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-4">
                {/* Estatísticas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      {servico.estatisticas.totalAgendamentos}
                    </p>
                  </div>

                  <div className="bg-white rounded p-3 border border-orange-200 bg-orange-50">
                    <p className="text-xs text-gray-600">Pendente</p>
                    <p className="text-xl font-bold text-orange-600">
                      {servico.estatisticas.pendentes}
                    </p>
                  </div>

                  <div className="bg-white rounded p-3 border border-blue-200 bg-blue-50">
                    <p className="text-xs text-gray-600">Confirmado</p>
                    <p className="text-xl font-bold text-blue-600">
                      {servico.estatisticas.confirmados}
                    </p>
                  </div>

                  <div className="bg-white rounded p-3 border border-green-200 bg-green-50">
                    <p className="text-xs text-gray-600">Concluído</p>
                    <p className="text-xl font-bold text-green-600">
                      {servico.estatisticas.concluidos}
                    </p>
                  </div>

                  <div className="bg-white rounded p-3 border border-red-200 bg-red-50">
                    <p className="text-xs text-gray-600">Cancelado</p>
                    <p className="text-xl font-bold text-red-600">
                      {servico.estatisticas.cancelados}
                    </p>
                  </div>
                </div>

                {/* Avaliações resumidas */}
                {servico.avaliacoes && servico.avaliacoes.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Avaliações recentes</h4>
                    <div className="space-y-3">
                      {servico.avaliacoes.slice(0, 3).map((av: any) => (
                        <div key={av.id} className="pb-3 border-b border-gray-200 last:border-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{av.cliente?.nome}</p>
                            <span className="text-sm font-semibold text-yellow-600">
                              {av.nota} ⭐
                            </span>
                          </div>
                          {av.comentario && (
                            <p className="text-sm text-gray-600 mt-1">{av.comentario}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(av.data_avaliacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agendamentos recentes */}
                {servico.agendamentos && servico.agendamentos.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Agendamentos recentes</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {servico.agendamentos.slice(0, 5).map((agend: any) => (
                        <Link
                          key={agend.id}
                          href={`/dashboard/agendamentos/${agend.id}`}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition text-sm border-l-4 border-indigo-300"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{agend.cliente?.nome}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(agend.data_agendamento).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              agend.status === 'pendente'
                                ? 'bg-orange-100 text-orange-700'
                                : agend.status === 'confirmado'
                                  ? 'bg-blue-100 text-blue-700'
                                  : agend.status === 'concluido'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {agend.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/servicos/${servico.id}/editar`}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold text-center"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/dashboard/agendamentos?servicoId=${servico.id}`}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-sm font-semibold text-center flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver agendamentos
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Icon component simples
function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  )
}
