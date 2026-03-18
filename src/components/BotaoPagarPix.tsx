'use client'

import { useState } from 'react'
import { QrCode } from 'lucide-react'
import CheckoutModal from '@/components/CheckoutModal'

export default function BotaoPagarPix({ agendamento }: { agendamento: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
            >
                <QrCode size={16} /> Pagar com PIX
            </button>

            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                agendamento={agendamento}
            />
        </>
    )
}