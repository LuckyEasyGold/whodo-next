/**
 * Human-readable labels for Agendamento status
 */
export const AGENDAMENTO_STATUS_LABELS: Record<string, string> = {
    pendente: "Pendente",
    aceito: "Aceito",
    aguardando_cliente: "Aguardando Cliente",
    recusado: "Recusado",
    orcamento_enviado: "Orçamento Enviado",
    orcamento_aprovado: "Orçamento Aprovado",
    aguardando_pagamento: "Aguardando Pagamento",
    confirmado: "Confirmado",
    aguardando_confirmacao_cliente: "Aguardando Confirmação",
    concluido: "Concluído",
    negociacao: "Em Negociação",
    cancelado: "Cancelado",
};

/**
 * Get human-readable label for a status
 * @param status - The status string
 * @returns Human-readable label
 */
export function getStatusLabel(status: string): string {
    return AGENDAMENTO_STATUS_LABELS[status] || status;
}

/**
 * Get CSS color class for a status
 * @param status - The status string
 * @returns CSS color class
 */
export function getStatusColor(status: string): string {
    switch (status) {
        case "pendente":
            return "bg-yellow-100 text-yellow-800";
        case "aceito":
            return "bg-blue-100 text-blue-800";
        case "orcamento_enviado":
            return "bg-purple-100 text-purple-800";
        case "orcamento_aprovado":
            return "bg-indigo-100 text-indigo-800";
        case "aguardando_pagamento":
            return "bg-orange-100 text-orange-800";
        case "confirmado":
            return "bg-green-100 text-green-800";
        case "aguardando_confirmacao_cliente":
            return "bg-teal-100 text-teal-800";
        case "concluido":
            return "bg-green-200 text-green-900";
        case "recusado":
        case "cancelado":
            return "bg-red-100 text-red-800";
        case "negociacao":
            return "bg-amber-100 text-amber-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}
