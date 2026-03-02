'use client'

import dynamic from 'next/dynamic'

// Leaflet relies on the browser window object, so we load it dynamically with ssr disabled
const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                <span className="text-sm font-medium text-slate-500">Carregando mapa...</span>
            </div>
        </div>
    )
})

type Profissional = any

type Props = {
    profissionais: Profissional[]
    centerCity?: string
}

export default function MapWrapper({ profissionais, centerCity }: Props) {
    return <MapComponent profissionais={profissionais} centerCity={centerCity} />
}
