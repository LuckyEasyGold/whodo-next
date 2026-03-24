import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Decimal } from "decimal.js";
import { Prisma } from "@prisma/client";

// =============================================================================
// TIPOS
// =============================================================================

interface Params {
  id: string;
}

type AcaoAgendamento =
  | "aceitar"
  | "recusar"
  | "sugerir_data"
  | "enviar_orcamento"
  | "aprovar_orcamento"
  | "recusar_orcamento"
  | "iniciar_servico"
  | "concluir_servico"
  | "confirmar_conclusao"
  | "recusar_conclusao"
  | "cancelar";

interface BodyAcao {
  acao: AcaoAgendamento;
  // sugerir_data
  novaData?: string;
  mensagem?: string;
  // enviar_orcamento
  valor_orcamento?: number;
  descricao_orcamento?: string;
  condicoes_orcamento?: string;
  // recusar / cancelar / recusar_conclusao
  motivo?: string;
  // recusar_orcamento (negociação)
  novoValor?: number;
  novasCondicoes?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

const TAXA_COMISSAO = 0.04;
const TAXA_PROVEDOR = 0.96;

/**
 * Registra uma entrada no histórico do agendamento.
 */
async function registrarHistorico(
  tx: Prisma.TransactionClient,
  agendamentoId: number,
  usuarioId: number,
  acao: string,
  statusAnterior: string,
  statusNovo: string,
  descricao: string
) {
  await tx.historicoAgendamento.create({
    data: {
      agendamentoId,
      usuarioId,
      acao,
      status_anterior: statusAnterior,
      status_novo: statusNovo,
      descricao,
    },
  });
}

/**
 * Cria uma notificação para um usuário.
 */
async function notificar(
  usuarioId: number,
  tipo: string,
  titulo: string,
  mensagem: string,
  link: string
) {
  await prisma.notificacao.create({
    data: { usuario_id: usuarioId, tipo, titulo, mensagem, link },
  });
}

// =============================================================================
// HANDLERS DE CADA AÇÃO
// =============================================================================

/** ACEITAR — Prestador aceita o agendamento pendente */
async function handleAceitar(agendamentoId: number, userId: number) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.prestador_id !== userId)
    return err(403, "Apenas o prestador pode aceitar este agendamento");
  if (ag.status !== "pendente")
    return err(400, "Este agendamento não está mais pendente");

  const [atualizado, prestador, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: "aceito" },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "aceitar", ag.status, "aceito",
      `Prestador ${prestador?.nome} aceitou o agendamento`
    );
  });

  await notificar(
    ag.cliente_id,
    "agendamento_aceito",
    "Agendamento Aceito",
    `O prestador ${prestador?.nome} aceitou seu agendamento de ${servico?.titulo}`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Agendamento aceito com sucesso", atualizado);
}

/** RECUSAR — Prestador recusa o agendamento pendente */
async function handleRecusar(
  agendamentoId: number,
  userId: number,
  body: BodyAcao
) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.prestador_id !== userId)
    return err(403, "Apenas o prestador pode recusar este agendamento");
  if (ag.status !== "pendente")
    return err(400, "Este agendamento não está mais pendente");

  const motivo = body.motivo || "Recusado pelo prestador";

  const [atualizado, prestador, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: "recusado", motivo_cancelamento: motivo },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "recusar", ag.status, "recusado",
      `Prestador ${prestador?.nome} recusou o agendamento: ${motivo}`
    );
  });

  await notificar(
    ag.cliente_id,
    "agendamento_recusado",
    "Agendamento Recusado",
    `O prestador ${prestador?.nome} recusou seu agendamento de ${servico?.titulo}. Motivo: ${motivo}`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Agendamento recusado com sucesso", atualizado);
}

/** SUGERIR_DATA — Prestador sugere nova data (em pendente ou aceito) */
async function handleSugerirData(
  agendamentoId: number,
  userId: number,
  body: BodyAcao
) {
  if (!body.novaData)
    return err(400, "Nova data é obrigatória");

  const novaDataDate = new Date(body.novaData);
  if (isNaN(novaDataDate.getTime()))
    return err(400, "Data inválida");

  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.prestador_id !== userId)
    return err(403, "Apenas o prestador pode sugerir nova data");
  if (!["pendente", "aceito"].includes(ag.status))
    return err(400, "Não é possível sugerir data neste status");

  const [atualizado, prestador, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: "aguardando_cliente", data_sugerida: novaDataDate },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  const dataFormatada = novaDataDate.toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "sugerir_data", ag.status, "aguardando_cliente",
      `Prestador ${prestador?.nome} sugeriu nova data: ${dataFormatada}${body.mensagem ? `. Mensagem: ${body.mensagem}` : ""}`
    );
  });

  await notificar(
    ag.cliente_id,
    "agendamento_sugestao_data",
    "Nova Data Sugerida",
    `O prestador ${prestador?.nome} sugeriu nova data para ${servico?.titulo}: ${dataFormatada}${body.mensagem ? ` — "${body.mensagem}"` : ""}`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Nova data sugerida com sucesso", atualizado);
}

/** ENVIAR_ORCAMENTO — Prestador envia orçamento (quando aceito) */
async function handleEnviarOrcamento(
  agendamentoId: number,
  userId: number,
  body: BodyAcao
) {
  if (!body.valor_orcamento || body.valor_orcamento <= 0)
    return err(400, "Valor do orçamento é obrigatório e deve ser maior que zero");

  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.prestador_id !== userId)
    return err(403, "Apenas o prestador pode enviar orçamento");
  if (ag.status !== "aceito")
    return err(400, "O orçamento só pode ser enviado quando o agendamento está aceito");

  const [atualizado, prestador, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: "orcamento_enviado",
        valor_orcamento: body.valor_orcamento,
        descricao_orcamento: body.descricao_orcamento || null,
        condicoes_orcamento: body.condicoes_orcamento || null,
      },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "enviar_orcamento", ag.status, "orcamento_enviado",
      `Prestador ${prestador?.nome} enviou orçamento de R$ ${body.valor_orcamento}`
    );
  });

  await notificar(
    ag.cliente_id,
    "orcamento_enviado",
    "Novo Orçamento Recebido",
    `O prestador ${prestador?.nome} enviou um orçamento de R$ ${body.valor_orcamento} para ${servico?.titulo}`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Orçamento enviado com sucesso", atualizado);
}

/** APROVAR_ORCAMENTO — Cliente aprova o orçamento */
async function handleAprovarOrcamento(agendamentoId: number, userId: number) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.cliente_id !== userId)
    return err(403, "Apenas o cliente pode aprovar o orçamento");
  if (ag.status !== "orcamento_enviado")
    return err(400, "Este agendamento não possui orçamento pendente de aprovação");

  const [atualizado, cliente, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: "aguardando_pagamento", orcamento_aprovado: true },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "aprovar_orcamento", ag.status, "aguardando_pagamento",
      `Cliente ${cliente?.nome} aprovou o orçamento`
    );
  });

  await notificar(
    ag.prestador_id,
    "orcamento_aprovado",
    "Orçamento Aprovado",
    `O cliente ${cliente?.nome} aprovou o orçamento para ${servico?.titulo}`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Orçamento aprovado com sucesso", atualizado);
}

/** RECUSAR_ORCAMENTO — Cliente recusa/renegocia o orçamento */
async function handleRecusarOrcamento(
  agendamentoId: number,
  userId: number,
  body: BodyAcao
) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.cliente_id !== userId)
    return err(403, "Apenas o cliente pode recusar o orçamento");
  if (ag.status !== "orcamento_enviado")
    return err(400, "Este agendamento não possui orçamento pendente de aprovação");

  const [atualizado, cliente, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: "negociacao",
        orcamento_aprovado: false,
        ...(body.novoValor && { valor_total: body.novoValor }),
        ...(body.novaData && { data_agendamento: new Date(body.novaData) }),
        ...(body.novasCondicoes && { condicoes_orcamento: body.novasCondicoes }),
      },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  let descricao = `Cliente ${cliente?.nome} recusou o orçamento`;
  if (body.motivo) descricao += `: ${body.motivo}`;
  if (body.novoValor || body.novaData || body.novasCondicoes)
    descricao += ". Novos termos sugeridos.";

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "recusar_orcamento", ag.status, "negociacao", descricao
    );
  });

  await notificar(
    ag.prestador_id,
    "orcamento_recusado",
    "Orçamento Recusado",
    body.motivo
      ? `O cliente ${cliente?.nome} recusou o orçamento para ${servico?.titulo}. Motivo: ${body.motivo}`
      : `O cliente ${cliente?.nome} recusou o orçamento para ${servico?.titulo}`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Orçamento recusado com sucesso", atualizado);
}

/** INICIAR_SERVICO — Prestador inicia a execução (PAGO → EM_ANDAMENTO) */
async function handleIniciarServico(agendamentoId: number, userId: number) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.prestador_id !== userId)
    return err(403, "Apenas o prestador pode iniciar o serviço");
  if (ag.status !== "confirmado")
    return err(400, "O serviço só pode ser iniciado após o pagamento ser confirmado");

  const [atualizado, prestador, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: "em_andamento" },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "iniciar_servico", ag.status, "em_andamento",
      `Prestador ${prestador?.nome} iniciou a execução do serviço`
    );
  });

  await notificar(
    ag.cliente_id,
    "servico_iniciado",
    "Serviço Iniciado",
    `O prestador ${prestador?.nome} iniciou a execução de ${servico?.titulo}`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Serviço iniciado com sucesso", atualizado);
}

/** CONCLUIR_SERVICO — Prestador marca serviço como executado */
async function handleConcluirServico(agendamentoId: number, userId: number) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.prestador_id !== userId)
    return err(403, "Apenas o prestador pode marcar o serviço como concluído");
  if (!["confirmado", "em_andamento"].includes(ag.status))
    return err(400, "O serviço só pode ser marcado como concluído quando o pagamento está confirmado ou em andamento");
  if (ag.concluido_prestador)
    return err(400, "O serviço já foi marcado como concluído pelo prestador");

  const [atualizado, prestador, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: "aguardando_confirmacao_cliente",
        concluido_prestador: true,
        data_conclusao: new Date(),
      },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "concluir_servico", ag.status, "aguardando_confirmacao_cliente",
      `Prestador ${prestador?.nome} marcou o serviço como concluído`
    );
  });

  await notificar(
    ag.cliente_id,
    "servico_concluido_prestador",
    "Serviço Marcado como Concluído",
    `O prestador ${prestador?.nome} marcou ${servico?.titulo} como concluído. Por favor, confirme.`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Serviço marcado como concluído com sucesso", atualizado);
}

/** CONFIRMAR_CONCLUSAO — Cliente confirma recebimento e libera pagamento */
async function handleConfirmarConclusao(agendamentoId: number, userId: number) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
    include: { prestador: { include: { carteira: true } }, servico: true },
  });

  if (ag.cliente_id !== userId)
    return err(403, "Apenas o cliente pode confirmar a conclusão");
  if (!ag.concluido_prestador)
    return err(400, "Aguardando o prestador marcar como concluído primeiro");
  if (!["confirmado", "aguardando_confirmacao_cliente"].includes(ag.status))
    return err(400, "Este agendamento não está em fase de confirmação de conclusão");
  if (ag.valor_pago)
    return err(400, "Pagamento já foi liberado anteriormente");

  const valorTotal = new Decimal(ag.valor_total.toString());
  const comissao = valorTotal.times(TAXA_COMISSAO);
  const valorLiquido = valorTotal.times(TAXA_PROVEDOR);
  const dataPagamento = new Date();

  let carteiraPrestador = await prisma.carteira.findUnique({
    where: { usuario_id: ag.prestador_id },
  });

  if (!carteiraPrestador) {
    carteiraPrestador = await prisma.carteira.create({
      data: {
        usuario_id: ag.prestador_id,
        saldo: 0, saldo_pendente: 0, total_ganho: 0, total_gasto: 0,
      },
    });
  }

  const resultado = await prisma.$transaction(async (tx) => {
    const agendamentoAtualizado = await tx.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: "concluido",
        concluido_cliente: true,
        data_conclusao: dataPagamento,
        valor_pago: true,
        valor_pago_valor: valorLiquido,
        data_pagamento: dataPagamento,
        comissao,
      },
    });

    const carteiraAtualizada = await tx.carteira.update({
      where: { id: carteiraPrestador!.id },
      data: {
        saldo: { increment: valorLiquido },
        total_ganho: { increment: valorLiquido },
      },
    });

    await tx.transacao.create({
      data: {
        carteira_id: carteiraPrestador!.id,
        agendamento_id: agendamentoId,
        tipo: "credito_servico",
        valor: valorLiquido,
        status: "concluido",
        data_processamento: dataPagamento,
        descricao: `Pagamento liberado: ${ag.servico.titulo}`,
        metodo_pagamento: "plataforma",
      },
    });

    await tx.transacao.create({
      data: {
        carteira_id: carteiraPrestador!.id,
        agendamento_id: agendamentoId,
        tipo: "comissao_plataforma",
        valor: comissao,
        status: "concluido",
        data_processamento: dataPagamento,
        descricao: `Comissão 4% — ${ag.servico.titulo}`,
        metodo_pagamento: "plataforma",
      },
    });

    await registrarHistorico(
      tx, agendamentoId, userId,
      "confirmar_conclusao", ag.status, "concluido",
      `Cliente confirmou conclusão. Liberado R$ ${valorLiquido.toFixed(2)} (comissão R$ ${comissao.toFixed(2)})`
    );

    return { carteira: carteiraAtualizada, agendamento: agendamentoAtualizado };
  });

  // Notificações pós-transação
  await Promise.all([
    notificar(
      ag.prestador_id,
      "pagamento_liberado",
      "Pagamento Liberado",
      `R$ ${valorLiquido.toFixed(2)} foi liberado para sua carteira (comissão: R$ ${comissao.toFixed(2)})`,
      `/dashboard/agendamentos/${agendamentoId}`
    ),
    !ag.avaliacao_prestador_feita &&
      notificar(
        ag.prestador_id,
        "avaliacao_pendente",
        "Avalie o Cliente!",
        "O serviço foi concluído. Por favor, avalie o cliente.",
        `/dashboard/agendamentos/${agendamentoId}`
      ),
    !ag.avaliacao_feita &&
      notificar(
        ag.cliente_id,
        "avaliacao_pendente",
        "Avalie o Serviço!",
        "O serviço foi concluído. Por favor, avalie o prestador.",
        `/dashboard/agendamentos/${agendamentoId}`
      ),
  ]);

  return NextResponse.json({
    success: true,
    message: "Conclusão confirmada e pagamento liberado",
    agendamento: resultado.agendamento,
    pagamento: {
      valor_total: valorTotal.toFixed(2),
      comissao: comissao.toFixed(2),
      valor_liquido: valorLiquido.toFixed(2),
      data_pagamento: dataPagamento,
      novo_saldo: resultado.carteira.saldo,
    },
  });
}

/** RECUSAR_CONCLUSAO — Cliente recusa a conclusão (devolve ao prestador) */
async function handleRecusarConclusao(
  agendamentoId: number,
  userId: number,
  body: BodyAcao
) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  if (ag.cliente_id !== userId)
    return err(403, "Apenas o cliente pode recusar a conclusão do serviço");
  if (ag.status !== "aguardando_confirmacao_cliente")
    return err(400, "Este agendamento não está aguardando confirmação de conclusão");

  const motivo = body.motivo || "Cliente recusou a conclusão do serviço";

  const [atualizado, cliente, servico] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        status: "conclusao_recusada",
        motivo_cancelamento: motivo,
        concluido_prestador: false,
        concluido_cliente: false,
      },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
    prisma.servico.findUnique({
      where: { id: ag.servico_id },
      select: { titulo: true },
    }),
  ]);

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "recusar_conclusao", ag.status, "conclusao_recusada",
      `Cliente ${cliente?.nome} recusou a conclusão: ${motivo}`
    );
  });

  await Promise.all([
    notificar(
      ag.prestador_id,
      "conclusao_recusada",
      "Conclusão Recusada pelo Cliente",
      `O cliente ${cliente?.nome} recusou a conclusão de "${servico?.titulo}". Motivo: ${motivo}`,
      `/dashboard/agendamentos/${agendamentoId}`
    ),
    ag.solicitacao_id &&
      prisma.mensagem.create({
        data: {
          remetente_id: userId,
          destinatario_id: ag.prestador_id,
          solicitacao_id: ag.solicitacao_id,
          conteudo: `⚠️ O cliente recusou a conclusão do serviço.\n\n**Motivo:** ${motivo}`,
        },
      }),
  ]);

  return ok("Conclusão recusada. O prestador será notificado.", atualizado);
}

/** CANCELAR — Qualquer parte cancela (com regras por status) */
async function handleCancelar(
  agendamentoId: number,
  userId: number,
  body: BodyAcao
) {
  const ag = await prisma.agendamento.findUniqueOrThrow({
    where: { id: agendamentoId },
  });

  const isCliente = ag.cliente_id === userId;
  const isPrestador = ag.prestador_id === userId;

  if (!isCliente && !isPrestador)
    return err(403, "Sem permissão para cancelar este agendamento");

  // Status que permitem cancelamento
  const statusCancelaveisCliente = ["pendente", "aguardando_cliente", "aceito", "orcamento_enviado", "aguardando_pagamento", "negociacao"];
  const statusCancelaveisAmbos = ["confirmado"];

  if (isCliente && !statusCancelaveisCliente.includes(ag.status) && !statusCancelaveisAmbos.includes(ag.status))
    return err(400, `Não é possível cancelar um agendamento com status: ${ag.status}`);
  if (isPrestador && !["pendente", "aceito"].includes(ag.status) && !statusCancelaveisAmbos.includes(ag.status))
    return err(400, `Não é possível cancelar um agendamento com status: ${ag.status}`);

  const motivo = body.motivo || (isCliente ? "Cancelado pelo cliente" : "Cancelado pelo prestador");

  const [atualizado, usuario] = await Promise.all([
    prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: "cancelado", motivo_cancelamento: motivo },
    }),
    prisma.usuario.findUnique({ where: { id: userId }, select: { nome: true } }),
  ]);

  await prisma.$transaction(async (tx) => {
    await registrarHistorico(
      tx, agendamentoId, userId,
      "cancelar", ag.status, "cancelado",
      `${isCliente ? "Cliente" : "Prestador"} ${usuario?.nome} cancelou: ${motivo}`
    );
  });

  // Notifica a outra parte
  const notificadoId = isCliente ? ag.prestador_id : ag.cliente_id;
  const quem = isCliente ? "O cliente" : "O prestador";

  await notificar(
    notificadoId,
    "agendamento_cancelado",
    "Agendamento Cancelado",
    `${quem} ${usuario?.nome} cancelou o agendamento. Motivo: ${motivo}`,
    `/dashboard/agendamentos/${agendamentoId}`
  );

  return ok("Agendamento cancelado com sucesso", atualizado);
}

// =============================================================================
// HELPERS DE RESPOSTA
// =============================================================================

function err(status: number, message: string): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

function ok(message: string, agendamento: unknown): NextResponse {
  return NextResponse.json({ success: true, message, agendamento });
}

// =============================================================================
// HANDLER PRINCIPAL — POST /api/agendamento/[id]/acoes
// =============================================================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getSession();
    if (!session) return err(401, "Não autenticado");

    const { id } = await params;
    const agendamentoId = parseInt(id);
    if (isNaN(agendamentoId)) return err(400, "ID de agendamento inválido");

    const body: BodyAcao = await req.json();
    if (!body.acao) return err(400, "Campo 'acao' é obrigatório");

    const userId = session.id;

    switch (body.acao) {
      case "aceitar":
        return await handleAceitar(agendamentoId, userId);
      case "recusar":
        return await handleRecusar(agendamentoId, userId, body);
      case "sugerir_data":
        return await handleSugerirData(agendamentoId, userId, body);
      case "enviar_orcamento":
        return await handleEnviarOrcamento(agendamentoId, userId, body);
      case "aprovar_orcamento":
        return await handleAprovarOrcamento(agendamentoId, userId);
      case "recusar_orcamento":
        return await handleRecusarOrcamento(agendamentoId, userId, body);
      case "iniciar_servico":
        return await handleIniciarServico(agendamentoId, userId);
      case "concluir_servico":
        return await handleConcluirServico(agendamentoId, userId);
      case "confirmar_conclusao":
        return await handleConfirmarConclusao(agendamentoId, userId);
      case "recusar_conclusao":
        return await handleRecusarConclusao(agendamentoId, userId, body);
      case "cancelar":
        return await handleCancelar(agendamentoId, userId, body);
      default:
        return err(400, `Ação desconhecida: ${(body as BodyAcao).acao}`);
    }
  } catch (error) {
    // Tratamento especial para "not found" do Prisma
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return err(404, "Agendamento não encontrado");
    }
    console.error("Erro na API de ações de agendamento:", error);
    return err(500, "Erro interno do servidor");
  }
}
