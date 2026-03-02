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
    'Consultoria Empresarial': '💼',
    'Aulas de Idiomas': '🌍',
    'Reparo de Eletrônicos': '📱',
    'Limpeza de Piscina': '🏊',
    'Aulas de Música': '🎵',
    'Decoração de Interiores': '🏠',
    'Serviços de Entrega': '🚚',
    'Consultoria de Moda': '👗',
    'Reparo de Móveis': '🛋️',
    'Aulas de Culinária': '👨‍🍳',
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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                    {categorias.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <Link
                                href={`/buscar?categoria=${cat.id}`}
                                className="group relative block rounded-xl overflow-hidden bg-white border-2 border-slate-100 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full"
                            >
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors duration-300" />
                                
                                {/* Content */}
                                <div className="relative flex flex-col items-center justify-center p-5 sm:p-6 h-full min-h-28">
                                    {/* Icon */}
                                    <div className="mb-3 p-3 bg-white rounded-xl group-hover:bg-indigo-50 transition-colors duration-300 shadow-md group-hover:shadow-lg">
                                        <span className="text-3xl sm:text-4 block">{iconMap[cat.nome] || '🔨'}</span>
                                    </div>
                                    
                                    {/* Category Name */}
                                    <h3 className="font-bold text-sm sm:text-base text-slate-900 text-center group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                                        {cat.nome}
                                    </h3>
                                    
                                    {/* Service Count */}
                                    <p className="text-xs text-slate-500 mt-2 group-hover:text-indigo-500 transition-colors">
                                        {cat._count.servicos} {cat._count.servicos === 1 ? 'serviço' : 'serviços'}
                                    </p>
                                </div>
                                
                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-300 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
