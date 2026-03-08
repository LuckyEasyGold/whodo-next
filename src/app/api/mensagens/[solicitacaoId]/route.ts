import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Busca todas as mensagens de uma conversa (solicitação)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ solicitacaoId: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { solicitacaoId } = await params;
        const id = parseInt(solicitacaoId);

        // Verificar se o usuário tem acesso a esta conversa
        const solicitacao = await prisma.solicitacao.findUnique({
            where: { id },
            include: {
                servico: { select: { usuario_id: true, titulo: true } },
                cliente: { select: { id: true, nome: true, foto_perfil: true } },
                prestador: { select: { id: true, nome: true, foto_perfil: true } },
                orcamentos: { orderBy: { created_at: "desc" }, take: 1 }
            }
        });

        if (!solicitacao) {
            return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
        }

        const donoServicoId = solicitacao.servico?.usuario_id || solicitacao.prestador_id;
        const isPrestador = donoServicoId === session.id;
        const isCliente = solicitacao.cliente_id === session.id;

        if (!isPrestador && !isCliente) {
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
        }

        // Buscar mensagens
        const mensagens = await prisma.mensagem.findMany({
            where: { solicitacao_id: id },
            include: {
                remetente: { select: { id: true, nome: true, foto_perfil: true } }
            },
            orderBy: { created_at: "asc" }
        });

        // Marcar mensagens não lidas como lidas
        await prisma.mensagem.updateMany({
            where: {
                solicitacao_id: id,
                destinatario_id: session.id,
                lida: false,
            },
            data: { lida: true }
        });

        return NextResponse.json({ solicitacao, mensagens });
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// POST: Enviar uma nova mensagem na conversa
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ solicitacaoId: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { solicitacaoId } = await params;
        const id = parseInt(solicitacaoId);
        const { conteudo } = await req.json();

        if (!conteudo?.trim()) {
            return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
        }

        const solicitacao = await prisma.solicitacao.findUnique({
            where: { id },
            include: { servico: { select: { usuario_id: true } } }
        });

        if (!solicitacao) {
            return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
        }

        const donoServicoId = solicitacao.servico?.usuario_id || solicitacao.prestador_id;
        if (!donoServicoId) {
            return NextResponse.json({ error: "Erro de integridade na solicitação" }, { status: 500 });
        }

        const isPrestador = donoServicoId === session.id;
        const isCliente = solicitacao.cliente_id === session.id;

        if (!isPrestador && !isCliente) {
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
        }

        // Destinatário é o outro participante da conversa
        const destinatario_id = isPrestador
            ? solicitacao.cliente_id
            : donoServicoId;

        const mensagem = await prisma.mensagem.create({
            data: {
                remetente_id: session.id,
                destinatario_id,
                solicitacao_id: id,
                conteudo: conteudo.trim(),
            },
            include: {
                remetente: { select: { id: true, nome: true, foto_perfil: true } }
            }
        });

        // Criar notificação para o destinatário da mensagem
        await prisma.notificacao.create({
            data: {
                usuario_id: destinatario_id,
                tipo: "mensagem",
                titulo: `Mensagem de ${session.nome}`,
                mensagem: conteudo.trim().length > 60 ? conteudo.trim().substring(0, 57) + "..." : conteudo.trim(),
                link: `/dashboard/mensagens?conversa=${id}`,
            }
        });

        return NextResponse.json(mensagem, { status: 201 });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
