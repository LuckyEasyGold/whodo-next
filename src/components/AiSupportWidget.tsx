'use client'
import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import Draggable from 'react-draggable'

export default function AiSupportWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 }) // posição do ícone arrastável
    const [isDragging, setIsDragging] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const nodeRef = useRef<HTMLDivElement>(null) // referência para o Draggable

    const { messages, input, handleInputChange, handleSubmit, status } = useChat({
        api: '/api/suporte/chat',
        body: {
            pagina_atual: typeof window !== 'undefined' ? window.location.pathname : '/'
        },
        onError: (err) => {
            console.error('Chat Error:', err)
        }
    })

    const isLoading = status === 'streaming' || status === 'submitted'

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (!mounted) return null

    // Extrai texto de uma mensagem (suporta v6 UIMessage com parts e formato legado)
    function getMessageText(m: any): string {
        if (!m) return ''
        if (Array.isArray(m.parts)) {
            const text = m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')
            if (text) return text
        }
        if (typeof m.content === 'string') return m.content
        if (Array.isArray(m.content)) {
            return (m.content as any[]).filter(p => p.type === 'text').map(p => p.text).join('')
        }
        return ''
    }

    return (
        <>
            {isOpen ? (
                // Janela de chat (fixa na posição original ou pode ser mantida como está)
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    zIndex: 999999,
                    fontFamily: 'sans-serif'
                }}>
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
                        {/* cabeçalho */}
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

                        {/* Área de mensagens */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>
                                    <div style={{ fontSize: '40px' }}>🤖</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Oi! Como posso ajudar?</div>
                                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Pergunte sobre serviços, cadastro ou como usar a plataforma.</div>
                                </div>
                            )}
                            {(messages as any[])
                                .filter((m: any) => m.role === 'user' || m.role === 'assistant')
                                .map((m: any) => {
                                    const text = getMessageText(m)
                                    if (!text.trim() && m.role !== 'assistant') return null
                                    return (
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
                                            wordBreak: 'break-word',
                                            minHeight: '20px'
                                        }}>
                                            {text || (isLoading ? '•••' : '')}
                                        </div>
                                    )
                                })}
                            {isLoading && messages.filter((m: any) => m.role === 'assistant').length === 0 && (
                                <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#6366f1' }}>
                                    •••
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Área de pergunta */}
                        <form onSubmit={handleSubmit} style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', backgroundColor: 'white' }}>
                            <input
                                value={input}
                                onChange={handleInputChange}
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
                </div>
            ) : (
                // Ícone arrastável com react-draggable
                <Draggable
                    nodeRef={nodeRef}
                    position={position}
                    onStart={() => setIsDragging(false)} // reseta flag de arrasto
                    onDrag={() => setIsDragging(true)}   // marca que está arrastando
                    onStop={(e, data) => {
                        // Se a posição mudou, atualiza o estado
                        if (data.x !== position.x || data.y !== position.y) {
                            setPosition({ x: data.x, y: data.y });
                        }
                        // Se não houve arrasto (diferença pequena pode ser tratada como clique)
                        // Usamos a flag isDragging para decidir
                        if (!isDragging) {
                            setIsOpen(true);
                        }
                    }}
                >
                    <div
                        ref={nodeRef}
                        style={{
                            position: 'fixed',
                            bottom: '30px',
                            right: '30px',
                            zIndex: 999999,
                            cursor: 'grab',
                            transform: `translate(${position.x}px, ${position.y}px)`, // mantém a posição acumulada
                        }}
                    >
                        <button
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
                                fontSize: '28px',
                                cursor: 'grab',
                            }}
                        >
                            💬
                        </button>
                    </div>
                </Draggable>
            )}
        </>
    )
}