'use client'

import { useState } from 'react'
import { Lock, AlertTriangle, LogOut, Mail } from 'lucide-react'

export default function ConfiguracoesClient() {
    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [loadingSenha, setLoadingSenha] = useState(false)
    const [msgSenha, setMsgSenha] = useState('')

    const [loadingDesativar, setLoadingDesativar] = useState(false)

    const [novoEmail, setNovoEmail] = useState('')
    const [loadingEmail, setLoadingEmail] = useState(false)
    const [msgEmail, setMsgEmail] = useState('')

    async function handleEmail(e: React.FormEvent) {
        e.preventDefault()
        setLoadingEmail(true)
        setMsgEmail('')
        try {
            const res = await fetch('/api/perfil/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ novoEmail })
            })
            const data = await res.json()
            if (!res.ok) {
                setMsgEmail(data.error || 'Erro ao alterar e-mail')
            } else {
                setMsgEmail('E-mail atualizado com sucesso!')
                setNovoEmail('')
            }
        } catch {
            setMsgEmail('Erro de conexão')
        } finally {
            setLoadingEmail(false)
        }
    }

    async function handleSenha(e: React.FormEvent) {
        e.preventDefault()
        setLoadingSenha(true)
        setMsgSenha('')
        try {
            const res = await fetch('/api/perfil/senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senhaAtual, novaSenha })
            })
            const data = await res.json()
            if (!res.ok) {
                setMsgSenha(data.error || 'Erro ao alterar senha')
            } else {
                setMsgSenha('Senha atualizada com sucesso!')
                setSenhaAtual('')
                setNovaSenha('')
            }
        } catch {
            setMsgSenha('Erro de conexão')
        } finally {
            setLoadingSenha(false)
        }
    }

    async function handleDesativar() {
        if (!confirm('Tem certeza que deseja desativar sua conta? Você não aparecerá mais nos resultados de busca.')) return

        setLoadingDesativar(true)
        try {
            const res = await fetch('/api/perfil/desativar', { method: 'POST' })
            if (res.ok) {
                alert('Conta desativada. Você será deslogado.')
                window.location.href = '/api/auth/logout' // Requires logout endpoint, or just /login maybe? Let's assume standard logout behavior
            } else {
                alert('Erro ao desativar conta')
            }
        } catch {
            alert('Erro de rede')
        } finally {
            setLoadingDesativar(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Secao Email */}
            <div className="bg-white border p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Mail size={18} />
                    Alterar E-mail (Migração de Conta)
                </h2>
                <p className="text-slate-600 text-sm mb-4">
                    Ao alterar seu e-mail, todo o seu histórico (avaliações, financeiro, agendamentos) será migrado e mantido na plataforma. O atual login será substituído pelo novo endereço informado.
                </p>
                <form onSubmit={handleEmail} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Novo E-mail</label>
                        <input
                            type="email"
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={novoEmail}
                            onChange={e => setNovoEmail(e.target.value)}
                            placeholder="seu.novo@email.com"
                        />
                    </div>
                    {msgEmail && <p className="text-sm font-medium text-indigo-600">{msgEmail}</p>}
                    <button
                        type="submit"
                        disabled={loadingEmail}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                    >
                        {loadingEmail ? 'Atualizando...' : 'Salvar Novo E-mail'}
                    </button>
                </form>
            </div>

            {/* Secao Senha */}
            <div className="bg-white border p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Lock size={18} />
                    Alterar Senha
                </h2>
                <form onSubmit={handleSenha} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Senha Atual (deixe em branco se for conta social/Google)</label>
                        <input
                            type="password"
                            required={false}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={senhaAtual}
                            onChange={e => setSenhaAtual(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nova Senha (min. 8 caracteres)</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={novaSenha}
                            onChange={e => setNovaSenha(e.target.value)}
                        />
                    </div>
                    {msgSenha && <p className="text-sm font-medium text-indigo-600">{msgSenha}</p>}
                    <button
                        type="submit"
                        disabled={loadingSenha}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                    >
                        {loadingSenha ? 'Salvando...' : 'Salvar Nova Senha'}
                    </button>
                </form>
            </div>

            {/* Secao Zona de Perigo */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                <h2 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} />
                    Zona de Perigo
                </h2>
                <p className="text-red-600 text-sm mb-4">
                    Desativar sua conta ocultará o seu perfil, portfólio e serviços da busca permanentemente. O seu histórico financeiro será mantido.
                </p>
                <button
                    onClick={handleDesativar}
                    disabled={loadingDesativar}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                    <LogOut size={16} />
                    {loadingDesativar ? 'Desativando...' : 'Desativar Conta'}
                </button>
            </div>
        </div>
    )
}
