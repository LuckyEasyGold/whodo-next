'use client';

import { useState, useEffect } from 'react';
import { X, HelpCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface OnboardingLink {
    texto: string;
    url: string;
}

interface OnboardingCardProps {
    rota: string;
    titulo: string;
    descricao: string;
    links?: OnboardingLink[];
    nomeChave: string; // chave única para localStorage
}

export default function OnboardingCard({
    rota,
    titulo,
    descricao,
    links = [],
    nomeChave,
}: OnboardingCardProps) {
    const [mostrar, setMostrar] = useState(false);
    const [fechado, setFechado] = useState(false);

    useEffect(() => {
        // Verifica se é a primeira vez que acessa esta tela
        const telasVisitadas = JSON.parse(
            localStorage.getItem('whodo_telas_visitadas') || '[]'
        );

        if (!telasVisitadas.includes(nomeChave)) {
            setMostrar(true);
            // Adiciona ao histórico de visitas
            localStorage.setItem(
                'whodo_telas_visitadas',
                JSON.stringify([...telasVisitadas, nomeChave])
            );
        }
    }, [nomeChave]);

    const handleFechar = () => {
        setMostrar(false);
        setFechado(true);
        // Salva que o usuário fechou o card para esta chave
        const fechados = JSON.parse(
            localStorage.getItem('whodo_onboarding_fechados') || '[]'
        );
        if (!fechados.includes(nomeChave)) {
            localStorage.setItem(
                'whodo_onboarding_fechados',
                JSON.stringify([...fechados, nomeChave])
            );
        }
    };

    // Não mostrar se já foi fechado ou não é primeira visita
    if (!mostrar || fechado) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                {/* Cabeçalho estilo folha de papel */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-1.5 rounded-full">
                            <HelpCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">
                            {titulo}
                        </span>
                    </div>
                    <button
                        onClick={handleFechar}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Fechar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Corpo do card */}
                <div className="p-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {descricao}
                    </p>

                    {/* Links de ajuda */}
                    {links.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                                >
                                    <ChevronRight className="w-3 h-3" />
                                    {link.texto}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Botão para rever onboarding */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                            onClick={() => {
                                const fechados = JSON.parse(
                                    localStorage.getItem('whodo_onboarding_fechados') || '[]'
                                );
                                const novosFechados = fechados.filter(
                                    (k: string) => k !== nomeChave
                                );
                                localStorage.setItem(
                                    'whodo_onboarding_fechados',
                                    JSON.stringify(novosFechados)
                                );
                                setFechado(false);
                                setMostrar(true);
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Mostrar ajuda novamente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
