import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Home() {
    const session = await getSession();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Nav */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-indigo-600">WhoDo!</span>
                    </div>
                    <nav className="flex gap-4">
                        {session ? (
                            <Link
                                href="/dashboard"
                                className="text-gray-600 hover:text-indigo-600 font-medium"
                            >
                                Ir para o App
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-indigo-600 font-medium"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/cadastro"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                                >
                                    Cadastrar
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section - Explicação da Finalidade */}
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-12">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
                    Quem precisa encontra. <br />
                    <span className="text-indigo-600">Quem faz escolhe.</span>
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-10">
                    O <strong>WhoDo!</strong> é a plataforma que conecta profissionais qualificados a clientes que precisam de serviços rápidos e de confiança.
                    Simplificamos a contratação e o gerenciamento de serviços em um só lugar.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/buscar" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg">
                        Encontrar Profissionais
                    </Link>
                    <Link href="/cadastro?tipo=prestador" className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition">
                        Sou Profissional
                    </Link>
                </div>
            </main>

            <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} WhoDo! Marketplace. Todos os direitos reservados.
            </footer>
        </div>
    );
}