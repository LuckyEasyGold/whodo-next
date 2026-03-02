import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import DashboardSidebar from './DashboardSidebar'
import DashboardMobileNav from './DashboardMobileNav'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    if (!session) redirect('/login')

    const usuario = await prisma.usuario.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            nome: true,
            foto_perfil: true,
            tipo: true,
            especialidade: true,
        },
    })

    if (!usuario) redirect('/login')

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <div className="pt-16 pb-16 lg:pb-0 flex max-w-7xl mx-auto">
                <DashboardSidebar usuario={usuario} />
                <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
                <DashboardMobileNav />
            </div>
        </div>
    )
}
