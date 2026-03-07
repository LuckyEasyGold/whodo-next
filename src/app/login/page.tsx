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
            <main className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: 'var(--gradient-hero)' }}>
                <div className="w-full max-w-md">
                    <div className="text-center mb-8 flex flex-col items-center">
                        <Link href="/" className="mb-6 block hover:opacity-90 transition-transform hover:scale-105">
                            <div className="bg-white p-3 rounded-2xl shadow-lg">
                                <img src="/logo.png" alt="WhoDo! Logo" className="h-10 w-auto object-contain mx-auto" />
                            </div>
                        </Link>
                        <h1 className="text-2xl font-extrabold text-white">Entrar no WhoDo!</h1>
                        <p className="text-indigo-200 mt-2 font-medium">Whodo — Quem precisa encontra. Quem faz escolhe.</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <LoginForm />

                        <div className="mt-6 text-center text-sm text-slate-400">
                            Em breve: login com redes sociais
                        </div>
                    </div>

                    {/* Register link */}
                    <p className="text-center mt-6 text-sm text-indigo-200/80">
                        Ainda não tem conta?{' '}
                        <Link href="/cadastro" className="font-semibold text-white hover:text-indigo-100 transition-colors">
                            Cadastre-se grátis
                        </Link>
                    </p>
                </div>
            </main>
        </>
    )
}
