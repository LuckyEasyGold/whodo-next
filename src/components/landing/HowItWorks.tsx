'use client'

import { motion } from 'framer-motion'
import { Search, MessageSquare, Calendar, Star } from 'lucide-react'

const steps = [
    {
        icon: Search,
        title: 'Busque',
        description: 'Encontre profissionais qualificados perto de você',
        color: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
    },
    {
        icon: MessageSquare,
        title: 'Compare',
        description: 'Receba orçamentos e compare preços e avaliações',
        color: 'from-purple-500 to-violet-600',
        bgLight: 'bg-purple-50',
    },
    {
        icon: Calendar,
        title: 'Contrate',
        description: 'Escolha o melhor profissional e agende o serviço',
        color: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
    },
    {
        icon: Star,
        title: 'Avalie',
        description: 'Deixe sua avaliação e ajude outros clientes',
        color: 'from-amber-500 to-orange-600',
        bgLight: 'bg-amber-50',
    },
]

export default function HowItWorks() {
    return (
        <section className="py-20 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
                        Simples e rápido
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        Como funciona
                    </h2>
                    <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
                        Em 4 passos simples você resolve o que precisa
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative text-center p-8 rounded-2xl bg-white border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 group"
                        >
                            {/* Step number */}
                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                {i + 1}
                            </div>

                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.bgLight} mb-5 group-hover:scale-110 transition-transform`}>
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}>
                                    <step.icon size={20} />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
