import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Política de Privacidade - WhoDo!' }

export default function PrivacidadePage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Política de Privacidade</h1>
                    <p className="text-slate-500 mb-8">Última atualização: março de 2026</p>
                    <div className="space-y-6 text-slate-600">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Dados que coletamos</h2>
                            <p>Coletamos nome, e-mail, telefone, localização e informações de perfil para o funcionamento da plataforma. Suas senhas são armazenadas de forma criptografada e nunca compartilhadas.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Como usamos seus dados</h2>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Para criar e gerenciar sua conta</li>
                                <li>Para conectar você a prestadores ou clientes</li>
                                <li>Para melhorar nossos serviços</li>
                                <li>Para comunicações relevantes sobre a plataforma</li>
                            </ul>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Compartilhamento</h2>
                            <p>Não vendemos seus dados. Compartilhamos informações apenas quando necessário para o funcionamento da plataforma ou quando exigido por lei.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Seus direitos (LGPD)</h2>
                            <p>Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail <a href="mailto:ajuda@whodo.com.br" className="text-indigo-600 hover:underline">ajuda@whodo.com.br</a>.</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
