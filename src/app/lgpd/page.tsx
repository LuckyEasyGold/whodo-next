import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'LGPD - WhoDo!' }

export default function LgpdPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">LGPD — Lei Geral de Proteção de Dados</h1>
                    <p className="text-slate-500 mb-8">Última atualização: março de 2026</p>
                    <div className="space-y-6 text-slate-600">
                        <p>O WhoDo! está em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD).</p>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Seus direitos como titular</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Acesso</strong> — saber quais dados seus temos armazenados</li>
                                <li><strong>Correção</strong> — atualizar dados incorretos ou desatualizados</li>
                                <li><strong>Exclusão</strong> — solicitar a exclusão dos seus dados pessoais</li>
                                <li><strong>Portabilidade</strong> — receber seus dados em formato legível</li>
                                <li><strong>Revogação</strong> — retirar seu consentimento a qualquer momento</li>
                            </ul>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Encarregado de Dados (DPO)</h2>
                            <p>Para exercer seus direitos ou tirar dúvidas sobre o tratamento dos seus dados, entre em contato pelo e-mail: <a href="mailto:ajuda@whodo.com.br" className="text-indigo-600 hover:underline">ajuda@whodo.com.br</a></p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
