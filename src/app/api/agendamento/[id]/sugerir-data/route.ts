import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
    id: string;
}

// POST: Sugerir nova data para agendamento (prestador)
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
        const { novaData, mensagem } = body;

        // Validar data
        if (!novaData) {
            return NextResponse.json(
                { error: "Nova data é obrigatória" },
                { status: 400 }
            );
        }

        const novaDataDate = new Date(novaData);
        if (isNaN(novaDataDate.getTime())) {
            return NextResponse.json(
                { error: "Data inválida" },
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
                { error: "Apenas o prestador pode sugerir nova data para este agendamento" },
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
        const statusNovo = "aguardando_cliente";

        // Atualizar status do agendamento com a nova data sugerida
        const agendamentoAtualizado = await prisma.agendamento.update({
            where: { id: agendamentoId },
            data: {
                status: statusNovo,
                data_sugerida: novaDataDate,
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
                acao: "sugerir_data",
                status_anterior: statusAnterior,
                status_novo: statusNovo,
                descricao: mensagem
                    ? `Prestador ${prestador?.nome || 'Unknown'} sugeriu nova data: ${novaDataDate.toLocaleDateString('pt-BR')}. Mensagem: ${mensagem}`
                    : `Prestador ${prestador?.nome || 'Unknown'} sugeriu nova data: ${novaDataDate.toLocaleDateString('pt-BR')}`,
            },
        });

        // Criar notificação para o cliente
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.cliente_id,
                tipo: "agendamento_sugestao_data",
                titulo: "Nova Data Sugerida",
                mensagem: mensagem
                    ? `O prestador ${prestador?.nome || 'Unknown'} sugeriu uma nova data para seu agendamento de ${servico?.titulo || 'serviço'}: ${novaDataDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. "${mensagem}"`
                    : `O prestador ${prestador?.nome || 'Unknown'} sugeriu uma nova data para seu agendamento de ${servico?.titulo || 'serviço'}: ${novaDataDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`,
                link: `/dashboard/agendamentos/${agendamentoId}`,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Nova data sugerida com sucesso",
            agendamento: agendamentoAtualizado,
        });
    } catch (error) {
        console.error("Erro ao sugerir nova data:", error);
        return NextResponse.json(
            { error: "Erro ao sugerir nova data" },
            { status: 500 }
        );
    }
}
