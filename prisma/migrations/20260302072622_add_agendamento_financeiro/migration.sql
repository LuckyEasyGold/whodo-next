-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `nome_fantasia` VARCHAR(100) NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NULL,
    `telefone` VARCHAR(20) NULL,
    `documento` VARCHAR(20) NULL,
    `tipo` VARCHAR(20) NOT NULL DEFAULT 'usuario',
    `foto_perfil` VARCHAR(255) NULL,
    `especialidade` VARCHAR(255) NULL,
    `sobre` TEXT NULL,
    `avaliacao_media` DECIMAL(3, 2) NOT NULL DEFAULT 0,
    `verificado` BOOLEAN NOT NULL DEFAULT false,
    `disponibilidade` VARCHAR(255) NULL,
    `endereco` VARCHAR(255) NULL,
    `cidade` VARCHAR(100) NULL,
    `estado` VARCHAR(2) NULL,
    `cep` VARCHAR(10) NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `website` VARCHAR(255) NULL,
    `linkedin` VARCHAR(255) NULL,
    `facebook` VARCHAR(255) NULL,
    `instagram` VARCHAR(255) NULL,
    `youtube` VARCHAR(255) NULL,
    `tiktok` VARCHAR(255) NULL,
    `kwai` VARCHAR(255) NULL,
    `perfil_academico` VARCHAR(255) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ativo',
    `email_verificado` BOOLEAN NOT NULL DEFAULT false,
    `token_verificacao` VARCHAR(255) NULL,
    `patrocinador_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_documento_key`(`documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `album_id` INTEGER NULL,
    `url` VARCHAR(255) NOT NULL,
    `tipo` VARCHAR(20) NOT NULL DEFAULT 'imagem',
    `titulo` VARCHAR(255) NULL,
    `descricao` TEXT NULL,
    `citacao` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio_albums` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `capa_url` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `icone` VARCHAR(50) NULL,
    `imagem` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `categoria_id` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `preco_base` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `unidade_medida` VARCHAR(50) NULL,
    `destaque` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ativo',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `prestador_id` INTEGER NOT NULL,
    `servico_id` INTEGER NOT NULL,
    `agendamento_id` INTEGER NULL,
    `nota` DECIMAL(2, 1) NOT NULL,
    `comentario` TEXT NULL,
    `resposta_prestador` TEXT NULL,
    `data_avaliacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `servico_id` INTEGER NOT NULL,
    `descricao` TEXT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'pendente',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orcamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `solicitacao_id` INTEGER NOT NULL,
    `prestador_id` INTEGER NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `descricao` TEXT NULL,
    `prazo_estimado` VARCHAR(50) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'enviado',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensagens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `remetente_id` INTEGER NOT NULL,
    `destinatario_id` INTEGER NOT NULL,
    `conteudo` TEXT NOT NULL,
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `mensagem` TEXT NULL,
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `link` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agendamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `prestador_id` INTEGER NOT NULL,
    `servico_id` INTEGER NOT NULL,
    `solicitacao_id` INTEGER NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'pendente',
    `data_agendamento` DATETIME(3) NOT NULL,
    `data_conclusao` DATETIME(3) NULL,
    `descricao` TEXT NULL,
    `endereco_servico` VARCHAR(255) NULL,
    `valor_total` DECIMAL(10, 2) NOT NULL,
    `valor_pago` BOOLEAN NOT NULL DEFAULT false,
    `avaliacao_feita` BOOLEAN NOT NULL DEFAULT false,
    `motivo_cancelamento` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carteiras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `saldo` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `saldo_pendente` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total_ganho` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total_gasto` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `carteiras_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carteira_id` INTEGER NOT NULL,
    `agendamento_id` INTEGER NULL,
    `tipo` VARCHAR(30) NOT NULL,
    `valor` DECIMAL(12, 2) NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'pendente',
    `data_solicitacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_processamento` DATETIME(3) NULL,
    `descricao` TEXT NULL,
    `chave_pix` VARCHAR(255) NULL,
    `banco_agencia` VARCHAR(50) NULL,
    `banco_conta` VARCHAR(50) NULL,
    `tipo_conta` VARCHAR(30) NULL,
    `metodo_pagamento` VARCHAR(30) NULL,
    `comprovante_url` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dados_bancarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `chave_pix` VARCHAR(255) NULL,
    `banco_nome` VARCHAR(100) NULL,
    `banco_codigo` VARCHAR(10) NULL,
    `agencia` VARCHAR(20) NULL,
    `conta` VARCHAR(20) NULL,
    `tipo_conta` VARCHAR(30) NULL,
    `titular_nome` VARCHAR(255) NULL,
    `cpf_cnpj` VARCHAR(20) NULL,
    `verificado` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `dados_bancarios_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_patrocinador_id_fkey` FOREIGN KEY (`patrocinador_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio_media` ADD CONSTRAINT `portfolio_media_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio_media` ADD CONSTRAINT `portfolio_media_album_id_fkey` FOREIGN KEY (`album_id`) REFERENCES `portfolio_albums`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio_albums` ADD CONSTRAINT `portfolio_albums_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicos` ADD CONSTRAINT `servicos_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicos` ADD CONSTRAINT `servicos_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_prestador_id_fkey` FOREIGN KEY (`prestador_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_servico_id_fkey` FOREIGN KEY (`servico_id`) REFERENCES `servicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitacoes` ADD CONSTRAINT `solicitacoes_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitacoes` ADD CONSTRAINT `solicitacoes_servico_id_fkey` FOREIGN KEY (`servico_id`) REFERENCES `servicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orcamentos` ADD CONSTRAINT `orcamentos_solicitacao_id_fkey` FOREIGN KEY (`solicitacao_id`) REFERENCES `solicitacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orcamentos` ADD CONSTRAINT `orcamentos_prestador_id_fkey` FOREIGN KEY (`prestador_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensagens` ADD CONSTRAINT `mensagens_remetente_id_fkey` FOREIGN KEY (`remetente_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensagens` ADD CONSTRAINT `mensagens_destinatario_id_fkey` FOREIGN KEY (`destinatario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacoes` ADD CONSTRAINT `notificacoes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamentos` ADD CONSTRAINT `agendamentos_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamentos` ADD CONSTRAINT `agendamentos_prestador_id_fkey` FOREIGN KEY (`prestador_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendamentos` ADD CONSTRAINT `agendamentos_servico_id_fkey` FOREIGN KEY (`servico_id`) REFERENCES `servicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carteiras` ADD CONSTRAINT `carteiras_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacoes` ADD CONSTRAINT `transacoes_carteira_id_fkey` FOREIGN KEY (`carteira_id`) REFERENCES `carteiras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacoes` ADD CONSTRAINT `transacoes_agendamento_id_fkey` FOREIGN KEY (`agendamento_id`) REFERENCES `agendamentos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dados_bancarios` ADD CONSTRAINT `dados_bancarios_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
