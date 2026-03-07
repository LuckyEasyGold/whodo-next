import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ mediaId: string }> }
) {
    try {
        const params = await context.params;
        const mediaId = parseInt(params.mediaId);

        if (isNaN(mediaId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        const comentarios = await prisma.portfolioComentario.findMany({
            where: { media_id: mediaId },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        nome_fantasia: true,
                        foto_perfil: true
                    }
                }
            },
            orderBy: { created_at: "asc" }
        });

        return NextResponse.json({ comentarios });
    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ mediaId: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const params = await context.params;
        const mediaId = parseInt(params.mediaId);

        if (isNaN(mediaId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        const { texto } = await req.json();

        if (!texto || texto.trim() === '') {
            return NextResponse.json({ error: "O comentário não pode ser vazio" }, { status: 400 });
        }

        const media = await prisma.portfolioMedia.findUnique({
            where: { id: mediaId },
            select: { usuario_id: true }
        });

        if (!media) {
            return NextResponse.json({ error: "Mídia não encontrada" }, { status: 404 });
        }

        const comentario = await prisma.portfolioComentario.create({
            data: {
                texto: texto.trim(),
                media_id: mediaId,
                usuario_id: session.id
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        nome_fantasia: true,
                        foto_perfil: true
                    }
                }
            }
        });

        // Notificar o dono do portfólio
        if (media.usuario_id !== session.id) {
            await prisma.notificacao.create({
                data: {
                    usuario_id: media.usuario_id,
                    tipo: "novo_comentario_portfolio",
                    titulo: "Novo Comentário no Portfólio",
                    mensagem: `${comentario.usuario.nome} comentou em uma mídia do seu portfólio.`,
                    link: `/dashboard/portfolio`, // Ou link direto p a midia
                }
            });
        }

        return NextResponse.json({ comentario }, { status: 201 });
    } catch (error) {
        console.error("Erro ao publicar comentário:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
