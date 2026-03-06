import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Blog - WhoDo!' }

export default function BlogPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Blog</h1>
                    <p className="text-slate-500 mb-10">Dicas, novidades e histórias da comunidade WhoDo!</p>
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                        <p className="text-4xl mb-4">✍️</p>
                        <p className="text-slate-600 font-semibold">Em breve por aqui!</p>
                        <p className="text-slate-400 text-sm mt-2">Nosso blog está sendo preparado. Fique de olho!</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
