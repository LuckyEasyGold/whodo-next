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
                       <p className="text-indigo-200 mt-2 font-medium">Whodo — Quem precisa encontra. Quem faz escolhe.</p>
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
