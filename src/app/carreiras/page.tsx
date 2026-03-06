import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Carreiras - WhoDo!' }

export default function CarreirasPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Carreiras</h1>
                    <p className="text-slate-500 mb-10">Faça parte do time que conecta pessoas e serviços.</p>
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                        <p className="text-4xl mb-4">🚀</p>
                        <p className="text-slate-600 font-semibold">Vagas em breve!</p>
                        <p className="text-slate-400 text-sm mt-2">Estamos crescendo. Se quiser trabalhar conosco, mande um e-mail para <a href="mailto:ajuda@whodo.com.br" className="text-indigo-600 hover:underline">ajuda@whodo.com.br</a></p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
