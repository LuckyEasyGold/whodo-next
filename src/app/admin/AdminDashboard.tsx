'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SessionUser } from '@/lib/auth'

type Stat = {
    total: number
    ativos: number
    inativos: number
    verificados: number
    perfilCompleto: number
    ultimos7: number
    ultimos30: number
    comTelefone: number
    comEspecialidade: number
    comFoto: number
}

type Usuario = {
    id: number
    nome: string
    nome_fantasia: string | null
    email: string
    telefone: string | null
    cidade: string | null
    estado: string | null
    tipo: string
    status: string
    email_verificado: boolean
    verificado: boolean
    especialidade: string | null
    foto_perfil: string | null
    created_at: string
}

const TIPO_LABEL: Record<string, { label: string; color: string }> = {
    usuario: { label: 'Usuário', color: '#6b7280' },
    moderador: { label: 'Moderador', color: '#0ea5e9' },
    admin: { label: 'Admin', color: '#8b5cf6' },
    super_admin: { label: 'Super Admin', color: '#f59e0b' },
}

const STATUS_COLOR: Record<string, string> = {
    ativo: '#10b981',
    inativo: '#ef4444',
}

export default function AdminDashboard({ session }: { session: SessionUser }) {
    const router = useRouter()
    const [stats, setStats] = useState<Stat | null>(null)
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [total, setTotal] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [pagina, setPagina] = useState(1)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [filtroStatus, setFiltroStatus] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('')
    const [loadingStats, setLoadingStats] = useState(true)
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
    const [promoveModal, setPromoveModal] = useState<{ user: Usuario } | null>(null)
    const [novoTipo, setNovoTipo] = useState('moderador')

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok })
        setTimeout(() => setToast(null), 3500)
    }

    const fetchStats = useCallback(async () => {
        setLoadingStats(true)
        try {
            const res = await fetch('/api/admin/stats')
            if (res.ok) setStats(await res.json())
        } finally {
            setLoadingStats(false)
        }
    }, [])

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true)
        try {
            const params = new URLSearchParams({
                page: String(pagina),
                ...(search && { search }),
                ...(filtroStatus && { status: filtroStatus }),
                ...(filtroTipo && { tipo: filtroTipo }),
            })
            const res = await fetch(`/api/admin/users?${params}`)
            if (res.ok) {
                const data = await res.json()
                setUsuarios(data.usuarios)
                setTotal(data.total)
                setTotalPaginas(data.totalPaginas)
            }
        } finally {
            setLoadingUsers(false)
        }
    }, [pagina, search, filtroStatus, filtroTipo])

    useEffect(() => { fetchStats() }, [fetchStats])
    useEffect(() => { fetchUsers() }, [fetchUsers])

    async function handleClearSession(userId: number, nome: string) {
        if (!confirm(`Encerrar sessão de ${nome}?`)) return
        setActionLoading(userId)
        try {
            const res = await fetch(`/api/admin/users/${userId}/session`, { method: 'DELETE' })
            const data = await res.json()
            showToast(res.ok ? data.message : data.error, res.ok)
        } finally {
            setActionLoading(null)
        }
    }

    async function handleStatus(userId: number, nome: string, currentStatus: string) {
        const novo = currentStatus === 'ativo' ? 'inativo' : 'ativo'
        if (!confirm(`${novo === 'inativo' ? 'Desativar' : 'Ativar'} cadastro de ${nome}?`)) return
        setActionLoading(userId)
        try {
            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: novo }),
            })
            const data = await res.json()
            showToast(res.ok ? `${nome} ${novo === 'ativo' ? 'ativado' : 'desativado'} com sucesso.` : data.error, res.ok)
            if (res.ok) fetchUsers()
        } finally {
            setActionLoading(null)
        }
    }

    async function handlePromote() {
        if (!promoveModal) return
        const { user } = promoveModal
        setActionLoading(user.id)
        try {
            const res = await fetch(`/api/admin/users/${user.id}/promote`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ novoTipo }),
            })
            const data = await res.json()
            showToast(res.ok ? data.message : data.error, res.ok)
            if (res.ok) { fetchUsers(); setPromoveModal(null) }
        } finally {
            setActionLoading(null)
        }
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    const statCards = stats ? [
        { icon: '👥', label: 'Total de Cadastros', value: stats.total, color: '#6366f1' },
        { icon: '✅', label: 'Ativos', value: stats.ativos, color: '#10b981' },
        { icon: '🚫', label: 'Inativos', value: stats.inativos, color: '#ef4444' },
        { icon: '📋', label: 'Perfil Completo', value: stats.perfilCompleto, color: '#f59e0b' },
        { icon: '📞', label: 'Com Telefone', value: stats.comTelefone, color: '#0ea5e9' },
        { icon: '🤝', label: 'Com Especialidade', value: stats.comEspecialidade, color: '#8b5cf6' },
        { icon: '🆕', label: 'Últimos 7 dias', value: stats.ultimos7, color: '#ec4899' },
        { icon: '📅', label: 'Últimos 30 dias', value: stats.ultimos30, color: '#14b8a6' },
    ] : []

    return (
        <div style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Inter', system-ui, sans-serif", color: '#e2e8f0' }}>
            {/* TOAST */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
                    background: toast.ok ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#dc2626,#ef4444)',
                    color: '#fff', padding: '0.875rem 1.5rem', borderRadius: '0.75rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)', fontWeight: 500, fontSize: '0.9rem',
                    animation: 'slideIn 0.3s ease',
                }}>
                    {toast.ok ? '✅' : '❌'} {toast.msg}
                </div>
            )}

            {/* PROMOTE MODAL */}
            {promoveModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
                }}>
                    <div style={{
                        background: '#1e1b4b', borderRadius: '1.25rem', padding: '2rem',
                        maxWidth: '400px', width: '100%', border: '1px solid rgba(139,92,246,0.3)',
                    }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#c4b5fd', fontSize: '1.1rem' }}>Promover Usuário</h3>
                        <p style={{ color: '#94a3b8', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
                            <strong style={{ color: '#e2e8f0' }}>{promoveModal.user.nome}</strong> — {promoveModal.user.email}
                        </p>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Novo nível:</label>
                        <select
                            value={novoTipo}
                            onChange={e => setNovoTipo(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem', background: '#2d2d5e',
                                border: '1px solid rgba(139,92,246,0.4)', borderRadius: '0.5rem',
                                color: '#e2e8f0', fontSize: '1rem', marginBottom: '0.75rem',
                            }}
                        >
                            <option value="usuario">👤 Usuário (comum)</option>
                            <option value="moderador">🛡️ Moderador</option>
                            {session.tipo === 'super_admin' && <option value="admin">⚙️ Admin</option>}
                        </select>
                        <p style={{ color: '#fbbf24', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                            ⚠️ A senha será zerada. O usuário deverá criar uma nova senha no próximo login.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setPromoveModal(null)} style={{
                                flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.5rem',
                                color: '#e2e8f0', cursor: 'pointer', fontSize: '0.9rem',
                            }}>
                                Cancelar
                            </button>
                            <button onClick={handlePromote} disabled={!!actionLoading} style={{
                                flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                border: 'none', borderRadius: '0.5rem', color: '#fff', cursor: 'pointer',
                                fontSize: '0.9rem', fontWeight: 600,
                            }}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                borderBottom: '1px solid rgba(139,92,246,0.2)',
                padding: '1rem 2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '42px', height: '42px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem', fontWeight: 700, color: '#fff',
                    }}>
                        ⚙️
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#c4b5fd' }}>Painel Admin — Whodo</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            Logado como <strong style={{ color: '#a5b4fc' }}>{session.nome}</strong>
                            {' '}·{' '}
                            <span style={{ color: TIPO_LABEL[session.tipo]?.color || '#fff', fontWeight: 600 }}>
                                {TIPO_LABEL[session.tipo]?.label || session.tipo}
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={handleLogout} style={{
                    padding: '0.5rem 1.25rem', background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem',
                    color: '#fca5a5', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                    transition: 'all 0.2s',
                }}>
                    Sair
                </button>
            </header>

            <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                {/* STATS GRID */}
                <h2 style={{ color: '#c4b5fd', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📊 Estatísticas
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2.5rem',
                }}>
                    {loadingStats ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', padding: '1.25rem',
                                border: '1px solid rgba(255,255,255,0.07)', height: '90px', animation: 'pulse 1.5s infinite',
                            }} />
                        ))
                    ) : statCards.map(card => (
                        <div key={card.label} style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${card.color}33`,
                            borderRadius: '1rem',
                            padding: '1.25rem',
                            transition: 'transform 0.2s',
                        }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: card.color, lineHeight: 1 }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                {card.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* USERS TABLE */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '1.25rem',
                    overflow: 'hidden',
                }}>
                    {/* Table Header */}
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center',
                    }}>
                        <h2 style={{ margin: 0, color: '#c4b5fd', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
                            👤 Cadastros ({total})
                        </h2>
                        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <input
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPagina(1) } }}
                                placeholder="Buscar nome, email, telefone..."
                                style={{
                                    padding: '0.5rem 0.875rem', background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5rem',
                                    color: '#e2e8f0', fontSize: '0.875rem', outline: 'none', minWidth: '220px',
                                }}
                            />
                            <button onClick={() => { setSearch(searchInput); setPagina(1) }} style={{
                                padding: '0.5rem 1rem', background: 'rgba(99,102,241,0.2)',
                                border: '1px solid rgba(99,102,241,0.4)', borderRadius: '0.5rem',
                                color: '#a5b4fc', cursor: 'pointer', fontSize: '0.875rem',
                            }}>
                                🔍 Buscar
                            </button>
                            <select
                                value={filtroStatus}
                                onChange={e => { setFiltroStatus(e.target.value); setPagina(1) }}
                                style={{
                                    padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5rem',
                                    color: '#e2e8f0', fontSize: '0.875rem',
                                }}
                            >
                                <option value="">Todos os status</option>
                                <option value="ativo">Ativos</option>
                                <option value="inativo">Inativos</option>
                            </select>
                            <select
                                value={filtroTipo}
                                onChange={e => { setFiltroTipo(e.target.value); setPagina(1) }}
                                style={{
                                    padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5rem',
                                    color: '#e2e8f0', fontSize: '0.875rem',
                                }}
                            >
                                <option value="">Todos os tipos</option>
                                <option value="usuario">Usuário</option>
                                <option value="moderador">Moderador</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button onClick={() => { setSearch(''); setSearchInput(''); setFiltroStatus(''); setFiltroTipo(''); setPagina(1) }} style={{
                                padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem',
                                color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem',
                            }}>
                                Limpar
                            </button>
                        </div>
                    </div>

                    {/* Table Scroll */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                                    {['ID', 'Nome', 'Email', 'Telefone', 'Cidade/UF', 'Tipo', 'Status', 'Cadastro', 'Ações'].map(col => (
                                        <th key={col} style={{
                                            padding: '0.75rem 1rem', textAlign: 'left',
                                            fontSize: '0.75rem', fontWeight: 600, color: '#64748b',
                                            textTransform: 'uppercase', letterSpacing: '0.05em',
                                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                                        }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loadingUsers ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            {Array.from({ length: 9 }).map((_, j) => (
                                                <td key={j} style={{ padding: '1rem' }}>
                                                    <div style={{ height: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : usuarios.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                            Nenhum usuário encontrado.
                                        </td>
                                    </tr>
                                ) : usuarios.map((u, idx) => (
                                    <tr key={u.id} style={{
                                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                                        transition: 'background 0.15s',
                                    }}>
                                        <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>#{u.id}</td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {u.foto_perfil ? (
                                                    <img src={u.foto_perfil} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: '50%',
                                                        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                                                    }}>
                                                        {u.nome.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#e2e8f0' }}>{u.nome}</div>
                                                    {u.nome_fantasia && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.nome_fantasia}</div>}
                                                    {u.especialidade && <div style={{ fontSize: '0.7rem', color: '#6366f1' }}>{u.especialidade}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                            {u.email}
                                            {u.email_verificado && <span style={{ marginLeft: '0.25rem', color: '#10b981' }}>✓</span>}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: u.telefone ? '#e2e8f0' : '#475569' }}>
                                            {u.telefone || '—'}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: u.cidade ? '#e2e8f0' : '#475569' }}>
                                            {u.cidade ? `${u.cidade}${u.estado ? `/${u.estado}` : ''}` : '—'}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.6rem',
                                                background: `${TIPO_LABEL[u.tipo]?.color || '#6b7280'}22`,
                                                border: `1px solid ${TIPO_LABEL[u.tipo]?.color || '#6b7280'}44`,
                                                borderRadius: '0.35rem',
                                                color: TIPO_LABEL[u.tipo]?.color || '#6b7280',
                                                fontSize: '0.7rem', fontWeight: 600,
                                            }}>
                                                {TIPO_LABEL[u.tipo]?.label || u.tipo}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.6rem',
                                                background: `${STATUS_COLOR[u.status] || '#6b7280'}22`,
                                                borderRadius: '0.35rem',
                                                color: STATUS_COLOR[u.status] || '#6b7280',
                                                fontSize: '0.7rem', fontWeight: 600,
                                            }}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                                            {new Date(u.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'nowrap' }}>
                                                <button
                                                    onClick={() => handleClearSession(u.id, u.nome)}
                                                    disabled={actionLoading === u.id}
                                                    title="Encerrar sessão travada"
                                                    style={{
                                                        padding: '0.35rem 0.6rem', fontSize: '0.75rem',
                                                        background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                                                        borderRadius: '0.4rem', color: '#fbbf24', cursor: 'pointer',
                                                        opacity: actionLoading === u.id ? 0.5 : 1,
                                                    }}
                                                >
                                                    🔄 Sessão
                                                </button>
                                                <button
                                                    onClick={() => handleStatus(u.id, u.nome, u.status)}
                                                    disabled={actionLoading === u.id}
                                                    title={u.status === 'ativo' ? 'Desativar cadastro' : 'Ativar cadastro'}
                                                    style={{
                                                        padding: '0.35rem 0.6rem', fontSize: '0.75rem',
                                                        background: u.status === 'ativo' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                                                        border: u.status === 'ativo' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)',
                                                        borderRadius: '0.4rem',
                                                        color: u.status === 'ativo' ? '#f87171' : '#34d399',
                                                        cursor: 'pointer', opacity: actionLoading === u.id ? 0.5 : 1,
                                                    }}
                                                >
                                                    {u.status === 'ativo' ? '🚫 Desativar' : '✅ Ativar'}
                                                </button>
                                                {session.tipo !== 'moderador' && (
                                                    <button
                                                        onClick={() => { setPromoveModal({ user: u }); setNovoTipo('moderador') }}
                                                        disabled={actionLoading === u.id}
                                                        title="Promover/rebaixar nível"
                                                        style={{
                                                            padding: '0.35rem 0.6rem', fontSize: '0.75rem',
                                                            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                                                            borderRadius: '0.4rem', color: '#a5b4fc', cursor: 'pointer',
                                                            opacity: actionLoading === u.id ? 0.5 : 1,
                                                        }}
                                                    >
                                                        ⬆️ Nível
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPaginas > 1 && (
                        <div style={{
                            padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
                        }}>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                Página {pagina} de {totalPaginas} · {total} cadastros
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    disabled={pagina === 1}
                                    style={{
                                        padding: '0.4rem 0.875rem', background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem',
                                        color: pagina === 1 ? '#475569' : '#e2e8f0', cursor: pagina === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem',
                                    }}
                                >← Anterior</button>
                                <button
                                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                    disabled={pagina === totalPaginas}
                                    style={{
                                        padding: '0.4rem 0.875rem', background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem',
                                        color: pagina === totalPaginas ? '#475569' : '#e2e8f0', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', fontSize: '0.85rem',
                                    }}
                                >Próximo →</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
                tr:hover td { background: rgba(99,102,241,0.03) !important; }
                button:hover:not(:disabled) { filter: brightness(1.15); }
                input:focus, select:focus { border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 2px rgba(99,102,241,0.15); }
            `}</style>
        </div>
    )
}
