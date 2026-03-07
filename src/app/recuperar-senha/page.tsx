'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import Link from 'next/link'

export default function RecuperarSenha() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus('loading')

        try {
            const res = await fetch('/api/auth/recuperar-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                setMessage(data.error || 'Ocorreu um erro ao enviar e-mail.')
                setStatus('error')
                return
            }

            setStatus('success')
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage('Erro de conexão. Verifique sua internet.')
            setStatus('error')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-slate-50 to-indigo-50/30">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <Link href="/" className="mb-6 block hover:opacity-90 transition-opacity">
                        <img src="/logo.png" alt="WhoDo! Logo" className="h-10 w-auto object-contain mx-auto" />
                    </Link>
                    <h1 className="text-2xl font-extrabold text-slate-900">Recuperar Senha</h1>
                    <p className="text-slate-500 mt-2 font-medium">Enviaremos um link de redefinição</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">

                    {status === 'success' ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MailCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">E-mail Enviado!</h3>
                            <p className="text-slate-600 text-sm mb-6">
                                Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link na sua caixa de entrada para criar uma nova senha.
                            </p>
                            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                                Voltar para o Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {status === 'error' && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                                    {message}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Seu e-mail cadastrado
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="exemplo@email.com"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {status === 'loading' ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    'Enviar link de recuperação'
                                )}
                            </button>

                            <div className="pt-2 text-center">
                                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">
                                    <ArrowLeft size={16} />
                                    Voltar para o Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </main>
    )
}
