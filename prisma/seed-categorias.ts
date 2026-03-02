import { prisma } from '../src/lib/prisma'

const novasCategorias = [
  {
    nome: 'Consultoria Empresarial',
    descricao: 'Consultores especializados em estratégia e gestão empresarial',
    icone: '💼',
  },
  {
    nome: 'Aulas de Idiomas',
    descricao: 'Professores de inglês, espanhol, francês e outros idiomas',
    icone: '🌍',
  },
  {
    nome: 'Reparo de Eletrônicos',
    descricao: 'Técnicos especializados em conserto de celulares e eletrônicos',
    icone: '📱',
  },
  {
    nome: 'Limpeza de Piscina',
    descricao: 'Serviços profissionais de manutenção e limpeza de piscinas',
    icone: '🏊',
  },
  {
    nome: 'Aulas de Música',
    descricao: 'Professores de violão, piano, bateria e outros instrumentos',
    icone: '🎵',
  },
  {
    nome: 'Decoração de Interiores',
    descricao: 'Decoradores e consultores de design de interiores',
    icone: '🏠',
  },
  {
    nome: 'Serviços de Entrega',
    descricao: 'Profissionais para entrega e logística local',
    icone: '🚚',
  },
  {
    nome: 'Consultoria de Moda',
    descricao: 'Consultores de estilo e moda para eventos e dia a dia',
    icone: '👗',
  },
  {
    nome: 'Reparo de Móveis',
    descricao: 'Restauração e reparo profissional de móveis',
    icone: '🛋️',
  },
  {
    nome: 'Aulas de Culinária',
    descricao: 'Aulas de cozinha e técnicas culinárias profissionais',
    icone: '👨‍🍳',
  },
]

async function seedCategorias() {
  try {
    console.log('🌱 Iniciando seed de categorias...')

    for (const categoria of novasCategorias) {
      const existe = await prisma.categoria.findFirst({
        where: { nome: categoria.nome },
      })

      if (!existe) {
        await prisma.categoria.create({
          data: categoria,
        })
        console.log(`✅ Categoria criada: ${categoria.nome}`)
      } else {
        console.log(`⏭️  Categoria já existe: ${categoria.nome}`)
      }
    }

    // Get all categories
    const totalCategorias = await prisma.categoria.count()
    console.log(`\n✅ Seed de categorias completo!`)
    console.log(`📊 Total de categorias no banco: ${totalCategorias}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao fazer seed de categorias:', error)
    process.exit(1)
  }
}

seedCategorias()
