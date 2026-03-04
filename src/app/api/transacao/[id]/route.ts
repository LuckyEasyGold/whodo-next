import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
  id: string;
}

// PUT: Atualizar transação (confirmar, falhar, etc)
export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const session = await getSession();
    const resolvedParams = await params;

    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const transacaoId = parseInt(resolvedParams.id);
    const body = await req.json();

    const transacao = await prisma.transacao.findUnique({
      where: { id: transacaoId },
      include: { carteira: true },
    });

    if (!transacao) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    // Verificar permissão
    if (transacao.carteira.usuario_id !== userId) {
      return NextResponse.json(
        { error: "Sem permissão para alterar esta transação" },
        { status: 403 }
      );
    }

    const { status, data_processamento } = body;

    if (!["concluido", "falhado"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    const transacaoAtualizada = await prisma.transacao.update({
      where: { id: transacaoId },
      data: {
        status,
        data_processamento: data_processamento ? new Date(data_processamento) : new Date(),
      },
    });

    // Atualizar carteira se transação for concluída
    if (status === "concluido") {
      if (transacao.tipo === "deposito") {
        // Mover saldo pendente para saldo
        await prisma.carteira.update({
          where: { id: transacao.carteira_id },
          data: {
            saldo_pendente: {
              decrement: transacao.valor,
            },
            saldo: {
              increment: transacao.valor,
            },
            total_ganho: {
              increment: transacao.valor,
            },
          },
        });
      } else if (transacao.tipo === "saque") {
        // Saque já foi decrementado do saldo
        // Só precisamos atualizar total_gasto
        await prisma.carteira.update({
          where: { id: transacao.carteira_id },
          data: {
            total_gasto: {
              increment: transacao.valor,
            },
          },
        });
      }

      // Criar notificação de confirmação
      await prisma.notificacao.create({
        data: {
          usuario_id: transacao.carteira.usuario_id,
          tipo: `${transacao.tipo}_concluido`,
          titulo: transacao.tipo === "deposito" ? "Depósito Confirmado" : "Saque Confirmado",
          mensagem: `Seu ${transacao.tipo} de R$ ${transacao.valor.toFixed(2)} foi processado com sucesso.`,
          link: "/dashboard/financeiro",
        },
      });
    } else if (status === "falhado") {
      // Se falhar, revertemos o saldo se era saque
      if (transacao.tipo === "saque") {
        await prisma.carteira.update({
          where: { id: transacao.carteira_id },
          data: {
            saldo: {
              increment: transacao.valor,
            },
          },
        });
      } else if (transacao.tipo === "deposito") {
        // Remover do saldo_pendente
        await prisma.carteira.update({
          where: { id: transacao.carteira_id },
          data: {
            saldo_pendente: {
              decrement: transacao.valor,
            },
          },
        });
      }

      // Notificar o usuário
      await prisma.notificacao.create({
        data: {
          usuario_id: transacao.carteira.usuario_id,
          tipo: `${transacao.tipo}_falhado`,
          titulo: transacao.tipo === "deposito" ? "Depósito Falhado" : "Saque Falhado",
          mensagem: `Seu ${transacao.tipo} de R$ ${transacao.valor.toFixed(2)} falhou. Por favor, tente novamente.`,
          link: "/dashboard/financeiro",
        },
      });
    }

    return NextResponse.json(transacaoAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}
