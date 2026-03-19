-- CreateTable
CREATE TABLE "historico_agendamentos" (
    "id" SERIAL NOT NULL,
    "agendamentoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "acao" VARCHAR(50) NOT NULL,
    "status_anterior" VARCHAR(30),
    "status_novo" VARCHAR(30),
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "historico_agendamentos_agendamentoId_idx" ON "historico_agendamentos"("agendamentoId");

-- CreateIndex
CREATE INDEX "historico_agendamentos_usuarioId_idx" ON "historico_agendamentos"("usuarioId");

-- AddForeignKey
ALTER TABLE "historico_agendamentos" ADD CONSTRAINT "historico_agendamentos_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "agendamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_agendamentos" ADD CONSTRAINT "historico_agendamentos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "agendamentos" ADD COLUMN "orcamento_aprovado" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "agendamentos" ADD COLUMN "concluido_prestador" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "agendamentos" ADD COLUMN "concluido_cliente" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "agendamentos" ADD COLUMN "valor_orcamento" DECIMAL(10,2);

ALTER TABLE "agendamentos" ADD COLUMN "descricao_orcamento" TEXT;

ALTER TABLE "agendamentos" ADD COLUMN "condicoes_orcamento" TEXT;
