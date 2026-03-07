import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Você precisa estar logado para enviar mensagens" }, { status: 401 });
        }

        const { prestador_id } = await req.json();

        if (!prestador_id) {
            return NextResponse.json({ error: "ID do prestador obrigatório" }, { status: 400 });
        }

        if (prestador_id === session.id) {
            return NextResponse.json({ error: "Você não pode iniciar um chat com você mesmo" }, { status: 400 });
        }

        // Verifica se já existe UMA solicitação (chat) ativa entre esse cliente e esse prestador
        // Vai pegar a mais recente
        const solicitacaoExistente = await prisma.solicitacao.findFirst({
            where: {
                cliente_id: session.id,
                servico: {
                    usuario_id: prestador_id
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        // Se já existir conversa, apenas retorna o ID dela para redirecionar o usuário
        if (solicitacaoExistente) {
            return NextResponse.json({ solicitacao_id: solicitacaoExistente.id });
        }

        // Se não existir, precisamos criar uma nova.
        // Como o chat do WhoDo é atrelado a um "Servico", buscamos qualquer serviço desse prestador.
        const servicoDisponivel = await prisma.servico.findFirst({
            where: {
                usuario_id: prestador_id,
                status: 'ativo'
            }
        });

        if (!servicoDisponivel) {
            // Se ele não tem serviço, buscamos mesmo assim inativo ou criamos um dummy fallback?
            // Neste domínio, se o usuário não é prestador ativo, não pode ser contratado.
            return NextResponse.json({ error: "Este usuário não possui serviços ativos para contato." }, { status: 400 });
        }

        // Cria a conversa (solicitação) genérica
        const novaSolicitacao = await prisma.solicitacao.create({
            data: {
                cliente_id: session.id,
                servico_id: servicoDisponivel.id,
                descricao: "Contato direto via perfil",
                status: "pendente"
            }
        });

        // Mandamos uma mensagem do sistema "invisível" ou apenas criamos a sala.
        // O app não precisa necessariamente de uma msg inicial para existir o chat.
        // Mas para aparecer na View, é bom ter algo ou a view lidará bem com 0 mensagens.
        // A view já suporta "Nenhuma mensagem. Seja o primeiro a falar!"

        return NextResponse.json({ solicitacao_id: novaSolicitacao.id });

    } catch (error) {
        console.error("Erro ao iniciar chat:", error);
        return NextResponse.json({ error: "Erro interno ao iniciar conversa" }, { status: 500 });
    }
}
