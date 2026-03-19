import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
    id: string;
}

// POST: Aceitar agendamento (prestador)
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
                { error: "Apenas o prestador pode aceitar este agendamento" },
                { status: 403 }
            );
        }

        // Verificar se o status é pendente
        if (agendamento.status !== "pendente") {
            return NextResponse.json(
                { error: "Este agendamento não está mais pendente" },
                { status: 400 }
            );
        }

        const statusAnterior = agendamento.status;
        const statusNovo = "aceito";

        // Atualizar status do agendamento
        const agendamentoAtualizado = await prisma.agendamento.update({
            where: { id: agendamentoId },
            data: { status: statusNovo },
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
                acao: "aceitar",
                status_anterior: statusAnterior,
                status_novo: statusNovo,
                descricao: `Prestador ${prestador?.nome || 'Unknown'} aceitou o agendamento`,
            },
        });

        // Criar notificação para o cliente
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.cliente_id,
                tipo: "agendamento_aceito",
                titulo: "Agendamento Aceito",
                mensagem: `O prestador ${prestador?.nome || 'Unknown'} aceitou seu agendamento de ${servico?.titulo || 'serviço'}`,
                link: `/dashboard/agendamentos/${agendamentoId}`,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Agendamento aceito com sucesso",
            agendamento: agendamentoAtualizado,
        });
    } catch (error) {
        console.error("Erro ao aceitar agendamento:", error);
        return NextResponse.json(
            { error: "Erro ao aceitar agendamento" },
            { status: 500 }
        );
    }
}
