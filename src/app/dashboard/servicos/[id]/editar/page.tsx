import ServicoForm from '../../components/ServicoForm'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const metadata = {
    title: 'Editar Serviço | Whodo',
}

export default async function EditarServicoPage({ params }: { params: { id: string } }) {
    const servicoId = parseInt(params.id)

    if (isNaN(servicoId)) {
        notFound()
    }

    const servico = await prisma.servico.findUnique({
        where: { id: servicoId }
    })

    if (!servico) {
        notFound()
    }

    // Converter Decimal para número/string para o lado do cliente não reclamar
    const cleanServico = {
        ...servico,
        preco_base: servico.preco_base ? servico.preco_base.toString() : '0'
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <ServicoForm initialData={cleanServico} isEditing={true} />
        </div>
    )
}
