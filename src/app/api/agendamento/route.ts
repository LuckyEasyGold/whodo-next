import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Listar agendamentos do usuário autenticado
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const userId = session.id;
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo");
    const prestadorIdParam = searchParams.get("prestador_id");
    const incluirArquivados = searchParams.get("incluir_arquivados") === "true";

    const includeComum = {
      cliente: { select: { id: true, nome: true, foto_perfil: true, avaliacao_media: true } },
      prestador: { select: { id: true, nome: true, foto_perfil: true, avaliacao_media: true } },
      servico: { select: { id: true, titulo: true, descricao: true } },
    };

    // Filtro base: excluir arquivados salvo quando explicitamente pedido
    const filtroArquivado = incluirArquivados ? {} : { arquivado: false };

    let agendamentos;

    if (prestadorIdParam) {
      agendamentos = await prisma.agendamento.findMany({
        where: { prestador_id: parseInt(prestadorIdParam), ...filtroArquivado },
        include: includeComum,
        orderBy: { data_agendamento: "asc" },
      });
    } else if (tipo === "prestador") {
      agendamentos = await prisma.agendamento.findMany({
        where: { prestador_id: userId, ...filtroArquivado },
        include: includeComum,
        orderBy: { data_agendamento: "asc" },
      });
    } else {
      agendamentos = await prisma.agendamento.findMany({
        where: { cliente_id: userId, ...filtroArquivado },
        include: includeComum,
        orderBy: { data_agendamento: "asc" },
      });
    }

    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    return NextResponse.json({ error: "Erro ao listar agendamentos" }, { status: 500 });
  }
}

// POST: Criar novo agendamento
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const clienteId = session.id;
    const body = await req.json();
    const { prestador_id, servico_id, data_agendamento, descricao, endereco_servico, valor_total } = body;

    if (!prestador_id || !servico_id || !data_agendamento || !valor_total) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    // Buscar serviço para validar e pegar duração
    const servico = await prisma.servico.findUnique({ where: { id: parseInt(servico_id) } });
    if (!servico || servico.usuario_id !== parseInt(prestador_id)) {
      return NextResponse.json({ error: "Serviço não encontrado ou inválido" }, { status: 404 });
    }

    const duracaoMinutos = servico.duracao_minutos ?? 60;
    const dataInicio = new Date(data_agendamento);
    const dataFim = new Date(dataInicio.getTime() + duracaoMinutos * 60 * 1000);

    // Verificar conflito de horário com agendamentos ativos do prestador
    const statusAtivos = [
      "pendente", "aceito", "aguardando_cliente", "orcamento_enviado",
      "aguardando_pagamento", "confirmado", "em_andamento",
    ];

    // Busca todos os agendamentos ativos do prestador no mesmo período aproximado
    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        prestador_id: parseInt(prestador_id),
        status: { in: statusAtivos },
        arquivado: false,
        data_agendamento: {
          // Só verifica janela de ±24h para performance
          gte: new Date(dataInicio.getTime() - 24 * 60 * 60 * 1000),
          lte: new Date(dataFim.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      select: { id: true, data_agendamento: true, duracao_minutos: true },
    });

    const conflito = agendamentosExistentes.find((ag) => {
      const existInicio = new Date(ag.data_agendamento);
      const existDuracao = ag.duracao_minutos ?? 60;
      const existFim = new Date(existInicio.getTime() + existDuracao * 60 * 1000);
      // overlap: novoInicio < existFim && novoFim > existInicio
      return dataInicio < existFim && dataFim > existInicio;
    });

    if (conflito) {
      const hora = new Date(conflito.data_agendamento).toLocaleTimeString("pt-BR", {
        hour: "2-digit", minute: "2-digit",
      });
      return NextResponse.json(
        { error: `Prestador já tem um agendamento às ${hora}. Escolha outro horário.` },
        { status: 409 }
      );
    }

    // Criar solicitação vinculada
    const solicitacao = await prisma.solicitacao.create({
      data: {
        cliente_id: clienteId,
        prestador_id: parseInt(prestador_id),
        servico_id: parseInt(servico_id),
        descricao: descricao || `Agendamento para ${servico.titulo}`,
        status: "pendente",
      },
    });

    await prisma.mensagem.create({
      data: {
        remetente_id: clienteId,
        destinatario_id: parseInt(prestador_id),
        solicitacao_id: solicitacao.id,
        conteudo: descricao || `Olá! Gostaria de agendar o serviço "${servico.titulo}" para ${dataInicio.toLocaleDateString("pt-BR")}.`,
      },
    });

    const agendamento = await prisma.agendamento.create({
      data: {
        cliente_id: clienteId,
        prestador_id: parseInt(prestador_id),
        servico_id: parseInt(servico_id),
        solicitacao_id: solicitacao.id,
        data_agendamento: dataInicio,
        descricao,
        endereco_servico,
        valor_total: parseFloat(valor_total),
        duracao_minutos: duracaoMinutos,
        status: "pendente",
      },
      include: {
        cliente: { select: { id: true, nome: true, foto_perfil: true } },
        prestador: { select: { id: true, nome: true, foto_perfil: true } },
        servico: { select: { id: true, titulo: true } },
      },
    });

    await prisma.notificacao.create({
      data: {
        usuario_id: parseInt(prestador_id),
        tipo: "novo_agendamento",
        titulo: "Novo Agendamento",
        mensagem: `${agendamento.cliente.nome} solicitou um agendamento para ${agendamento.servico.titulo}`,
        link: `/dashboard/agendamentos/${agendamento.id}`,
      },
    });

    return NextResponse.json({ ...agendamento, solicitacao_id: solicitacao.id }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
  }
}
