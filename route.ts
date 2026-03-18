import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { Prisma } from '@prisma/client'

// Inicializa o cliente do Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log('Webhook Mercado Pago recebido:', body.type || body.topic)

        // Verifica se é uma notificação do tipo pagamento
        if (body.type === 'payment' || body.topic === 'payment') {
            const paymentId = body.data?.id || body.resource?.split('/').pop()

            if (!paymentId) {
                return NextResponse.json({ error: 'ID do pagamento não encontrado' }, { status: 400 })
            }

            // 1. Buscar os detalhes completos e seguros direto na API do Mercado Pago
            const paymentClient = new Payment(client)
            const paymentData = await paymentClient.get({ id: paymentId })

            // 2. Se o PIX foi efetivamente pago
            if (paymentData.status === 'approved') {
                const agendamentoId = Number(paymentData.external_reference)

                if (!agendamentoId || isNaN(agendamentoId)) {
                    throw new Error('external_reference inválido ou ausente')
                }

                // 3. Executar o Split usando Transaction (Tudo ou Nada)
                await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                    // Buscar o agendamento e a carteira do prestador
                    const agendamento = await tx.agendamento.findUnique({
                        where: { id: agendamentoId },
                        include: { prestador: { include: { carteira: true } } }
                    })

                    if (!agendamento) throw new Error(`Agendamento ${agendamentoId} não encontrado`)
                    if (agendamento.valor_pago) return // Evitar pagamento duplo se o MP notificar duas vezes

                    // A MATEMÁTICA DO SPLIT
                    const valorTotal = Number(agendamento.valor_total)
                    const taxaPlataforma = valorTotal * 0.04 // 4% pra plataforma
                    const valorPrestador = valorTotal - taxaPlataforma // 96% pro profissional
                    const platformAccountId = Number(process.env.PLATFORM_ACCOUNT_ID)

                    // Atualiza o agendamento
                    await tx.agendamento.update({
                        where: { id: agendamentoId },
                        data: { valor_pago: true, status: 'confirmado' }
                    })

                    // Adiciona os 4% na carteira da Plataforma
                    await tx.carteira.update({
                        where: { usuario_id: platformAccountId },
                        data: {
                            saldo: { increment: taxaPlataforma },
                            total_ganho: { increment: taxaPlataforma }
                        }
                    })

                    // Garante que o Prestador tem carteira e adiciona os 96%
                    const carteiraPrestadorId = agendamento.prestador.carteira?.id ||
                        (await tx.carteira.create({ data: { usuario_id: agendamento.prestador_id } })).id

                    await tx.carteira.update({
                        where: { id: carteiraPrestadorId },
                        data: {
                            saldo: { increment: valorPrestador },
                            total_ganho: { increment: valorPrestador }
                        }
                    })

                    // Registra no histórico do prestador
                    await tx.transacao.create({
                        data: { carteira_id: carteiraPrestadorId, agendamento_id: agendamento.id, tipo: 'recebimento_servico', valor: valorPrestador, status: 'concluido', descricao: `Pagamento do serviço #${agendamento.id} (Taxa WhoDo: 4%)`, metodo_pagamento: 'pix', data_processamento: new Date() }
                    })
                })
                console.log(`✅ Pagamento #${agendamentoId} processado com sucesso pelo Webhook!`)
            }
        }

        // Precisamos retornar 200 pro Mercado Pago parar de tentar enviar a notificação
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Erro crítico no Webhook:', error)
        return NextResponse.json({ error: 'Erro interno no processamento' }, { status: 500 })
    }
}