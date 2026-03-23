'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import LoginForm from './LoginForm'
import Navbar from '@/components/Navbar'

function LoginContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    const getErrorMessage = () => {
        if (!error) return null

        switch (error) {
            case 'Configuration':
                return 'Erro de configuração. Tente fazer login com email e senha.'
            case 'OauthSessionFailed':
                return 'Erro na conexão com o Google. Tente fazer login com email e senha.'
            case 'AccessDenied':
                return 'Acesso negado. Tente novamente.'
            case 'Verification':
                return 'Token expirado. Tente fazer login novamente.'
            default:
                return errorDescription || 'Erro ao fazer login. Tente novamente.'
        }
    }

    const errorMessage = getErrorMessage()

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: 'var(--gradient-hero)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8 flex flex-col items-center">
                    <p className="text-indigo-200 mt-2 font-medium">Whodo — Quem precisa encontra. Quem faz escolhe.</p>
                </div>

                {/* Erro do OAuth */}
                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700 text-sm font-medium">
                            ⚠️ {errorMessage}
                        </p>
                        <p className="text-red-600 text-xs mt-1">
                            Você pode fazer login com email e senha abaixo.
                        </p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 "></div>
                    <LoginForm />
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
    )
}

export default function LoginPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <main className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: 'var(--gradient-hero)' }}>
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8 flex flex-col items-center">
                            <p className="text-indigo-200 mt-2 font-medium">Whodo — Quem precisa encontra. Quem faz escolhe.</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8">
                            <div className="animate-pulse">Carregando...</div>
                        </div>
                    </div>
                </main>
            }>
                <LoginContent />
            </Suspense>
        </>
    )
}
