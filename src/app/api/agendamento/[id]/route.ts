import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
  id: string;
}

// GET: Obter agendamento específico
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const agendamentoId = parseInt(params.id);
    const userId = session.id;

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: {
        cliente: true,
        prestador: true,
        servico: true,
        transacoes: true,
      },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário é cliente ou prestador
    if (
      agendamento.cliente_id !== userId &&
      agendamento.prestador_id !== userId
    ) {
      return NextResponse.json(
        { error: "Sem permissão para acessar este agendamento" },
        { status: 403 }
      );
    }

    return NextResponse.json(agendamento);
  } catch (error) {
    console.error("Erro ao obter agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao obter agendamento" },
      { status: 500 }
    );
  }
}

// PUT: Atualizar agendamento
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const agendamentoId = parseInt(params.id);
    const userId = session.id;
    const body = await req.json();

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar permissões: só prestador pode confirmar/concluir
    if (body.status && agendamento.prestador_id !== userId) {
      return NextResponse.json(
        { error: "Apenas o prestador pode atualizar o status" },
        { status: 403 }
      );
    }

    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: body.status || agendamento.status,
        descricao: body.descricao || agendamento.descricao,
        endereco_servico: body.endereco_servico || agendamento.endereco_servico,
        data_conclusao: body.data_conclusao,
        motivo_cancelamento: body.motivo_cancelamento,
      },
      include: {
        cliente: { select: { id: true, nome: true } },
        prestador: { select: { id: true, nome: true } },
      },
    });

    // Se status mudou para "concluido", criar transação automática
    if (
      body.status === "concluido" &&
      agendamento.status !== "concluido" &&
      !agendamento.valor_pago
    ) {
      // Isso será processado pela API de transações
      await prisma.notificacao.create({
        data: {
          usuario_id: agendamento.cliente_id,
          tipo: "agendamento_concluido",
          titulo: "Agendamento Concluído",
          mensagem: `Seu agendamento com ${agendamentoAtualizado.prestador.nome} foi concluído`,
          link: `/dashboard/agendamentos/${agendamentoId}`,
        },
      });
    }

    return NextResponse.json(agendamentoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
      { status: 500 }
    );
  }
}

// DELETE: Cancelar agendamento
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const agendamentoId = parseInt(params.id);
    const userId = session.id;

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se é cliente ou prestador
    if (
      agendamento.cliente_id !== userId &&
      agendamento.prestador_id !== userId
    ) {
      return NextResponse.json(
        { error: "Sem permissão para cancelar este agendamento" },
        { status: 403 }
      );
    }

    const agendamentoDeletado = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: "cancelado" },
    });

    return NextResponse.json(agendamentoDeletado);
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar agendamento" },
      { status: 500 }
    );
  }
}
