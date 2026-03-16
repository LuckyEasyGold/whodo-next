'use client'

import Link from 'next/link'
import { UserPlus, X } from 'lucide-react'
import { useState } from 'react'

type Props = {
    sugestoesPerfis: any[]
}

export default function SidebarDireita({ sugestoesPerfis }: Props) {
    const [anuncios, setAnuncios] = useState([
        { id: 1, ativo: true },
        { id: 2, ativo: true },
        { id: 3, ativo: true }
    ])

    const fecharAnuncio = (id: number) => {
        setAnuncios(anuncios.map(a => 
            a.id === id ? { ...a, ativo: false } : a
        ))
    }

    return (
        <div className="space-y-4 sticky top-20">
            {/* Anúncios */}
            {anuncios.map((anuncio) => anuncio.ativo && (
                <div key={anuncio.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Publicidade
                        </span>
                        <button 
                            onClick={() => fecharAnuncio(anuncio.id)}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4 text-white">
                            <h4 className="font-bold text-sm mb-1">Anuncie no WhoDo!</h4>
                            <p className="text-xs opacity-90 mb-3">
                                Alcance milhares de profissionais e clientes
                            </p>
                            <button className="w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                                Saiba mais
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Quem seguir */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Quem seguir</h3>
                </div>
                <div className="p-2">
                    {sugestoesPerfis.map((perfil) => (
                        <div key={perfil.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="flex items-center gap-2">
                                <img
                                    src={perfil.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                    alt={perfil.nome}
                                    className="w-8 h-8 rounded-lg object-cover"
                                />
                                <div>
                                    <Link 
                                        href={`/perfil/${perfil.id}`}
                                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                                    >
                                        {perfil.nome}
                                    </Link>
                                    <p className="text-xs text-slate-500">
                                        {perfil.especialidade || 'Profissional'} · {perfil._count?.seguidores} seguidores
                                    </p>
                                </div>
                            </div>
                            <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                <UserPlus size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-2 border-t border-slate-100">
                    <Link 
                        href="/explorar"
                        className="block text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1"
                    >
                        Ver mais sugestões
                    </Link>
                </div>
            </div>

            {/* Links rápidos */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    <Link href="/sobre" className="hover:text-indigo-600 hover:underline">Sobre</Link>
                    <span>·</span>
                    <Link href="/termos" className="hover:text-indigo-600 hover:underline">Termos</Link>
                    <span>·</span>
                    <Link href="/privacidade" className="hover:text-indigo-600 hover:underline">Privacidade</Link>
                    <span>·</span>
                    <Link href="/carreiras" className="hover:text-indigo-600 hover:underline">Carreiras</Link>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    © 2024 WhoDo! Technologies, Inc.
                </p>
            </div>
        </div>
    )
}