import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const body = await req.json();
        const { prestador_id, servico_id, nota, comentario } = body;

        if (!prestador_id || !servico_id || !nota) {
            return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
        }

        if (session.id === prestador_id) {
            return NextResponse.json({ error: "Você não pode avaliar a si mesmo" }, { status: 400 });
        }

        const numNota = Number(nota);
        if (numNota < 1 || numNota > 5) {
            return NextResponse.json({ error: "Nota inválida" }, { status: 400 });
        }

        // Verifica se o serviço pertence ao prestador
        const servico = await prisma.servico.findUnique({
            where: { id: parseInt(servico_id) }
        });

        if (!servico || servico.usuario_id !== parseInt(prestador_id)) {
            return NextResponse.json({ error: "Serviço inválido" }, { status: 400 });
        }

        const avaliacao = await prisma.avaliacao.create({
            data: {
                cliente_id: session.id,
                prestador_id: parseInt(prestador_id),
                servico_id: parseInt(servico_id),
                nota: numNota,
                comentario: comentario?.trim() || null
            },
            include: {
                cliente: {
                    select: { nome: true, foto_perfil: true }
                },
                servico: {
                    select: { titulo: true }
                }
            }
        });

        // Atualizar média do prestador via Trigger ou Query (aqui faremos via Query por simplicidade)
        const todasAsAvaliacoes = await prisma.avaliacao.findMany({
            where: { prestador_id: parseInt(prestador_id) },
            select: { nota: true }
        });

        const soma = todasAsAvaliacoes.reduce((acc, a) => acc + Number(a.nota), 0);
        const media = soma / todasAsAvaliacoes.length;

        await prisma.usuario.update({
            where: { id: parseInt(prestador_id) },
            data: { avaliacao_media: media }
        });

        // Notificar o prestador
        await prisma.notificacao.create({
            data: {
                usuario_id: parseInt(prestador_id),
                tipo: "nova_avaliacao",
                titulo: "Nova Avaliação!",
                mensagem: `${avaliacao.cliente.nome} deixou uma avaliação de ${numNota} estrelas no seu serviço ${servico.titulo}.`,
                link: `/dashboard/avaliacoes`, // Link para painel do dono futuramente
            }
        });

        return NextResponse.json({ avaliacao }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar avaliação:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
