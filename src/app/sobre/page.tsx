import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Sobre nós - WhoDo!' }

export default function SobrePage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-6">Sobre o WhoDo!</h1>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-600">
                        <p className="text-lg">O <strong>WhoDo!</strong> é uma plataforma que conecta pessoas que precisam de serviços com profissionais qualificados da sua região, de forma rápida, segura e transparente.</p>
                        <p>Nascemos com a missão de valorizar o trabalho dos profissionais locais e facilitar a vida de quem precisa de um serviço confiável. Na nossa plataforma você encontra eletricistas, encanadores, pintores, diaristas, personal trainers e muito mais — tudo em um só lugar.</p>
                        <h2 className="text-2xl font-bold text-slate-900 mt-8">Nossa missão</h2>
                        <p>Criar um ecossistema onde profissionais qualificados encontram oportunidades de trabalho e clientes encontram o serviço certo com segurança e confiança.</p>
                        <h2 className="text-2xl font-bold text-slate-900 mt-8">Nossos valores</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Transparência</strong> — avaliações reais de clientes reais</li>
                            <li><strong>Valorização</strong> — profissionais locais em primeiro lugar</li>
                            <li><strong>Segurança</strong> — dados protegidos com criptografia</li>
                            <li><strong>Comunidade</strong> — fomentando a economia local</li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
