import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ServicosContent from '../ServicosContent'

export const metadata = {
  title: 'Meus Serviços | WhoDo',
  description: 'Gerenciador de seus serviços e agendamentos',
}

export default async function ServicosPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Verificar se é prestador
  if (session.tipo !== 'usuario') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Serviços</h1>
        <p className="text-gray-600 mt-1">Acompanhe seus serviços e agendamentos em tempo real</p>
      </div>

      <ServicosContent />
    </div>
  )
}
