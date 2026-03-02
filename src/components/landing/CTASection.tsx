'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export default function CTASection() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
                    style={{ background: 'var(--gradient-hero)' }}
                >
                    {/* Decorative shapes */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-sm font-medium mb-6">
                            <Zap size={16} className="text-yellow-400" />
                            <span>Comece agora — é grátis!</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                            Pronto para encontrar o
                            <br />
                            profissional ideal?
                        </h2>

                        <p className="text-lg text-indigo-200/80 max-w-2xl mx-auto mb-10">
                            Cadastre-se gratuitamente e comece a buscar profissionais agora mesmo.
                            Sem compromisso, sem taxas escondidas.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/cadastro"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-2xl hover:shadow-xl hover:-translate-y-0.5 text-lg"
                            >
                                Quero me cadastrar
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                href="/cadastro?tipo=prestador"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-lg"
                            >
                                Sou profissional
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
