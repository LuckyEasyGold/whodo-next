import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
    id: string;
}

interface BodyParams {
    valor_orcamento: number;
    descricao_orcamento?: string;
    condicoes_orcamento?: string;
}

// POST: Enviar orçamento (prestador)
export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const session = await getSession();
        const resolvedParams = await params;

        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const agendamentoId = parseInt(resolvedParams.id);
        const userId = session.id;

        // Parse body
        const body: BodyParams = await req.json();
        const { valor_orcamento, descricao_orcamento, condicoes_orcamento } = body;

        // Validate required fields
        if (!valor_orcamento || valor_orcamento <= 0) {
            return NextResponse.json(
                { error: "Valor do orçamento é obrigatório e deve ser maior que zero" },
                { status: 400 }
            );
        }

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
                { error: "Apenas o prestador pode enviar orçamento para este agendamento" },
                { status: 403 }
            );
        }

        // Verificar se o status é 'aceito'
        if (agendamento.status !== "aceito") {
            return NextResponse.json(
                { error: "O orçamento só pode ser enviado quando o agendamento está aceito" },
                { status: 400 }
            );
        }

        const statusAnterior = agendamento.status;
        const statusNovo = "orcamento_enviado";

        // Atualizar agendamento com orçamento e status
        const agendamentoAtualizado = await prisma.agendamento.update({
            where: { id: agendamentoId },
            data: {
                status: statusNovo,
                valor_orcamento: valor_orcamento,
                descricao_orcamento: descricao_orcamento || null,
                condicoes_orcamento: condicoes_orcamento || null,
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
                acao: "enviar_orcamento",
                status_anterior: statusAnterior,
                status_novo: statusNovo,
                descricao: `Prestador ${prestador?.nome || 'Unknown'} enviou orçamento de R$ ${valor_orcamento}`,
            },
        });

        // Criar notificação para o cliente
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.cliente_id,
                tipo: "orcamento_enviado",
                titulo: "Novo Orçamento Recebido",
                mensagem: `O prestador ${prestador?.nome || 'Unknown'} enviou um orçamento de R$ ${valor_orcamento} para ${servico?.titulo || 'o serviço'}`,
                link: `/dashboard/agendamentos/${agendamentoId}`,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Orçamento enviado com sucesso",
            agendamento: agendamentoAtualizado,
        });
    } catch (error) {
        console.error("Erro ao enviar orçamento:", error);
        return NextResponse.json(
            { error: "Erro ao enviar orçamento" },
            { status: 500 }
        );
    }
}
