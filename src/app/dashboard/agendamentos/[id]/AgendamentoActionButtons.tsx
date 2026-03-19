'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CheckoutModal from '@/components/CheckoutModal';
import { useToast } from '@/components/Toast';

type Agendamento = {
  id: number;
  status: string;
  valor?: number | null;
  servico?: {
    titulo: string;
  };
};

type AgendamentoActionButtonsProps = {
  agendamento: Agendamento;
  isPrestador: boolean;
  saldo: number;
};

const AgendamentoActionButtons = ({ agendamento, isPrestador, saldo }: AgendamentoActionButtonsProps) => {
  const router = useRouter();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isPayingWithBalance, setIsPayingWithBalance] = useState(false);

  const { showToast } = useToast(); // ✅ correto

  const handleUpdateStatus = async (status: 'confirmado' | 'cancelado') => {
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar o status.');
      }

      showToast(
        `Agendamento ${status === 'confirmado' ? 'confirmado' : 'recusado'} com sucesso!`,
        'success'
      );

      // alert(`Agendamento ${status === 'confirmado' ? 'confirmado' : 'recusado'} com sucesso!`);

      router.refresh();
    } catch (error: unknown) {
      console.error(error);

      const message = error instanceof Error ? error.message : 'Erro desconhecido.';

      showToast(`Erro: ${message}`, 'error');

      // alert(`Erro: ${message}`);
    }
  };

  const handlePayWithBalance = async () => {
    setIsPayingWithBalance(true);

    try {
      const response = await fetch('/api/transacao/pagar-com-saldo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agendamentoId: agendamento.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao processar o pagamento.');
      }

      showToast('Pagamento realizado com sucesso!', 'success');

      // alert('Pagamento realizado com sucesso!');

      router.refresh();
    } catch (error: unknown) {
      console.error(error);

      const message = error instanceof Error ? error.message : 'Erro desconhecido.';

      showToast(`Erro: ${message}`, 'error');

      // alert(`Erro: ${message}`);
    } finally {
      setIsPayingWithBalance(false);
    }
  };

  const agendamentoParaModal = {
    ...agendamento,
    valor_total: agendamento.valor
  };

  const hasSufficientBalance = saldo >= (agendamento.valor ?? 0);

  return (
    <>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        agendamento={agendamentoParaModal}
      />

      <div className="flex flex-wrap gap-4 items-center">

        {/* Ações do Prestador */}
        {isPrestador && agendamento.status === 'pendente' && (
          <>
            <button
              onClick={() => handleUpdateStatus('confirmado')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Aceitar Pedido
            </button>

            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
              Sugerir Nova Data
            </button>

            <button
              onClick={() => handleUpdateStatus('cancelado')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Recusar
            </button>
          </>
        )}

        {/* Ações do Cliente */}
        {!isPrestador && agendamento.status === 'confirmado' && (
          hasSufficientBalance ? (
            <button
              onClick={handlePayWithBalance}
              disabled={isPayingWithBalance}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            >
              {isPayingWithBalance ? 'Processando...' : 'Pagar com Saldo da Carteira'}
            </button>
          ) : (
            <button
              onClick={() => setCheckoutOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Pagar via Pix / Cartão
            </button>
          )
        )}

        {/* Ação para ambos */}
        {agendamento.status !== 'cancelado' && (
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Abrir Chat
          </button>
        )}
      </div>
    </>
  );
};

export default AgendamentoActionButtons;