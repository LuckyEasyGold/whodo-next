import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Buscar um serviço específico
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const servicoId = parseInt(id);

        const servico = await prisma.servico.findUnique({
            where: { id: servicoId },
            include: {
                usuario: { select: { id: true, nome: true, foto_perfil: true } },
                categoria: { select: { id: true, nome: true } }
            }
        });

        if (!servico) {
            return NextResponse.json(
                { error: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(servico, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar serviço:", error);
        return NextResponse.json(
            { error: "Erro ao buscar serviço" },
            { status: 500 }
        );
    }
}

// PUT: Atualizar um serviço existente
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const userId = session.id;
        const servicoId = parseInt(id);
        const body = await req.json();

        const {
            categoria_id,
            titulo,
            descricao,
            preco_base,
            unidade_medida,
            cobranca_tipo,
            tempo_estimado,
            status
        } = body;

        // Verificar se o serviço pertence ao usuário
        const servicoExistente = await prisma.servico.findUnique({
            where: { id: servicoId },
        });

        if (!servicoExistente || servicoExistente.usuario_id !== userId) {
            return NextResponse.json(
                { error: "Serviço não encontrado ou acesso negado" },
                { status: 404 }
            );
        }

        const updateData: any = {};
        if (categoria_id) updateData.categoria_id = parseInt(categoria_id);
        if (titulo !== undefined) updateData.titulo = titulo;
        if (descricao !== undefined) updateData.descricao = descricao;
        if (preco_base !== undefined) updateData.preco_base = parseFloat(preco_base);
        if (unidade_medida !== undefined) updateData.unidade_medida = unidade_medida;
        if (cobranca_tipo !== undefined) updateData.cobranca_tipo = cobranca_tipo;
        if (tempo_estimado !== undefined) updateData.tempo_estimado = tempo_estimado;
        if (status !== undefined) updateData.status = status;

        const servico = await prisma.servico.update({
            where: { id: servicoId },
            data: updateData,
        });

        return NextResponse.json(servico, { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar serviço:", error);
        return NextResponse.json(
            { error: "Erro ao atualizar serviço" },
            { status: 500 }
        );
    }
}

// DELETE: Excluir um serviço
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const userId = session.id;
        const servicoId = parseInt(id);

        // Verificar se o serviço pertence ao usuário
        const servicoExistente = await prisma.servico.findUnique({
            where: { id: servicoId },
        });

        if (!servicoExistente || servicoExistente.usuario_id !== userId) {
            return NextResponse.json(
                { error: "Serviço não encontrado ou acesso negado" },
                { status: 404 }
            );
        }

        await prisma.servico.delete({
            where: { id: servicoId },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        return NextResponse.json(
            { error: "Erro ao excluir serviço" },
            { status: 500 }
        );
    }
}
