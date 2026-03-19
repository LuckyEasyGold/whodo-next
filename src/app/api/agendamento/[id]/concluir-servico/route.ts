import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
    id: string;
}

// POST: Concluir serviço (prestador marca serviço como executado)
export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const session = await getSession();
        const resolvedParams = await params;

        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const agendamentoId = parseInt(resolvedParams.id);
        const userId = session.id;

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

        // Verificar se o usuário é o prestador
        if (agendamento.prestador_id !== userId) {
            return NextResponse.json(
                { error: "Apenas o prestador pode marcar o serviço como concluído" },
                { status: 403 }
            );
        }

        // Verificar se o status é 'confirmado' (pagamento realizado)
        if (agendamento.status !== "confirmado") {
            return NextResponse.json(
                { error: "O serviço só pode ser marcado como concluído quando o pagamento está confirmado" },
                { status: 400 }
            );
        }

        // Verificar se o prestador já marcou como concluído
        if (agendamento.concluido_prestador) {
            return NextResponse.json(
                { error: "O serviço já foi marcado como concluído pelo prestador" },
                { status: 400 }
            );
        }

        const statusAnterior = agendamento.status;
        const statusNovo = "aguardando_confirmacao_cliente";

        // Atualizar status do agendamento
        const agendamentoAtualizado = await prisma.agendamento.update({
            where: { id: agendamentoId },
            data: {
                status: statusNovo,
                concluido_prestador: true,
                data_conclusao: new Date(),
            },
        });

        // Buscar dados do prestador e serviço para a notificação
        const prestador = await prisma.usuario.findUnique({
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
                acao: "concluir_servico",
                status_anterior: statusAnterior,
                status_novo: statusNovo,
                descricao: `Prestador ${prestador?.nome || 'Unknown'} marcou o serviço como concluído`,
            },
        });

        // Criar notificação para o cliente
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.cliente_id,
                tipo: "servico_concluido_prestador",
                titulo: "Serviço Marcado como Concluído",
                mensagem: `O prestador ${prestador?.nome || 'Unknown'} marcou o serviço de ${servico?.titulo || 'o serviço'} como concluído. Por favor, confirme a conclusão.`,
                link: `/dashboard/agendamentos/${agendamentoId}`,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Serviço marcado como concluído com sucesso",
            agendamento: agendamentoAtualizado,
        });
    } catch (error) {
        console.error("Erro ao concluir serviço:", error);
        return NextResponse.json(
            { error: "Erro ao concluir serviço" },
            { status: 500 }
        );
    }
}
