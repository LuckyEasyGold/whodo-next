const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTables() {
    try {
        console.log('=== CONTAGEM DE REGISTROS POR TABELA (Banco Neon) ===\n');

        // Usando os modelos do Prisma diretamente
        const results = [];

        try {
            const usuarios = await prisma.usuario.count();
            results.push({ table: 'usuarios', count: usuarios });
        } catch (e) { results.push({ table: 'usuarios', error: e.message }); }

        try {
            const portfolio_media = await prisma.portfolioMedia.count();
            results.push({ table: 'portfolio_media', count: portfolio_media });
        } catch (e) { results.push({ table: 'portfolio_media', error: e.message }); }

        try {
            const portfolio_albums = await prisma.portfolioAlbum.count();
            results.push({ table: 'portfolio_albums', count: portfolio_albums });
        } catch (e) { results.push({ table: 'portfolio_albums', error: e.message }); }

        try {
            const categorias = await prisma.categoria.count();
            results.push({ table: 'categorias', count: categorias });
        } catch (e) { results.push({ table: 'categorias', error: e.message }); }

        try {
            const servicos = await prisma.servico.count();
            results.push({ table: 'servicos', count: servicos });
        } catch (e) { results.push({ table: 'servicos', error: e.message }); }

        try {
            const avaliacoes = await prisma.avaliacao.count();
            results.push({ table: 'avaliacoes', count: avaliacoes });
        } catch (e) { results.push({ table: 'avaliacoes', error: e.message }); }

        try {
            const solicitacoes = await prisma.solicitacao.count();
            results.push({ table: 'solicitacoes', count: solicitacoes });
        } catch (e) { results.push({ table: 'solicitacoes', error: e.message }); }

        try {
            const orcamentos = await prisma.orcamento.count();
            results.push({ table: 'orcamentos', count: orcamentos });
        } catch (e) { results.push({ table: 'orcamentos', error: e.message }); }

        try {
            const mensagens = await prisma.mensagem.count();
            results.push({ table: 'mensagens', count: mensagens });
        } catch (e) { results.push({ table: 'mensagens', error: e.message }); }

        try {
            const notificacoes = await prisma.notificacao.count();
            results.push({ table: 'notificacoes', count: notificacoes });
        } catch (e) { results.push({ table: 'notificacoes', error: e.message }); }

        try {
            const agendamentos = await prisma.agendamento.count();
            results.push({ table: 'agendamentos', count: agendamentos });
        } catch (e) { results.push({ table: 'agendamentos', error: e.message }); }

        try {
            const historico_agendamentos = await prisma.historicoAgendamento.count();
            results.push({ table: 'historico_agendamentos', count: historico_agendamentos });
        } catch (e) { results.push({ table: 'historico_agendamentos', error: e.message }); }

        try {
            const carteiras = await prisma.carteira.count();
            results.push({ table: 'carteiras', count: carteiras });
        } catch (e) { results.push({ table: 'carteiras', error: e.message }); }

        try {
            const transacoes = await prisma.transacao.count();
            results.push({ table: 'transacoes', count: transacoes });
        } catch (e) { results.push({ table: 'transacoes', error: e.message }); }

        try {
            const dados_bancarios = await prisma.dadosBancarios.count();
            results.push({ table: 'dados_bancarios', count: dados_bancarios });
        } catch (e) { results.push({ table: 'dados_bancarios', error: e.message }); }

        try {
            const accounts = await prisma.account.count();
            results.push({ table: 'accounts', count: accounts });
        } catch (e) { results.push({ table: 'accounts', error: e.message }); }

        try {
            const sessions = await prisma.session.count();
            results.push({ table: 'sessions', count: sessions });
        } catch (e) { results.push({ table: 'sessions', error: e.message }); }

        try {
            const verification_tokens = await prisma.verificationToken.count();
            results.push({ table: 'verification_tokens', count: verification_tokens });
        } catch (e) { results.push({ table: 'verification_tokens', error: e.message }); }

        try {
            const seguidores = await prisma.seguidor.count();
            results.push({ table: 'seguidores', count: seguidores });
        } catch (e) { results.push({ table: 'seguidores', error: e.message }); }

        try {
            const portfolio_comentarios = await prisma.portfolioComentario.count();
            results.push({ table: 'portfolio_comentarios', count: portfolio_comentarios });
        } catch (e) { results.push({ table: 'portfolio_comentarios', error: e.message }); }

        try {
            const postagens = await prisma.postagem.count();
            results.push({ table: 'postagens', count: postagens });
        } catch (e) { results.push({ table: 'postagens', error: e.message }); }

        try {
            const postagem_curtidas = await prisma.postagemCurtida.count();
            results.push({ table: 'postagem_curtidas', count: postagem_curtidas });
        } catch (e) { results.push({ table: 'postagem_curtidas', error: e.message }); }

        try {
            const postagem_comentarios = await prisma.postagemComentario.count();
            results.push({ table: 'postagem_comentarios', count: postagem_comentarios });
        } catch (e) { results.push({ table: 'postagem_comentarios', error: e.message }); }

        try {
            const postagem_compartilhamentos = await prisma.postagemCompartilhamento.count();
            results.push({ table: 'postagem_compartilhamentos', count: postagem_compartilhamentos });
        } catch (e) { results.push({ table: 'postagem_compartilhamentos', error: e.message }); }

        try {
            const postagens_salvas = await prisma.postagemSalva.count();
            results.push({ table: 'postagens_salvas', count: postagens_salvas });
        } catch (e) { results.push({ table: 'postagens_salvas', error: e.message }); }

        // Exibir resultados
        console.log('| Tabela | Registros |');
        console.log('|--------|-----------|');
        for (const r of results) {
            if (r.error) {
                console.log(`| ${r.table} | ERRO |`);
            } else {
                console.log(`| ${r.table} | ${r.count} |`);
            }
        }

        console.log('\n=== RESUMO ===');
        const withData = results.filter(r => !r.error && r.count > 0).length;
        const empty = results.filter(r => !r.error && r.count === 0).length;
        const errors = results.filter(r => r.error).length;
        console.log(`Tabelas com dados: ${withData}`);
        console.log(`Tabelas vazias: ${empty}`);
        console.log(`Erros: ${errors}`);

    } catch (error) {
        console.error('Erro geral:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTables();
