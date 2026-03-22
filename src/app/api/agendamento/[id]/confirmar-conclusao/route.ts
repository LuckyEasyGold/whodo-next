import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Decimal } from "decimal.js";

interface Params {
    id: string;
}

// Taxa de comissão da plataforma (4%)
const TAXA_COMISSAO = 0.04;
const TAXA_PROVEDOR = 0.96;

// POST: Confirmar conclusão (cliente)
export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const session = await getSession();
        const resolvedParams = await params;

        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const agendamentoId = parseInt(resolvedParams.id);
        const userId = session.id;

        // Buscar agendamento atual com dados relacionados
        const agendamento = await prisma.agendamento.findUnique({
            where: { id: agendamentoId },
            include: {
                prestador: {
                    include: { carteira: true }
                },
                servico: true
            }
        });

        if (!agendamento) {
            return NextResponse.json(
                { error: "Agendamento não encontrado" },
                { status: 404 }
            );
        }

        // Verificar se o usuário é o cliente
        if (agendamento.cliente_id !== userId) {
            return NextResponse.json(
                { error: "Apenas o cliente pode confirmar a conclusão" },
                { status: 403 }
            );
        }

        // Verificar se o prestador já marcou como concluído
        if (!agendamento.concluido_prestador) {
            return NextResponse.json(
                { error: "Aguardando confirmação do prestador" },
                { status: 400 }
            );
        }

        // Verificar se o status é aguardando_confirmacao_cliente ou confirmado
        const statusValidos = ["confirmado", "aguardando_confirmacao_cliente"];
        if (!statusValidos.includes(agendamento.status)) {
            return NextResponse.json(
                { error: "Este agendamento não está em fase de confirmação de conclusão" },
                { status: 400 }
            );
        }

        // Verificar se o pagamento já foi liberado
        if (agendamento.valor_pago) {
            return NextResponse.json(
                { error: "Pagamento já foi liberado anteriormente" },
                { status: 400 }
            );
        }

        const statusAnterior = agendamento.status;
        const statusNovo = "concluido";
        const dataPagamento = new Date();

        // Calcular valores
        const valorTotal = new Decimal(agendamento.valor_total.toString());
        const comissao = valorTotal.times(TAXA_COMISSAO);
        const valorLiquido = valorTotal.times(TAXA_PROVEDOR);

        // Buscar ou criar carteira do prestador
        let carteiraPrestador = await prisma.carteira.findUnique({
            where: { usuario_id: agendamento.prestador_id }
        });

        if (!carteiraPrestador) {
            // Criar carteira para o prestador se não existir
            carteiraPrestador = await prisma.carteira.create({
                data: {
                    usuario_id: agendamento.prestador_id,
                    saldo: 0,
                    saldo_pendente: 0,
                    total_ganho: 0,
                    total_gasto: 0
                }
            });
        }

        // Iniciar transação para garantir atomicidade
        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Atualizar status do agendamento com informações do pagamento
            const agendamentoAtualizado = await tx.agendamento.update({
                where: { id: agendamentoId },
                data: {
                    status: statusNovo,
                    concluido_cliente: true,
                    data_conclusao: dataPagamento,
                    valor_pago: true,
                    valor_pago_valor: valorLiquido,
                    data_pagamento: dataPagamento,
                    comissao: comissao
                }
            });

            // 2. Atualizar saldo do prestador (adicionar valor líquido)
            const carteiraAtualizada = await tx.carteira.update({
                where: { id: carteiraPrestador!.id },
                data: {
                    saldo: {
                        increment: valorLiquido
                    },
                    total_ganho: {
                        increment: valorLiquido
                    }
                }
            });

            // 3. Registrar transação de crédito para o prestador
            await tx.transacao.create({
                data: {
                    carteira_id: carteiraPrestador!.id,
                    agendamento_id: agendamentoId,
                    tipo: "credito_servico",
                    valor: valorLiquido,
                    status: "concluido",
                    data_processamento: dataPagamento,
                    descricao: `Pagamento liberado para serviço: ${agendamento.servico.titulo}`,
                    metodo_pagamento: "plataforma"
                }
            });

            // 4. Registrar transação de comissão (para controle interno)
            await tx.transacao.create({
                data: {
                    carteira_id: carteiraPrestador!.id,
                    agendamento_id: agendamentoId,
                    tipo: "comissao_plataforma",
                    valor: comissao,
                    status: "concluido",
                    data_processamento: dataPagamento,
                    descricao: `Comissão plataforma (4%) - Serviço: ${agendamento.servico.titulo}`,
                    metodo_pagamento: "plataforma"
                }
            });

            // 5. Criar histórico do agendamento
            await tx.historicoAgendamento.create({
                data: {
                    agendamentoId: agendamentoId,
                    usuarioId: userId,
                    acao: "confirmar_conclusao",
                    status_anterior: statusAnterior,
                    status_novo: statusNovo,
                    descricao: `Cliente confirmou a conclusão. Pagamento liberado: R$ ${valorLiquido.toFixed(2)} para o prestador (R$ ${comissao.toFixed(2)} de comissão)`
                }
            });

            return {
                carteira: carteiraAtualizada,
                agendamento: agendamentoAtualizado
            };
        });

        // Criar notificação para o prestador
        await prisma.notificacao.create({
            data: {
                usuario_id: agendamento.prestador_id,
                tipo: "pagamento_liberado",
                titulo: "Pagamento Liberado",
                mensagem: `O pagamento de R$ ${valorLiquido.toFixed(2)} foi liberado para sua carteira. Comissão da plataforma: R$ ${comissao.toFixed(2)}`,
                link: `/dashboard/agendamentos/${agendamentoId}`,
            },
        });

        // =============================================
        // SOLICITAR AVALIAÇÕES OBRIGATÓRIAS (Item 6)
        // =============================================
        
        // Notificar prestador para avaliar cliente
        if (!agendamento.avaliacao_prestador_feita) {
            await prisma.notificacao.create({
                data: {
                    usuario_id: agendamento.prestador_id,
                    tipo: "avaliacao_pendente",
                    titulo: "Avalie o Cliente!",
                    mensagem: `O serviço foi concluído. Por favor, avalie o cliente para ajudar outros prestadores.`,
                    link: `/dashboard/agendamentos/${agendamentoId}`,
                }
            });
        }

        // Notificar cliente para avaliar prestador
        if (!agendamento.avaliacao_feita) {
            await prisma.notificacao.create({
                data: {
                    usuario_id: agendamento.cliente_id,
                    tipo: "avaliacao_pendente",
                    titulo: "Avalie o Serviço!",
                    mensagem: `O serviço foi concluído. Por favor, avalie o prestador para ajudar outros clientes.`,
                    link: `/dashboard/agendamentos/${agendamentoId}`,
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: "Conclusão confirmada e pagamento liberado com sucesso",
            agendamento: resultado.agendamento,
            pagamento: {
                valor_total: valorTotal.toFixed(2),
                comissao: comissao.toFixed(2),
                valor_liquido: valorLiquido.toFixed(2),
                data_pagamento: dataPagamento,
                novo_saldo: resultado.carteira.saldo
            }
        });
    } catch (error) {
        console.error("Erro ao confirmar conclusão:", error);
        return NextResponse.json(
            { error: "Erro ao confirmar conclusão" },
            { status: 500 }
        );
    }
}
