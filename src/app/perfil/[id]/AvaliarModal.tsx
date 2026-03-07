import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Loader2 } from 'lucide-react'

type Props = {
    isOpen: boolean
    onClose: () => void
    usuarioId: number
    servicos: { id: number; titulo: string }[]
    onAvaliacaoCriada: (avaliacao: any) => void
}

export default function AvaliarModal({ isOpen, onClose, usuarioId, servicos, onAvaliacaoCriada }: Props) {
    const [servicoId, setServicoId] = useState<string>('')
    const [nota, setNota] = useState<number>(0)
    const [hoverNota, setHoverNota] = useState<number>(0)
    const [comentario, setComentario] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!servicoId) {
            setError('Selecione um serviço')
            return
        }
        if (nota < 1 || nota > 5) {
            setError('Selecione uma nota de 1 a 5 estrelas')
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/avaliacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prestador_id: usuarioId,
                    servico_id: servicoId,
                    nota,
                    comentario
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Erro ao enviar avaliação')

            onAvaliacaoCriada(data.avaliacao)
            // Limpa o form
            setServicoId('')
            setNota(0)
            setComentario('')
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao enviar avaliação')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-lg font-bold text-slate-800">Avaliar Profissional</h2>
                        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Serviço Avaliado *</label>
                            {servicos.length === 0 ? (
                                <p className="text-sm text-red-500">Este profissional não possui serviços cadastrados.</p>
                            ) : (
                                <select
                                    value={servicoId}
                                    onChange={(e) => setServicoId(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all text-slate-700 bg-white"
                                >
                                    <option value="">Selecione um serviço...</option>
                                    {servicos.map(s => (
                                        <option key={s.id} value={s.id}>{s.titulo}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sua Nota *</label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNota(star)}
                                        onMouseEnter={() => setHoverNota(star)}
                                        onMouseLeave={() => setHoverNota(0)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            size={32}
                                            className={`transition-colors ${(hoverNota || nota) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Clique nas estrelas para avaliar</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Comentário (Opcional)</label>
                            <textarea
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Conte como foi sua experiência..."
                                rows={4}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all text-slate-700 resize-none"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || servicos.length === 0}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : 'Enviar Avaliação'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
