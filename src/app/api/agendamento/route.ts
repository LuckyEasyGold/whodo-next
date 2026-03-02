import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Listar agendamentos do usuário autenticado
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo"); // "cliente" ou "prestador"

    let agendamentos;

    if (tipo === "prestador") {
      agendamentos = await prisma.agendamento.findMany({
        where: { prestador_id: userId },
        include: {
          cliente: { select: { id: true, nome: true, foto_perfil: true, avaliacao_media: true } },
          servico: { select: { id: true, titulo: true, descricao: true } },
        },
        orderBy: { data_agendamento: "asc" },
      });
    } else {
      agendamentos = await prisma.agendamento.findMany({
        where: { cliente_id: userId },
        include: {
          prestador: { select: { id: true, nome: true, foto_perfil: true, avaliacao_media: true } },
          servico: { select: { id: true, titulo: true, descricao: true } },
        },
        orderBy: { data_agendamento: "asc" },
      });
    }

    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao listar agendamentos" },
      { status: 500 }
    );
  }
}

// POST: Criar novo agendamento
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const clienteId = session.id;
    const body = await req.json();

    const {
      prestador_id,
      servico_id,
      data_agendamento,
      descricao,
      endereco_servico,
      valor_total,
    } = body;

    // Validar campos obrigatórios
    if (!prestador_id || !servico_id || !data_agendamento || !valor_total) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Verificar se o serviço existe e pertence ao prestador
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(servico_id) },
    });

    if (!servico || servico.usuario_id !== parseInt(prestador_id)) {
      return NextResponse.json(
        { error: "Serviço não encontrado ou inválido" },
        { status: 404 }
      );
    }

    // Criar agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        cliente_id: clienteId,
        prestador_id: parseInt(prestador_id),
        servico_id: parseInt(servico_id),
        data_agendamento: new Date(data_agendamento),
        descricao,
        endereco_servico,
        valor_total: parseFloat(valor_total),
        status: "pendente",
      },
      include: {
        cliente: { select: { id: true, nome: true, foto_perfil: true } },
        prestador: { select: { id: true, nome: true, foto_perfil: true } },
        servico: { select: { id: true, titulo: true } },
      },
    });

    // Criar notificação para o prestador
    await prisma.notificacao.create({
      data: {
        usuario_id: parseInt(prestador_id),
        tipo: "novo_agendamento",
        titulo: "Novo Agendamento",
        mensagem: `${agendamento.cliente.nome} solicitou um agendamento para ${agendamento.servico.titulo}`,
        link: `/dashboard/agendamentos/${agendamento.id}`,
      },
    });

    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}
