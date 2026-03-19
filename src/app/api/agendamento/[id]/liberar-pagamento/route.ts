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

// POST: Liberar pagamento para o prestador
export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const session = await getSession();
        const resolvedParams = await params;

        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const agendamentoId = parseInt(resolvedParams.id);
        const userId = session.id;

        // Buscar agendamento atual
        const agendamento = await prisma.agendamento.findUnique({
            where: { id: agendamentoId },
            include: {
                prestador: {
                    include: { carteira: true }
                },
                cliente: true,
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
                { error: "Apenas o cliente pode liberar o pagamento" },
                { status: 403 }
            );
        }

        // Verificar se ambos confirmaram a conclusão
        if (!agendamento.concluido_prestador || !agendamento.concluido_cliente) {
            return NextResponse.json(
                { error: "Ambos devem confirmar a conclusão para liberar o pagamento" },
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

        // Verificar status válido para liberação
        if (agendamento.status !== "concluido") {
            return NextResponse.json(
                { error: "O agendamento deve estar concluído para liberar o pagamento" },
                { status: 400 }
            );
        }

        // Calcular valores
        const valorTotal = new Decimal(agendamento.valor_total.toString());
        const comissao = valorTotal.times(TAXA_COMISSAO);
        const valorLiquido = valorTotal.times(TAXA_PROVEDOR);
        const dataPagamento = new Date();

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
            // 1. Atualizar saldo do prestador (adicionar valor líquido)
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

            // 2. Registrar transação de crédito para o prestador
            const transacaoPrestador = await tx.transacao.create({
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

            // 3. Registrar transação de comissão (para controle interno)
            // A comissão fica retida pela plataforma
            const transacaoComissao = await tx.transacao.create({
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

            // 4. Atualizar o agendamento com informações do pagamento
            const agendamentoAtualizado = await tx.agendamento.update({
                where: { id: agendamentoId },
                data: {
                    valor_pago: true,
                    valor_pago_valor: valorLiquido,
                    data_pagamento: dataPagamento,
                    comissao: comissao
                }
            });

            // 5. Criar histórico do pagamento
            await tx.historicoAgendamento.create({
                data: {
                    agendamentoId: agendamentoId,
                    usuarioId: userId,
                    acao: "liberar_pagamento",
                    status_anterior: agendamento.status,
                    status_novo: agendamento.status,
                    descricao: `Pagamento liberado: R$ ${valorLiquido.toFixed(2)} para o prestador (R$ ${comissao.toFixed(2)} de comissão)`
                }
            });

            return {
                carteira: carteiraAtualizada,
                transacaoPrestador,
                transacaoComissao,
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
                link: `/dashboard/carteira`
            }
        });

        return NextResponse.json({
            success: true,
            message: "Pagamento liberado com sucesso",
            data: {
                valor_total: valorTotal.toFixed(2),
                comissao: comissao.toFixed(2),
                valor_liquido: valorLiquido.toFixed(2),
                data_pagamento: dataPagamento,
                novo_saldo: resultado.carteira.saldo
            }
        });
    } catch (error) {
        console.error("Erro ao liberar pagamento:", error);
        return NextResponse.json(
            { error: "Erro ao liberar pagamento" },
            { status: 500 }
        );
    }
}

// GET: Verificar status do pagamento
export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const session = await getSession();
        const resolvedParams = await params;

        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const agendamentoId = parseInt(resolvedParams.id);

        const agendamento = await prisma.agendamento.findUnique({
            where: { id: agendamentoId },
            select: {
                id: true,
                valor_total: true,
                valor_pago: true,
                valor_pago_valor: true,
                data_pagamento: true,
                comissao: true,
                status: true,
                concluido_prestador: true,
                concluido_cliente: true
            }
        });

        if (!agendamento) {
            return NextResponse.json(
                { error: "Agendamento não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            agendamento: {
                id: agendamento.id,
                status_pagamento: agendamento.valor_pago ? "pago" : "pendente",
                valor_total: agendamento.valor_total,
                valor_pago: agendamento.valor_pago_valor,
                comissao: agendamento.comissao,
                data_pagamento: agendamento.data_pagamento,
                AmbosConfirmaram: agendamento.concluido_prestador && agendamento.concluido_cliente
            }
        });
    } catch (error) {
        console.error("Erro ao buscar status do pagamento:", error);
        return NextResponse.json(
            { error: "Erro ao buscar status do pagamento" },
            { status: 500 }
        );
    }
}
