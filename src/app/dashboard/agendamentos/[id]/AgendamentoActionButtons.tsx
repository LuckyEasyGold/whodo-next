'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CheckoutModal from '@/components/CheckoutModal';
import { useToast } from '@/components/Toast';
import {
  Check,
  X,
  Calendar,
  MessageCircle,
  Loader2,
  Clock,
  AlertCircle,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Send
} from 'lucide-react';

type Agendamento = {
  id: number;
  status: string;
  valor?: number | null;
  valor_total?: number | null;
  valor_orcamento?: number | null;
  orcamento_aprovado?: boolean;
  concluido_prestador?: boolean;
  concluido_cliente?: boolean;
  valor_pago?: boolean;
  servico?: {
    titulo: string;
  };
  solicitacao_id?: number | null;
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
  const [isSuggestingDate, setIsSuggestingDate] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [isSendingBudget, setIsSendingBudget] = useState(false);
  const [isRefusingCompletion, setIsRefusingCompletion] = useState(false);
  const [refuseReason, setRefuseReason] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [negotiationValues, setNegotiationValues] = useState({
    novoValor: '',
    novaData: '',
    novasCondicoes: ''
  });
  const [budgetValues, setBudgetValues] = useState({
    valor: '',
    descricao: '',
    condicoes: ''
  });
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const { showToast } = useToast();

  // Helper para tratar respostas de API
  async function handleApiResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na requisição.');
      }
      throw new Error('Erro do servidor. Tente novamente.');
    }
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return null;
  }

  // Handle accepting a scheduling (prestador)
  const handleAccept = async () => {
    setIsLoading('aceitar');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/aceitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      await handleApiResponse(response);

      showToast('Agendamento aceito com sucesso!', 'success');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle refusing a scheduling (prestador)
  const handleRefuse = async () => {
    const motivo = prompt('Por favor, informe o motivo da recusa (opcional):');

    setIsLoading('recusar');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/recusar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao recusar o agendamento.');
      }

      showToast('Agendamento recusado com sucesso!', 'success');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle suggesting a new date (prestador)
  const handleSuggestDate = async () => {
    if (!suggestedDate) {
      showToast('Por favor, selecione uma nova data.', 'error');
      return;
    }

    setIsLoading('sugerir');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/sugerir-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novaData: suggestedDate,
          mensagem: suggestionMessage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao sugerir nova data.');
      }

      showToast('Nova data sugerida com sucesso! O cliente será notificado.', 'success');
      setIsSuggestingDate(false);
      setSuggestedDate('');
      setSuggestionMessage('');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle approving budget (cliente)
  const handleApproveBudget = async () => {
    setIsLoading('aprovar_orcamento');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/aprovar-orcamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao aprovar o orçamento.');
      }

      showToast('Orçamento aprovado com sucesso!', 'success');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle refusing budget (cliente)
  const handleRefuseBudget = async () => {
    const motivo = prompt('Por favor, informe o motivo da recusa (opcional):');

    setIsLoading('recusar_orcamento');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/recusar-orcamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao recusar o orçamento.');
      }

      showToast('Orçamento recusado com sucesso!', 'success');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle negotiate (cliente)
  const handleNegotiate = async () => {
    if (!negotiationValues.novoValor && !negotiationValues.novaData && !negotiationValues.novasCondicoes) {
      showToast('Por favor, informe pelo menos uma nova condição.', 'error');
      return;
    }

    setIsLoading('negociar');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/recusar-orcamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motivo: 'Cliente propôs novos termos',
          novoValor: negotiationValues.novoValor ? parseFloat(negotiationValues.novoValor) : undefined,
          novaData: negotiationValues.novaData || undefined,
          novasCondicoes: negotiationValues.novasCondicoes || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao enviar proposta.');
      }

      showToast('Proposta enviada com sucesso! O prestador será notificado.', 'success');
      setIsNegotiating(false);
      setNegotiationValues({ novoValor: '', novaData: '', novasCondicoes: '' });
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle confirming completion (cliente)
  const handleConfirmCompletion = async () => {
    setIsLoading('confirmar_conclusao');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/confirmar-conclusao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao confirmar conclusão.');
      }

      showToast('Conclusão confirmada com sucesso! O pagamento foi liberado para o prestador.', 'success');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle refusing completion (cliente)
  const handleRefuseCompletion = async () => {
    if (!refuseReason.trim()) {
      showToast('Por favor, informe o motivo da recusa.', 'error');
      return;
    }

    setIsLoading('recusar_conclusao');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/recusar-conclusao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo: refuseReason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao recusar conclusão.');
      }

      showToast('Conclusão recusada. O prestador será notificado.', 'success');
      setIsRefusingCompletion(false);
      setRefuseReason('');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle sending budget (prestador)
  const handleSendBudget = async () => {
    if (!budgetValues.valor || parseFloat(budgetValues.valor) <= 0) {
      showToast('Por favor, informe um valor válido para o orçamento.', 'error');
      return;
    }

    setIsLoading('enviar_orcamento');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/enviar-orcamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor_orcamento: parseFloat(budgetValues.valor),
          descricao_orcamento: budgetValues.descricao || undefined,
          condicoes_orcamento: budgetValues.condicoes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao enviar orçamento.');
      }

      showToast('Orçamento enviado com sucesso! O cliente será notificado.', 'success');
      setIsSendingBudget(false);
      setBudgetValues({ valor: '', descricao: '', condicoes: '' });
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle marking service as completed (prestador)
  const handleMarkAsCompleted = async () => {
    setIsLoading('concluir_servico');
    try {
      const response = await fetch(`/api/agendamento/${agendamento.id}/concluir-servico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao marcar serviço como concluído.');
      }

      showToast('Serviço marcado como concluído! O cliente será notificado para confirmar.', 'success');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsLoading(null);
    }
  };

  // Handle payment with balance
  const handlePayWithBalance = async () => {
    setIsPayingWithBalance(true);

    try {
      const response = await fetch('/api/transacao/pagar-com-saldo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agendamentoId: agendamento.id }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Falha ao processar o pagamento.');
        } else {
          throw new Error('Erro do servidor. Tente novamente.');
        }
      }

      showToast('Pagamento realizado com sucesso!', 'success');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      showToast(`Erro: ${message}`, 'error');
    } finally {
      setIsPayingWithBalance(false);
    }
  };

  // Handle opening chat
  const handleOpenChat = () => {
    if (agendamento.solicitacao_id) {
      router.push(`/dashboard/mensagens/${agendamento.solicitacao_id}`);
    } else {
      showToast('Chat não disponível para este agendamento.', 'error');
    }
  };

  const agendamentoParaModal = {
    ...agendamento,
    valor_total: agendamento.valor
  };

  const hasSufficientBalance = saldo >= (agendamento.valor ?? 0);

  // Check if payment is available (when status is 'pendente', 'aceito' or 'orcamento_aprovado')
  const canPay = agendamento.status === 'pendente' || agendamento.status === 'aceito' || agendamento.orcamento_aprovado === true;

  // Check if budget actions are available (when status is 'orcamento_enviado')
  const canHandleBudget = agendamento.status === 'orcamento_enviado';

  // Check if can confirm completion (when provider marked as done)
  // Convert to boolean in case it's a string from the API
  const concluidoPrestador = Boolean(agendamento.concluido_prestador);
  const concluidoCliente = Boolean(agendamento.concluido_cliente);
  const canConfirmCompletion = (
    agendamento.status === 'confirmado' ||
    agendamento.status === 'aguardando_confirmacao_cliente' ||
    agendamento.status === 'aceito'
  ) && concluidoPrestador === true && !concluidoCliente;

  // Check if provider can send budget (status is 'aceito')
  // Note: This variable is reserved for future use
  // const canSendBudget = isPrestador && agendamento.status === 'aceito';

  // Check if provider can mark as completed (status is 'confirmado' and not already done)
  // Note: This variable is reserved for future use  
  // const canMarkAsCompleted = isPrestador && agendamento.status === 'confirmado' && !agendamento.concluido_prestador;

  return (
    <>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        agendamento={agendamentoParaModal}
      />

      {/* Modal de Sugerir Nova Data (Prestador) */}
      {isSuggestingDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Sugerir Nova Data
              </h3>
              <button
                onClick={() => setIsSuggestingDate(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Data *
                </label>
                <input
                  type="datetime-local"
                  value={suggestedDate}
                  onChange={(e) => setSuggestedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem (opcional)
                </label>
                <textarea
                  value={suggestionMessage}
                  onChange={(e) => setSuggestionMessage(e.target.value)}
                  placeholder="Explique o motivo da sugestão de nova data..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsSuggestingDate(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSuggestDate}
                  disabled={isLoading === 'sugerir' || !suggestedDate}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading === 'sugerir' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      Sugerir Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Negociação (Cliente) */}
      {isNegotiating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Negociar Novos Termos
              </h3>
              <button
                onClick={() => setIsNegotiating(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Novo Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={negotiationValues.novoValor}
                  onChange={(e) => setNegotiationValues({ ...negotiationValues, novoValor: e.target.value })}
                  placeholder={agendamento.valor_orcamento ? `Atual: R$ ${agendamento.valor_orcamento}` : 'Digite o novo valor'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Data
                </label>
                <input
                  type="datetime-local"
                  value={negotiationValues.novaData}
                  onChange={(e) => setNegotiationValues({ ...negotiationValues, novaData: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Novas Condições
                </label>
                <textarea
                  value={negotiationValues.novasCondicoes}
                  onChange={(e) => setNegotiationValues({ ...negotiationValues, novasCondicoes: e.target.value })}
                  placeholder="Descreva as novas condições..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsNegotiating(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleNegotiate}
                  disabled={isLoading === 'negociar'}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading === 'negociar' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      Enviar Proposta
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Enviar Orçamento (Prestador) */}
      {isSendingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-500" />
                Enviar Orçamento
              </h3>
              <button
                onClick={() => setIsSendingBudget(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor do Orçamento (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetValues.valor}
                  onChange={(e) => setBudgetValues({ ...budgetValues, valor: e.target.value })}
                  placeholder="Digite o valor do orçamento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Serviço
                </label>
                <textarea
                  value={budgetValues.descricao}
                  onChange={(e) => setBudgetValues({ ...budgetValues, descricao: e.target.value })}
                  placeholder="Descreva os serviços inclusos no orçamento..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condições e Observações
                </label>
                <textarea
                  value={budgetValues.condicoes}
                  onChange={(e) => setBudgetValues({ ...budgetValues, condicoes: e.target.value })}
                  placeholder="Forma de pagamento, garantias, prazos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsSendingBudget(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendBudget}
                  disabled={isLoading === 'enviar_orcamento' || !budgetValues.valor}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading === 'enviar_orcamento' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Orçamento
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Recusar Conclusão (Cliente) */}
      {isRefusingCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Recusar Conclusão do Serviço
              </h3>
              <button
                onClick={() => setIsRefusingCompletion(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Ao recusar a conclusão, o prestador será notificado e deverá resolver os problemas encontrados.
                  O pagamento permanecerá bloqueado até que o serviço seja aceito ou mediado.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da Recusa *
                </label>
                <textarea
                  value={refuseReason}
                  onChange={(e) => setRefuseReason(e.target.value)}
                  placeholder="Descreva o motivo pelo qual você está recusando a conclusão do serviço..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsRefusingCompletion(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRefuseCompletion}
                  disabled={isLoading === 'recusar_conclusao' || !refuseReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading === 'recusar_conclusao' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Recusar Conclusão
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center">

        {/* ==================== AÇÕES DO PRESTADOR ==================== */}
        {isPrestador && agendamento.status === 'pendente' && (
          <>
            {/* Aceitar */}
            <button
              onClick={handleAccept}
              disabled={isLoading === 'aceitar'}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              {isLoading === 'aceitar' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Aceitar
            </button>

            {/* Sugerir Nova Data */}
            <button
              onClick={() => setIsSuggestingDate(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Sugerir Nova Data
            </button>

            {/* Recusar */}
            <button
              onClick={handleRefuse}
              disabled={isLoading === 'recusar'}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              {isLoading === 'recusar' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Recusar
            </button>

            {/* Abrir Chat */}
            <button
              onClick={handleOpenChat}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Abrir Chat
            </button>
          </>
        )}

        {/* ==================== AÇÕES DO PRESTADOR - Status aceito ==================== */}
        {isPrestador && agendamento.status === 'aceito' && (
          <>
            {/* Enviar Orçamento */}
            <button
              onClick={() => setIsSendingBudget(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Enviar Orçamento
            </button>

            {/* Sugerir Nova Data */}
            <button
              onClick={() => setIsSuggestingDate(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Sugerir Nova Data
            </button>

            {/* Abrir Chat */}
            <button
              onClick={handleOpenChat}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Abrir Chat
            </button>
          </>
        )}

        {/* ==================== AÇÕES DO PRESTADOR - Status confirmado ==================== */}
        {isPrestador && agendamento.status === 'confirmado' && (
          <>
            {/* Marcar como Concluído */}
            <button
              onClick={handleMarkAsCompleted}
              disabled={isLoading === 'concluir_servico'}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              {isLoading === 'concluir_servico' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Marcar como Concluído
            </button>

            {/* Abrir Chat */}
            <button
              onClick={handleOpenChat}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Abrir Chat
            </button>
          </>
        )}

        {/* ==================== AÇÕES DO PRESTADOR - Status aguardando_confirmacao_cliente ==================== */}
        {isPrestador && agendamento.status === 'aguardando_confirmacao_cliente' && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Aguardando confirmação do cliente</span>
          </div>
        )}

        {/* ==================== AÇÕES DO CLIENTE ==================== */}

        {/* 1. Status pendente - mostrar que está aguardando */}
        {!isPrestador && agendamento.status === 'pendente' && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Aguardando confirmação do prestador</span>
          </div>
        )}

        {/* 2. Status aceito - Mostrar botão de pagamento (após prestador aceitar) */}
        {!isPrestador && canPay && !agendamento.valor_pago && (
          hasSufficientBalance ? (
            <button
              onClick={handlePayWithBalance}
              disabled={isPayingWithBalance}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              {isPayingWithBalance ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Pagar com Saldo da Carteira
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCheckoutOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Pagar via Pix / Cartão
            </button>
          )
        )}

        {/* 3. Status orcamento_enviado - Aprovar/Recusar/Negociar orçamento */}
        {!isPrestador && canHandleBudget && (
          <>
            {/* Aprovar Orçamento */}
            <button
              onClick={handleApproveBudget}
              disabled={isLoading === 'aprovar_orcamento'}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              {isLoading === 'aprovar_orcamento' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
              Aprovar Orçamento
            </button>

            {/* Negociar */}
            <button
              onClick={() => setIsNegotiating(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              Negociar
            </button>

            {/* Recusar Orçamento */}
            <button
              onClick={handleRefuseBudget}
              disabled={isLoading === 'recusar_orcamento'}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              {isLoading === 'recusar_orcamento' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ThumbsDown className="w-4 h-4" />
              )}
              Recusar Orçamento
            </button>
          </>
        )}

        {/* 4. Status confirmado/aguardando_confirmacao_cliente - Confirmar/Recusar Conclusão (quando prestador marcou como done) */}
        {!isPrestador && canConfirmCompletion && (
          <>
            {/* Botão Aceitar */}
            <button
              onClick={handleConfirmCompletion}
              disabled={isLoading === 'confirmar_conclusao'}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              {isLoading === 'confirmar_conclusao' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Aceitar e Finalizar
            </button>

            {/* Botão Recusar */}
            <button
              onClick={() => setIsRefusingCompletion(true)}
              disabled={isLoading === 'recusar_conclusao'}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
            >
              {isLoading === 'recusar_conclusao' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Recusar
            </button>
          </>
        )}

        {/* 5. Status aguardando_pagamento - Mostrar status para cliente */}
        {!isPrestador && agendamento.status === 'aguardando_pagamento' && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Aguardando pagamento</span>
          </div>
        )}

        {/* 6. Status em negociação - Mostrar status para cliente */}
        {!isPrestador && agendamento.status === 'negociacao' && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Em negociação</span>
          </div>
        )}

        {/* 7. Status aguardando_confirmacao_cliente - Mostrar status quando aguardando confirmação do cliente */}
        {!isPrestador && agendamento.status === 'aguardando_confirmacao_cliente' && !canConfirmCompletion && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Aguardando sua confirmação</span>
          </div>
        )}

        {/* ==================== AÇÕES PARA AMBOS ==================== */}

        {/* Abrir Chat (quando não for pendente e não for cancelado/recusado) */}
        {agendamento.status !== 'cancelado' && agendamento.status !== 'pendente' && agendamento.status !== 'recusado' && (
          <button
            onClick={handleOpenChat}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Abrir Chat
          </button>
        )}

        {/* Status aguardando_cliente para prestador */}
        {isPrestador && agendamento.status === 'negociacao' && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Aguardando resposta do cliente</span>
          </div>
        )}

        {/* Status confirmado para prestador - aguardando execução */}
        {isPrestador && agendamento.status === 'confirmado' && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Aguardando execução do serviço</span>
          </div>
        )}

        {/* Status conclusao_recusada - Cliente */}
        {!isPrestador && agendamento.status === 'conclusao_recusada' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Conclusão recusada. Aguarde contato do prestador.</span>
          </div>
        )}

        {/* Status conclusao_recusada - Prestador */}
        {isPrestador && agendamento.status === 'conclusao_recusada' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Conclusão recusada pelo cliente. Entre em contato para resolver.</span>
          </div>
        )}
      </div>
    </>
  );
};

export default AgendamentoActionButtons;
