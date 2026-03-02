import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/landing/HeroSection'
import CategoriesSection from '@/components/landing/CategoriesSection'
import HowItWorks from '@/components/landing/HowItWorks'
import TopProfessionals from '@/components/landing/TopProfessionals'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import CTASection from '@/components/landing/CTASection'

export default async function Home() {
  let categorias: any[] = []
  let topPrestadores: any[] = []

  try {
    categorias = await prisma.categoria.findMany({
      include: { _count: { select: { servicos: true } } },
      orderBy: { servicos: { _count: 'desc' } },
      take: 8,
    })

    topPrestadores = await prisma.usuario.findMany({
      where: { tipo: 'prestador', status: 'ativo' },
      include: {
        prestador: true,
        servicos: { include: { categoria: true }, take: 2 },
        avaliacoesRecebidas: true,
      },
      take: 6,
    })
  } catch (e) {
    console.warn('⚠️ DB not available, using empty data:', (e as Error).message)
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <CategoriesSection categorias={JSON.parse(JSON.stringify(categorias))} />
        <HowItWorks />
        <TopProfessionals prestadores={JSON.parse(JSON.stringify(topPrestadores))} />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
