import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed...')

    // Limpar dados existentes (ordem importa por FKs)
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0')
    await prisma.notificacao.deleteMany()
    await prisma.mensagem.deleteMany()
    await prisma.orcamento.deleteMany()
    await prisma.solicitacao.deleteMany()
    await prisma.avaliacao.deleteMany()
    await prisma.servico.deleteMany()
    await prisma.prestador.deleteMany()
    await prisma.cliente.deleteMany()
    await prisma.categoria.deleteMany()
    await prisma.usuario.deleteMany()
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1')

    // Categorias
    const categorias = await Promise.all([
        prisma.categoria.create({ data: { nome: 'Encanador', descricao: 'Serviços de encanamento e hidráulica', icone: 'fa-wrench', imagem: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Eletricista', descricao: 'Instalações e reparos elétricos', icone: 'fa-bolt', imagem: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Pintor', descricao: 'Pintura residencial e comercial', icone: 'fa-paint-roller', imagem: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Diarista', descricao: 'Limpeza e organização de ambientes', icone: 'fa-broom', imagem: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Marceneiro', descricao: 'Móveis sob medida e reparos', icone: 'fa-hammer', imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Jardineiro', descricao: 'Paisagismo e manutenção de jardins', icone: 'fa-leaf', imagem: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Fotógrafo', descricao: 'Fotografia profissional para eventos', icone: 'fa-camera', imagem: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Personal Trainer', descricao: 'Treinamento físico personalizado', icone: 'fa-dumbbell', imagem: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Pedreiro', descricao: 'Construção e reformas', icone: 'fa-hard-hat', imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' } }),
        prisma.categoria.create({ data: { nome: 'Designer Gráfico', descricao: 'Design de logos, banners e materiais visuais', icone: 'fa-palette', imagem: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400' } }),
    ])

    const senhaHash = await bcrypt.hash('123456', 10)

    // Prestadores
    const prestadores = await Promise.all([
        prisma.usuario.create({
            data: {
                nome: 'Carlos Oliveira', email: 'carlos@whodo.com', senha: senhaHash, telefone: '(43) 99999-1001',
                tipo: 'prestador', cidade: 'Palmas', estado: 'PR', latitude: -26.484, longitude: -51.990,
                foto_perfil: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'ativo', email_verificado: true,
                prestador: { create: { especialidade: 'Encanador Residencial', sobre: 'Mais de 10 anos de experiência em encanamento residencial e industrial. Trabalho com instalação e manutenção.', avaliacao_media: 4.8, verificado: true, disponibilidade: 'Seg-Sex 8h-18h' } }
            }
        }),
        prisma.usuario.create({
            data: {
                nome: 'Ana Santos', email: 'ana@whodo.com', senha: senhaHash, telefone: '(43) 99999-1002',
                tipo: 'prestador', cidade: 'Palmas', estado: 'PR', latitude: -26.486, longitude: -51.988,
                foto_perfil: 'https://randomuser.me/api/portraits/women/44.jpg', status: 'ativo', email_verificado: true,
                prestador: { create: { especialidade: 'Eletricista Industrial', sobre: 'Técnica em eletrotécnica com certificação NR10. Atendo residências e empresas.', avaliacao_media: 4.9, verificado: true, disponibilidade: 'Seg-Sáb 7h-17h' } }
            }
        }),
        prisma.usuario.create({
            data: {
                nome: 'Roberto Lima', email: 'roberto@whodo.com', senha: senhaHash, telefone: '(43) 99999-1003',
                tipo: 'prestador', cidade: 'Guarapuava', estado: 'PR', latitude: -25.39, longitude: -51.456,
                foto_perfil: 'https://randomuser.me/api/portraits/men/55.jpg', status: 'ativo', email_verificado: true,
                prestador: { create: { especialidade: 'Pintor de Interiores', sobre: 'Especialista em pintura decorativa, textura e efeitos especiais. Trabalho limpo e pontual.', avaliacao_media: 4.6, verificado: true, disponibilidade: 'Seg-Sex 8h-17h' } }
            }
        }),
        prisma.usuario.create({
            data: {
                nome: 'Juliana Ferreira', email: 'juliana@whodo.com', senha: senhaHash, telefone: '(43) 99999-1004',
                tipo: 'prestador', cidade: 'Palmas', estado: 'PR', latitude: -26.482, longitude: -51.992,
                foto_perfil: 'https://randomuser.me/api/portraits/women/65.jpg', status: 'ativo', email_verificado: true,
                prestador: { create: { especialidade: 'Diarista Profissional', sobre: 'Serviço de limpeza completo com produtos de qualidade. Pontual e organizada.', avaliacao_media: 4.7, verificado: false, disponibilidade: 'Seg-Sex 8h-16h' } }
            }
        }),
        prisma.usuario.create({
            data: {
                nome: 'Marcos Silva', email: 'marcos@whodo.com', senha: senhaHash, telefone: '(43) 99999-1005',
                tipo: 'prestador', cidade: 'Guarapuava', estado: 'PR', latitude: -25.388, longitude: -51.458,
                foto_perfil: 'https://randomuser.me/api/portraits/men/75.jpg', status: 'ativo', email_verificado: true,
                prestador: { create: { especialidade: 'Marceneiro e Carpinteiro', sobre: 'Fabricação de móveis sob medida, restauração e reparos. Madeira de qualidade garantida.', avaliacao_media: 4.5, verificado: true, disponibilidade: 'Seg-Sex 8h-18h, Sáb 8h-12h' } }
            }
        }),
        prisma.usuario.create({
            data: {
                nome: 'Fernanda Costa', email: 'fernanda@whodo.com', senha: senhaHash, telefone: '(43) 99999-1006',
                tipo: 'prestador', cidade: 'Palmas', estado: 'PR', latitude: -26.488, longitude: -51.985,
                foto_perfil: 'https://randomuser.me/api/portraits/women/33.jpg', status: 'ativo', email_verificado: true,
                prestador: { create: { especialidade: 'Fotógrafa de Eventos', sobre: 'Casamentos, aniversários e ensaios fotográficos. Equipamento profissional Canon.', avaliacao_media: 4.9, verificado: true, disponibilidade: 'Todos os dias sob agendamento' } }
            }
        }),
    ])

    // Cliente de teste
    const cliente = await prisma.usuario.create({
        data: {
            nome: 'Vinicius Ramos', email: 'vinicius@whodo.com', senha: senhaHash, telefone: '(43) 99999-2001',
            tipo: 'cliente', cidade: 'Palmas', estado: 'PR', latitude: -26.485, longitude: -51.991,
            foto_perfil: 'https://randomuser.me/api/portraits/men/22.jpg', status: 'ativo', email_verificado: true,
            cliente: { create: {} }
        }
    })

    // Serviços
    const servicos = await Promise.all([
        prisma.servico.create({ data: { usuario_id: prestadores[0].id, categoria_id: categorias[0].id, titulo: 'Instalação de Torneira', descricao: 'Instalação completa de torneiras e misturadores em pias e lavatórios.', preco_base: 80, unidade_medida: 'por unidade', destaque: true } }),
        prisma.servico.create({ data: { usuario_id: prestadores[0].id, categoria_id: categorias[0].id, titulo: 'Desentupimento de Pia', descricao: 'Desentupimento profissional com equipamento especializado. Sem quebrar pisos.', preco_base: 120, unidade_medida: 'por serviço' } }),
        prisma.servico.create({ data: { usuario_id: prestadores[1].id, categoria_id: categorias[1].id, titulo: 'Instalação de Tomadas', descricao: 'Instalação de tomadas simples e especiais (ar-condicionado, chuveiro).', preco_base: 60, unidade_medida: 'por ponto', destaque: true } }),
        prisma.servico.create({ data: { usuario_id: prestadores[1].id, categoria_id: categorias[1].id, titulo: 'Troca de Disjuntores', descricao: 'Substituição de disjuntores e balanceamento do quadro elétrico.', preco_base: 150, unidade_medida: 'por quadro' } }),
        prisma.servico.create({ data: { usuario_id: prestadores[2].id, categoria_id: categorias[2].id, titulo: 'Pintura de Quarto', descricao: 'Pintura completa de quarto incluindo teto. Inclui massa corrida.', preco_base: 350, unidade_medida: 'por cômodo', destaque: true } }),
        prisma.servico.create({ data: { usuario_id: prestadores[3].id, categoria_id: categorias[3].id, titulo: 'Faxina Completa', descricao: 'Limpeza completa do imóvel incluindo vidros, banheiros e cozinha.', preco_base: 180, unidade_medida: 'por diária', destaque: true } }),
        prisma.servico.create({ data: { usuario_id: prestadores[4].id, categoria_id: categorias[4].id, titulo: 'Móvel Sob Medida', descricao: 'Projeto e fabricação de móveis personalizados em MDF ou madeira maciça.', preco_base: 800, unidade_medida: 'a partir de' } }),
        prisma.servico.create({ data: { usuario_id: prestadores[5].id, categoria_id: categorias[6].id, titulo: 'Ensaio Fotográfico', descricao: 'Ensaio fotográfico externo ou em estúdio com 50 fotos editadas.', preco_base: 250, unidade_medida: 'por sessão', destaque: true } }),
    ])

    // Avaliações
    await Promise.all([
        prisma.avaliacao.create({ data: { cliente_id: cliente.id, prestador_id: prestadores[0].id, servico_id: servicos[0].id, nota: 5.0, comentario: 'Excelente profissional! Chegou no horário e fez um trabalho impecável. Super recomendo!' } }),
        prisma.avaliacao.create({ data: { cliente_id: cliente.id, prestador_id: prestadores[0].id, servico_id: servicos[1].id, nota: 4.5, comentario: 'Resolveu o problema rapidamente. Preço justo e trabalho de qualidade.' } }),
        prisma.avaliacao.create({ data: { cliente_id: cliente.id, prestador_id: prestadores[1].id, servico_id: servicos[2].id, nota: 5.0, comentario: 'Ana é muito profissional e detalhista. Instalação perfeita!' } }),
        prisma.avaliacao.create({ data: { cliente_id: cliente.id, prestador_id: prestadores[2].id, servico_id: servicos[4].id, nota: 4.5, comentario: 'Pintura ficou linda! Roberto é muito cuidadoso com os acabamentos.' } }),
        prisma.avaliacao.create({ data: { cliente_id: cliente.id, prestador_id: prestadores[3].id, servico_id: servicos[5].id, nota: 5.0, comentario: 'Casa ficou brilhando! Juliana é muito organizada e eficiente.' } }),
        prisma.avaliacao.create({ data: { cliente_id: cliente.id, prestador_id: prestadores[5].id, servico_id: servicos[7].id, nota: 5.0, comentario: 'Fotos maravilhosas! Fernanda tem um olhar incrível para composição.' } }),
    ])

    // Notificações
    await Promise.all([
        prisma.notificacao.create({ data: { usuario_id: cliente.id, tipo: 'sistema', titulo: 'Bem-vindo ao WhoDo!', mensagem: 'Sua conta foi criada com sucesso. Explore profissionais próximos de você!' } }),
        prisma.notificacao.create({ data: { usuario_id: prestadores[0].id, tipo: 'servico', titulo: 'Nova solicitação de serviço', mensagem: 'Você recebeu uma nova solicitação de orçamento para Instalação de Torneira.' } }),
    ])

    console.log('✅ Seed concluído!')
    console.log(`   📁 ${categorias.length} categorias`)
    console.log(`   👷 ${prestadores.length} prestadores`)
    console.log(`   👤 1 cliente de teste`)
    console.log(`   🔧 ${servicos.length} serviços`)
    console.log(`   ⭐ 6 avaliações`)
    console.log(`   🔔 2 notificações`)
    console.log('')
    console.log('   Login de teste: vinicius@whodo.com / 123456')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
