'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export default function AiSupportWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        const text = input.trim()
        if (!text || isLoading) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        const assistantId = (Date.now() + 1).toString()
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])

        try {
            const res = await fetch('/api/suporte/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
                    pagina_atual: window.location.pathname
                })
            })

            if (!res.ok || !res.body) throw new Error('Erro na resposta')

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() ?? ''

                for (const line of lines) {
                    if (line.startsWith('0:')) {
                        try {
                            const chunk = JSON.parse(line.slice(2))
                            setMessages(prev => prev.map(m =>
                                m.id === assistantId
                                    ? { ...m, content: m.content + chunk }
                                    : m
                            ))
                        } catch { /* ignora linhas inválidas */ }
                    }
                }
            }
        } catch (err) {
            console.error('Erro no chat:', err)
            setMessages(prev => prev.map(m =>
                m.id === assistantId
                    ? { ...m, content: 'Desculpe, ocorreu um erro. Tente novamente.' }
                    : m
            ))
        } finally {
            setIsLoading(false)
        }
    }, [input, isLoading, messages])

    if (!mounted) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 999999,
            fontFamily: 'sans-serif'
        }}>
            {isOpen ? (
                <div style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    color: '#1e293b'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Suporte WhoDo!</div>
                                <div style={{ fontSize: '10px', opacity: 0.8 }}>Online agora</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}>×</button>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>
                                <div style={{ fontSize: '40px' }}>🤖</div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Oi! Como posso ajudar?</div>
                                <div style={{ fontSize: '12px', marginTop: '4px' }}>Pergunte sobre serviços, cadastro ou como usar a plataforma.</div>
                            </div>
                        )}
                        {messages.map((m) => (
                            <div key={m.id} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '10px 14px',
                                borderRadius: '16px',
                                fontSize: '13px',
                                lineHeight: '1.6',
                                backgroundColor: m.role === 'user' ? '#4f46e5' : 'white',
                                color: m.role === 'user' ? 'white' : '#1e293b',
                                border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                                borderTopRightRadius: m.role === 'user' ? '2px' : '16px',
                                borderTopLeftRadius: m.role === 'user' ? '16px' : '2px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {m.content || (m.role === 'assistant' && isLoading ? '•••' : '')}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', backgroundColor: 'white' }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Escreva sua dúvida..."
                            disabled={isLoading}
                            style={{ flex: 1, padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '13px' }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            style={{
                                background: '#4f46e5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0 16px',
                                cursor: 'pointer',
                                opacity: (isLoading || !input.trim()) ? 0.5 : 1,
                                fontSize: '18px'
                            }}
                        >
                            →
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid white',
                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                        cursor: 'pointer',
                        fontSize: '28px',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    💬
                </button>
            )}
        </div>
    )
}
