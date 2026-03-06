import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Serviços</h3>
                        <ul className="space-y-3">
                            <li><Link href="/buscar?cat=encanador" className="text-sm hover:text-white transition-colors">Encanador</Link></li>
                            <li><Link href="/buscar?cat=eletricista" className="text-sm hover:text-white transition-colors">Eletricista</Link></li>
                            <li><Link href="/buscar?cat=pintor" className="text-sm hover:text-white transition-colors">Pintor</Link></li>
                            <li><Link href="/buscar?cat=diarista" className="text-sm hover:text-white transition-colors">Diarista</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Empresa</h3>
                        <ul className="space-y-3">
                            <li><Link href="/sobre" className="text-sm hover:text-white transition-colors">Sobre nós</Link></li>
                            <li><Link href="/blog" className="text-sm hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/carreiras" className="text-sm hover:text-white transition-colors">Carreiras</Link></li>
                            <li><Link href="/contato" className="text-sm hover:text-white transition-colors">Contato</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link href="/privacidade" className="text-sm hover:text-white transition-colors">Privacidade</Link></li>
                            <li><Link href="/termos" className="text-sm hover:text-white transition-colors">Termos de Uso</Link></li>
                            <li><Link href="/lgpd" className="text-sm hover:text-white transition-colors">LGPD</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contato</h3>
                        <ul className="space-y-3">
                            <li><span className="text-sm">ajuda@whodo.com.br</span></li>
                            <li><span className="text-sm">(43) 99999-0000</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="WhoDo"
                            className="h-8 w-auto opacity-80"
                        />
                        <span className="font-black text-white text-lg tracking-tight">WhoDo<span className="text-blue-400">!</span></span>
                    </div>
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} WhoDo! Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}
