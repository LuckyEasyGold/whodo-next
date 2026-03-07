import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Serviços</h1>
          <p className="text-gray-600 mt-1">Acompanhe seus serviços e agendamentos em tempo real</p>
        </div>
        <Link href="/dashboard/servicos/novo" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
          <Plus size={20} />
          Criar Serviço
        </Link>
      </div>

      <ServicosContent />
    </div>
  )
}
