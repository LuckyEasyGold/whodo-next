import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { agendamentoId } = await req.json();

  if (!agendamentoId) {
    return NextResponse.json({ error: 'ID do agendamento é obrigatório' }, { status: 400 });
  }

  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });

    // --- Validações ---
    if (!agendamento) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    if (agendamento.cliente_id !== session.id) {
      return NextResponse.json({ error: 'Você não é o cliente deste agendamento' }, { status: 403 });
    }

    if (agendamento.status !== 'confirmado') {
      return NextResponse.json({ error: 'Este agendamento não está confirmado e não pode ser pago' }, { status: 409 });
    }

    if (agendamento.valor_pago) {
      return NextResponse.json({ error: 'Este agendamento já foi pago' }, { status: 409 });
    }

    const carteiraCliente = await prisma.carteira.findUnique({
      where: { usuario_id: session.id },
    });

    if (!carteiraCliente || carteiraCliente.saldo < agendamento.valor_total) {
      return NextResponse.json({ error: 'Saldo insuficiente para realizar o pagamento' }, { status: 402 });
    }

    // --- Transação Atômica ---
    const result = await prisma.$transaction(async (tx) => {
      // 1. Debitar da carteira do cliente e mover para pendente
      const carteiraAtualizada = await tx.carteira.update({
        where: { id: carteiraCliente.id },
        data: {
          saldo: {
            decrement: agendamento.valor_total,
          },
          saldo_pendente: {
            increment: agendamento.valor_total,
          },
        },
      });

      // 2. Marcar agendamento como pago
      const agendamentoAtualizado = await tx.agendamento.update({
        where: { id: agendamento.id },
        data: {
          valor_pago: true,
        },
      });

      // 3. Registrar a transação para auditoria
      const transacao = await tx.transacao.create({
        data: {
          carteira_id: carteiraCliente.id,
          agendamento_id: agendamento.id,
          tipo: 'PAGAMENTO_SALDO_INTERNO',
          valor: agendamento.valor_total,
          status: 'concluido',
          descricao: `Pagamento do agendamento #${agendamento.id} para ${agendamento.prestador_id}`,
        },
      });

      return { carteiraAtualizada, agendamentoAtualizado, transacao };
    });

    return NextResponse.json({ message: 'Pagamento realizado com sucesso!', data: result });

  } catch (error) {
    console.error('Erro ao processar pagamento com saldo:', error);
    return NextResponse.json({ error: 'Ocorreu um erro interno ao processar o pagamento.' }, { status: 500 });
  }
}
