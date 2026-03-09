import { createOpenAI, openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { streamText, LanguageModel } from 'ai'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

// ─── Configurações de IA ──────────────────────────────────────────────────────

const githubModels = createOpenAI({
    baseURL: 'https://models.inference.ai.azure.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
})

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

// ─── Respostas pré-definidas (Kimi Style) ─────────────────────────────────────

const RESPOSTAS_FIXAS: Array<{ palavras: string[]; resposta: string }> = [
    {
        palavras: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'],
        resposta: 'Olá! 👋 Bem-vindo ao suporte da **WhoDo!**\n\nSou o assistente inteligente e posso ajudar com:\n• 🔍 Encontrar profissionais\n• 📝 Dúvidas sobre cadastro e login\n• 💰 Informações sobre pagamentos\n\nComo posso ajudar você hoje?'
    },
    {
        palavras: ['cadastro', 'cadastrar', 'criar conta', 'registrar'],
        resposta: '📝 **Cadastro na WhoDo!**\n\nO cadastro é 100% gratuito. Basta clicar em "Cadastrar" no menu superior e escolher se você é um **Cliente** ou um **Prestador**.'
    }
]

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
    const palavrasBusca = ['preciso de', 'procuro', 'quero contratar', 'busco', 'tem algum', 'encontrar', 'indicar', 'tem pedreiro', 'tem faxineira', 'tem encanador', 'tem eletricista']
    const ehBusca = palavrasBusca.some(w => p.includes(w))
    if (!ehBusca) return null

    const match = p.match(/(?:preciso de|procuro|quero contratar|busco|tem algum|encontrar|indicar|tem)\s+(?:um|uma|algum|alguma)?\s*([a-záéíóúâêîôûãõàèìòùç\s]+?)(?:\s+em\s+([a-záéíóúâêîôûãõàèìòùç\s]+))?(?:\.|,|$)/i)
    if (!match) return null

    return {
        especialidade: match[1].trim(),
        cidade: match[2]?.trim()
    }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        const { messages, pagina_atual } = await req.json()
        const ultimaMensagem = messages?.[messages.length - 1]?.content ?? ''
        const texto = (typeof ultimaMensagem === 'string' ? ultimaMensagem : '').toLowerCase()

        const encoder = new TextEncoder()

        // 1. Tenta Busca de Profissional (Prioridade Máxima e Instantânea)
        const buscaDetectada = detectarBuscaProfissional(texto)
        if (buscaDetectada) {
            const profs = await buscarProfissionais(buscaDetectada.especialidade, buscaDetectada.cidade)
            let resposta = ''
            if (profs.length > 0) {
                const lista = profs.map(p =>
                    `• **${p.nome}** — ${p.especialidade || 'Serviço'}${p.cidade ? ` (${p.cidade})` : ''}${p.avaliacao_media && Number(p.avaliacao_media) > 0 ? ` ⭐ ${Number(p.avaliacao_media).toFixed(1)}` : ''}`
                ).join('\n')
                resposta = `🔍 Encontrei esses profissionais de **${buscaDetectada.especialidade}**:\n\n${lista}\n\n---\nVisite o perfil deles para contratar!`
            } else {
                resposta = `😕 Não encontrei profissionais de **${buscaDetectada.especialidade}** ativos agora.`
            }
            return streamingResponse(resposta)
        }

        // 2. Tenta Respostas Fixas (Instantâneas)
        for (const item of RESPOSTAS_FIXAS) {
            if (item.palavras.some(palavra => texto.includes(palavra))) {
                return streamingResponse(item.resposta)
            }
        }

        // 3. IA FALLBACK (Failover: OpenAI -> GitHub -> Gemini)
        const model = getModel()
        if (model) {
            const faqContent = getFaqSections().map(s => `### ${s.titulo}\n${s.conteudo}`).join('\n\n')
            const systemPrompt = `Você é o Suporte WhoDo! (versão inteligente). Suas respostas são curtas e gentis. 
Baseie-se nestas informações do FAQ:
${faqContent}

Regras:
1. Se o usuário perguntar por um profissional (ex: pedreiro), diga "Posso ajudar a encontrar. De qual cidade você é?".
2. Nunca invente regras. Se não souber, diga para falar com contato@whodo.com.br.
3. Use Português do Brasil.`

            const result = await streamText({
                model,
                system: systemPrompt,
                messages,
            })

            const stream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`))
                    }
                    controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
                    controller.close()
                }
            })

            return new Response(stream, {
                headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Vercel-AI-Data-Stream': 'v1' }
            })
        }

        // 4. Último caso: Busca Manual Simples
        return streamingResponse("Olá! Sou o assistente WhoDo. Como posso ajudar você? Atualmente estou offline para perguntas complexas, mas posso ajudar você a encontrar profissionais se me disser o que precisa.")

    } catch (err: any) {
        console.error("Erro no chat:", err.message)
        return streamingResponse(`⚠️ Ocorreu um erro técnico: ${err.message}. Tente novamente.`)
    }
}

// Auxiliar para resposta em stream manual
function streamingResponse(text: string) {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
        async start(controller) {
            const words = text.split(' ')
            for (const word of words) {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(word + ' ')}\n`))
                await new Promise(r => setTimeout(r, 20))
            }
            controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
            controller.close()
        }
    })
    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Vercel-AI-Data-Stream': 'v1', 'Cache-Control': 'no-cache' }
    })
}

// Seleção de modelo inteligente (Failover)
function getModel(): LanguageModel | null {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5) {
        return openai('gpt-4o-mini')
    }
    if (process.env.DEEPSEEK_API_KEY?.startsWith('github_pat_')) {
        return githubModels('gpt-4o-mini')
    }
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return google('gemini-1.5-flash')
    }
    return null
}
