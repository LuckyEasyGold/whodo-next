import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Obter dados bancários do usuário
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

    const dadosBancarios = await prisma.dadosBancarios.findUnique({
      where: { usuario_id: userId },
    });

    if (!dadosBancarios) {
      return NextResponse.json(
        { error: "Dados bancários não encontrados" },
        { status: 404 }
      );
    }

    // Mascarar dados sensíveis
    const dadosMascarados = {
      ...dadosBancarios,
      chave_pix: dadosBancarios.chave_pix ? dadosBancarios.chave_pix.substring(0, 3) + "***" : null,
      conta: dadosBancarios.conta ? dadosBancarios.conta.substring(0, 2) + "***" : null,
      cpf_cnpj: dadosBancarios.cpf_cnpj ? "***" + dadosBancarios.cpf_cnpj.substring(dadosBancarios.cpf_cnpj.length - 2) : null,
    };

    return NextResponse.json(dadosMascarados);
  } catch (error) {
    console.error("Erro ao obter dados bancários:", error);
    return NextResponse.json(
      { error: "Erro ao obter dados bancários" },
      { status: 500 }
    );
  }
}

// POST: Criar dados bancários
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
      chave_pix,
      banco_nome,
      banco_codigo,
      agencia,
      conta,
      tipo_conta,
      titular_nome,
      cpf_cnpj,
    } = body;

    // Verificar se já existe
    const existe = await prisma.dadosBancarios.findUnique({
      where: { usuario_id: userId },
    });

    if (existe) {
      return NextResponse.json(
        { error: "Já existem dados bancários cadastrados. Use PUT para atualizar." },
        { status: 400 }
      );
    }

    // Validações
    if (!chave_pix && !banco_codigo) {
      return NextResponse.json(
        { error: "Adicione uma chave PIX ou dados bancários" },
        { status: 400 }
      );
    }

    const dadosBancarios = await prisma.dadosBancarios.create({
      data: {
        usuario_id: userId,
        chave_pix,
        banco_nome,
        banco_codigo,
        agencia,
        conta,
        tipo_conta,
        titular_nome,
        cpf_cnpj,
        verificado: false,
      },
    });

    return NextResponse.json(dadosBancarios, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar dados bancários:", error);
    return NextResponse.json(
      { error: "Erro ao criar dados bancários" },
      { status: 500 }
    );
  }
}

// PUT: Atualizar dados bancários
export async function PUT(req: NextRequest) {
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

    const dadosBancarios = await prisma.dadosBancarios.findUnique({
      where: { usuario_id: userId },
    });

    if (!dadosBancarios) {
      return NextResponse.json(
        { error: "Dados bancários não encontrados" },
        { status: 404 }
      );
    }

    const dadosBancariosAtualizado = await prisma.dadosBancarios.update({
      where: { usuario_id: userId },
      data: {
        chave_pix: body.chave_pix || dadosBancarios.chave_pix,
        banco_nome: body.banco_nome || dadosBancarios.banco_nome,
        banco_codigo: body.banco_codigo || dadosBancarios.banco_codigo,
        agencia: body.agencia || dadosBancarios.agencia,
        conta: body.conta || dadosBancarios.conta,
        tipo_conta: body.tipo_conta || dadosBancarios.tipo_conta,
        titular_nome: body.titular_nome || dadosBancarios.titular_nome,
        cpf_cnpj: body.cpf_cnpj || dadosBancarios.cpf_cnpj,
      },
    });

    // Notificar que dados foram atualizados
    await prisma.notificacao.create({
      data: {
        usuario_id: userId,
        tipo: "dados_bancarios_atualizados",
        titulo: "Dados Bancários Atualizados",
        mensagem: "Seus dados bancários foram atualizados com sucesso.",
        link: "/dashboard/financeiro",
      },
    });

    return NextResponse.json(dadosBancariosAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar dados bancários:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar dados bancários" },
      { status: 500 }
    );
  }
}
