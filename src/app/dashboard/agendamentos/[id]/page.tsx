import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import AgendamentoActionButtons from './AgendamentoActionButtons';
import { getStatusLabel, getStatusColor } from '@/lib/status-utils';

type AgendamentoDetalhePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const AgendamentoDetalhePage = async ({ params }: AgendamentoDetalhePageProps) => {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const agendamentoId = parseInt(resolvedParams.id);
  if (isNaN(agendamentoId)) {
    notFound();
  }

  const agendamento = await prisma.agendamento.findUnique({
    where: { id: agendamentoId },
    include: {
      servico: {
        select: {
          titulo: true,
        },
      },
      prestador: {
        select: {
          id: true,
          nome: true,
        },
      },
      cliente: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });

  if (!agendamento) {
    notFound();
  }

  const isOwner = session.id === agendamento.prestador_id || session.id === agendamento.cliente_id;
  if (!isOwner) {
    return (
      <div className="p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Acesso Negado</h1>
        <p className="text-gray-600 dark:text-gray-400">Você não tem permissão para visualizar este agendamento.</p>
      </div>
    );
  }

  const isPrestador = session.id === agendamento.prestador_id;
  const valor = Number(agendamento.valor_total) ?? 0;

  let saldo = 0;
  if (!isPrestador) {
    const carteira = await prisma.carteira.findUnique({
      where: { usuario_id: session.id },
    });
    saldo = Number(carteira?.saldo) ?? 0;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Agendamento #{agendamento.id}</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
        <p><strong>Serviço:</strong> {agendamento.servico.titulo}</p>
        <p><strong>Prestador:</strong> {agendamento.prestador.nome}</p>
        <p><strong>Cliente:</strong> {agendamento.cliente.nome}</p>
        <p><strong>Data:</strong> {new Date(agendamento.data_agendamento).toLocaleDateString()}</p>
        <p><strong>Valor:</strong> R$ {valor.toFixed(2)}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(agendamento.status)}`}>
          {getStatusLabel(agendamento.status)}
        </span></p>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        <AgendamentoActionButtons
          agendamento={{
            id: agendamento.id,
            status: agendamento.status,
            valor: Number(agendamento.valor_total),
            valor_orcamento: agendamento.valor_orcamento ? Number(agendamento.valor_orcamento) : null,
            orcamento_aprovado: agendamento.orcamento_aprovado,
            concluido_prestador: agendamento.concluido_prestador,
            concluido_cliente: agendamento.concluido_cliente,
            valor_pago: agendamento.valor_pago,
            servico: agendamento.servico,
            solicitacao_id: agendamento.solicitacao_id,
          }}
          isPrestador={isPrestador}
          saldo={saldo}
        />
      </div>
    </div>
  );
};

export default AgendamentoDetalhePage;
