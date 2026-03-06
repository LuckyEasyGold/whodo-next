'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MessageSquare, CheckCircle, Star, Clock, MapPin, Tag, FileText } from 'lucide-react'

type Servico = {
  id: number
  titulo: string
  descricao: string | null
  preco_base: any
  cobranca_tipo: string
  categoria: { nome: string }
}

type Props = {
  usuario: {
    id: number
    nome: string
    nome_fantasia: string | null
    foto_perfil: string | null
    especialidade: string | null
    avaliacao_media: any
    cidade: string | null
    estado: string | null
    servicos: Servico[]
  }
  isOpen: boolean
  onClose: () => void
}

export default function ContratarModal({ usuario, isOpen, onClose }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<'escolher' | 'detalhes' | 'sucesso'>('escolher')
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [solicitacaoId, setSolicitacaoId] = useState<number | null>(null)

  function fechar() {
    onClose()
    setTimeout(() => { setStep('escolher'); setServicoSelecionado(null); setMensagem(''); setErro('') }, 300)
  }

  function selecionarServico(s: Servico) {
    setServicoSelecionado(s)
    const prefixo = s.cobranca_tipo === 'FIXO'
      ? `Olá! Gostaria de agendar o serviço "${s.titulo}". Qual seria a sua disponibilidade?`
      : `Olá! Tenho interesse no serviço "${s.titulo}". Poderia me informar mais detalhes e valor?`
    setMensagem(prefixo)
    setStep('detalhes')
  }

  async function confirmar() {
    if (!servicoSelecionado || !mensagem.trim()) return
    setEnviando(true)
    setErro('')
    try {
      const r = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servico_id: servicoSelecionado.id,
          mensagem_inicial: mensagem.trim(),
        })
      })
      const data = await r.json()
      if (r.status === 401) {
        router.push('/login')
        return
      }
      if (!r.ok) {
        setErro(data.error || 'Erro ao enviar solicitação.')
        return
      }
      setSolicitacaoId(data.solicitacao_id)
      setStep('sucesso')
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const rating = Number(usuario.avaliacao_media || 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && fechar()}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Cabeçalho do modal */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white">
              <button onClick={fechar} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all">
                <X size={16} />
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={usuario.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  className="w-14 h-14 rounded-2xl object-cover ring-3 ring-white/40"
                  alt={usuario.nome}
                />
                <div>
                  <h2 className="font-bold text-lg leading-tight">{usuario.nome_fantasia || usuario.nome}</h2>
                  {usuario.especialidade && <p className="text-indigo-200 text-sm">{usuario.especialidade}</p>}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-yellow-300 font-medium">
                      <Star size={11} className="fill-yellow-300" /> {rating.toFixed(1)}
                    </span>
                    {usuario.cidade && (
                      <span className="flex items-center gap-1 text-xs text-indigo-200">
                        <MapPin size={11} /> {usuario.cidade}, {usuario.estado}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo do modal por etapa */}
            <div className="p-6">

              {/* ETAPA 1: Escolher serviço */}
              {step === 'escolher' && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Escolha o serviço</h3>
                  <p className="text-sm text-slate-500 mb-4">Selecione qual serviço você deseja contratar ou solicitar orçamento</p>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {usuario.servicos.length === 0 ? (
                      <p className="text-center text-slate-400 py-6 text-sm">Este profissional ainda não cadastrou serviços.</p>
                    ) : (
                      usuario.servicos.map(s => (
                        <button
                          key={s.id}
                          onClick={() => selecionarServico(s)}
                          className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{s.titulo}</p>
                              {s.descricao && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.descricao}</p>}
                              <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{s.categoria.nome}</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {s.cobranca_tipo === 'FIXO' ? (
                                <div>
                                  <span className="text-indigo-600 font-bold text-base">R$ {Number(s.preco_base).toFixed(0)}</span>
                                  <div className="mt-0.5 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium inline-block">
                                    <Calendar size={9} className="inline mr-0.5" />Agendar
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <span className="text-slate-500 font-medium text-sm">A combinar</span>
                                  <div className="mt-0.5 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium inline-block">
                                    <FileText size={9} className="inline mr-0.5" />Orçamento
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ETAPA 2: Mensagem de contato */}
              {step === 'detalhes' && servicoSelecionado && (
                <div>
                  <button onClick={() => setStep('escolher')} className="text-xs text-indigo-600 mb-4 hover:underline flex items-center gap-1">← Voltar</button>

                  {/* Resumo do serviço selecionado */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{servicoSelecionado.titulo}</p>
                        <p className="text-xs text-slate-500">{servicoSelecionado.categoria.nome}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${servicoSelecionado.cobranca_tipo === 'FIXO' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                        {servicoSelecionado.cobranca_tipo === 'FIXO' ? `R$ ${Number(servicoSelecionado.preco_base).toFixed(0)}` : 'Orçamento'}
                      </span>
                    </div>
                  </div>

                  <label className="block text-sm font-semibold text-slate-800 mb-2">Sua mensagem para o profissional</label>
                  <textarea
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
                    placeholder="Descreva o que precisa, local e qualquer detalhes importante..."
                  />
                  {erro && <p className="text-red-500 text-xs mt-2">{erro}</p>}

                  <button
                    onClick={confirmar}
                    disabled={!mensagem.trim() || enviando}
                    className={`w-full mt-4 py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg disabled:opacity-50 ${servicoSelecionado.cobranca_tipo === 'FIXO'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/25'
                      }`}
                  >
                    {enviando ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : servicoSelecionado.cobranca_tipo === 'FIXO' ? (
                      <span className="flex items-center justify-center gap-2"><Calendar size={16} /> Enviar Solicitação de Agendamento</span>
                    ) : (
                      <span className="flex items-center justify-center gap-2"><MessageSquare size={16} /> Solicitar Orçamento</span>
                    )}
                  </button>
                </div>
              )}

              {/* ETAPA 3: Sucesso */}
              {step === 'sucesso' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Solicitação enviada!</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Sua mensagem foi enviada para <strong>{usuario.nome_fantasia || usuario.nome}</strong>.
                    Acompanhe a conversa no painel de mensagens.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={fechar} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all">
                      Fechar
                    </button>
                    <button
                      onClick={() => { fechar(); router.push(`/dashboard/mensagens?conversa=${solicitacaoId}`) }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
                    >
                      <MessageSquare size={14} className="inline mr-1.5" />Ver conversa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
