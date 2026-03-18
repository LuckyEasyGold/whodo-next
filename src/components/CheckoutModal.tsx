'use client'

import { useState, useEffect } from 'react'
import { X, Copy, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

type Props = {
    isOpen: boolean
    onClose: () => void
    agendamento: any
}

export default function CheckoutModal({ isOpen, onClose, agendamento }: Props) {
    const [loading, setLoading] = useState(false)
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null)
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Só gera o PIX se o modal for aberto e ainda não tiver sido gerado
        if (isOpen && agendamento?.id && !qrCodeBase64) {
            gerarPix()
        }
    }, [isOpen, agendamento])

    const gerarPix = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/transacao/pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agendamentoId: agendamento.id })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Erro ao gerar PIX')

            setQrCodeBase64(data.qrCodeBase64)
            setQrCode(data.qrCode)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        if (qrCode) {
            navigator.clipboard.writeText(qrCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Pagamento via PIX</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div className="text-center mb-6">
                        <p className="text-sm text-slate-500 mb-1">Valor do Serviço</p>
                        <p className="text-3xl font-black text-slate-900">
                            R$ {Number(agendamento?.valor_total || 0).toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-sm text-slate-500 mt-2 font-medium line-clamp-1">{agendamento?.servico?.titulo || 'Serviço'}</p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4">
                            <Loader2 size={40} className="text-indigo-600 animate-spin" />
                            <p className="text-sm text-slate-500 font-medium">Gerando QR Code seguro...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center text-center p-4 bg-red-50 rounded-xl w-full">
                            <AlertCircle size={32} className="text-red-500 mb-2" />
                            <p className="text-red-700 font-medium text-sm">{error}</p>
                            <button onClick={gerarPix} className="mt-4 px-4 py-2 bg-white text-red-600 font-semibold rounded-lg shadow-sm border border-red-100 hover:bg-red-50">
                                Tentar novamente
                            </button>
                        </div>
                    ) : qrCodeBase64 ? (
                        <div className="w-full flex flex-col items-center space-y-5">
                            <div className="p-2 bg-slate-50 rounded-xl shadow-inner border border-slate-200">
                                <img src={`data:image/jpeg;base64,${qrCodeBase64}`} alt="QR Code PIX" className="w-48 h-48" />
                            </div>

                            <div className="w-full space-y-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">PIX Copia e Cola</p>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="text" value={qrCode || ''} readOnly className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3 py-2.5 focus:outline-none truncate" />
                                    <button onClick={handleCopy} className="flex items-center justify-center min-w-[100px] gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors">
                                        {copied ? <><CheckCircle2 size={16} /> Copiado</> : <><Copy size={16} /> Copiar</>}
                                    </button>
                                </div>
                            </div>
                            <div className="w-full pt-4 border-t border-slate-100">
                                <button onClick={onClose} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                                    Fechar
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-3 font-medium">O pagamento será confirmado automaticamente pelo sistema.</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}