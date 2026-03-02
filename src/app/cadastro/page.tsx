import Link from 'next/link'
import CadastroForm from './CadastroForm'
import Navbar from '@/components/Navbar'

export const metadata = {
    title: 'Cadastre-se - WhoDo!',
    description: 'Crie sua conta gratuita no WhoDo! e encontre os melhores profissionais.',
}

export default function CadastroPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-slate-50 to-indigo-50/30">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl shadow-lg shadow-indigo-500/30 mb-4">
                            W
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Criar conta no WhoDo!</h1>
                        <p className="text-slate-500 mt-1">É grátis e leva menos de 1 minuto</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <CadastroForm />
                    </div>

                    <p className="text-center mt-6 text-sm text-slate-500">
                        Já tem conta?{' '}
                        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Entrar
                        </Link>
                    </p>
                </div>
            </main>
        </>
    )
}
