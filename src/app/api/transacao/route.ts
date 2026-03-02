import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Listar transações do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo"); // deposito, saque, pagamento, recebimento
    const status = searchParams.get("status"); // pendente, concluido, falhado

    // Obter carteira do usuário
    const carteira = await prisma.carteira.findUnique({
      where: { usuario_id: userId },
    });

    if (!carteira) {
      return NextResponse.json(
        { error: "Carteira não encontrada" },
        { status: 404 }
      );
    }

    let where: any = { carteira_id: carteira.id };
    if (tipo) where.tipo = tipo;
    if (status) where.status = status;

    const transacoes = await prisma.transacao.findMany({
      where,
      include: {
        agendamento: {
          select: {
            id: true,
            servico: { select: { titulo: true } },
            cliente: { select: { nome: true } },
            prestador: { select: { nome: true } },
          },
        },
      },
      orderBy: { data_solicitacao: "desc" },
    });

    return NextResponse.json(transacoes);
  } catch (error) {
    console.error("Erro ao listar transações:", error);
    return NextResponse.json(
      { error: "Erro ao listar transações" },
      { status: 500 }
    );
  }
}

// POST: Criar nova transação (deposito ou saque)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const body = await req.json();

    const {
      tipo, // "deposito" ou "saque"
      valor,
      descricao,
      chave_pix,
      banco_agencia,
      banco_conta,
      tipo_conta,
      metodo_pagamento,
    } = body;

    // Validações
    if (!tipo || !valor) {
      return NextResponse.json(
        { error: "Tipo e valor são obrigatórios" },
        { status: 400 }
      );
    }

    if (tipo !== "deposito" && tipo !== "saque") {
      return NextResponse.json(
        { error: "Tipo deve ser 'deposito' ou 'saque'" },
        { status: 400 }
      );
    }

    if (valor <= 0) {
      return NextResponse.json(
        { error: "Valor deve ser maior que 0" },
        { status: 400 }
      );
    }

    // Obter carteira
    let carteira = await prisma.carteira.findUnique({
      where: { usuario_id: userId },
    });

    if (!carteira) {
      carteira = await prisma.carteira.create({
        data: {
          usuario_id: userId,
          saldo: 0,
          saldo_pendente: 0,
          total_ganho: 0,
          total_gasto: 0,
        },
      });
    }

    // Para saque, verificar saldo
    if (tipo === "saque" && carteira.saldo < valor) {
      return NextResponse.json(
        { error: "Saldo insuficiente para saque" },
        { status: 400 }
      );
    }

    // Criar transação
    const transacao = await prisma.transacao.create({
      data: {
        carteira_id: carteira.id,
        tipo,
        valor: parseFloat(valor),
        status: "pendente",
        descricao,
        chave_pix,
        banco_agencia,
        banco_conta,
        tipo_conta,
        metodo_pagamento,
      },
    });

    // Atualizar carteira se for deposito (validar para saque)
    if (tipo === "deposito") {
      // Deposito fica pendente até confirmação
      await prisma.carteira.update({
        where: { id: carteira.id },
        data: {
          saldo_pendente: {
            increment: parseFloat(valor),
          },
        },
      });
    } else if (tipo === "saque") {
      // Saque também fica pendente
      await prisma.carteira.update({
        where: { id: carteira.id },
        data: {
          saldo: {
            decrement: parseFloat(valor),
          },
        },
      });
    }

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        usuario_id: userId,
        tipo: tipo === "deposito" ? "novo_deposito" : "novo_saque",
        titulo: tipo === "deposito" ? "Depósito Solicitado" : "Saque Solicitado",
        mensagem: `Sua solicitação de ${tipo} de R$ ${valor.toFixed(2)} foi recebida e está sendo processada.`,
        link: "/dashboard/financeiro",
      },
    });

    return NextResponse.json(transacao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}
