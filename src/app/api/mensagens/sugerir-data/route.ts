import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const suggestDateSchema = z.object({
  agendamentoId: z.number(),
  newSuggestedDate: z.string().datetime(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const validation = suggestDateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: validation.error.format() }, { status: 400 });
    }

    const { agendamentoId, newSuggestedDate } = validation.data;

    // Verificar se o usuário é o prestador do agendamento
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      select: { prestador_id: true, cliente_id: true },
    });

    if (!agendamento) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    if (agendamento.prestador_id !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Acesso negado. Você não é o prestador deste serviço.' }, { status: 403 });
    }

    // Formatar a data para uma string legível
    const formattedDate = new Date(newSuggestedDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const mensagem = `[SISTEMA] O prestador sugeriu uma nova data/hora: ${formattedDate}.`;

    // Criar a mensagem no chat
    await prisma.mensagem.create({
      data: {
        agendamento_id: agendamentoId,
        remetente_id: parseInt(session.user.id),
        destinatario_id: agendamento.cliente_id,
        conteudo: mensagem,
        lida: false,
      },
    });

    // TODO: Criar uma notificação para o cliente

    return NextResponse.json({ message: 'Sugestão enviada com sucesso!' });

  } catch (error) {
    console.error('Erro ao sugerir nova data:', error);
    return NextResponse.json({ error: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
