'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface UseOnboardingOptions {
    chave: string;
    dependencia?: string; // rota ou outra dependência
}

export function useOnboarding({ chave }: UseOnboardingOptions) {
    const pathname = usePathname();
    const [mostrarCard, setMostrarCard] = useState(false);
    const [jaVisto, setJaVisto] = useState(false);

    useEffect(() => {
        // Só verifica se é a primeira vez quando está no client
        if (typeof window === 'undefined') return;

        const telasVisitadas = JSON.parse(
            localStorage.getItem('whodo_telas_visitadas') || '[]'
        );

        const fechados = JSON.parse(
            localStorage.getItem('whodo_onboarding_fechados') || '[]'
        );

        // Se nunca foi visto E nunca foi fechado pelo usuário
        if (!telasVisitadas.includes(chave) && !fechados.includes(chave)) {
            setMostrarCard(true);
            // Marca como visitada
            localStorage.setItem(
                'whodo_telas_visitadas',
                JSON.stringify([...telasVisitadas, chave])
            );
        } else {
            setJaVisto(true);
        }
    }, [chave, pathname]);

    const marcarComoVisto = () => {
        setMostrarCard(false);
        const fechados = JSON.parse(
            localStorage.getItem('whodo_onboarding_fechados') || '[]'
        );
        if (!fechados.includes(chave)) {
            localStorage.setItem(
                'whodo_onboarding_fechados',
                JSON.stringify([...fechados, chave])
            );
        }
    };

    const reativarAjuda = () => {
        const fechados = JSON.parse(
            localStorage.getItem('whodo_onboarding_fechados') || '[]'
        );
        const novosFechados = fechados.filter((k: string) => k !== chave);
        localStorage.setItem(
            'whodo_onboarding_fechados',
            JSON.stringify(novosFechados)
        );
        setJaVisto(false);
        setMostrarCard(true);
    };

    return {
        mostrarCard,
        jaVisto,
        marcarComoVisto,
        reativarAjuda,
    };
}

// Função helper para limpar todos os dados de onboarding (útil para debug)
export function limparDadosOnboarding() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('whodo_telas_visitadas');
        localStorage.removeItem('whodo_onboarding_fechados');
    }
}
