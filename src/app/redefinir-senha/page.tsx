'use client'

import { useState, Suspense } from 'react'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RedefinirSenhaForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [senha, setSenha] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    if (!token) {
        return (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Link Inválido</h3>
                <p className="text-slate-600 text-sm mb-6">O link de recuperação de senha está ausente ou quebrado.</p>
                <Link href="/recuperar-senha" className="inline-block w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                    Solicitar novo link
                </Link>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus('loading')

        try {
            const res = await fetch('/api/auth/redefinir-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, senha }),
            })

            const data = await res.json()

            if (!res.ok) {
                setMessage(data.error || 'Ocorreu um erro ao redefinir a senha.')
                setStatus('error')
                return
            }

            setStatus('success')
            setTimeout(() => {
                router.push('/login')
            }, 3000)

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage('Erro de conexão. Verifique sua internet.')
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Senha Alterada!</h3>
                <p className="text-slate-600 text-sm mb-6">
                    Sua senha foi redefinida com sucesso. Redirecionando para o login...
                </p>
                <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                    Fazer Login Agora
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                    {message}
                </div>
            )}

            <div>
                <label htmlFor="senha" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Digite sua nova senha
                </label>
                <div className="relative">
                    <input
                        id="senha"
                        type={showPass ? 'text' : 'password'}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        minLength={6}
                        autoFocus
                        placeholder="Mínimo de 6 caracteres"
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {senha.length > 0 && senha.length < 6 && (
                    <p className="text-xs text-red-500 mt-2">A senha deve ter pelo menos 6 caracteres.</p>
                )}
            </div>

            <button
                type="submit"
                disabled={status === 'loading' || senha.length < 6}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {status === 'loading' ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    'Redefinir Senha'
                )}
            </button>
        </form>
    )
}

export default function RedefinirSenha() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-slate-50 to-indigo-50/30">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 flex flex-col items-center">
                    <Link href="/" className="mb-6 block hover:opacity-90 transition-opacity">
                        <img src="/logo.png" alt="WhoDo! Logo" className="h-10 w-auto object-contain mx-auto" />
                    </Link>
                    <h1 className="text-2xl font-extrabold text-slate-900">Criar Nova Senha</h1>
                    <p className="text-slate-500 mt-2 font-medium">Digite uma senha forte e segura</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                    <Suspense fallback={<div className="flex justify-center py-6"><Loader2 className="animate-spin text-indigo-600" size={24} /></div>}>
                        <RedefinirSenhaForm />
                    </Suspense>
                </div>
            </div>
        </main>
    )
}
