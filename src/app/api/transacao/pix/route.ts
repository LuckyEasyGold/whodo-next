import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    if (!agendamento) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    if (agendamento.cliente_id !== session.id) {
      return NextResponse.json({ error: 'Você não é o cliente deste agendamento' }, { status: 403 });
    }

    if (agendamento.status !== 'confirmado' && agendamento.status !== 'pendente' && agendamento.status !== 'aceito') {
      return NextResponse.json({ error: 'Este agendamento não está confirmado e não pode ser pago' }, { status: 409 });
    }

    if (agendamento.valor_pago) {
      return NextResponse.json({ error: 'Este agendamento já foi pago' }, { status: 409 });
    }

    // Simular geração de QR Code PIX (em produção, usaria API do Mercado Pago)
    // Por enquanto, vamos apenas marcar como pago diretamente
    const qrCodeBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const qrCode = `00020126360014BR.GOV.BCB.PIX01${agendamento.id.toString().padStart(10, '0')}5204000053039865404${agendamento.valor_total.toString().replace('.', '').padStart(10, '0')}5802BR5925WHO_DO_59360060970485026360440D9`;

    // Atualizar status do agendamento para confirmado e pago
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        valor_pago: true,
        status: 'confirmado',
      },
    });

    // Buscar ou criar carteira do prestador
    let carteiraPrestador = await prisma.carteira.findUnique({
      where: { usuario_id: agendamento.prestador_id }
    });

    if (!carteiraPrestador) {
      carteiraPrestador = await prisma.carteira.create({
        data: {
          usuario_id: agendamento.prestador_id,
          saldo: 0,
          saldo_pendente: agendamento.valor_total,
        }
      });
    } else {
      // Adicionar valor à carteira do prestador
      await prisma.carteira.update({
        where: { id: carteiraPrestador.id },
        data: {
          saldo_pendente: { increment: agendamento.valor_total }
        }
      });
    }

    // Criar registro de transação
    await prisma.transacao.create({
      data: {
        carteira_id: carteiraPrestador.id,
        agendamento_id: agendamentoId,
        tipo: 'PAGAMENTO_PIX',
        valor: agendamento.valor_total,
        status: 'concluido',
        descricao: `Pagamento via PIX do agendamento #${agendamentoId}`,
      },
    });

    // Criar notificação para o prestador
    await prisma.notificacao.create({
      data: {
        usuario_id: agendamento.prestador_id,
        tipo: 'pagamento_recebido',
        titulo: 'Pagamento Recebido',
        mensagem: `Você recebeu um pagamento de R$ ${agendamento.valor_total} via PIX!`,
        link: `/dashboard/agendamentos/${agendamentoId}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pagamento confirmado!',
      qrCodeBase64,
      qrCode,
    });

  } catch (error) {
    console.error('Erro ao processar PIX:', error);
    return NextResponse.json({ error: 'Ocorreu um erro ao processar o pagamento.' }, { status: 500 });
  }
}
