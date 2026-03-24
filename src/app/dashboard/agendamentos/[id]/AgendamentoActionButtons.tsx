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
  Send,
  Play,
} from 'lucide-react';

// =============================================================================
// TIPOS
// =============================================================================

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
  servico?: { titulo: string; tipo?: string | null };
  solicitacao_id?: number | null;
  arquivado?: boolean;
};

type AgendamentoActionButtonsProps = {
  agendamento: Agendamento;
  isPrestador: boolean;
  saldo: number;
};

type AcaoAgendamento =
  | 'aceitar'
  | 'recusar'
  | 'sugerir_data'
  | 'enviar_orcamento'
  | 'aprovar_orcamento'
  | 'recusar_orcamento'
  | 'iniciar_servico'
  | 'concluir_servico'
  | 'confirmar_conclusao'
  | 'recusar_conclusao'
  | 'cancelar'
  | 'arquivar'
  | 'desarquivar';

// =============================================================================
// COMPONENTE
// =============================================================================

const AgendamentoActionButtons = ({
  agendamento,
  isPrestador,
  saldo,
}: AgendamentoActionButtonsProps) => {
  const router = useRouter();
  const { showToast } = useToast();

  // Estados de modal/formulário
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
    novasCondicoes: '',
  });
  const [budgetValues, setBudgetValues] = useState({
    valor: '',
    descricao: '',
    condicoes: '',
  });
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // ===========================================================================
  // HELPER: chamada à API unificada
  // ===========================================================================

  async function chamarAcao(
    acao: AcaoAgendamento,
    extra: Record<string, unknown> = {}
  ) {
    setIsLoading(acao);
    try {
      const res = await fetch(`/api/agendamento/${agendamento.id}/acoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao, ...extra }),
      });

      const contentType = res.headers.get('content-type');
      const data =
        contentType?.includes('application/json') ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error || 'Erro na requisição.');
      }

      return data;
    } finally {
      setIsLoading(null);
    }
  }

  // ===========================================================================
  // HANDLERS — cada ação chama `chamarAcao` e exibe toast
  // ===========================================================================

  const handleAccept = async () => {
    try {
      await chamarAcao('aceitar');
      showToast('Agendamento aceito com sucesso!', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleRefuse = async () => {
    const motivo = prompt('Informe o motivo da recusa (opcional):');
    try {
      await chamarAcao('recusar', { motivo });
      showToast('Agendamento recusado.', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleSuggestDate = async () => {
    if (!suggestedDate) {
      showToast('Selecione uma nova data.', 'error');
      return;
    }
    try {
      await chamarAcao('sugerir_data', {
        novaData: suggestedDate,
        mensagem: suggestionMessage,
      });
      showToast('Nova data sugerida! O cliente será notificado.', 'success');
      setIsSuggestingDate(false);
      setSuggestedDate('');
      setSuggestionMessage('');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleApproveBudget = async () => {
    try {
      await chamarAcao('aprovar_orcamento');
      showToast('Orçamento aprovado!', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleRefuseBudget = async () => {
    const motivo = prompt('Informe o motivo da recusa (opcional):');
    try {
      await chamarAcao('recusar_orcamento', { motivo });
      showToast('Orçamento recusado.', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleNegotiate = async () => {
    if (
      !negotiationValues.novoValor &&
      !negotiationValues.novaData &&
      !negotiationValues.novasCondicoes
    ) {
      showToast('Informe pelo menos uma nova condição.', 'error');
      return;
    }
    try {
      await chamarAcao('recusar_orcamento', {
        motivo: 'Cliente propôs novos termos',
        novoValor: negotiationValues.novoValor
          ? parseFloat(negotiationValues.novoValor)
          : undefined,
        novaData: negotiationValues.novaData || undefined,
        novasCondicoes: negotiationValues.novasCondicoes || undefined,
      });
      showToast('Proposta enviada! O prestador será notificado.', 'success');
      setIsNegotiating(false);
      setNegotiationValues({ novoValor: '', novaData: '', novasCondicoes: '' });
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleSendBudget = async () => {
    if (!budgetValues.valor || parseFloat(budgetValues.valor) <= 0) {
      showToast('Informe um valor válido para o orçamento.', 'error');
      return;
    }
    try {
      await chamarAcao('enviar_orcamento', {
        valor_orcamento: parseFloat(budgetValues.valor),
        descricao_orcamento: budgetValues.descricao || undefined,
        condicoes_orcamento: budgetValues.condicoes || undefined,
      });
      showToast('Orçamento enviado! O cliente será notificado.', 'success');
      setIsSendingBudget(false);
      setBudgetValues({ valor: '', descricao: '', condicoes: '' });
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleIniciarServico = async () => {
    try {
      await chamarAcao('iniciar_servico');
      showToast('Serviço iniciado!', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      await chamarAcao('concluir_servico');
      showToast('Serviço marcado como concluído! O cliente será notificado.', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleConfirmCompletion = async () => {
    try {
      await chamarAcao('confirmar_conclusao');
      showToast('Conclusão confirmada! Pagamento liberado para o prestador.', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleRefuseCompletion = async () => {
    if (!refuseReason.trim()) {
      showToast('Informe o motivo da recusa.', 'error');
      return;
    }
    try {
      await chamarAcao('recusar_conclusao', { motivo: refuseReason });
      showToast('Conclusão recusada. O prestador será notificado.', 'success');
      setIsRefusingCompletion(false);
      setRefuseReason('');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handleCancelar = async () => {
    const motivo = prompt('Informe o motivo do cancelamento (opcional):');
    try {
      await chamarAcao('cancelar', { motivo });
      showToast('Agendamento cancelado.', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  const handlePayWithBalance = async () => {
    setIsPayingWithBalance(true);
    try {
      const res = await fetch('/api/transacao/pagar-com-saldo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agendamentoId: agendamento.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Falha ao processar o pagamento.');
      }
      showToast('Pagamento realizado com sucesso!', 'success');
      router.refresh();
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    } finally {
      setIsPayingWithBalance(false);
    }
  };

  const handleOpenChat = () => {
    if (agendamento.solicitacao_id) {
      router.push(`/dashboard/mensagens/${agendamento.solicitacao_id}`);
    } else {
      showToast('Chat não disponível para este agendamento.', 'error');
    }
  };

  const handleArquivamento = async (acao: 'arquivar' | 'desarquivar') => {
    try {
      await chamarAcao(acao);
      showToast(`Agendamento ${acao === 'arquivar' ? 'arquivado' : 'desarquivado'} com sucesso!`, 'success');
      router.refresh();
      // Opcional: redirecionar para a lista após arquivar, se estiver no detalhe
      if (acao === 'arquivar') {
        router.push('/dashboard/agendamentos');
      }
    } catch (e) {
      showToast(`Erro ao ${acao}: ${e instanceof Error ? e.message : 'Desconhecido'}`, 'error');
    }
  };

  // ===========================================================================
  // CONDIÇÕES DE VISIBILIDADE (máquina de estados)
  // ===========================================================================

  const status = agendamento.status;
  const valor = agendamento.valor ?? agendamento.valor_total ?? 0;
  const hasSufficientBalance = saldo >= valor;
  const tipoServico = agendamento.servico?.tipo ?? 'FIXO'; // padrão FIXO se não informado
  const isOrcamento = tipoServico === 'ORCAMENTO';

  // Pagamento disponível:
  // - FIXO: status aceito (pagamento imediato, sem etapa de orçamento)
  // - ORCAMENTO: status aguardando_pagamento (após aprovação do orçamento)
  const canPay =
    status === 'aguardando_pagamento' ||
    (status === 'aceito' && !isOrcamento);

  const canHandleBudget = status === 'orcamento_enviado';

  const concluidoPrestador = Boolean(agendamento.concluido_prestador);
  const concluidoCliente = Boolean(agendamento.concluido_cliente);
  const canConfirmCompletion =
    status === 'aguardando_confirmacao_cliente' &&
    concluidoPrestador &&
    !concluidoCliente;

  // Status em que o cancelamento é permitido
  const statusCancelavel = [
    'pendente', 'aguardando_cliente', 'aceito', 'orcamento_enviado',
    'aguardando_pagamento', 'negociacao', 'confirmado',
  ];
  const canCancel = statusCancelavel.includes(status);

  const statusTerminal = ['concluido', 'cancelado', 'recusado', 'conclusao_recusada', 'avaliado', 'disputa'];
  const canArchive = statusTerminal.includes(status);

  const agendamentoParaModal = { ...agendamento, valor_total: valor };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <>
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        agendamento={agendamentoParaModal}
      />

      {/* ===== MODAL: Sugerir Nova Data ===== */}
      {isSuggestingDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Sugerir Nova Data
              </h3>
              <button onClick={() => setIsSuggestingDate(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Data *</label>
                <input
                  type="datetime-local"
                  value={suggestedDate}
                  onChange={(e) => setSuggestedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem (opcional)</label>
                <textarea
                  value={suggestionMessage}
                  onChange={(e) => setSuggestionMessage(e.target.value)}
                  placeholder="Explique o motivo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsSuggestingDate(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleSuggestDate}
                  disabled={isLoading === 'sugerir_data' || !suggestedDate}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading === 'sugerir_data' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                  Sugerir Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Negociar Orçamento ===== */}
      {isNegotiating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Negociar Novos Termos
              </h3>
              <button onClick={() => setIsNegotiating(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Novo Valor (R$)</label>
                <input
                  type="number" step="0.01"
                  value={negotiationValues.novoValor}
                  onChange={(e) => setNegotiationValues({ ...negotiationValues, novoValor: e.target.value })}
                  placeholder={agendamento.valor_orcamento ? `Atual: R$ ${agendamento.valor_orcamento}` : 'Novo valor'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Data</label>
                <input
                  type="datetime-local"
                  value={negotiationValues.novaData}
                  onChange={(e) => setNegotiationValues({ ...negotiationValues, novaData: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Novas Condições</label>
                <textarea
                  value={negotiationValues.novasCondicoes}
                  onChange={(e) => setNegotiationValues({ ...negotiationValues, novasCondicoes: e.target.value })}
                  placeholder="Descreva as novas condições..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsNegotiating(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleNegotiate}
                  disabled={isLoading === 'recusar_orcamento'}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading === 'recusar_orcamento' ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                  Enviar Proposta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Enviar Orçamento ===== */}
      {isSendingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-500" />
                Enviar Orçamento
              </h3>
              <button onClick={() => setIsSendingBudget(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
                <input
                  type="number" step="0.01" min="0"
                  value={budgetValues.valor}
                  onChange={(e) => setBudgetValues({ ...budgetValues, valor: e.target.value })}
                  placeholder="Valor do orçamento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Serviço</label>
                <textarea
                  value={budgetValues.descricao}
                  onChange={(e) => setBudgetValues({ ...budgetValues, descricao: e.target.value })}
                  placeholder="Descreva os serviços inclusos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condições e Observações</label>
                <textarea
                  value={budgetValues.condicoes}
                  onChange={(e) => setBudgetValues({ ...budgetValues, condicoes: e.target.value })}
                  placeholder="Forma de pagamento, garantias, prazos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsSendingBudget(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleSendBudget}
                  disabled={isLoading === 'enviar_orcamento' || !budgetValues.valor}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading === 'enviar_orcamento' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Enviar Orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Recusar Conclusão ===== */}
      {isRefusingCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Recusar Conclusão do Serviço
              </h3>
              <button onClick={() => setIsRefusingCompletion(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  O prestador será notificado e deverá resolver os problemas. O pagamento permanecerá bloqueado.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo da Recusa *</label>
                <textarea
                  value={refuseReason}
                  onChange={(e) => setRefuseReason(e.target.value)}
                  placeholder="Descreva o motivo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4} required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsRefusingCompletion(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleRefuseCompletion}
                  disabled={isLoading === 'recusar_conclusao' || !refuseReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading === 'recusar_conclusao' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  Recusar Conclusão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* BOTÕES PRINCIPAIS                                                      */}
      {/* ===================================================================== */}

      {agendamento.arquivado && (
        <div className="w-full flex items-center justify-between bg-gray-100 border border-gray-300 rounded-md p-4 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Este agendamento está arquivado.</span>
            <span className="text-sm">Ele não aparece na sua lista principal, apenas no calendário.</span>
          </div>
          <button onClick={() => handleArquivamento('desarquivar')} disabled={isLoading === 'desarquivar'}
            className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
            {isLoading === 'desarquivar' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Desarquivar
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center">

        {/* ==================== PRESTADOR — PENDENTE ==================== */}
        {isPrestador && status === 'pendente' && (
          <>
            <button onClick={handleAccept} disabled={isLoading === 'aceitar'}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              {isLoading === 'aceitar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Aceitar
            </button>
            <button onClick={() => setIsSuggestingDate(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <Clock className="w-4 h-4" /> Sugerir Nova Data
            </button>
            <button onClick={handleRefuse} disabled={isLoading === 'recusar'}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              {isLoading === 'recusar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Recusar
            </button>
            <button onClick={handleOpenChat}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <MessageCircle className="w-4 h-4" /> Abrir Chat
            </button>
          </>
        )}

        {/* ==================== PRESTADOR — ACEITO ==================== */}
        {isPrestador && status === 'aceito' && (
          <>
            {/* Enviar Orçamento — apenas para serviços do tipo ORCAMENTO */}
            {isOrcamento && (
              <button onClick={() => setIsSendingBudget(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
                <Send className="w-4 h-4" /> Enviar Orçamento
              </button>
            )}
            <button onClick={() => setIsSuggestingDate(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <Clock className="w-4 h-4" /> Sugerir Nova Data
            </button>
            <button onClick={handleOpenChat}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <MessageCircle className="w-4 h-4" /> Abrir Chat
            </button>
          </>
        )}

        {/* ==================== PRESTADOR — CONFIRMADO (pago, aguardando início) ==================== */}
        {isPrestador && status === 'confirmado' && (
          <>
            <button onClick={handleIniciarServico} disabled={isLoading === 'iniciar_servico'}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              {isLoading === 'iniciar_servico' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Iniciar Serviço
            </button>
            <button onClick={handleOpenChat}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <MessageCircle className="w-4 h-4" /> Abrir Chat
            </button>
          </>
        )}

        {/* ==================== PRESTADOR — EM ANDAMENTO ==================== */}
        {isPrestador && status === 'em_andamento' && (
          <>
            <button onClick={handleMarkAsCompleted} disabled={isLoading === 'concluir_servico'}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              {isLoading === 'concluir_servico' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Marcar como Concluído
            </button>
            <button onClick={handleOpenChat}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <MessageCircle className="w-4 h-4" /> Abrir Chat
            </button>
          </>
        )}

        {/* ==================== PRESTADOR — AGUARDANDO CONFIRMAÇÃO CLIENTE ==================== */}
        {isPrestador && status === 'aguardando_confirmacao_cliente' && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Aguardando confirmação do cliente</span>
          </div>
        )}

        {/* ==================== PRESTADOR — NEGOCIAÇÃO ==================== */}
        {isPrestador && status === 'negociacao' && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Aguardando resposta do cliente</span>
          </div>
        )}

        {/* ==================== CLIENTE — PENDENTE ==================== */}
        {!isPrestador && status === 'pendente' && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Aguardando confirmação do prestador</span>
          </div>
        )}

        {/* ==================== CLIENTE — PAGAMENTO ==================== */}
        {!isPrestador && canPay && !agendamento.valor_pago && (
          hasSufficientBalance ? (
            <button onClick={handlePayWithBalance} disabled={isPayingWithBalance}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2">
              {isPayingWithBalance ? <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</> : <><DollarSign className="w-4 h-4" /> Pagar com Saldo</>}
            </button>
          ) : (
            <button onClick={() => setCheckoutOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Pagar via Pix / Cartão
            </button>
          )
        )}

        {/* ==================== CLIENTE — ORÇAMENTO ==================== */}
        {!isPrestador && canHandleBudget && (
          <>
            <button onClick={handleApproveBudget} disabled={isLoading === 'aprovar_orcamento'}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              {isLoading === 'aprovar_orcamento' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
              Aprovar Orçamento
            </button>
            <button onClick={() => setIsNegotiating(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <DollarSign className="w-4 h-4" /> Negociar
            </button>
            <button onClick={handleRefuseBudget} disabled={isLoading === 'recusar_orcamento'}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              {isLoading === 'recusar_orcamento' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4" />}
              Recusar Orçamento
            </button>
          </>
        )}

        {/* ==================== CLIENTE — CONFIRMAR/RECUSAR CONCLUSÃO ==================== */}
        {!isPrestador && canConfirmCompletion && (
          <>
            <button onClick={handleConfirmCompletion} disabled={isLoading === 'confirmar_conclusao'}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              {isLoading === 'confirmar_conclusao' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Aceitar e Finalizar
            </button>
            <button onClick={() => setIsRefusingCompletion(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <X className="w-4 h-4" /> Recusar Conclusão
            </button>
          </>
        )}

        {/* ==================== CLIENTE — STATUSES INFORMATIVOS ==================== */}
        {!isPrestador && status === 'aguardando_pagamento' && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Aguardando pagamento</span>
          </div>
        )}
        {!isPrestador && status === 'negociacao' && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Em negociação</span>
          </div>
        )}
        {!isPrestador && status === 'em_andamento' && (
          <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded">
            <Play className="w-5 h-5" />
            <span className="font-medium">Serviço em andamento</span>
          </div>
        )}
        {!isPrestador && status === 'conclusao_recusada' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Conclusão recusada. Aguarde contato do prestador.</span>
          </div>
        )}
        {isPrestador && status === 'conclusao_recusada' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Conclusão recusada pelo cliente. Entre em contato para resolver.</span>
          </div>
        )}

        {/* ==================== BOTÃO CANCELAR (ambas as partes) ==================== */}
        {canCancel && (
          <button onClick={handleCancelar} disabled={isLoading === 'cancelar'}
            className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
            {isLoading === 'cancelar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            Cancelar Agendamento
          </button>
        )}

        {/* ==================== BOTÃO CHAT (em todos os status ativos) ==================== */}
        {!['cancelado', 'pendente', 'recusado', 'concluido', 'avaliado'].includes(status) &&
          !isPrestador && status !== 'aguardando_pagamento' && (
            <button onClick={handleOpenChat}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
              <MessageCircle className="w-4 h-4" /> Abrir Chat
            </button>
          )}

        {/* ==================== BOTÃO ARQUIVAR (status terminais) ==================== */}
        {canArchive && !agendamento.arquivado && (
          <button onClick={() => handleArquivamento('arquivar')} disabled={isLoading === 'arquivar'}
            className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
            {isLoading === 'arquivar' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Arquivar
          </button>
        )}
      </div>
    </>
  );
};

export default AgendamentoActionButtons;
