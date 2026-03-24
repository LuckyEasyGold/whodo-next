'use client'

import { useState, useEffect } from 'react'
import {
  ChevronDown,
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
  Eye,
  Archive,
  RefreshCw,
  X,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

interface Servico {
  id: number
  titulo: string
  descricao?: string
  preco_base: number
  status: string
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
  agendamentos?: AgendamentoItem[]
  avaliacoes?: AvaliacaoItem[]
}

interface AgendamentoItem {
  id: number
  status: string
  data_agendamento: string
  valor_total: string
  cliente?: { nome: string }
}

interface AvaliacaoItem {
  id: number
  nota: number
  comentario?: string
  data_avaliacao: string
  cliente?: { nome: string }
}

type Aba = 'ativos' | 'arquivados'

// ───────────────────────────────────────────────
// Modal de confirmação de arquivamento
// ───────────────────────────────────────────────
function ModalArquivar({
  servico,
  onConfirmar,
  onCancelar,
  loading,
}: {
  servico: Servico
  onConfirmar: () => void
  onCancelar: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancelar}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
        {/* Close */}
        <button
          onClick={onCancelar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-amber-100 rounded-full mx-auto mb-4">
          <Archive className="text-amber-600" size={28} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Arquivar serviço?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          <span className="font-semibold text-gray-700">{servico.titulo}</span>
        </p>

        {/* Aviso histórico */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Por que não é possível excluir?</p>
            <p>
              Este serviço faz parte do <strong>histórico de agendamentos</strong> e
              avaliações de clientes. Excluí-lo apagaria registros importantes para
              você e para a plataforma.
            </p>
          </div>
        </div>

        {/* O que acontece */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-700 space-y-2">
          <p className="font-semibold text-gray-800">O que acontece ao arquivar:</p>
          <ul className="space-y-1 list-none">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">✗</span>
              O serviço <strong>não aparece mais na busca pública</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">✗</span>
              Novos clientes não poderão contratar este serviço
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              O histórico e avaliações são preservados
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              Você pode <strong>reativar</strong> quando quiser
            </li>
          </ul>
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Archive size={16} />
            )}
            Arquivar mesmo assim
          </button>
        </div>
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────
// Componente principal
// ───────────────────────────────────────────────
export default function ServicosContent() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aba, setAba] = useState<Aba>('ativos')
  const [modalServico, setModalServico] = useState<Servico | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

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

  const alterarStatus = async (servico: Servico, novoStatus: 'ativo' | 'arquivado') => {
    setActionLoading(servico.id)
    try {
      const res = await fetch(`/api/servicos/${servico.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      })
      if (!res.ok) throw new Error('Erro ao atualizar serviço')
      // Atualiza localmente sem refetch
      setServicos(prev =>
        prev.map(s => (s.id === servico.id ? { ...s, status: novoStatus } : s))
      )
      setModalServico(null)
      // Muda aba conforme ação
      if (novoStatus === 'arquivado') setAba('arquivados')
      else setAba('ativos')
    } catch {
      alert('Erro ao atualizar o serviço. Tente novamente.')
    } finally {
      setActionLoading(null)
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

  const ativos = servicos.filter(s => s.status !== 'arquivado')
  const arquivados = servicos.filter(s => s.status === 'arquivado')
  const listaAtual = aba === 'ativos' ? ativos : arquivados

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
    const concluidos = s.agendamentos?.filter((a) => a.status === 'concluido') || []
    return sum + concluidos.reduce((acc, a) => acc + parseFloat(a.valor_total), 0)
  }, 0)

  return (
    <>
      {/* Modal de arquivamento */}
      {modalServico && (
        <ModalArquivar
          servico={modalServico}
          loading={actionLoading === modalServico.id}
          onConfirmar={() => alterarStatus(modalServico, 'arquivado')}
          onCancelar={() => setModalServico(null)}
        />
      )}

      <div className="space-y-6">
        {/* Resumo geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Serviços Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{ativos.length}</p>
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
                          const avg =
                            typeof s.estatisticas.mediaAvaliacoes === 'string'
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

        {/* Abas Ativos / Arquivados */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          <button
            onClick={() => setAba('ativos')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              aba === 'ativos'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ativos
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                aba === 'ativos'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {ativos.length}
            </span>
          </button>
          <button
            onClick={() => setAba('arquivados')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              aba === 'arquivados'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Arquivados
            {arquivados.length > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  aba === 'arquivados'
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {arquivados.length}
              </span>
            )}
          </button>
        </div>

        {/* Lista vazia */}
        {listaAtual.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            {aba === 'ativos' ? (
              <>
                <Package className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhum serviço ativo</p>
                <Link
                  href="/dashboard/servicos/novo"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                  Criar novo serviço
                </Link>
              </>
            ) : (
              <>
                <Archive className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhum serviço arquivado</p>
              </>
            )}
          </div>
        )}

        {/* Lista de serviços */}
        <div className="space-y-4">
          {listaAtual.map((servico) => {
            const isArquivado = servico.status === 'arquivado'
            return (
              <div
                key={servico.id}
                className={`bg-white rounded-lg border overflow-hidden transition ${
                  isArquivado ? 'border-gray-200 opacity-75' : 'border-gray-200'
                }`}
              >
                {/* Header do serviço */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === servico.id ? null : servico.id)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {servico.titulo}
                      </h3>
                      {isArquivado && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                          <Archive size={11} />
                          Arquivado
                        </span>
                      )}
                    </div>
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
                      <div className="bg-orange-50 rounded p-3 border border-orange-200">
                        <p className="text-xs text-gray-600">Pendente</p>
                        <p className="text-xl font-bold text-orange-600">
                          {servico.estatisticas.pendentes}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded p-3 border border-blue-200">
                        <p className="text-xs text-gray-600">Confirmado</p>
                        <p className="text-xl font-bold text-blue-600">
                          {servico.estatisticas.confirmados}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded p-3 border border-green-200">
                        <p className="text-xs text-gray-600">Concluído</p>
                        <p className="text-xl font-bold text-green-600">
                          {servico.estatisticas.concluidos}
                        </p>
                      </div>
                      <div className="bg-red-50 rounded p-3 border border-red-200">
                        <p className="text-xs text-gray-600">Cancelado</p>
                        <p className="text-xl font-bold text-red-600">
                          {servico.estatisticas.cancelados}
                        </p>
                      </div>
                    </div>

                    {/* Avaliações resumidas */}
                    {servico.avaliacoes && servico.avaliacoes.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Avaliações recentes
                        </h4>
                        <div className="space-y-3">
                          {servico.avaliacoes.slice(0, 3).map((av) => (
                            <div
                              key={av.id}
                              className="pb-3 border-b border-gray-200 last:border-0"
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">
                                  {av.cliente?.nome}
                                </p>
                                <span className="text-sm font-semibold text-yellow-600">
                                  {av.nota} ⭐
                                </span>
                              </div>
                              {av.comentario && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {av.comentario}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(av.data_avaliacao).toLocaleDateString(
                                  'pt-BR'
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Agendamentos recentes */}
                    {servico.agendamentos && servico.agendamentos.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Agendamentos recentes
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {servico.agendamentos.slice(0, 5).map((agend) => (
                            <Link
                              key={agend.id}
                              href={`/dashboard/agendamentos/${agend.id}`}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition text-sm border-l-4 border-indigo-300"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {agend.cliente?.nome}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    agend.data_agendamento
                                  ).toLocaleDateString('pt-BR')}
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

                    {/* Faixa de serviço arquivado */}
                    {isArquivado && (
                      <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-start gap-3 text-sm text-gray-600">
                        <Archive size={16} className="mt-0.5 shrink-0 text-gray-400" />
                        <p>
                          Este serviço está <strong>arquivado</strong> e não aparece na
                          busca pública. O histórico de agendamentos e avaliações é
                          preservado.
                        </p>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-3 flex-wrap">
                      {!isArquivado && (
                        <Link
                          href={`/dashboard/servicos/${servico.id}/editar`}
                          className="flex-1 min-w-[120px] px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold text-center"
                        >
                          Editar
                        </Link>
                      )}

                      <Link
                        href={`/dashboard/agendamentos?servicoId=${servico.id}`}
                        className="flex-1 min-w-[140px] px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-sm font-semibold text-center flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Ver agendamentos
                      </Link>

                      {isArquivado ? (
                        <button
                          onClick={() => alterarStatus(servico, 'ativo')}
                          disabled={actionLoading === servico.id}
                          className="flex-1 min-w-[120px] px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {actionLoading === servico.id ? (
                            <RefreshCw size={15} className="animate-spin" />
                          ) : (
                            <RefreshCw size={15} />
                          )}
                          Reativar
                        </button>
                      ) : (
                        <button
                          onClick={() => setModalServico(servico)}
                          disabled={actionLoading === servico.id}
                          className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-100 transition text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          <Archive size={15} />
                          Arquivar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
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
