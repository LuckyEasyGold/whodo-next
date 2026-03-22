import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
    id: string;
}

// POST: Cliente recusar a conclusão do serviço
export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const session = await getSession();
        const resolvedParams = await params;

        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const agendamentoId = parseInt(resolvedParams.id);
        const userId = session.id;

        // Buscar dados do corpo da requisição
        const { motivo } = await req.json();

        // Buscar agendamento atual
        const agendamento = await prisma.agendamento.findUnique({
            where: { id: agendamentoId },
        });

        if (!agendamento) {
            return NextResponse.json(
                { error: "Agendamento não encontrado" },
                { status: 404 }
            );
        }

        // Verificar se o usuário é o cliente
        if (agendamento.cliente_id !== userId) {
            return NextResponse.json(
                { error: "Apenas o cliente pode recusar a conclusão do serviço" },
                { status: 403 }
            );
        }

        // Verificar se o status permite recusar a conclusão
        if (agendamento.status !== 'aguardando_confirmacao_cliente') {
            return NextResponse.json(
                { error: "Este agendamento não está aguardando sua confirmação" },
                { status: 400 }
            );
        }

        const statusAnterior = agendamento.status;
        const statusNovo = "conclusao_recusada";

        // Atualizar status do agendamento
        const agendamentoAtualizado = await prisma.agendamento.update({
            where: { id: agendamentoId },
            data: {
                status: statusNovo,
                motivo_cancelamento: motivo || "Cliente recusou a conclusão do serviço",
                // Reset das flags de conclusão
                concluido_prestador: false,
                concluido_cliente: false,
            },
        });

        // Buscar dados do cliente para a notificação
        const cliente = await prisma.usuario.findUnique({
            where: { id: userId },
            select: { nome: true },
        });

        const servico = await prisma.servico.findUnique({
            where: { id: agendamento.servico_id },
            select: { titulo: true },
        });

        // Criar histórico do agendamento
        await prisma.historicoAgendamento.create({
            data: {
                agendamentoId: agendamentoId,
                usuarioId: userId,
                acao: "recusar_conclusao",
                status_anterior: statusAnterior,
                status_novo: statusNovo,
                descricao: motivo ? `Cliente ${cliente?.nome || 'Unknown'} recusou a conclusão: ${motivo}` : `Cliente ${cliente?.nome || 'Unknown'} recusou a conclusão`,
            },
        });

        // Criar notificação para o prestador
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.prestador_id,
                tipo: "conclusao_recusada",
                titulo: "Conclusão Recusada pelo Cliente",
                mensagem: motivo 
                    ? `O cliente ${cliente?.nome || 'Unknown'} recusou a conclusão do serviço "${servico?.titulo || 'serviço'}". Motivo: ${motivo}`
                    : `O cliente ${cliente?.nome || 'Unknown'} recusou a conclusão do serviço "${servico?.titulo || 'serviço'}". Entre em contato para mais detalhes.`,
                link: `/dashboard/agendamentos/${agendamentoId}`,
            },
        });

        // Criar mensagem no chat
        const mensagemTexto = motivo 
            ? `⚠️ O cliente recusou a conclusão do serviço.\n\n**Motivo:** ${motivo}`
            : `⚠️ O cliente indicou problemas com a conclusão do serviço. Por favor, entre em contato para resolver.`;

        await prisma.mensagem.create({
            data: {
                remetente_id: userId,
                destinatario_id: agendamento.prestador_id,
                solicitacao_id: agendamento.solicitacao_id,
                conteudo: mensagemTexto,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Conclusão recusada. O prestador será notificado.",
            agendamento: agendamentoAtualizado,
        });
    } catch (error) {
        console.error("Erro ao recusar conclusão:", error);
        return NextResponse.json(
            { error: "Erro ao recusar conclusão" },
            { status: 500 }
        );
    }
}
