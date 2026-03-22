import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST: Criar uma nova solicitação de serviço e primeira mensagem
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { servico_id, descricao, mensagem_inicial } = await req.json();

        if (!servico_id) {
            return NextResponse.json({ error: "Serviço obrigatório" }, { status: 400 });
        }

        // Busca o serviço para saber o dono (prestador)
        const servico = await prisma.servico.findUnique({
            where: { id: parseInt(servico_id) },
            select: { id: true, usuario_id: true, titulo: true }
        });

        if (!servico) {
            return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
        }

        if (servico.usuario_id === session.id) {
            return NextResponse.json({ error: "Não pode contratar seu próprio serviço" }, { status: 403 });
        }

        // Verificar se já existe uma solicitação ativa desse cliente para esse serviço
        const solicitacaoExistente = await prisma.solicitacao.findFirst({
            where: {
                cliente_id: session.id,
                servico_id: servico.id,
                status: { in: ["pendente", "em_negociacao"] }
            }
        });

        if (solicitacaoExistente) {
            return NextResponse.json({ solicitacao_id: solicitacaoExistente.id, ja_existe: true }, { status: 200 });
        }

        // Criar a solicitação (para serviços de orçamento)
        const solicitacao = await prisma.solicitacao.create({
            data: {
                cliente_id: session.id,
                servico_id: servico.id,
                prestador_id: servico.usuario_id,
                descricao: descricao || mensagem_inicial || `Interesse no serviço: ${servico.titulo}`,
                status: "pendente",
            }
        });

        // Criar a primeira mensagem automaticamente
        const texto = mensagem_inicial || `Olá! Tenho interesse no seu serviço "${servico.titulo}". Poderia me passar mais informações?`;
        await prisma.mensagem.create({
            data: {
                remetente_id: session.id,
                destinatario_id: servico.usuario_id,
                solicitacao_id: solicitacao.id,
                conteudo: texto,
            }
        });

        // Criar notificação para o prestador
        await prisma.notificacao.create({
            data: {
                usuario_id: servico.usuario_id,
                tipo: "solicitacao",
                titulo: "Nova solicitação de serviço!",
                mensagem: `Você recebeu uma nova solicitação para "${servico.titulo}"`,
                link: `/dashboard/mensagens?conversa=${solicitacao.id}`,
            }
        });

        return NextResponse.json({ solicitacao_id: solicitacao.id }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar solicitação:", error);
        return NextResponse.json({ error: "Erro ao criar solicitação" }, { status: 500 });
    }
}

// GET: Lista todas as solicitações do usuário logado
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const solicitacoes = await prisma.solicitacao.findMany({
            where: {
                OR: [
                    { cliente_id: session.id },
                    { prestador_id: session.id },
                    { servico: { usuario_id: session.id } }
                ]
            },
            include: {
                cliente: { select: { id: true, nome: true, foto_perfil: true } },
                prestador: { select: { id: true, nome: true, foto_perfil: true } },
                servico: {
                    select: {
                        id: true, titulo: true, cobranca_tipo: true,
                        usuario: { select: { id: true, nome: true, foto_perfil: true } }
                    }
                },
                mensagens: {
                    orderBy: { created_at: "desc" },
                    take: 1,
                    select: { conteudo: true, created_at: true, remetente_id: true, lida: true }
                }
            },
            orderBy: { created_at: "desc" }
        });

        return NextResponse.json(solicitacoes);
    } catch (error) {
        console.error("Erro ao listar solicitações:", error);
        return NextResponse.json({ error: "Erro ao listar" }, { status: 500 });
    }
}
