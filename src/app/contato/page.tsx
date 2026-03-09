import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Contato - WhoDo!' }

export default function ContatoPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Contato</h1>
                    <p className="text-slate-500 mb-10">Fale com a gente. Estamos aqui para ajudar!</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <p className="text-2xl mb-3">✉️</p>
                            <h2 className="font-bold text-slate-900 mb-1">E-mail</h2>
                            <a href="mailto:viniciusribramos@gmail.com" className="text-indigo-600 hover:underline text-sm">ajuda@whodo.com.br</a>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <p className="text-2xl mb-3">📱</p>
                            <h2 className="font-bold text-slate-900 mb-1">WhatsApp</h2>
                            <p className="text-slate-500 text-sm">(42) 99153-2962</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
