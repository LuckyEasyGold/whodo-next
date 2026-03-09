import { Settings } from 'lucide-react'
import ConfiguracoesClient from './ConfiguracoesClient'

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
                    <p className="text-sm text-slate-500">Gerencie sua segurança e disponibilidade</p>
                </div>
            </div>

            <ConfiguracoesClient />
        </div>
    )
}
