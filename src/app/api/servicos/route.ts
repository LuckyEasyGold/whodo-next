import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Listar serviços do prestador com seus agendamentos
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
    const servicoId = searchParams.get("servicoId");

    // Listar serviços do prestador com agendamentos
    const servicos = await prisma.servico.findMany({
      where: { usuario_id: userId },
      include: {
        categoria: { select: { id: true, nome: true } },
        agendamentos: {
          include: {
            cliente: { select: { id: true, nome: true, foto_perfil: true, avaliacao_media: true } },
          },
          orderBy: { data_agendamento: "desc" },
        },
        avaliacoes: {
          select: {
            id: true,
            nota: true,
            comentario: true,
            data_avaliacao: true,
            cliente: { select: { nome: true } },
          },
          orderBy: { data_avaliacao: "desc" },
          take: 5,
        },
      },
    });

    // Se filtrar por serviço específico
    if (servicoId) {
      const servico = servicos.find(s => s.id === parseInt(servicoId));
      if (!servico) {
        return NextResponse.json(
          { error: "Serviço não encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json(servico);
    }

    // Calcular estatísticas por serviço
    const servicosComEstatisticas = servicos.map(servico => {
      const agendamentos = servico.agendamentos;
      const avaliacoes = servico.avaliacoes;

      return {
        ...servico,
        estatisticas: {
          totalAgendamentos: agendamentos.length,
          pendentes: agendamentos.filter((a: any) => a.status === "pendente").length,
          confirmados: agendamentos.filter((a: any) => a.status === "confirmado").length,
          concluidos: agendamentos.filter((a: any) => a.status === "concluido").length,
          cancelados: agendamentos.filter((a: any) => a.status === "cancelado").length,
          totalAvaliacoes: avaliacoes.length,
          mediaAvaliacoes: avaliacoes.length > 0 
            ? (avaliacoes.reduce((sum: number, a: any) => sum + parseFloat(a.nota), 0) / avaliacoes.length).toFixed(1)
            : 0,
        },
      };
    });

    return NextResponse.json(servicosComEstatisticas);
  } catch (error) {
    console.error("Erro ao listar serviços:", error);
    return NextResponse.json(
      { error: "Erro ao listar serviços" },
      { status: 500 }
    );
  }
}

// POST: Criar novo serviço
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const userId = session.id;
    const body = await req.json();

    const {
      categoria_id,
      titulo,
      descricao,
      preco_base,
      unidade_medida,
    } = body;

    // Validações
    if (!categoria_id || !titulo || !preco_base) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const servico = await prisma.servico.create({
      data: {
        usuario_id: userId,
        categoria_id: parseInt(categoria_id),
        titulo,
        descricao,
        preco_base: parseFloat(preco_base),
        unidade_medida,
        status: "ativo",
      },
      include: {
        categoria: true,
      },
    });

    return NextResponse.json(servico, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao criar serviço" },
      { status: 500 }
    );
  }
}
