'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ServicoFormProps {
    initialData?: any
    isEditing?: boolean
}

export default function ServicoForm({ initialData, isEditing = false }: ServicoFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        titulo: initialData?.titulo || '',
        descricao: initialData?.descricao || '',
        categoria_id: initialData?.categoria_id?.toString() || '',
        preco_base: initialData?.preco_base?.toString() || '',
        cobranca_tipo: initialData?.cobranca_tipo || 'FIXO',
        tempo_estimado: initialData?.tempo_estimado || '',
    })

    useEffect(() => {
        // Carregar categorias
        fetch('/api/servicos/categorias')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setCategorias(data)
            })
            .catch(err => console.error("Erro ao carregar categorias", err))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const url = isEditing ? `/api/servicos/${initialData.id}` : '/api/servicos'
            const method = isEditing ? 'PUT' : 'POST'

            // Se for orçamento, o preço base pode ser 0 ou o valor mínimo
            const payload = {
                ...formData,
                preco_base: formData.preco_base ? parseFloat(formData.preco_base) : 0
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao salvar serviço')
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/dashboard/servicos')
                router.refresh()
            }, 1500)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/dashboard/servicos"
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
                </h1>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    Serviço salvo com sucesso! Redirecionando...
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">

                {/* Título e Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                            Nome do Serviço <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            required
                            value={formData.titulo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ex: Reforma de Parede"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700">
                            Categoria <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="categoria_id"
                            name="categoria_id"
                            required
                            value={formData.categoria_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                            <option value="" disabled>Selecione uma categoria...</option>
                            {categorias.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                            {/* Fallback temporário caso a API não tenha categorias */}
                            {categorias.length === 0 && (
                                <>
                                    <option value="1">Construção e Reformas</option>
                                    <option value="2">Assistência Técnica</option>
                                    <option value="3">Limpeza e Conservação</option>
                                    <option value="4">Saúde e Bem-estar</option>
                                    <option value="5">Eventos</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* Tipo de Cobrança */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Como você cobra por este serviço? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className={`relative flex cursor-pointer p-4 border rounded-lg hover:bg-gray-50 items-start gap-4 transition-colors ${formData.cobranca_tipo === 'FIXO' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200'}`}>
                            <div className="flex items-center h-5">
                                <input
                                    type="radio"
                                    name="cobranca_tipo"
                                    value="FIXO"
                                    checked={formData.cobranca_tipo === 'FIXO'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="block text-sm font-semibold text-gray-900">Preço Fixo</span>
                                <span className="block text-xs text-gray-500 mt-1">O valor é exato (Ex: Limpeza de Ar Condicionado R$ 150). O cliente já clica em Reservar e pode pagar o valor de imediato.</span>
                            </div>
                        </label>

                        <label className={`relative flex cursor-pointer p-4 border rounded-lg hover:bg-gray-50 items-start gap-4 transition-colors ${formData.cobranca_tipo === 'ORCAMENTO' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200'}`}>
                            <div className="flex items-center h-5">
                                <input
                                    type="radio"
                                    name="cobranca_tipo"
                                    value="ORCAMENTO"
                                    checked={formData.cobranca_tipo === 'ORCAMENTO'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="block text-sm font-semibold text-gray-900">Sob Orçamento</span>
                                <span className="block text-xs text-gray-500 mt-1">O valor é variável (A partir de R$ 100). O cliente clica em Solicitar Orçamento e você define o preço final conversando no painel.</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Preço e Tempo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="space-y-2">
                        <label htmlFor="preco_base" className="block text-sm font-medium text-gray-700">
                            {formData.cobranca_tipo === 'FIXO' ? 'Valor Final do Serviço (R$)' : 'Valor Inicial Mínimo (R$)'}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            id="preco_base"
                            name="preco_base"
                            required={formData.cobranca_tipo === 'FIXO'}
                            value={formData.preco_base}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tempo_estimado" className="block text-sm font-medium text-gray-700">
                            Tempo Estimado de Conclusão <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
                        </label>
                        <input
                            type="text"
                            id="tempo_estimado"
                            name="tempo_estimado"
                            value={formData.tempo_estimado}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ex: 2 horas, 3 dias, 1 semana"
                        />
                    </div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                        Descrição detalhada do Serviço
                    </label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        rows={4}
                        value={formData.descricao}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        placeholder="Descreva exatamente o que está incluso no serviço e o que não está..."
                    />
                </div>

                {/* Botão de Envio */}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || success}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="h-5 w-5" />
                        )}
                        {loading ? 'Salvando...' : 'Salvar Serviço'}
                    </button>
                </div>
            </form>
        </div>
    )
}
