'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpCircle, Book, MessageCircle, Calendar, User, Settings, Briefcase, DollarSign, Image, ChevronRight, Home } from 'lucide-react';

// Dados dos tópicos de ajuda
const topicosAjuda = [
  {
    id: 'dashboard',
    titulo: 'Dashboard Principal',
    icon: Home,
    descricao: 'Visão geral da sua atividade',
    conteudo: `
## Dashboard Principal

O dashboard é a sua central de controle na plataforma WhoDo. Aqui você encontra:

### O que você pode fazer:
- **Visão Geral:** See um resumo das suas atividades recentes, incluindo agendamentos pendentes, mensagens não lidas e receitas do período.
- **Estatísticas:** Acompanhe métricas importantes como número de agendamentos, taxa de conversão e avaliação média.
- **Acesso Rápido:** Botões convenientemente posicionados para as ações mais frequentes.

### Dicas:
- Visite diariamente para não perder nenhuma novidade
- Configure suas preferências para personalizar o que aparece aqui
    `,
  },
  {
    id: 'agendamentos',
    titulo: 'Meus Agendamentos',
    icon: Calendar,
    descricao: 'Gerencie seus serviços agendados',
    conteudo: `
## Meus Agendamentos

Esta é a tela principal para gerenciar todos os seus agendamentos, seja como cliente ou prestador.

### Como funciona:
- **Lista de Agendamentos:** Veja todos os agendamentos organizados por status (pendentes, confirmados, concluídos, etc.)
- **Filtros:** Use os filtros para encontrar agendamentos específicos por data, status ou serviço.
- **Ações Rápidas:** Aceite, recuse ou negocie diretamente da lista.

### Status dos Agendamentos:
- **Pendente:** Aguardando confirmação do prestador
- **Aceito:** Confirmado pelo prestador
- **Em Negociação:** Terms being discussed
- **Confirmado:** Pago e confirmado
- **Em Andamento:** Serviço sendo executado
- **Concluído:** Serviço finalized
    `,
  },
  {
    id: 'agendamento-detalhe',
    titulo: 'Detalhes do Agendamento',
    icon: Calendar,
    descricao: 'Informações completas de cada agendamento',
    conteudo: `
## Detalhes do Agendamento

Nesta tela você encontra todas as informações sobre um agendamento específico.

### Informações disponíveis:
- **Dados do Serviço:** Nome, descrição, valor
- **Partes Envolvidas:** Cliente e prestador
- **Data e Horário:** Quando o serviço será realizado
- **Status Atual:** Em que etapa do fluxo está
- **Histórico:** Todas as ações realizadas neste agendamento

### Ações disponíveis:
- Iniciar serviço (prestador)
- Marcar como concluído (prestador)
- Confirmar conclusão (cliente)
- Cancelar agendamento
- Abrir chat
- Abrir disputa (em casos de problema)
    `,
  },
  {
    id: 'mensagens',
    titulo: 'Mensagens',
    icon: MessageCircle,
    descricao: 'Comunique-se com clientes e prestadores',
    conteudo: `
## Mensagens

O sistema de mensagens permite a comunicação direta entre clientes e prestadores de serviço.

### Como usar:
- **Conversas:** Acesse suas conversas ativas na lista lateral
- **Orçamento:** Envie e receba orçamentos detalhados
- **Sugestão de Data:** Proponha horários para realização do serviço
- **Arquivos:** Compartilhe imagens ou documentos quando necessário

### Dicas:
- Responda rapidamente para aumentar suas chances de fechamento
- Use o chat para negociar detalhes antes do agendamento
- Todas as mensagens são guardadas para futuras referências
    `,
  },
  {
    id: 'notificacoes',
    titulo: 'Notificações',
    icon: HelpCircle,
    descricao: 'Fique por dentro de tudo',
    conteudo: `
## Notificações

As notificações mantêm você informado sobre tudo que acontece na plataforma.

### Tipos de notificação:
- **Agendamentos:** Quando você recebe um novo agendamento, status muda, etc.
- **Mensagens:** Novas mensagens de clientes ou prestadores
- **Pagamentos:** Confirmações de pagamento, saques processados
- **Avaliações:** Quando você recebe uma nova avaliação
- **Promoções:** Ofertas especiais e novidades da plataforma

### Configurações:
Você pode escolher quais notificações deseja receber no seu email nas Configurações.
    `,
  },
  {
    id: 'perfil',
    titulo: 'Meu Perfil',
    icon: User,
    descricao: 'Gerencie suas informações pessoais',
    conteudo: `
## Meu Perfil

Seu perfil é sua carta de apresentação na plataforma. Um perfil completo aumenta suas chances de ser contratado.

### O que incluir:
- **Foto de Perfil:** Uma foto profissional ou friendly
- **Nome Fantasia:** Como você quer ser chamado
- **Descrição:** Fale sobre sua experiência e especialidades
- **Localização:** Cidade e região que atende
- **Contato:** Telefone e outras formas de contato

### Dicas para um perfil atrativo:
- Use uma foto de qualidade e professional
- Escreva uma descrição clara dos seus serviços
- Liste suas especializações e experiências
- Mantenha suas informações sempre atualizadas
- Peça para avaliar após serviços bem prestados
    `,
  },
  {
    id: 'configuracoes',
    titulo: 'Configurações',
    icon: Settings,
    descricao: 'Personalize sua experiência',
    conteudo: `
## Configurações

Gerencie suas preferências e configurações de conta.

### Opções disponíveis:
- **Dados Pessoais:** Nome, email, telefone
- **Segurança:** Alterar senha, autenticação em duas etapas
- **Privacidade:** Controlar quem vê suas informações
- **Notificações:** Escolher como quieres receber alertas
- **Métodos de Pagamento:** Adicionar/remover formas de pagamento

### Dicas:
- Mantenha seu email atualizado para não perder comunicações
- Ative a autenticação em duas etapas para maior segurança
- Revise suas configurações de privacidade regularmente
    `,
  },
  {
    id: 'portfolio',
    titulo: 'Portfólio',
    icon: Image,
    descricao: 'Mostre seus melhores trabalhos',
    conteudo: `
## Portfólio

O portfólio é onde você mostra seus melhores trabalhos para potenciais clientes.

### Como usar:
- **Adicionar Mídia:** Fotos e vídeos dos serviços realizados
- **Álbuns:** Organize por tipo de serviço ou projeto
- **Descrições:** Adicione contexto a cada trabalho
- **Destaque:** Marque seus melhores trabalhos

### Dicas para um portfólio profissional:
- Escolha imagens de alta qualidade
- Varie os tipos de serviços mostrados
- Adicione descrições que explicem o trabalho realizado
- Atualize regularmente com novos projetos
- Peça autorização para usar fotos de trabalhos
    `,
  },
  {
    id: 'servicos',
    titulo: 'Meus Serviços',
    icon: Briefcase,
    descricao: 'Gerencie seus serviços oferecidos',
    conteudo: `
## Meus Serviços

Aqui você gerencia todos os serviços que oferece na plataforma.

### Funcionalidades:
- **Lista de Serviços:** See todos os seus serviços cadastrados
- **Editar:** Altere preço, descrição, categoria
- **Status:** Ative ou desative serviços temporariamente
- **Estatísticas:** Veja quantas pessoas visualizaram e contrataram cada serviço

### Como criar um serviço atrativo:
- Escolha um título claro e descritivo
- Defina um preço competitivo
- Escreva uma descrição detalhada do que está incluído
- Adicione informações sobre tempo estimado
- Escolha categorias relevantes para sua área de atuação
    `,
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro',
    icon: DollarSign,
    descricao: 'Gerencie suas finanças',
    conteudo: `
## Financeiro

A área financeira mostra suas receitas, saldo e transações.

### O que você encontra:
- **Saldo Disponível:** Valor que você pode sacar
- **Saldo Pendente:** Valores em análise
- **Histórico de Transações:** Todas as entradas e saídas
- **Receitas:** Total ganho no período

### Como funciona o pagamento:
1. Cliente realiza o pagamento via plataforma
2. Valor fica retido até conclusão do serviço
3. Após confirmação do cliente, valor é liberado
4. Você pode solicitar saque para sua conta bancária

### Taxas:
A plataforma cobra uma pequena taxa de serviço sobre cada transação.
    `,
  },
];

export default function AjudaPage() {
  const pathname = usePathname();
  const [topicoAtivo, setTopicoAtivo] = useState('dashboard');

  // Detectar qual tópico está ativo pela URL hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTopicoAtivo(hash);
      }
    }
  }, []);

  const topicoSelecionado = topicosAjuda.find((t) => t.id === topicoAtivo);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-bold text-xl text-gray-800">WhoDo</span>
              </Link>
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Central de Ajuda
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Lista de Tópicos */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Tópicos de Ajuda
              </h2>
              {topicosAjuda.map((topico) => {
                const Icon = topico.icon;
                const isActive = topicoAtivo === topico.id;
                return (
                  <button
                    key={topico.id}
                    onClick={() => setTopicoAtivo(topico.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    {topico.titulo}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {topicoSelecionado ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {(() => {
                        const Icon = topicoSelecionado.icon;
                        return <Icon className="w-6 h-6 text-blue-600" />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {topicoSelecionado.titulo}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        {topicoSelecionado.descricao}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-blue max-w-none">
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {topicoSelecionado.conteudo}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Selecione um tópico na sidebar</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
