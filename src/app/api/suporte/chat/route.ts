import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText, tool, stepCountIs, LanguageModel, createUIMessageStreamResponse, createUIMessageStream } from 'ai'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

// ─── Provedores ───────────────────────────────────────────────────────────────

// OpenAI (Principal)
const openaiProvider = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? 'placeholder',
})

// Alibaba DashScope — compatível com OpenAI API
const dashscope = createOpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.DASHSCOPE_API_KEY ?? 'placeholder',
})

// GitHub Models
const githubModels = createOpenAI({
    baseURL: 'https://models.inference.ai.azure.com',
    apiKey: process.env.DEEPSEEK_API_KEY ?? 'placeholder',
})

// Google Gemini
const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? 'placeholder',
})

interface ModelConfig {
    name: string
    model: LanguageModel
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function getFaqContext(): string {
    try {
        const p = path.join(process.cwd(), 'FAQ.md')
        return fs.readFileSync(p, 'utf8').substring(0, 6000)
    } catch {
        return 'Central de ajuda em manutenção.'
    }
}

// ─── Fallback sem IA ─────────────────────────────────────────────────────────

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

function buscarNoFaq(pergunta: string): string {
    const sections = getFaqSections()
    if (sections.length === 0) return ''
    const palavras = pergunta.toLowerCase()
        .replace(/[^\w\sáéíóúâêîôûãõàèìòùç]/g, '')
        .split(/\s+/)
        .filter((w: string) => w.length > 2)
    const pontuadas = sections.map(s => {
        const texto = (s.titulo + ' ' + s.conteudo).toLowerCase()
        const pontos = palavras.reduce((acc: number, w: string) => acc + (texto.includes(w) ? 1 : 0), 0)
        return { ...s, pontos }
    })
    pontuadas.sort((a, b) => b.pontos - a.pontos)
    const melhor = pontuadas[0]
    if (melhor.pontos === 0) return ''
    return `**${melhor.titulo}**\n\n${melhor.conteudo.substring(0, 800)}`
}

const RESPOSTAS_FIXAS: Array<{ palavras: string[]; resposta: string }> = [
    {
        palavras: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello'],
        resposta: 'Olá! 👋 Bem-vindo ao suporte da **WhoDo!**\n\nComo posso ajudar você hoje? Posso responder sobre:\n• 🔍 Encontrar profissionais\n• 📝 Cadastro e conta\n• 💰 Pagamentos\n• ⚙️ Como usar a plataforma'
    },
    {
        palavras: ['cadastro', 'cadastrar', 'criar conta', 'registrar'],
        resposta: '📝 **Como se cadastrar na WhoDo!**\n\n1. Clique em **"Cadastrar"** no menu\n2. Preencha nome, e-mail e senha\n3. Escolha: **Cliente** ou **Prestador**\n4. Confirme seu e-mail\n\nO cadastro é **gratuito**!'
    },
    {
        palavras: ['prestador', 'profissional', 'serviço', 'contratar', 'encontrar'],
        resposta: '🔍 **Encontrando profissionais**\n\n• Use a **busca** no topo da página\n• Filtre por categoria e cidade\n• Veja avaliações de outros clientes\n• Entre em contato pelo chat\n\nQue serviço você precisa?'
    },
    {
        palavras: ['pagamento', 'pagar', 'preço', 'valor', 'custo', 'taxa'],
        resposta: '💰 **Pagamentos na WhoDo!**\n\nA plataforma é **gratuita para clientes**.\n\nPara prestadores há planos básico (gratuito) e premium.\n\nOs pagamentos são combinados diretamente entre cliente e prestador.'
    },
    {
        palavras: ['senha', 'esqueci', 'recuperar', 'login', 'entrar', 'acessar'],
        resposta: '🔐 **Problemas com acesso?**\n\n1. Clique em "Entrar"\n2. Selecione "Esqueci minha senha"\n3. Digite seu e-mail\n4. Verifique sua caixa de entrada\n\nAinda com problemas? Use o formulário em **/contato**.'
    },
]

function gerarRespostaFallback(pergunta: string): string {
    const p = pergunta.toLowerCase()
    for (const item of RESPOSTAS_FIXAS) {
        if (item.palavras.some(palavra => p.includes(palavra))) return item.resposta
    }
    const faqResult = buscarNoFaq(pergunta)
    if (faqResult) return `Encontrei isso que pode ajudar:\n\n${faqResult}\n\n---\nTem mais alguma dúvida?`
    return `Obrigado pela sua pergunta! 🤔\n\nNão encontrei uma resposta específica. Você pode:\n• 📧 Usar o formulário em **/contato**\n• 🔍 Usar a busca do site\n\nPosso ajudar com mais alguma coisa?`
}

function generateStreamResponse(text: string): Response {
    const stream = createUIMessageStream({
        execute: async ({ writer }) => {
            const words = text.split(' ')
            for (const word of words) {
                writer.write({ type: 'text-delta', delta: word + ' ', id: 'fallback' })
                await new Promise(r => setTimeout(r, 25))
            }
        }
    })
    return createUIMessageStreamResponse({ stream })
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: Request) {
    let lastUserMessage = ''
    try {
        const { messages, pagina_atual } = await req.json()
        const faqData = getFaqContext()

        // Guarda última mensagem para fallback
        const lastMsg = messages?.[messages.length - 1]?.content
        lastUserMessage = typeof lastMsg === 'string' ? lastMsg : ''

        const systemPrompt = `Você é o Suporte Humanizado e Amigável da plataforma WhoDo! — um marketplace de serviços que conecta clientes a prestadores qualificados.
O usuário está navegando na página: ${pagina_atual || 'Página inicial'}.

CONHECIMENTO (FAQ):
${faqData}

DIRETRIZES DE CONTRATAÇÃO:
1. Para contratar, o usuário deve: 
   a) Buscar o profissional (use a ferramenta 'buscarProfissionais').
   b) Acessar o perfil do profissional.
   c) Clicar no botão 'Contratar' para iniciar uma solicitação ou 'Mensagem' para tirar dúvidas.
2. Explique a diferença entre 'Preço Fixo' e 'Sob Orçamento' se necessário.
3. Responda SEMPRE em Português Brasileiro.
4. Seja breve, amigável e útil.
5. Não divulgue informações técnicas internas.`

        type BuscarInput = { especialidade: string; cidade?: string }
        type BuscarOutput = {
            resultado?: string
            profissionais?: Array<{ nome: string; especialidade: string | null; cidade: string | null; avaliacao_media: number | null }>
        }

        const buscarSchema = z.object({
            especialidade: z.string(),
            cidade: z.string().optional(),
        })

        const tools = {
            buscarProfissionais: tool<BuscarInput, BuscarOutput>({
                description: 'Busca profissionais reais cadastrados no WhoDo!',
                inputSchema: buscarSchema,
                execute: async (input: BuscarInput): Promise<BuscarOutput> => {
                    const profs = await prisma.usuario.findMany({
                        where: {
                            status: 'ativo',
                            OR: [
                                { especialidade: { contains: input.especialidade, mode: 'insensitive' } },
                                { sobre: { contains: input.especialidade, mode: 'insensitive' } }
                            ],
                            ...(input.cidade ? { cidade: { contains: input.cidade, mode: 'insensitive' } } : {})
                        },
                        select: { nome: true, especialidade: true, cidade: true, avaliacao_media: true },
                        take: 5
                    })
                    if (profs.length === 0) return { resultado: 'Nenhum profissional encontrado para essa especialidade.' }
                    return { profissionais: profs.map(p => ({ ...p, avaliacao_media: p.avaliacao_media?.toNumber() ?? null })) }
                }
            })
        }

        const modelsToTry: ModelConfig[] = []

        // 1º: OpenAI (Prioridade do Usuário)
        if (process.env.OPENAI_API_KEY) {
            modelsToTry.push({ name: 'OpenAI', model: openaiProvider('gpt-4o-mini') })
        }

        // 2º: Google Gemini (Fallback 1)
        if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            modelsToTry.push({ name: 'Gemini', model: googleAI('gemini-2.0-flash') })
        }

        // 3º: Alibaba DashScope (Fallback 2)
        if (process.env.DASHSCOPE_API_KEY) {
            modelsToTry.push({ name: 'Qwen', model: dashscope('qwen-plus') })
        }

        // 4º: GitHub Models (Fallback 3)
        if (process.env.DEEPSEEK_API_KEY?.startsWith('github_pat_')) {
            modelsToTry.push({ name: 'GitHub-GPT', model: githubModels('gpt-4o-mini') })
        }

        if (modelsToTry.length === 0) {
            return generateStreamResponse(gerarRespostaFallback(lastUserMessage))
        }

        async function runWithFailover(index: number): Promise<Response> {
            try {
                const current = modelsToTry[index]
                console.log(`🤖 Tentando: ${current.name}`)

                const result = streamText({
                    model: current.model,
                    system: systemPrompt,
                    messages,
                    tools,
                    stopWhen: stepCountIs(5),
                })

                return result.toUIMessageStreamResponse()

            } catch (err: any) {
                console.warn(`⚠️ Erro em ${modelsToTry[index].name}:`, err.message)
                if (index + 1 < modelsToTry.length) return runWithFailover(index + 1)
                throw err
            }
        }

        return await runWithFailover(0)

    } catch (err: any) {
        console.error('❌ Erro final:', err.message)
        return generateStreamResponse(gerarRespostaFallback(lastUserMessage))
    }
}
