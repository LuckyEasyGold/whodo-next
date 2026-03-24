'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpCircle, Book, MessageCircle, Calendar, User, Settings, Briefcase, DollarSign, Image, ChevronRight, Home, X, Search, Shield, Users, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReactMarkdown from 'react-markdown';

// Dados dos tópicos de ajuda
const topicosAjuda = [
  {
    id: 'dashboard',
    titulo: 'Dashboard Principal',
    icon: Home,
    descricao: 'Visão geral da sua atividade',
    conteudo: `
O dashboard é a central de controle da sua conta WhoDo.

**O que você pode fazer:**
* **Visão Geral:** Veja um resumo das suas atividades recentes, agendamentos pendentes, mensagens, etc.
* **Estatísticas:** Acompanhe métricas como total de serviços e conversão.
* **Acesso Rápido:** Atalhos para as ações mais frequentes.
    `,
  },
  {
    id: 'agendamentos',
    titulo: 'Agendamentos',
    icon: Calendar,
    descricao: 'Gerencie seus serviços agendados',
    conteudo: `
### Meus Agendamentos

Gerencie todos os seus agendamentos, clientes ou serviços prestados.

**Como funciona:**
* **Lista de Agendamentos:** Monitore o status (pendentes, aceitos, concluídos, etc).
* **Filtros:** Busque por data, serviço ou status.
* **Interações:** Aceite, recuse ou sugira novas datas.

**Status possíveis:**
* **Pendente:** Aguardando aceite do prestador.
* **Aceito:** Confirmado.
* **Concluído:** Serviço finalizado.
    `,
  },
  {
    id: 'busca',
    titulo: 'Busca e Avaliações',
    icon: Search,
    descricao: 'Como encontrar o profissional ideal',
    conteudo: `
### Buscando Profissionais

O WhoDo conta com um sistema de busca inteligente para conectar você com o melhor profissional.

**Dicas para buscas efetivas:**
* **Mapa Local:** Utilize o mapa para encontrar prestadores mais próximos de sua residência, economizando com deslocamentos.
* **Profissionais Verificados:** Dê preferência a usuários com o selo azul de verificado, que indica que o prestador já concluiu serviços reais pelo sistema.
* **Filtros:** Filtre resultados por nota média e preço máximo estabelecido.
* **Sob Orçamento vs Fixo:** Alguns serviços custam um valor cravado (FIXO), enquanto outros exigem combinar os detalhes no chat antes de acertar o valor (ORÇAMENTO).
    `,
  },
  {
    id: 'pagamento-seguro',
    titulo: 'Pagamento Seguro',
    icon: Shield,
    descricao: 'Entenda a custódia de valores (Escrow)',
    conteudo: `
### Como seu dinheiro fica protegido

No WhoDo, você não paga diretamente para a conta bancária do profissional, o que evita golpes. Utilizamos um sistema chamado de **Escrow** (Custódia).

**Como funciona a segurança:**
1. **Retenção:** Ao aceitar o contrato, o cliente faz o pagamento. Esse dinheiro fica retido **no painel do WhoDo**.
2. **Execução:** O profissional realiza o serviço sabendo que o dinheiro já está garantido e separado.
3. **Liberação:** Apenas quando as duas partes clicam em "Concluído" o dinheiro é repassado para a carteira do profissional.
4. **Disputas:** Se houver problemas, abrimos uma reclamação formal e o dinheiro fica bloqueado até a staff intervir.
    `,
  },
  {
    id: 'praca',
    titulo: 'A Praça (Feed)',
    icon: Users,
    descricao: 'Interaja com a comunidade do WhoDo',
    conteudo: `
### O que é a Praça?

A \`/praca\` funciona como o feed social e público de todos os usuários da plataforma!

**Mecânicas da Praça:**
* **Postagens:** Prestadores podem postar atualizações, fotos de serviços finalizados e novidades, como fariam no Instagram.
* **Engajamento:** Você pode curtir, comentar em posts e compartilhar os melhores conteúdos.
* **Seguidores:** Se você gosta do trabalho de alguém, siga o perfil do prestador para acompanhar todas as postagens na sua timeline.
    `,
  },
  {
    id: 'mmn',
    titulo: 'Programa de Afiliados (MMN)',
    icon: Share2,
    descricao: 'Ganhe indicando novos usuários',
    conteudo: `
### Marketing Multinível (MMN)

Expanda a rede do WhoDo e seja recompensado proporcionalmente por isso em até 4 níveis de indicação!

**Como o comissionamento funciona:**
Sempre que alguém que você convidou fechar e concluir um serviço pela plataforma pago através dela, parte da taxa do WhoDo é convertida em comissão direta na sua Carteira, distribuída na seguinte hierarquia:

* **Nível 1 (Seu indicado direto):** Ganhe **8%** de comissão.
* **Nível 2 (Indicado do seu indicado):** Ganhe **4%** de comissão.
* **Nível 3:** Ganhe **2%** de comissão.
* **Nível 4:** Ganhe **1%** de comissão.

O saldo de afiliados fica livre para saque imediato em \`Financeiro > Carteira\` asim que cada serviço é finalizado.
    `,
  },
  {
    id: 'agendamento-detalhe',
    titulo: 'Detalhes do Agendamento',
    icon: Book,
    descricao: 'Informações completas de cada agendamento',
    conteudo: `
### Detalhes do Agendamento

Tenha acesso profundo às informações de um serviço contratado.

**Informações disponíveis:**
* Dados do cliente/prestador e serviço contratado.
* Endereço, data e horário combinados.
* Orçamentos, mensagens do chat vinculadas e histórico de atualizações (logs).
    `,
  },
  {
    id: 'mensagens',
    titulo: 'Mensagens',
    icon: MessageCircle,
    descricao: 'Comunique-se com clientes e prestadores',
    conteudo: `
### Sistema de Chat e Mensagens

A comunicação direta é fundamental para alinhar expectativas no WhoDo.

**Como usar:**
* Negocie com os clientes **antes** do agendamento usando o chat do sistema.
* Discuta orçamento, prazos e tire dúvidas sobre o serviço.
* Acesse o histórico de conversação sempre que algo não ficar claro.
    `,
  },
  {
    id: 'perfil',
    titulo: 'Meu Perfil',
    icon: User,
    descricao: 'Gerencie suas informações',
    conteudo: `
### Meu Perfil

O seu perfil é sua vitrine no WhoDo. Um perfil completo gera muito mais confiança.

**O que incluir:**
* **Foto:** Uma foto com boa iluminação e rosto legível.
* **Biografia:** Fale brevemente sobre o seu histórico e experiência profissional.
* **Contato e Local:** Mostre onde você atende e especialidade principal.
    `,
  },
  {
    id: 'configuracoes',
    titulo: 'Configurações',
    icon: Settings,
    descricao: 'Personalize sua experiência',
    conteudo: `
### Configurações de Conta

Administre dados importantes de segurança e usabilidade.

**Nestas telas, você pode:**
* Atualizar e-mail e telefone.
* Alterar senha de acesso ou configurações de notificação preferenciais.
* Configurar opções extras de segurança.
    `,
  },
  {
    id: 'portfolio',
    titulo: 'Portfólio',
    icon: Image,
    descricao: 'Mostre seus melhores trabalhos',
    conteudo: `
### Criação de Portfólio

Mostre o que sabe fazer através de galerias de imagens.

**Dicas para um ótimo portfólio:**
* Use imagens com boa luz mostrando o "Antes e Depois" do serviço.
* Crie **Álbuns** dividindo seu trabalho (ex: "Instalação Elétrica Completa").
* Uma imagem vale por mil palavras: clientes convertem mais ao ver serviços bem executados no passado.
    `,
  },
  {
    id: 'servicos',
    titulo: 'Meus Serviços',
    icon: Briefcase,
    descricao: 'Gerencie os serviços oferecidos',
    conteudo: `
### Gerenciamento de Serviços

Crie e detalhe exatamente o que você vende na plataforma.

**O que pode ser feito:**
* **Criar:** Definir Título, Categoria, Preço Base e Descrição.
* **Arquivar:** Oculte o serviço para não receber novos clientes, sem apagar seu histórico no sistema. (O serviço para de aparecer na busca pública).
* **Gerenciar:** Visualize agendamentos recebidos atrelados a cada serviço específico.
    `,
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro',
    icon: DollarSign,
    descricao: 'Gerencie suas finanças',
    conteudo: `
### Carteira Financeira

Aqui você monitora todo movimento financeiro derivado do seu trabalho.

**Visão Geral:**
* **Saldo Disponível:** Dinheiro livre e pronto para Saque via Chave PIX cadastrada.
* **Saldo Pendente:** Valores retidos de agendamentos em andamento.
* **Extrato/Transações:** Visão temporal de tudo o que entrou e saiu da sua conta (taxas do WhoDo, comissões de patrocínio, saques concluídos e estornos).
    `,
  },
];

export default function AjudaPage() {
  const [topicoAtivo, setTopicoAtivo] = useState('dashboard');
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  // Detectar qual tópico está ativo pela URL hash no carregamento
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && topicosAjuda.find((t) => t.id === hash)) {
        setTopicoAtivo(hash);
      }
    }
  }, []);

  const handleSelectTopico = (id: string) => {
    setTopicoAtivo(id);
    setMenuMobileOpen(false); // fechar menu mobile ao clicar
    window.location.hash = id;
  };

  const topicoSelecionado = topicosAjuda.find((t) => t.id === topicoAtivo) || topicosAjuda[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar Padrão */}
      <Navbar />

      {/* Container Principal abaixo da Navbar fixa */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 pt-24">
        
        {/* Cabeçalho da página (Mobile Friendly) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 mb-6 px-2 md:px-0 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-indigo-600" />
              Central de Ajuda
            </h1>
            <p className="mt-2 text-gray-600">
              Encontre guias e tutoriais para explorar toda a plataforma.
            </p>
          </div>
          
          <Link
            href="/dashboard"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-100 transition w-max"
          >
            <Home className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navegação Mobile (Dropdown/Botão) */}
          <div className="lg:hidden w-full mb-4">
            <button 
              onClick={() => setMenuMobileOpen(!menuMobileOpen)}
              className="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <topicoSelecionado.icon className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-gray-900">
                  {topicoSelecionado.titulo}
                </span>
              </div>
              {menuMobileOpen ? <X size={20} className="text-gray-500" /> : <ChevronRight className="rotate-90 text-gray-500" size={20} />}
            </button>

            {/* Menu expandido Mobile */}
            {menuMobileOpen && (
              <div className="mt-2 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-20 absolute left-4 right-4 sm:left-6 sm:right-6">
                <div className="max-h-[60vh] overflow-y-auto">
                  {topicosAjuda.map((topico) => {
                    const Icon = topico.icon;
                    const isActive = topicoAtivo === topico.id;
                    return (
                      <button
                        key={topico.id}
                        onClick={() => handleSelectTopico(topico.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                          isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                        {topico.titulo}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <nav className="sticky top-28 space-y-1 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">
                Tópicos
              </h2>
              {topicosAjuda.map((topico) => {
                const Icon = topico.icon;
                const isActive = topicoAtivo === topico.id;
                return (
                  <button
                    key={topico.id}
                    onClick={() => handleSelectTopico(topico.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left ${
                        isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {topico.titulo}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Conteúdo Principal (Markdown Renderizado) */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 min-h-[500px]">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <topicoSelecionado.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {topicoSelecionado.titulo}
                  </h2>
                  <p className="text-gray-500 mt-1 md:text-lg">
                    {topicoSelecionado.descricao}
                  </p>
                </div>
              </div>

              {/* React Markdown para renderizar as intruções sem ser "texto puro" */}
              <div className="prose prose-indigo prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700 prose-li:text-gray-700 marker:text-indigo-500">
                <ReactMarkdown>
                  {topicoSelecionado.conteudo}
                </ReactMarkdown>
              </div>
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}
