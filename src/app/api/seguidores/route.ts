import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { seguido_id } = await req.json();

        if (!seguido_id) {
            return NextResponse.json({ error: "ID do usuário seguido é obrigatório" }, { status: 400 });
        }

        if (session.id === seguido_id) {
            return NextResponse.json({ error: "Você não pode seguir a si mesmo" }, { status: 400 });
        }

        // Verifica se já segue
        const seguidorExistente = await prisma.seguidor.findUnique({
            where: {
                seguidor_id_seguido_id: {
                    seguidor_id: session.id,
                    seguido_id: seguido_id
                }
            }
        });

        if (seguidorExistente) {
            // Unfollow
            await prisma.seguidor.delete({
                where: { id: seguidorExistente.id }
            });
            return NextResponse.json({ following: false });
        } else {
            // Follow
            await prisma.seguidor.create({
                data: {
                    seguidor_id: session.id,
                    seguido_id: seguido_id
                }
            });

            // Criar notificação para o usuário seguido
            const seguidorInfo = await prisma.usuario.findUnique({ where: { id: session.id } });
            await prisma.notificacao.create({
                data: {
                    usuario_id: seguido_id,
                    tipo: "novo_seguidor",
                    titulo: "Novo Seguidor!",
                    mensagem: `${seguidorInfo?.nome || 'Alguém'} começou a seguir você.`,
                    link: `/perfil/${session.id}`,
                }
            });

            return NextResponse.json({ following: true });
        }
    } catch (error) {
        console.error("Erro ao seguir usuário:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
