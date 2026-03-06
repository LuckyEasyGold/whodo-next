/**
 * Script para importar os 30 profissionais gerados pelo whodo-populator
 * Usa o Prisma para buscar IDs reais das categorias antes de inserir
 * Execute com: npx tsx prisma/importar-profissionais.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SENHAPADRAO = 'whodo123'

// Dados gerados pelo whodo-populator (demo_sem_api)
const profissionais = [
    { nome: 'Fernanda Lima Diárias', email: 'fernandalimadiarias1@whodo.temp', telefone: '(46) 94444-6666', especialidade: 'Diarista', sobre: 'Limpeza residencial e comercial, organização de ambientes, lavagem de roupas e passadoria. Referências disponíveis.', avaliacao: 4.8, disponibilidade: 'Seg-Sáb: 7h às 17h', endereco: 'Rua Rio Grande do Sul, 987 - Jardim Europa', cidade: 'Palmas', estado: 'PR', lat: -26.483, lng: -51.993, instagram: 'lima_limpeza_pr', foto: 'https://randomuser.me/api/portraits/women/52.jpg', categoria: 'Diarista' },
    { nome: 'Maria Oliveira Encanamentos', email: 'mariaoliveiraencanamentos2@whodo.temp', telefone: '(46) 98888-2222', especialidade: 'Encanador', sobre: 'Serviços de encanamento, desentupimento, instalação de aquecedores e reparos em geral. Garantia de 90 dias em todos os serviços.', avaliacao: 4.9, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Av. Brasil, 456 - Jardim América', cidade: 'Palmas', estado: 'PR', lat: -26.486, lng: -51.9885, instagram: 'oliveira_hidraulica', website: 'https://oliveirahidraulica.com.br', foto: 'https://randomuser.me/api/portraits/women/44.jpg', categoria: 'Encanador' },
    { nome: 'Letícia Cardoso Pedreiro', email: 'leticiacardosopedreiro3@whodo.temp', telefone: '(46) 97159-3874', especialidade: 'Pedreiro', sobre: 'Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.7, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Rua Santa Catarina, 641 - Jardim Europa', cidade: 'Palmas', estado: 'PR', lat: -26.479619, lng: -51.985763, instagram: 'leticia_pedreiro_pr', foto: 'https://randomuser.me/api/portraits/women/22.jpg', categoria: 'Pedreiro' },
    { nome: 'Roberto Silva Eletricista', email: 'robertosilvaeletricista4@whodo.temp', telefone: '(46) 95101-7871', especialidade: 'Eletricista', sobre: 'Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.8, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Rua das Flores, 993 - Centro', cidade: 'Palmas', estado: 'PR', lat: -26.490024, lng: -51.983505, instagram: 'roberto_eletricista_pr', foto: 'https://randomuser.me/api/portraits/men/48.jpg', categoria: 'Eletricista' },
    { nome: 'Bruno Alves Personal', email: 'brunoalvespersonal5@whodo.temp', telefone: '(46) 91111-9999', especialidade: 'Personal Trainer', sobre: 'Treinamento personalizado, emagrecimento, hipertrofia, preparação física. Atendo em academias ou domicílio.', avaliacao: 4.8, disponibilidade: 'Seg-Sáb: 6h às 21h', endereco: 'Rua Goiás, 369 - Vila Operária', cidade: 'Palmas', estado: 'PR', lat: -26.4895, lng: -51.9855, instagram: 'alves_fitness', foto: 'https://randomuser.me/api/portraits/men/73.jpg', categoria: 'Personal Trainer' },
    { nome: 'Rafael Dias Pintor', email: 'rafaeldiaspintor6@whodo.temp', telefone: '(46) 92004-6303', especialidade: 'Pintor', sobre: 'Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 5.0, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Rua Goiás, 826 - Industrial', cidade: 'Palmas', estado: 'PR', lat: -26.48266, lng: -51.98995, instagram: 'rafael_pintor_pr', foto: 'https://randomuser.me/api/portraits/men/5.jpg', categoria: 'Pintor' },
    { nome: 'Patrícia Rocha Beleza', email: 'patriciarochabeleza7@whodo.temp', telefone: '(46) 90000-0000', especialidade: 'Cabeleireiro', sobre: 'Cortes femininos e masculinos, coloração, mechas, tratamentos capilares e penteados para eventos.', avaliacao: 4.7, disponibilidade: 'Ter-Sáb: 9h às 19h', endereco: 'Av. Mato Grosso, 741 - Centro', cidade: 'Palmas', estado: 'PR', lat: -26.4805, lng: -51.9955, instagram: 'rocha_studio_beleza', website: 'https://rochastudio.com.br', foto: 'https://randomuser.me/api/portraits/women/61.jpg', categoria: 'Cabeleireiro' },
    { nome: 'Natália Barbosa Designer Gráfico', email: 'nataliabarbosadesignergrafico8@whodo.temp', telefone: '(46) 96365-7862', especialidade: 'Designer Gráfico', sobre: 'Profissional de Designer Gráfico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.2, disponibilidade: 'Seg-Sex: 8h às 18h', endereco: 'Rua Minas Gerais, 229 - Jardim das Palmeiras', cidade: 'Palmas', estado: 'PR', lat: -26.483366, lng: -51.991831, instagram: 'natalia_designer_pr', foto: 'https://randomuser.me/api/portraits/women/38.jpg', categoria: 'Designer Gráfico' },
    { nome: 'Vanessa Castro Marceneiro', email: 'vanessacastromarceneiro9@whodo.temp', telefone: '(46) 99569-6011', especialidade: 'Marceneiro', sobre: 'Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.0, disponibilidade: 'Agendamento prévio', endereco: 'Av. Mato Grosso, 678 - Vila Operária', cidade: 'Palmas', estado: 'PR', lat: -26.481746, lng: -51.990751, instagram: 'vanessa_marceneiro_pr', website: 'https://vanessamarceneiro.com.br', foto: 'https://randomuser.me/api/portraits/women/45.jpg', categoria: 'Marceneiro' },
    { nome: 'Mariana Santos Encanador', email: 'marianasantosencanador10@whodo.temp', telefone: '(46) 95671-9638', especialidade: 'Encanador', sobre: 'Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.1, disponibilidade: 'Agendamento prévio', endereco: 'Av. Brasil, 617 - Jardim América', cidade: 'Palmas', estado: 'PR', lat: -26.485596, lng: -51.987933, instagram: 'mariana_encanador_pr', foto: 'https://randomuser.me/api/portraits/women/31.jpg', categoria: 'Encanador' },
    { nome: 'Matheus Rodrigues Jardineiro', email: 'matheusrodriguesjardineiro11@whodo.temp', telefone: '(46) 91748-7862', especialidade: 'Jardineiro', sobre: 'Profissional de Jardineiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.8, disponibilidade: 'Agendamento prévio', endereco: 'Av. Curitiba, 376 - Jardim das Palmeiras', cidade: 'Palmas', estado: 'PR', lat: -26.478685, lng: -51.983653, instagram: 'matheus_jardineiro_pr', foto: 'https://randomuser.me/api/portraits/men/74.jpg', categoria: 'Jardineiro' },
    { nome: 'Leonardo Ribeiro Mecânico', email: 'leonardoribeiromecanico12@whodo.temp', telefone: '(46) 99089-9750', especialidade: 'Mecânico', sobre: 'Profissional de Mecânico em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.3, disponibilidade: 'Seg-Sex: 8h às 18h', endereco: 'Rua Paraná, 628 - Centro', cidade: 'Palmas', estado: 'PR', lat: -26.47999, lng: -51.985883, instagram: 'leonardo_mecanico_pr', foto: 'https://randomuser.me/api/portraits/men/14.jpg', categoria: 'Mecânico' },
    { nome: 'Isabela Lima Cabeleireiro', email: 'isabelalimacabeleireiro13@whodo.temp', telefone: '(46) 96258-9816', especialidade: 'Cabeleireiro', sobre: 'Profissional de Cabeleireiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.8, disponibilidade: 'Agendamento prévio', endereco: 'Av. Mato Grosso, 839 - Vila Nova', cidade: 'Palmas', estado: 'PR', lat: -26.488503, lng: -51.987463, instagram: 'isabela_cabeleireiro_pr', website: 'https://isabelacabeleireiro.com.br', foto: 'https://randomuser.me/api/portraits/women/45.jpg', categoria: 'Cabeleireiro' },
    { nome: 'André Martins Encanador', email: 'andremartinsencanador14@whodo.temp', telefone: '(46) 93649-1835', especialidade: 'Encanador', sobre: 'Profissional de Encanador em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.9, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Av. Curitiba, 551 - Vila Nova', cidade: 'Palmas', estado: 'PR', lat: -26.482593, lng: -51.995158, instagram: 'andre_encanador_pr', foto: 'https://randomuser.me/api/portraits/men/1.jpg', categoria: 'Encanador' },
    { nome: 'Carlos Mendes Marcenaria', email: 'carlosmendesmarcenaria15@whodo.temp', telefone: '(46) 95555-5555', especialidade: 'Marceneiro', sobre: 'Móveis sob medida, cozinhas planejadas, armários, portas e janelas. Madeira de qualidade e acabamento fino.', avaliacao: 4.9, disponibilidade: 'Seg-Sex: 8h às 18h', endereco: 'Rua Paraná, 654 - Industrial', cidade: 'Palmas', estado: 'PR', lat: -26.487, lng: -51.987, instagram: 'mendes_moveis', foto: 'https://randomuser.me/api/portraits/men/67.jpg', categoria: 'Marceneiro' },
    { nome: 'Ricardo Souza Jardins', email: 'ricardosouzajardins16@whodo.temp', telefone: '(46) 93333-7777', especialidade: 'Jardineiro', sobre: 'Paisagismo, manutenção de jardins, poda de árvores, plantio de grama e jardinagem em geral.', avaliacao: 4.7, disponibilidade: 'Seg-Sáb: 7h às 18h', endereco: 'Av. Curitiba, 147 - Jardim das Palmeiras', cidade: 'Palmas', estado: 'PR', lat: -26.488, lng: -51.986, instagram: 'souza_paisagismo', website: 'https://souzajardins.com.br', foto: 'https://randomuser.me/api/portraits/men/41.jpg', categoria: 'Jardineiro' },
    { nome: 'Felipe Nascimento Personal Trainer', email: 'felipenascimentopersonaltrainer17@whodo.temp', telefone: '(46) 92161-5560', especialidade: 'Personal Trainer', sobre: 'Profissional de Personal Trainer em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.7, disponibilidade: 'Seg-Sex: 8h às 18h', endereco: 'Rua Goiás, 959 - Jardim América', cidade: 'Palmas', estado: 'PR', lat: -26.481062, lng: -51.986579, instagram: 'felipe_personaltrainer_pr', foto: 'https://randomuser.me/api/portraits/men/81.jpg', categoria: 'Personal Trainer' },
    { nome: 'Lucas Oliveira Pedreiro', email: 'lucasoliveirapedreiro18@whodo.temp', telefone: '(46) 91183-9754', especialidade: 'Pedreiro', sobre: 'Profissional de Pedreiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.5, disponibilidade: 'Seg-Sex: 8h às 18h', endereco: 'Rua São Paulo, 780 - Vila Nova', cidade: 'Palmas', estado: 'PR', lat: -26.489007, lng: -51.996714, instagram: 'lucas_pedreiro_pr', foto: 'https://randomuser.me/api/portraits/men/92.jpg', categoria: 'Pedreiro' },
    { nome: 'Bianca Araújo Manicure', email: 'biancaaraujomanicure19@whodo.temp', telefone: '(46) 97508-9901', especialidade: 'Manicure', sobre: 'Profissional de Manicure em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.5, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Av. Brasil, 967 - Industrial', cidade: 'Palmas', estado: 'PR', lat: -26.483675, lng: -51.983269, instagram: 'bianca_manicure_pr', foto: 'https://randomuser.me/api/portraits/women/26.jpg', categoria: 'Manicure' },
    { nome: 'Thiago Carvalho Barbeiro', email: 'thiagocarvalhobarbeiro20@whodo.temp', telefone: '(46) 91086-4233', especialidade: 'Barbeiro', sobre: 'Profissional de Barbeiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.1, disponibilidade: 'Seg-Sex: 8h às 18h', endereco: 'Rua das Flores, 527 - Jardim Europa', cidade: 'Palmas', estado: 'PR', lat: -26.48337, lng: -51.989778, instagram: 'thiago_barbeiro_pr', foto: 'https://randomuser.me/api/portraits/men/73.jpg', categoria: 'Barbeiro' },
    { nome: 'Carolina Gomes Eletricista', email: 'carolinagomeseletricista21@whodo.temp', telefone: '(46) 97071-9251', especialidade: 'Eletricista', sobre: 'Profissional de Eletricista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.0, disponibilidade: 'Seg-Sex: 8h às 18h', endereco: 'Rua Rio Grande do Sul, 398 - Jardim América', cidade: 'Palmas', estado: 'PR', lat: -26.489052, lng: -51.985425, instagram: 'carolina_eletricista_pr', foto: 'https://randomuser.me/api/portraits/women/97.jpg', categoria: 'Eletricista' },
    { nome: 'Larissa Costa Diarista', email: 'larissacostadiarista22@whodo.temp', telefone: '(46) 91919-2832', especialidade: 'Diarista', sobre: 'Profissional de Diarista em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.9, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Rua Rio Grande do Sul, 486 - Vila Operária', cidade: 'Palmas', estado: 'PR', lat: -26.480373, lng: -51.991085, instagram: 'larissa_diarista_pr', foto: 'https://randomuser.me/api/portraits/women/89.jpg', categoria: 'Diarista' },
    { nome: 'Gabriel Pereira Marceneiro', email: 'gabrielpereiramarceneiro23@whodo.temp', telefone: '(46) 99355-4584', especialidade: 'Marceneiro', sobre: 'Profissional de Marceneiro em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.9, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Rua Paraná, 316 - Industrial', cidade: 'Palmas', estado: 'PR', lat: -26.478996, lng: -51.992109, instagram: 'gabriel_marceneiro_pr', foto: 'https://randomuser.me/api/portraits/men/62.jpg', categoria: 'Marceneiro' },
    { nome: 'João Silva Eletricista', email: 'joaosilvaeletricista24@whodo.temp', telefone: '(46) 99999-1111', especialidade: 'Eletricista', sobre: 'Especialista em instalações elétricas residenciais e comerciais. Mais de 15 anos de experiência. Atendimento 24 horas para emergências.', avaliacao: 4.8, disponibilidade: 'Seg-Sex: 8h às 18h, Sáb: 8h às 12h', endereco: 'Rua das Flores, 123 - Centro', cidade: 'Palmas', estado: 'PR', lat: -26.4845, lng: -51.9902, instagram: 'js_eletrica', foto: 'https://randomuser.me/api/portraits/men/32.jpg', categoria: 'Eletricista' },
    { nome: 'Camila Souza Pintor', email: 'camilasouzapintor25@whodo.temp', telefone: '(46) 96328-1441', especialidade: 'Pintor', sobre: 'Profissional de Pintor em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.6, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Rua Minas Gerais, 752 - Jardim Europa', cidade: 'Palmas', estado: 'PR', lat: -26.478486, lng: -51.984784, instagram: 'camila_pintor_pr', foto: 'https://randomuser.me/api/portraits/men/32.jpg', categoria: 'Pintor' },
    { nome: 'Juliana Martins Fotografia', email: 'julianamartinsfotografia26@whodo.temp', telefone: '(46) 92222-8888', especialidade: 'Fotógrafo', sobre: 'Fotografia de casamentos, aniversários, ensaios e eventos corporativos. Edição profissional incluída.', avaliacao: 4.9, disponibilidade: 'Agendamento prévio', endereco: 'Rua Santa Catarina, 258 - Centro', cidade: 'Palmas', estado: 'PR', lat: -26.4815, lng: -51.9945, instagram: 'jm_fotografia', website: 'https://jmfotos.com.br', foto: 'https://randomuser.me/api/portraits/women/35.jpg', categoria: 'Fotógrafo' },
    { nome: 'Diego Fernandes Técnico', email: 'diegofernandestecnico27@whodo.temp', telefone: '(46) 93263-3093', especialidade: 'Técnico de Informática', sobre: 'Profissional de Técnico de Informática em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.4, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Rua São Paulo, 728 - Vila Operária', cidade: 'Palmas', estado: 'PR', lat: -26.483011, lng: -51.99417, instagram: 'diego_tecnico_pr', foto: 'https://randomuser.me/api/portraits/men/72.jpg', categoria: 'Técnico de Informática' },
    { nome: 'Ana Costa Pinturas', email: 'anacostapinturas28@whodo.temp', telefone: '(46) 96666-4444', especialidade: 'Pintor', sobre: 'Pintura residencial e comercial, texturas, grafiato, massa corrida. Trabalho limpo e profissional.', avaliacao: 4.6, disponibilidade: 'Seg-Sáb: 8h às 18h', endereco: 'Rua Minas Gerais, 321 - Centro', cidade: 'Palmas', estado: 'PR', lat: -26.4855, lng: -51.991, instagram: 'costa_pinturas', website: 'https://costapinturas.com', foto: 'https://randomuser.me/api/portraits/women/28.jpg', categoria: 'Pintor' },
    { nome: 'Pedro Santos Construções', email: 'pedrosantosconstrucoes29@whodo.temp', telefone: '(46) 97777-3333', especialidade: 'Pedreiro', sobre: 'Construção civil, reformas, acabamentos, pintura e pequenos reparos. Orçamento sem compromisso.', avaliacao: 4.7, disponibilidade: 'Seg-Sex: 7h às 17h', endereco: 'Rua São Paulo, 789 - Vila Nova', cidade: 'Palmas', estado: 'PR', lat: -26.482, lng: -51.992, instagram: 'santos_reformas_pr', foto: 'https://randomuser.me/api/portraits/men/55.jpg', categoria: 'Pedreiro' },
    { nome: 'Amanda Almeida Fotógrafa', email: 'amandaalmeidafotografa30@whodo.temp', telefone: '(46) 97231-1815', especialidade: 'Fotógrafo', sobre: 'Profissional de Fotógrafa em Palmas - PR. Atendimento de qualidade e compromisso com o cliente.', avaliacao: 4.6, disponibilidade: 'Seg-Sáb: 7h às 19h', endereco: 'Rua Santa Catarina, 196 - Centro', cidade: 'Palmas', estado: 'PR', lat: -26.479342, lng: -51.99687, instagram: 'amanda_fotografa_pr', foto: 'https://randomuser.me/api/portraits/women/80.jpg', categoria: 'Fotógrafo' },
]

// Novas categorias que não existem no seed padrão
const novasCategorias = [
    'Barbeiro', 'Cabeleireiro', 'Designer Gráfico', 'Manicure', 'Mecânico',
    'Técnico de Informática'
]

async function main() {
    console.log('🌱 Iniciando importação de profissionais...')

    const senhaHash = await bcrypt.hash(SENHAPADRAO, 10)

    // Garantir que as novas categorias existam
    for (const nomeCategoria of novasCategorias) {
        const existe = await prisma.categoria.findFirst({ where: { nome: nomeCategoria } })
        if (!existe) {
            await prisma.categoria.create({
                data: {
                    nome: nomeCategoria,
                    descricao: `Serviços de ${nomeCategoria}`,
                    icone: `fa-${nomeCategoria.toLowerCase().replace(/\s/g, '-')}`,
                }
            })
        }
    }

    // Carregar mapa de categorias
    const cats = await prisma.categoria.findMany()
    const mapa: Record<string, number> = {}
    for (const c of cats) {
        mapa[c.nome] = c.id
    }

    console.log(`📁 ${cats.length} categorias carregadas`)

    let inseridos = 0
    let ignorados = 0

    for (const p of profissionais) {
        const categoriaId = mapa[p.especialidade]
        if (!categoriaId) {
            console.warn(`⚠️  Categoria não encontrada: "${p.especialidade}" para ${p.nome}`)
            ignorados++
            continue
        }

        // Verificar se já existe
        const existe = await prisma.usuario.findUnique({ where: { email: p.email } })
        if (existe) {
            ignorados++
            continue
        }

        const usuario = await prisma.usuario.create({
            data: {
                nome: p.nome,
                nome_fantasia: p.nome,
                email: p.email,
                senha: senhaHash,
                telefone: p.telefone,
                tipo: 'usuario',
                especialidade: p.especialidade,
                sobre: p.sobre,
                avaliacao_media: p.avaliacao,
                verificado: false,
                disponibilidade: p.disponibilidade,
                endereco: p.endereco,
                cidade: p.cidade,
                estado: p.estado,
                latitude: p.lat,
                longitude: p.lng,
                instagram: p.instagram || null,
                website: (p as any).website || null,
                foto_perfil: p.foto,
                status: 'ativo',
                email_verificado: false,
            }
        })

        // Criar o serviço vinculado
        await prisma.servico.create({
            data: {
                usuario_id: usuario.id,
                categoria_id: categoriaId,
                titulo: p.especialidade,
                descricao: p.sobre,
                preco_base: 0,
                cobranca_tipo: 'ORCAMENTO',
                status: 'ativo',
            }
        })

        inseridos++
        console.log(`  ✅ ${p.nome} (${p.especialidade})`)
    }

    console.log('')
    console.log(`✅ Importação concluída!`)
    console.log(`   👷 ${inseridos} profissionais inseridos`)
    console.log(`   ⏭️  ${ignorados} ignorados (já existentes ou categoria não encontrada)`)
    console.log(`   🔑 Senha para todos: ${SENHAPADRAO}`)
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
