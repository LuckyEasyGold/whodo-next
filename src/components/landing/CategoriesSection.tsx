'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

type CategoriaProps = {
    categorias: {
        id: number
        nome: string
        descricao: string | null
        icone: string | null
        imagem: string | null
        _count: { servicos: number }
    }[]
}

const iconMap: Record<string, string> = {
    'Encanador': '🔧',
    'Eletricista': '⚡',
    'Pintor': '🎨',
    'Diarista': '🧹',
    'Marceneiro': '🪚',
    'Jardineiro': '🌿',
    'Fotógrafo': '📸',
    'Personal Trainer': '💪',
    'Pedreiro': '🏗️',
    'Designer Gráfico': '🖌️',
}

export default function CategoriesSection({ categorias }: CategoriaProps) {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
                        Categorias
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        Explore por categoria
                    </h2>
                    <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
                        Encontre profissionais nas áreas mais procuradas
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {categorias.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/buscar?categoria=${cat.id}`}
                                className="group relative block rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="relative h-36 sm:h-44 overflow-hidden">
                                    {cat.imagem ? (
                                        <img
                                            src={cat.imagem}
                                            alt={cat.nome}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                            <span className="text-5xl">{iconMap[cat.nome] || '🔨'}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{iconMap[cat.nome] || '🔨'}</span>
                                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {cat.nome}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {cat._count.servicos} {cat._count.servicos === 1 ? 'serviço' : 'serviços'}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
