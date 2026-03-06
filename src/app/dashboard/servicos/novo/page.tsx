import ServicoForm from '../components/ServicoForm'

export const metadata = {
    title: 'Novo Serviço | Whodo',
    description: 'Adicione um novo serviço ao seu perfil',
}

export default function NovoServicoPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <ServicoForm />
        </div>
    )
}
