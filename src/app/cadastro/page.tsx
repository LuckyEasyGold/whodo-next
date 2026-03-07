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
            <main className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: 'var(--gradient-hero)' }}>
                <div className="w-full max-w-md">
                    {/* Logo & Header */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <Link href="/" className="mb-6 block hover:opacity-90 transition-transform hover:scale-105">
                            <div className="bg-white p-3 rounded-2xl shadow-lg">
                                <img src="/logo.png" alt="WhoDo! Logo" className="h-10 w-auto object-contain mx-auto" />
                            </div>
                        </Link>
                        <h1 className="text-2xl font-extrabold text-white">Criar conta no WhoDo!</h1>
                        <p className="text-indigo-200 mt-2 font-medium">Whodo — Quem precisa encontra. Quem faz escolhe.</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <CadastroForm />
                    </div>

                    <p className="text-center mt-6 text-sm text-indigo-200/80">
                        Já tem conta?{' '}
                        <Link href="/login" className="font-semibold text-white hover:text-indigo-100 transition-colors">
                            Entrar
                        </Link>
                    </p>
                </div>
            </main>
        </>
    )
}
