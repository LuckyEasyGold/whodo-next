import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminDashboard from './AdminDashboard'

const ADMIN_TYPES = ['moderador', 'admin', 'super_admin']

export default async function AdminPage() {
    const session = await getSession()

    if (!session || !ADMIN_TYPES.includes(session.tipo)) {
        redirect('/login')
    }

    return <AdminDashboard session={session} />
}
