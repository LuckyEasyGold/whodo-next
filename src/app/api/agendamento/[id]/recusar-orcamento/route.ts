import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
    id: string;
}

// POST: Recusar orçamento (cliente)
export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const session = await getSession();
        const resolvedParams = await params;

        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const agendamentoId = parseInt(resolvedParams.id);
        const userId = session.id;
        const body = await req.json();
        const { motivo, novoValor, novaData, novasCondicoes } = body;

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
                { error: "Apenas o cliente pode recusar o orçamento" },
                { status: 403 }
            );
        }

        // Verificar se o status é orcamento_enviado
        if (agendamento.status !== "orcamento_enviado") {
            return NextResponse.json(
                { error: "Este agendamento não possui orçamento pendente de aprovação" },
                { status: 400 }
            );
        }

        const statusAnterior = agendamento.status;
        // Se o cliente sugerir novos termos, volta para negociação, caso contrário cancela
        const statusNovo = "negociacao";

        // Atualizar status do agendamento e limpar dados do orçamento
        const agendamentoAtualizado = await prisma.agendamento.update({
            where: { id: agendamentoId },
            data: {
                status: statusNovo,
                orcamento_aprovado: false,
                // Atualizar com novos valores sugeridos se houver
                ...(novoValor && { valor_total: novoValor }),
                ...(novaData && { data_agendamento: new Date(novaData) }),
                ...(novasCondicoes && { condicoes_orcamento: novasCondicoes }),
            },
        });

        // Buscar dados do cliente e serviço para a notificação
        const cliente = await prisma.usuario.findUnique({
            where: { id: userId },
            select: { nome: true },
        });

        const servico = await prisma.servico.findUnique({
            where: { id: agendamento.servico_id },
            select: { titulo: true },
        });

        // Criar histórico do agendamento
        let descricao = `Cliente ${cliente?.nome || 'Unknown'} recusou o orçamento`;
        if (motivo) {
            descricao += `: ${motivo}`;
        }
        if (novoValor || novaData || novasCondicoes) {
            descricao += '. Novos termos sugeridos.';
        }

        await prisma.historicoAgendamento.create({
            data: {
                agendamentoId: agendamentoId,
                usuarioId: userId,
                acao: "recusar_orcamento",
                status_anterior: statusAnterior,
                status_novo: statusNovo,
                descricao: descricao,
            },
        });

        // Criar notificação para o prestador
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.prestador_id,
                tipo: "orcamento_recusado",
                titulo: "Orçamento Recusado",
                mensagem: motivo
                    ? `O cliente ${cliente?.nome || 'Unknown'} recusou o orçamento para ${servico?.titulo || 'serviço'}. Motivo: ${motivo}`
                    : `O cliente ${cliente?.nome || 'Unknown'} recusou o orçamento para ${servico?.titulo || 'serviço'}`,
                link: `/dashboard/agendamentos/${agendamentoId}`,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Orçamento recusado com sucesso",
            agendamento: agendamentoAtualizado,
        });
    } catch (error) {
        console.error("Erro ao recusar orçamento:", error);
        return NextResponse.json(
            { error: "Erro ao recusar orçamento" },
            { status: 500 }
        );
    }
}
