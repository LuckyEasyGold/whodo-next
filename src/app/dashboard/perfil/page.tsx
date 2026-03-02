import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import EditarPerfilForm from './EditarPerfilForm'

export const metadata = { title: 'Editar Perfil - WhoDo!' }

export default async function DashboardPerfilPage() {
    const session = await getSession()

    if (!session) redirect('/login')

    const usuario = await prisma.usuario.findUnique({
        where: { id: session.id }
    })

    if (!usuario) redirect('/login')

    return (
        <div className="max-w-3xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-900">Editar Perfil</h1>
                <p className="text-slate-500 text-sm mt-1">Atualize suas informações públicas, foto de perfil e dados de contato.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <EditarPerfilForm usuario={JSON.parse(JSON.stringify(usuario))} />
            </div>
        </div>
    )
}
