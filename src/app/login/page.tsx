import Link from 'next/link'
import LoginForm from './LoginForm'
import Navbar from '@/components/Navbar'

export const metadata = {
    title: 'Entrar - WhoDo!',
    description: 'Faça login na sua conta WhoDo! para encontrar profissionais.',
}

export default function LoginPage() {
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
                        <h1 className="text-2xl font-extrabold text-slate-900">Entrar no WhoDo!</h1>
                        <p className="text-slate-500 mt-1">Acesse sua conta para continuar</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <LoginForm />

                        <div className="mt-6 text-center text-sm text-slate-400">
                            Em breve: login com redes sociais
                        </div>
                    </div>

                    {/* Register link */}
                    <p className="text-center mt-6 text-sm text-slate-500">
                        Ainda não tem conta?{' '}
                        <Link href="/cadastro" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Cadastre-se grátis
                        </Link>
                    </p>
                </div>
            </main>
        </>
    )
}
