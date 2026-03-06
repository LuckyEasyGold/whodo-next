import { Settings } from 'lucide-react'

export const metadata = { title: 'Configurações - WhoDo!' }

export default function ConfiguracoesPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Settings size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
                    <p className="text-sm text-slate-500">Gerencie as preferências da sua conta</p>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                <p className="text-amber-700 font-semibold">🚧 Em construção</p>
                <p className="text-amber-600 text-sm mt-1">Esta seção estará disponível em breve!</p>
                <p className="text-amber-500 text-xs mt-2">
                    Por ora, edite seu perfil em{' '}
                    <a href="/dashboard/perfil" className="underline font-medium">Dashboard → Perfil</a>
                </p>
            </div>
        </div>
    )
}
