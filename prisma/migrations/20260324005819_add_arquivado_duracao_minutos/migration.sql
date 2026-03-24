-- DropForeignKey
ALTER TABLE "historico_agendamentos" DROP CONSTRAINT "historico_agendamentos_usuarioId_fkey";

-- DropIndex
DROP INDEX "historico_agendamentos_agendamentoId_idx";

-- DropIndex
DROP INDEX "historico_agendamentos_usuarioId_idx";

-- AlterTable
ALTER TABLE "agendamentos" ADD COLUMN     "avaliacao_prestador_feita" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "comissao" DECIMAL(10,2),
ADD COLUMN     "data_pagamento" TIMESTAMP(3),
ADD COLUMN     "data_sugerida" TIMESTAMP(3),
ADD COLUMN     "valor_pago_valor" DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "historico_agendamentos" ADD CONSTRAINT "historico_agendamentos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
