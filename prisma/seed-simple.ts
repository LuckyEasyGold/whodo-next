import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Semeando banco de dados...')

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

    // Criar portfólios e mídia
    console.log('Criando portfólios e portfólios...')
    
    // Portfólio 1 - Carlos
    const album1Carlos = await prisma.portfolioAlbum.create({
      data: {
        usuario_id: carlos.id,
        nome: 'Reparos de Encanamento Residencial',
        descricao: 'Galeria de projetos de reparos completos em encanamento residencial. Inclui desentupimentos, trocas de tubulação e instalação de novos equipamentos.',
        capa_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop',
      },
    })

    // Imagens do portfólio 1 - Carlos
    await Promise.all([
      prisma.portfolioMedia.create({
        data: {
          usuario_id: carlos.id,
          album_id: album1Carlos.id,
          url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Instalação de cano de cobre em cozinha com acabamento profissional',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: carlos.id,
          album_id: album1Carlos.id,
          url: 'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Reparo de vazamento em tubulação antiga com substituição por PVC moderno',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: carlos.id,
          album_id: album1Carlos.id,
          url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Instalação completa de banheiro com chuveiro, torneira e acessórios',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: carlos.id,
          album_id: album1Carlos.id,
          url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Desentupimento de cano profundo com equipamento especializado',
        },
      }),
    ])

    // Portfólio 2 - Carlos
    const album2Carlos = await prisma.portfolioAlbum.create({
      data: {
        usuario_id: carlos.id,
        nome: 'Instalações de Sistemas Hidráulicos',
        descricao: 'Projetos de sistemas hidráulicos completos para residências e pequenos comércios. Includes distribuição de água, aquecimento e drenagem.',
        capa_url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&h=400&fit=crop',
      },
    })

    // Imagens do portfólio 2 - Carlos
    await Promise.all([
      prisma.portfolioMedia.create({
        data: {
          usuario_id: carlos.id,
          album_id: album2Carlos.id,
          url: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Sistema de aquecimento de água instantâneo instalado e funcionando',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: carlos.id,
          album_id: album2Carlos.id,
          url: 'https://images.unsplash.com/photo-1578500040211-cd5982105016?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Rede de tubulação de água com isolamento térmico em área externa',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: carlos.id,
          album_id: album2Carlos.id,
          url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Sistema de drenagem de piscina com filtro e bomba instalados',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: carlos.id,
          album_id: album2Carlos.id,
          url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Ponto de saída de água quente em cozinha com válvula de controle',
        },
      }),
    ])

    // Portfólio 1 - Ana
    const album1Ana = await prisma.portfolioAlbum.create({
      data: {
        usuario_id: ana.id,
        nome: 'Instalações Elétricas Residenciais',
        descricao: 'Projetos de adequação e atualização de sistemas elétricos em residências. Certificado NR10, com cálculos de carga e distribuição profissional.',
        capa_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
      },
    })

    // Imagens do portfólio 1 - Ana
    await Promise.all([
      prisma.portfolioMedia.create({
        data: {
          usuario_id: ana.id,
          album_id: album1Ana.id,
          url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Painel elétrico moderno com disjuntores bipolares e DPS',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: ana.id,
          album_id: album1Ana.id,
          url: 'https://images.unsplash.com/photo-1581077282552-8fcb1865a756?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Fiação de energia com canaleta de proteção passando por escritório',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: ana.id,
          album_id: album1Ana.id,
          url: 'https://images.unsplash.com/photo-1581076288629-fc50b2c6ad1f?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Instalação de luminárias LED com sensor de movimento em corredor',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: ana.id,
          album_id: album1Ana.id,
          url: 'https://images.unsplash.com/photo-1581077282553-8d5d604b1a36?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Tomadas e interruptores em acabamento branco com localização ergonômica',
        },
      }),
    ])

    // Portfólio 2 - Ana
    const album2Ana = await prisma.portfolioAlbum.create({
      data: {
        usuario_id: ana.id,
        nome: 'Manutenção de Circuitos Elétricos',
        descricao: 'Serviços de manutenção preventiva e corretiva em circuitos elétricos. Testes de continuidade, isolação e segurança em conformidade com normas.',
        capa_url: 'https://images.unsplash.com/photo-1581077286945-8f63e324b1a0?w=600&h=400&fit=crop',
      },
    })

    // Imagens do portfólio 2 - Ana
    await Promise.all([
      prisma.portfolioMedia.create({
        data: {
          usuario_id: ana.id,
          album_id: album2Ana.id,
          url: 'https://images.unsplash.com/photo-1581077286945-8f63e324b1a0?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Teste de isolação em fios usando multímetro digital',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: ana.id,
          album_id: album2Ana.id,
          url: 'https://images.unsplash.com/photo-1621905251919-48416bd8575a?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Substituição de condutor queimado em circuito de cozinha',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: ana.id,
          album_id: album2Ana.id,
          url: 'https://images.unsplash.com/photo-1581077282552-8fcb1865a756?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Instalação de diferencial residual para proteção contra choques',
        },
      }),
      prisma.portfolioMedia.create({
        data: {
          usuario_id: ana.id,
          album_id: album2Ana.id,
          url: 'https://images.unsplash.com/photo-1581076288629-fc50b2c6ad1f?w=600&h=400&fit=crop',
          tipo: 'imagem',
          descricao: 'Aferição de voltagem em painel elétrico com equipamento certificado',
        },
      }),
    ])

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
