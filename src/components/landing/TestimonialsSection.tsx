'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
    {
        name: 'Maria José',
        role: 'Cliente',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        text: 'Encontrei um eletricista excelente em menos de 5 minutos! O Carlos resolveu tudo no mesmo dia. Super recomendo o WhoDo!',
        rating: 5,
    },
    {
        name: 'Pedro Almeida',
        role: 'Prestador — Marceneiro',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        text: 'Desde que comecei a usar o WhoDo meus clientes triplicaram. A plataforma é intuitiva e os pagamentos são rápidos.',
        rating: 5,
    },
    {
        name: 'Camila Rodrigues',
        role: 'Cliente',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        text: 'Precisava de uma diarista urgente e achei a Juliana pelo WhoDo. Profissional incrível, casa ficou brilhando!',
        rating: 5,
    },
]

export default function TestimonialsSection() {
    return (
        <section className="py-20 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold mb-4">
                        Depoimentos
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        O que dizem nossos usuários
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all duration-300"
                        >
                            <Quote size={32} className="absolute top-4 right-4 text-indigo-100" />

                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                                &ldquo;{t.text}&rdquo;
                            </p>

                            <div className="flex items-center gap-3">
                                <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                                />
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">{t.name}</h4>
                                    <p className="text-xs text-slate-500">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
