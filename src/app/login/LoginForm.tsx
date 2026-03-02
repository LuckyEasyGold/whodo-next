'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErro('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            })

            const data = await res.json()

            if (!res.ok) {
                setErro(data.error || 'Erro ao fazer login')
                return
            }

            router.push('/')
            router.refresh()
        } catch {
            setErro('Erro de conexão. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {erro && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                    {erro}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    E-mail ou Nome
                </label>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="senha" className="text-sm font-medium text-slate-700">
                        Senha
                    </label>
                    <a href="/recuperar-senha" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        Esqueceu a senha?
                    </a>
                </div>
                <div className="relative">
                    <input
                        id="senha"
                        type={showPass ? 'text' : 'password'}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        placeholder="••••••••"
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
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <>
                        <LogIn size={18} />
                        Entrar
                    </>
                )}
            </button>
        </form>
    )
}
