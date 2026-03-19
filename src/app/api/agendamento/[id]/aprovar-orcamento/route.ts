import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
    id: string;
}

// POST: Aprovar orçamento (cliente)
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

        // Verificar se o usuário é o cliente
        if (agendamento.cliente_id !== userId) {
            return NextResponse.json(
                { error: "Apenas o cliente pode aprovar o orçamento" },
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
        const statusNovo = "aguardando_pagamento";

        // Atualizar status do agendamento e marcar orçamento como aprovado
        const agendamentoAtualizado = await prisma.agendamento.update({
            where: { id: agendamentoId },
            data: {
                status: statusNovo,
                orcamento_aprovado: true,
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
        await prisma.historicoAgendamento.create({
            data: {
                agendamentoId: agendamentoId,
                usuarioId: userId,
                acao: "aprovar_orcamento",
                status_anterior: statusAnterior,
                status_novo: statusNovo,
                descricao: `Cliente ${cliente?.nome || 'Unknown'} aprovou o orçamento`,
            },
        });

        // Criar notificação para o prestador
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.prestador_id,
                tipo: "orcamento_aprovado",
                titulo: "Orçamento Aprovado",
                mensagem: `O cliente ${cliente?.nome || 'Unknown'} aprovou o orçamento para ${servico?.titulo || 'serviço'}`,
                link: `/dashboard/agendamentos/${agendamentoId}`,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Orçamento aprovado com sucesso",
            agendamento: agendamentoAtualizado,
        });
    } catch (error) {
        console.error("Erro ao aprovar orçamento:", error);
        return NextResponse.json(
            { error: "Erro ao aprovar orçamento" },
            { status: 500 }
        );
    }
}
