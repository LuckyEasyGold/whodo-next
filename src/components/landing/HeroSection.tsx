'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MapPin, ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-sm font-medium mb-8 backdrop-blur-sm">
                        <Sparkles size={16} className="text-yellow-400" />
                        <span>+5.000 profissionais verificados</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
                        Encontre quem faz
                        <br />
                        <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                            o que você precisa
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-indigo-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Conectamos você aos melhores profissionais da sua região.
                        Rápido, seguro e sem complicação.
                    </p>
                </motion.div>

                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="max-w-2xl mx-auto"
                >
                    <form action="/buscar" method="GET" className="relative">
                        <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                            <div className="relative flex-1">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                                <input
                                    type="text"
                                    name="q"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="O que você precisa? Ex: encanador, pintor..."
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-xl text-white placeholder:text-white/40 border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 text-base transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
                            >
                                <Search size={18} />
                                <span>Buscar</span>
                            </button>
                        </div>
                    </form>

                    {/* Popular searches */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {['Encanador', 'Eletricista', 'Pintor', 'Diarista', 'Fotógrafo'].map((term) => (
                            <Link
                                key={term}
                                href={`/buscar?q=${term}`}
                                className="px-4 py-2 rounded-full bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 hover:text-white transition-all border border-white/10"
                            >
                                {term}
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
                >
                    {[
                        { num: '5K+', label: 'Profissionais' },
                        { num: '10K+', label: 'Serviços' },
                        { num: '4.8', label: 'Avaliação média' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-2xl sm:text-3xl font-black text-white">{stat.num}</div>
                            <div className="text-xs sm:text-sm text-indigo-300/70 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
