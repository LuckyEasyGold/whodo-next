'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save, Loader2, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
    usuario: any
}

export default function EditarPerfilForm({ usuario }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const [nome, setNome] = useState(usuario.nome)
    const [nome_fantasia, setNomeFantasia] = useState(usuario.nome_fantasia || '')
    const [documento, setDocumento] = useState(usuario.documento || '')
    const [telefone, setTelefone] = useState(usuario.telefone || '')
    const [cidade, setCidade] = useState(usuario.cidade || '')
    const [estado, setEstado] = useState(usuario.estado || '')
    const [cep, setCep] = useState(usuario.cep || '')
    const [endereco, setEndereco] = useState(usuario.endereco || '')

    // Profissional
    const [especialidade, setEspecialidade] = useState(usuario.especialidade || '')
    const [sobre, setSobre] = useState(usuario.sobre || '')
    const [disponibilidade, setDisponibilidade] = useState(usuario.disponibilidade || '')

    // Socials
    const [website, setWebsite] = useState(usuario.website || '')
    const [linkedin, setLinkedin] = useState(usuario.linkedin || '')
    const [facebook, setFacebook] = useState(usuario.facebook || '')
    const [instagram, setInstagram] = useState(usuario.instagram || '')
    const [youtube, setYoutube] = useState(usuario.youtube || '')
    const [tiktok, setTiktok] = useState(usuario.tiktok || '')
    const [kwai, setKwai] = useState(usuario.kwai || '')
    const [perfil_academico, setPerfilAcademico] = useState(usuario.perfil_academico || '')

    // For file upload
    const [fotoFile, setFotoFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState(usuario.foto_perfil || 'https://randomuser.me/api/portraits/lego/1.jpg')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFotoFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleCepBlur = async () => {
        const cleanCep = cep.replace(/\D/g, '')
        if (cleanCep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
                const data = await res.json()
                if (!data.erro) {
                    setEndereco(data.logradouro + (data.bairro ? ` - ${data.bairro}` : ''))
                    setCidade(data.localidade)
                    setEstado(data.uf)
                }
            } catch (err) {
                console.error("Erro ao buscar CEP:", err)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const formData = new FormData()
            formData.append('nome', nome)
            formData.append('nome_fantasia', nome_fantasia)
            formData.append('documento', documento)
            formData.append('telefone', telefone)
            formData.append('cep', cep)
            formData.append('endereco', endereco)
            formData.append('cidade', cidade)
            formData.append('estado', estado)
            formData.append('especialidade', especialidade)
            formData.append('sobre', sobre)
            formData.append('disponibilidade', disponibilidade)
            formData.append('website', website)
            formData.append('linkedin', linkedin)
            formData.append('facebook', facebook)
            formData.append('instagram', instagram)
            formData.append('youtube', youtube)
            formData.append('tiktok', tiktok)
            formData.append('kwai', kwai)
            formData.append('perfil_academico', perfil_academico)
            if (fotoFile) {
                formData.append('foto', fotoFile)
            }

            const res = await fetch('/api/perfil/update', {
                method: 'POST',
                body: formData, // fetch will automatically set the correct multipart/form-data boundary
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao atualizar perfil')
            }

            setSuccess(true)
            router.refresh()

            // hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-100 flex items-center gap-2">
                    <CheckCircle size={18} />
                    Perfil atualizado com sucesso!
                </div>
            )}

            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                <div className="relative group">
                    <img
                        src={previewUrl}
                        alt="Foto de perfil"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <label className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-sm transition-colors">
                        <Camera size={16} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
                <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-slate-900">Foto de Perfil</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">Recomendamos uma imagem quadrada, ex: 500x500px em formato JPG ou PNG.</p>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                    <input
                        type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome Fantasia (Opcional)</label>
                    <input
                        type="text" value={nome_fantasia} onChange={(e) => setNomeFantasia(e.target.value)} placeholder="Ex: Maria Serviços..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF ou CNPJ</label>
                    <input
                        type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} placeholder="Apenas números..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp / Telefone</label>
                    <input
                        type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                    <input
                        type="text" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={handleCepBlur} placeholder="00000-000" maxLength={9}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                    <input
                        type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, Número, Bairro"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                    <input
                        type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: São Paulo"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estado (UF)</label>
                    <input
                        type="text" value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Ex: SP" maxLength={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all uppercase"
                    />
                </div>
            </div>

            {/* Profissional Info */}
            <div className="space-y-4 pt-2 border-b border-slate-100 pb-6">
                <h3 className="font-bold text-slate-900">Perfil Profissional</h3>
                <p className="text-sm text-slate-500 -mt-2">Preencha caso você vá oferecer serviços na plataforma.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade Principal</label>
                        <input
                            type="text" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} placeholder="Ex: Eletricista Residencial, Desenvolvedor Web..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Disponibilidade</label>
                        <input
                            type="text" value={disponibilidade} onChange={(e) => setDisponibilidade(e.target.value)} placeholder="Ex: Seg a Sex, das 8h às 18h"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sobre mim (Biografia)</label>
                    <textarea
                        value={sobre} onChange={(e) => setSobre(e.target.value)} rows={4} placeholder="Conte um pouco sobre sua experiência, forma de trabalho e diferenciais..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all resize-none"
                    ></textarea>
                </div>
            </div>

            {/* Redes Sociais */}
            <div className="space-y-4 pt-2">
                <h3 className="font-bold text-slate-900">Redes Sociais e Links</h3>
                <p className="text-sm text-slate-500 -mt-2">Esses links ajudarão outras pessoas a conhecerem seu trabalho.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">Website</label>
                        <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://seudominio.com" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">LinkedIn</label>
                        <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/seu_perfil" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">Instagram</label>
                        <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@seuperfil" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">Facebook</label>
                        <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="URL do Facebook" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">YouTube</label>
                        <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/@seucanal" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">TikTok</label>
                        <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="@seuperfil" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">Kwai</label>
                        <input type="text" value={kwai} onChange={(e) => setKwai(e.target.value)} placeholder="@seuperfil" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">Perfil Acadêmico/Lattes</label>
                        <input type="text" value={perfil_academico} onChange={(e) => setPerfilAcademico(e.target.value)} placeholder="Lattes, ResearchGate, etc" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all" />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </form>
    )
}
