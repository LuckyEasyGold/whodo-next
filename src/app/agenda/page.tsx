import { redirect } from 'next/navigation'

export default function AgendaPage() {
    // Redirecionar para a página de agendamentos do dashboard
    redirect('/dashboard/agendamentos')
}
