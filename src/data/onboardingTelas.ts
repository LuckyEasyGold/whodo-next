// Configuração de onboarding para cada tela do dashboard
// Este arquivo contém os textos que aparecem nos cards de orientação

export interface OnboardingData {
    chave: string;
    titulo: string;
    descricao: string;
    links: { texto: string; url: string }[];
}

export const onboardingTelas: OnboardingData[] = [
    {
        chave: 'dashboard',
        titulo: 'Bem-vindo ao seu Dashboard!',
        descricao:
            'Aqui você tem uma visão geral da sua atividade na plataforma. Acompanhe seus agendamentos, mensagens e receitas em um só lugar...',
        links: [{ texto: 'Saiba mais sobre o Dashboard...', url: '/ajuda#dashboard' }],
    },
    {
        chave: 'agendamentos',
        titulo: 'Meus Agendamentos',
        descricao:
            'Gerencie todos os seus agendamentos aqui. Você pode aceitar, recusar ou negociar serviços com clientes. Arraste para o lado para ver mais detalhes...',
        links: [
            { texto: 'Como funcionam os agendamentos...', url: '/ajuda#agendamentos' },
        ],
    },
    {
        chave: 'agendamento_detalhe',
        titulo: 'Detalhes do Agendamento',
        descricao:
            'Veja todas as informações deste agendamento. Você pode iniciar o serviço, marcar como concluído ou entrar em contato com o cliente...',
        links: [
            {
                texto: 'Entenda o fluxo completo de agendamento...',
                url: '/ajuda#agendamento-detalhe',
            },
        ],
    },
    {
        chave: 'mensagens',
        titulo: 'Mensagens',
        descricao:
            'Comunique-se com seus clientes ou prestadores de serviço. Tire dúvidas, negocie termos e acompanhe propostas de orçamento...',
        links: [{ texto: 'Como usar o chat...', url: '/ajuda#mensagens' }],
    },
    {
        chave: 'notificacoes',
        titulo: 'Notificações',
        descricao:
            'Fique por dentro de tudo que acontece na plataforma. Receba alertas sobre novas mensagens, status de agendamentos e promoções...',
        links: [
            { texto: 'Configurar notificações...', url: '/ajuda#notificacoes' },
        ],
    },
    {
        chave: 'perfil',
        titulo: 'Meu Perfil',
        descricao:
            'Complete seu perfil para atrair mais clientes. Adicione foto, descrição, especialidade e localização para aparecer nas buscas...',
        links: [
            { texto: 'Dicas para um perfil atrativo...', url: '/ajuda#perfil' },
        ],
    },
    {
        chave: 'configuracoes',
        titulo: 'Configurações',
        descricao:
            'Gerencie suas configurações de conta, privacidade, notificações e métodos de pagamento. Tudo em um só lugar...',
        links: [{ texto: 'Ver todas as opções...', url: '/ajuda#configuracoes' }],
    },
    {
        chave: 'portfolio',
        titulo: 'Portfólio',
        descricao:
            'Mostre seus melhores trabalhos! Adicione fotos e vídeos dos serviços que você realiza para impressionar potenciais clientes...',
        links: [
            { texto: 'Dicas para um portfólio profissional...', url: '/ajuda#portfolio' },
        ],
    },
    {
        chave: 'servicos',
        titulo: 'Meus Serviços',
        descricao:
            'Gerencie os serviços que você oferece. Você pode criar novos serviços, editar preços, descrições e categorias...',
        links: [
            {
                texto: 'Como criar serviços atrativos...',
                url: '/ajuda#servicos',
            },
        ],
    },
    {
        chave: 'servico_novo',
        titulo: 'Criar Serviço',
        descricao:
            'Adicione um novo serviço ao seu catálogo. Defina preço, descrição, categoria e tempo estimado para atrair clientes...',
        links: [
            {
                texto: 'Ver exemplo de serviço bem detalhado...',
                url: '/ajuda#servico-criar',
            },
        ],
    },
    {
        chave: 'financeiro',
        titulo: 'Financeiro',
        descricao:
            'Acompanhe suas receitas, saldo disponível e histórico de transações. Solicite saques quando quiser para sua conta bancária...',
        links: [
            {
                texto: 'Entenda como funcionam os pagamentos...',
                url: '/ajuda#financeiro',
            },
        ],
    },
];

// Função helper para obter dados de onboarding por chave
export function getOnboardingData(chave: string): OnboardingData | undefined {
    return onboardingTelas.find((t) => t.chave === chave);
}
