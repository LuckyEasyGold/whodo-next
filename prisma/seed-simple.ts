import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Seeding database...')

    // Limpar
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0')
    console.log('Limpando tabelas...')
    
    await prisma.notificacao.deleteMany().catch(() => {})
    await prisma.transacao.deleteMany().catch(() => {})
    await prisma.dadosBancarios.deleteMany().catch(() => {})
    await prisma.carteira.deleteMany().catch(() => {})
    await prisma.agendamento.deleteMany().catch(() => {})
    await prisma.mensagem.deleteMany().catch(() => {})
    await prisma.orcamento.deleteMany().catch(() => {})
    await prisma.solicitacao.deleteMany().catch(() => {})
    await prisma.avaliacao.deleteMany().catch(() => {})
    await prisma.portfolioMedia.deleteMany().catch(() => {})
    await prisma.portfolioAlbum.deleteMany().catch(() => {})
    await prisma.servico.deleteMany().catch(() => {})
    await prisma.categoria.deleteMany().catch(() => {})
    await prisma.usuario.deleteMany().catch(() => {})

    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1')

    // Categorias
    console.log('Criando categorias...')
    const categorias = await Promise.all([
      prisma.categoria.create({
        data: {
          nome: 'Encanador',
          descricao: 'Serviços de encanamento',
          icone: 'fa-wrench',
          imagem: 'https://via.placeholder.com/200?text=Encanador',
        },
      }),
      prisma.categoria.create({
        data: {
          nome: 'Eletricista',
          descricao: 'Serviços elétricos',
          icone: 'fa-bolt',
          imagem: 'https://via.placeholder.com/200?text=Eletricista',
        },
      }),
      prisma.categoria.create({
        data: {
          nome: 'Pintor',
          descricao: 'Serviços de pintura',
          icone: 'fa-paint-roller',
          imagem: 'https://via.placeholder.com/200?text=Pintor',
        },
      }),
      prisma.categoria.create({
        data: {
          nome: 'Diarista',
          descricao: 'Limpeza e organização',
          icone: 'fa-broom',
          imagem: 'https://via.placeholder.com/200?text=Diarista',
        },
      }),
    ])

    const senhaHash = await bcrypt.hash('123456', 10)

    // Criar prestadores
    console.log('Criando prestadores...')
    const carlos = await prisma.usuario.create({
      data: {
        nome: 'Carlos Oliveira',
        email: 'carlos@whodo.com',
        senha: senhaHash,
        telefone: '(43) 99999-1001',
        tipo: 'usuario',
        cidade: 'Palmas',
        estado: 'PR',
        especialidade: 'Encanador',
        sobre: '10 anos de experiência',
        avaliacao_media: 4.8,
        verificado: true,
        email_verificado: true,
        status: 'ativo',
      },
    })

    const ana = await prisma.usuario.create({
      data: {
        nome: 'Ana Santos',
        email: 'ana@whodo.com',
        senha: senhaHash,
        telefone: '(43) 99999-1002',
        tipo: 'usuario',
        cidade: 'Palmas',
        estado: 'PR',
        especialidade: 'Eletricista',
        sobre: 'Técnica certificada NR10',
        avaliacao_media: 4.9,
        verificado: true,
        email_verificado: true,
        status: 'ativo',
      },
    })

    // Criar clientes
    console.log('Criando clientes...')
    const cliente1 = await prisma.usuario.create({
      data: {
        nome: 'João Cliente',
        email: 'joao@cliente.com',
        senha: senhaHash,
        telefone: '(43) 99888-8881',
        tipo: 'usuario',
        cidade: 'Palmas',
        estado: 'PR',
        email_verificado: true,
        status: 'ativo',
      },
    })

    // Criar carteiras
    console.log('Criando carteiras...')
    await prisma.carteira.create({
      data: {
        usuario_id: carlos.id,
        saldo: 5000,
        saldo_pendente: 1500,
        total_ganho: 15000,
      },
    })

    await prisma.carteira.create({
      data: {
        usuario_id: ana.id,
        saldo: 8000,
        saldo_pendente: 2000,
        total_ganho: 25000,
      },
    })

    await prisma.carteira.create({
      data: {
        usuario_id: cliente1.id,
        saldo: 2000,
        total_ganho: 0,
        total_gasto: 0,
      },
    })

    // Criar serviços
    console.log('Criando serviços...')
    const servico1 = await prisma.servico.create({
      data: {
        usuario_id: carlos.id,
        categoria_id: categorias[0].id,
        titulo: 'Reparo de Cano Entupido',
        descricao: 'Serviço rápido de desentupimento',
        preco_base: 150.0,
        status: 'ativo',
      },
    })

    const servico2 = await prisma.servico.create({
      data: {
        usuario_id: carlos.id,
        categoria_id: categorias[0].id,
        titulo: 'Instalação de Chuveiro',
        descricao: 'Instalação profissional de chuveiro',
        preco_base: 250.0,
        status: 'ativo',
      },
    })

    const servico3 = await prisma.servico.create({
      data: {
        usuario_id: ana.id,
        categoria_id: categorias[1].id,
        titulo: 'Manutenção Elétrica',
        descricao: 'Inspeção e manutenção de circuitos',
        preco_base: 300.0,
        status: 'ativo',
      },
    })

    // Criar agendamentos
    console.log('Criando agendamentos...')
    const now = new Date()
    await prisma.agendamento.create({
      data: {
        cliente_id: cliente1.id,
        prestador_id: carlos.id,
        servico_id: servico1.id,
        data_agendamento: new Date(now.getTime() + 86400000), // amanhã
        valor_total: 150.0,
        status: 'pendente',
      },
    })

    await prisma.agendamento.create({
      data: {
        cliente_id: cliente1.id,
        prestador_id: carlos.id,
        servico_id: servico2.id,
        data_agendamento: new Date(now.getTime() + 172800000), // 2 dias
        valor_total: 250.0,
        status: 'confirmado',
      },
    })

    await prisma.agendamento.create({
      data: {
        cliente_id: cliente1.id,
        prestador_id: ana.id,
        servico_id: servico3.id,
        data_agendamento: new Date(now.getTime() - 86400000), // ontem
        valor_total: 300.0,
        status: 'concluido',
        data_conclusao: new Date(),
      },
    })

    // Criar dados bancários
    console.log('Criando dados bancários...')
    await prisma.dadosBancarios.create({
      data: {
        usuario_id: carlos.id,
        chave_pix: 'carlos@whodo.com',
        banco_nome: 'Banco do Brasil',
        agencia: '1234',
        conta: '567890',
        verificado: true,
      },
    })

    await prisma.dadosBancarios.create({
      data: {
        usuario_id: ana.id,
        chave_pix: '12345678901234',
        banco_nome: 'Caixa',
        agencia: '5678',
        conta: '123456',
        verificado: true,
      },
    })

    // Criar avaliações
    console.log('Criando avaliações...')
    await prisma.avaliacao.create({
      data: {
        cliente_id: cliente1.id,
        prestador_id: carlos.id,
        servico_id: servico1.id,
        nota: 5,
        comentario: 'Excelente trabalho!',
      },
    })

    console.log('✅ Seed completo!')
    console.log('📧 Teste com:')
    console.log('   Email: carlos@whodo.com')
    console.log('   Senha: 123456')
  } catch (error) {
    console.error('❌ Erro durante seed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
