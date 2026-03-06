import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Termos de Uso - WhoDo!' }

export default function TermosPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Termos de Uso</h1>
                    <p className="text-slate-500 mb-8">Última atualização: março de 2026</p>
                    <div className="space-y-6 text-slate-600">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Aceitação dos Termos</h2>
                            <p>Ao utilizar a plataforma WhoDo!, você concorda com estes Termos de Uso. Caso não concorde, não utilize nossos serviços.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Uso da Plataforma</h2>
                            <p>A plataforma WhoDo! conecta clientes a prestadores de serviços. Somos um intermediador e não nos responsabilizamos diretamente pela execução dos serviços contratados entre as partes.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Cadastro e Responsabilidades</h2>
                            <p>Cada usuário é responsável pelas informações fornecidas no cadastro. Informações falsas poderão resultar no cancelamento da conta sem aviso prévio.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Avaliações e Conteúdo</h2>
                            <p>Avaliações e comentários devem ser verídicos e respeitosos. Conteúdo ofensivo, falso ou prejudicial será removido e o usuário poderá ser suspenso.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Contato</h2>
                            <p>Dúvidas sobre estes termos: <a href="mailto:ajuda@whodo.com.br" className="text-indigo-600 hover:underline">ajuda@whodo.com.br</a></p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
