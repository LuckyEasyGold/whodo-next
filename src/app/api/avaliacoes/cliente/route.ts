import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST: Prestador avalia cliente (após conclusão do serviço)
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const body = await req.json();
        const { agendamento_id, nota, comentario } = body;

        if (!agendamento_id || !nota) {
            return NextResponse.json(
                { error: "Campos obrigatórios faltando: agendamento_id e nota" },
                { status: 400 }
            );
        }

        const numNota = Number(nota);
        if (numNota < 1 || numNota > 5) {
            return NextResponse.json({ error: "Nota inválida. Use valores entre 1 e 5" }, { status: 400 });
        }

        // Buscar o agendamento
        const agendamento = await prisma.agendamento.findUnique({
            where: { id: parseInt(agendamento_id) },
            include: { servico: { select: { titulo: true } } }
        });

        if (!agendamento) {
            return NextResponse.json(
                { error: "Agendamento não encontrado" },
                { status: 404 }
            );
        }

        // Verificar se o usuário logado é o prestador do agendamento
        if (agendamento.prestador_id !== session.id) {
            return NextResponse.json(
                { error: "Apenas o prestador pode avaliar o cliente deste agendamento" },
                { status: 403 }
            );
        }

        // Verificar se o agendamento está em status que permite avaliação
        // Permite avaliação quando: concluido, confirmado, aguardando_confirmacao_cliente, aguardando_confirmacao
        const statusPermitidos = ["concluido", "confirmado", "aguardando_confirmacao_cliente", "aguardando_confirmacao"];
        if (!statusPermitidos.includes(agendamento.status)) {
            return NextResponse.json(
                { error: "Este agendamento ainda não foi concluído. Aguarde a confirmação do cliente." },
                { status: 400 }
            );
        }

        // Verificar se o prestador já avaliou este cliente neste agendamento
        if (agendamento.avaliacao_prestador_feita) {
            return NextResponse.json(
                { error: "Você já avaliou este cliente neste agendamento" },
                { status: 400 }
            );
        }

        // Buscar dados do prestador para notificação
        const prestador = await prisma.usuario.findUnique({
            where: { id: session.id },
            select: { nome: true }
        });

        // Atualizar o agendamento com a avaliação do prestador
        const avaliacaoPrestador = await prisma.agendamento.update({
            where: { id: parseInt(agendamento_id) },
            data: {
                avaliacao_prestador_feita: true
            },
            include: {
                servico: { select: { titulo: true } }
            }
        });

        // Notificar o cliente
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.cliente_id,
                tipo: "avaliacao_recebida",
                titulo: "Você recebeu uma avaliação!",
                mensagem: `${prestador?.nome || 'O prestador'} avaliou você com ${numNota} estrelas pelo serviço de ${avaliacaoPrestador.servico?.titulo}.`,
                link: `/dashboard/agendamentos/${agendamento_id}`,
            }
        });

        // Retornar sucesso
        return NextResponse.json({
            success: true,
            message: "Avaliação do cliente registrada com sucesso",
            avaliacao: {
                agendamento_id: parseInt(agendamento_id),
                prestador_id: session.id,
                cliente_id: agendamento.cliente_id,
                nota: numNota,
                comentario: comentario?.trim() || null,
                data_avaliacao: new Date()
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Erro ao avaliar cliente:", error);
        return NextResponse.json(
            { error: "Erro interno ao processar avaliação" },
            { status: 500 }
        );
    }
}

// GET: Listar avaliações feitas pelo prestador sobre clientes
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const agendamento_id = searchParams.get("agendamento_id");

        // Buscar agendamentos onde o prestador avaliou o cliente
        const whereClause: any = {
            prestador_id: session.id,
            avaliacao_prestador_feita: true
        };

        if (agendamento_id) {
            whereClause.id = parseInt(agendamento_id);
        }

        const avaliacoes = await prisma.agendamento.findMany({
            where: whereClause,
            select: {
                id: true,
                cliente: {
                    select: {
                        id: true,
                        nome: true,
                        foto_perfil: true,
                        avaliacao_media: true
                    }
                },
                servico: {
                    select: {
                        id: true,
                        titulo: true
                    }
                },
                valor_total: true,
                data_agendamento: true,
                data_conclusao: true,
                status: true
            },
            orderBy: {
                data_conclusao: 'desc'
            }
        });

        return NextResponse.json(avaliacoes);
    } catch (error) {
        console.error("Erro ao listar avaliações:", error);
        return NextResponse.json(
            { error: "Erro ao buscar avaliações" },
            { status: 500 }
        );
    }
}
