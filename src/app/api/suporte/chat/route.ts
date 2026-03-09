import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

// ─── Leitura do FAQ ───────────────────────────────────────────────────────────

function getFaqSections(): Array<{ titulo: string; conteudo: string }> {
    try {
        const p = path.join(process.cwd(), 'FAQ.md')
        const raw = fs.readFileSync(p, 'utf8')
        const sections: Array<{ titulo: string; conteudo: string }> = []
        const parts = raw.split(/^#{1,3} /m).filter(Boolean)
        for (const part of parts) {
            const lines = part.trim().split('\n')
            const titulo = lines[0].replace(/^#+\s*/, '').trim()
            const conteudo = lines.slice(1).join('\n').trim()
            if (titulo && conteudo) sections.push({ titulo, conteudo })
        }
        return sections
    } catch {
        return []
    }
}

// ─── Busca por relevância (sem IA) ───────────────────────────────────────────

function buscarNoFaq(pergunta: string): string {
    const sections = getFaqSections()
    if (sections.length === 0) return ''

    const palavras = pergunta.toLowerCase()
        .replace(/[^\w\sáéíóúâêîôûãõàèìòùç]/g, '')
        .split(/\s+/)
        .filter(p => p.length > 2)

    // Pontua cada seção pela quantidade de palavras-chave encontradas
    const pontuadas = sections.map(s => {
        const texto = (s.titulo + ' ' + s.conteudo).toLowerCase()
        const pontos = palavras.reduce((acc, p) => acc + (texto.includes(p) ? 1 : 0), 0)
        return { ...s, pontos }
    })

    pontuadas.sort((a, b) => b.pontos - a.pontos)
    const melhor = pontuadas[0]

    if (melhor.pontos === 0) return ''

    // Retorna até 800 chars da seção mais relevante
    const conteudo = melhor.conteudo.substring(0, 800)
    return `**${melhor.titulo}**\n\n${conteudo}`
}

// ─── Respostas pré-definidas ──────────────────────────────────────────────────

const RESPOSTAS_FIXAS: Array<{ palavras: string[]; resposta: string }> = [
    {
        palavras: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'],
        resposta: 'Olá! 👋 Bem-vindo ao suporte da **WhoDo!**\n\nSou o assistente virtual e posso ajudar com:\n• 🔍 Encontrar profissionais\n• 📝 Dúvidas sobre cadastro\n• 💰 Informações sobre pagamentos\n• ⚙️ Como usar a plataforma\n\nComo posso ajudar você hoje?'
    },
    {
        palavras: ['cadastro', 'cadastrar', 'criar conta', 'registrar', 'registro'],
        resposta: '📝 **Como se cadastrar na WhoDo!**\n\n1. Clique em **"Cadastrar"** no menu superior\n2. Preencha seus dados (nome, e-mail, senha)\n3. Escolha seu perfil: **Cliente** ou **Prestador de Serviços**\n4. Confirme seu e-mail\n5. Complete seu perfil\n\nO cadastro é **gratuito**! Tem alguma dúvida específica sobre o cadastro?'
    },
    {
        palavras: ['prestador', 'profissional', 'serviço', 'servico', 'contratar', 'encontrar'],
        resposta: '🔍 **Encontrando profissionais na WhoDo!**\n\nVocê pode:\n• Usar a **busca** no topo da página\n• Filtrar por **categoria** e **cidade**\n• Ver **avaliações** de outros clientes\n• Entrar em contato diretamente pelo chat\n\nQue tipo de serviço você está procurando? Posso ajudar a encontrar!'
    },
    {
        palavras: ['pagamento', 'pagar', 'preço', 'preco', 'valor', 'custo', 'taxa', 'cobrança'],
        resposta: '💰 **Pagamentos na WhoDo!**\n\nA plataforma é **gratuita para clientes**.\n\nPara prestadores:\n• Plano básico: gratuito com recursos limitados\n• Planos premium disponíveis para mais visibilidade\n\nOs pagamentos entre cliente e prestador são combinados diretamente entre as partes.\n\nTem mais alguma dúvida sobre valores?'
    },
    {
        palavras: ['senha', 'esqueci', 'recuperar', 'redefinir', 'login', 'entrar', 'acessar'],
        resposta: '🔐 **Problemas com acesso?**\n\n**Esqueceu a senha:**\n1. Clique em "Entrar"\n2. Selecione "Esqueci minha senha"\n3. Digite seu e-mail\n4. Verifique sua caixa de entrada\n\n**Ainda com problemas?** Entre em contato pelo e-mail de suporte ou use o formulário de contato no site.'
    },
    {
        palavras: ['avaliação', 'avaliacao', 'nota', 'estrela', 'review', 'comentário'],
        resposta: '⭐ **Sistema de Avaliações**\n\nApós contratar um serviço, você pode:\n• Dar uma nota de 1 a 5 estrelas\n• Deixar um comentário sobre a experiência\n• Ajudar outros clientes a escolher melhor\n\nAs avaliações são públicas e ajudam a construir a reputação dos profissionais.'
    },
    {
        palavras: ['mensagem', 'chat', 'conversar', 'contato', 'falar'],
        resposta: '💬 **Como entrar em contato com um profissional?**\n\n1. Encontre o profissional na busca\n2. Acesse o perfil dele\n3. Clique em **"Enviar Mensagem"** ou **"Solicitar Serviço"**\n4. Descreva o que você precisa\n\nO profissional receberá uma notificação e responderá em breve!'
    },
]

function gerarResposta(pergunta: string): string {
    const p = pergunta.toLowerCase()

    // Verifica respostas fixas primeiro
    for (const item of RESPOSTAS_FIXAS) {
        if (item.palavras.some(palavra => p.includes(palavra))) {
            return item.resposta
        }
    }

    // Busca no FAQ
    const faqResult = buscarNoFaq(pergunta)
    if (faqResult) {
        return `Encontrei isso que pode ajudar:\n\n${faqResult}\n\n---\nTem mais alguma dúvida?`
    }

    // Resposta genérica
    return `Obrigado pela sua pergunta! 🤔\n\nNão encontrei uma resposta específica para isso no momento. Você pode:\n\n• 📧 Entrar em contato pelo formulário em **/contato**\n• 🔍 Usar a busca do site para encontrar o que precisa\n• 📖 Consultar nossa central de ajuda\n\nPosso ajudar com mais alguma coisa?`
}

// ─── Busca de profissionais no banco ─────────────────────────────────────────

async function buscarProfissionais(especialidade: string, cidade?: string) {
    try {
        const profs = await prisma.usuario.findMany({
            where: {
                status: 'ativo',
                OR: [
                    { especialidade: { contains: especialidade, mode: 'insensitive' } },
                    { sobre: { contains: especialidade, mode: 'insensitive' } }
                ],
                ...(cidade ? { cidade: { contains: cidade, mode: 'insensitive' } } : {})
            },
            select: { nome: true, especialidade: true, cidade: true, avaliacao_media: true },
            take: 5
        })
        return profs
    } catch {
        return []
    }
}

// ─── Detecta se é pedido de busca de profissional ────────────────────────────

function detectarBuscaProfissional(msg: string): { especialidade: string; cidade?: string } | null {
    const p = msg.toLowerCase()
    const palavrasBusca = ['preciso de', 'procuro', 'quero contratar', 'busco', 'tem algum', 'encontrar', 'indicar']
    const ehBusca = palavrasBusca.some(w => p.includes(w))
    if (!ehBusca) return null

    // Extrai especialidade (palavras após "preciso de", "procuro", etc.)
    const match = p.match(/(?:preciso de|procuro|quero contratar|busco|tem algum|encontrar|indicar)\s+(?:um|uma|algum|alguma)?\s*([a-záéíóúâêîôûãõàèìòùç\s]+?)(?:\s+em\s+([a-záéíóúâêîôûãõàèìòùç\s]+))?(?:\.|,|$)/i)
    if (!match) return null

    return {
        especialidade: match[1].trim(),
        cidade: match[2]?.trim()
    }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        const ultimaMensagem = messages?.[messages.length - 1]?.content ?? ''
        const texto = typeof ultimaMensagem === 'string' ? ultimaMensagem : ''

        // Verifica se é busca de profissional
        const buscaDetectada = detectarBuscaProfissional(texto)
        let resposta: string

        if (buscaDetectada) {
            const profs = await buscarProfissionais(buscaDetectada.especialidade, buscaDetectada.cidade)
            if (profs.length > 0) {
                const lista = profs.map(p =>
                    `• **${p.nome}** — ${p.especialidade ?? 'Profissional'}${p.cidade ? ` (${p.cidade})` : ''}${p.avaliacao_media ? ` ⭐ ${Number(p.avaliacao_media).toFixed(1)}` : ''}`
                ).join('\n')
                resposta = `🔍 Encontrei ${profs.length} profissional(is) para **${buscaDetectada.especialidade}**${buscaDetectada.cidade ? ` em ${buscaDetectada.cidade}` : ''}:\n\n${lista}\n\n---\nClique no perfil de cada um para ver mais detalhes e entrar em contato!`
            } else {
                resposta = `😕 Não encontrei profissionais de **${buscaDetectada.especialidade}**${buscaDetectada.cidade ? ` em ${buscaDetectada.cidade}` : ''} no momento.\n\nTente:\n• Buscar por uma especialidade diferente\n• Ampliar a área de busca\n• Usar a busca avançada em **/buscar**`
            }
        } else {
            resposta = gerarResposta(texto)
        }

        // Retorna no formato de stream compatível com useChat do @ai-sdk/react
        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                // Envia a resposta palavra por palavra para efeito de digitação
                const words = resposta.split(' ')
                for (const word of words) {
                    controller.enqueue(encoder.encode(`0:${JSON.stringify(word + ' ')}\n`))
                    await new Promise(r => setTimeout(r, 25))
                }
                controller.enqueue(encoder.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`))
                controller.close()
            }
        })

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Vercel-AI-Data-Stream': 'v1',
                'Cache-Control': 'no-cache',
            }
        })

    } catch (err: any) {
        console.error("❌ Erro no suporte:", err.message)
        return new Response(
            JSON.stringify({ error: "Serviço temporariamente indisponível." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}
