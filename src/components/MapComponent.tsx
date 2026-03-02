'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { Star, MapPin, Loader2 } from 'lucide-react'

// Fix generic Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom SVG map pin
const renderCustomIcon = (color: string) => {
    return L.divIcon({
        html: `
      <div class="relative flex items-center justify-center w-10 h-10 group">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" class="w-10 h-10 drop-shadow-lg group-hover:scale-110 transition-transform">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
      </div>
    `,
        className: 'bg-transparent',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    })
}

// Map Controller for dynamic center updates
function MapController({ center, zoom, bounds }: { center: [number, number], zoom: number, bounds?: L.LatLngBounds }) {
    const map = useMap()
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
        } else {
            map.setView(center, zoom)
        }
    }, [center, zoom, bounds, map])
    return null
}

type Profissional = {
    id: number
    nome: string
    foto_perfil: string | null
    cidade: string | null
    estado: string | null
    latitude: any // from Prisma Decimal
    longitude: any
    prestador: { especialidade: string | null; avaliacao_media: any; verificado: boolean } | null
}

type Props = {
    profissionais: Profissional[]
    centerCity?: string
}

export default function MapComponent({ profissionais, centerCity }: Props) {
    const [mounted, setMounted] = useState(false)
    const [cityCoords, setCityCoords] = useState<[number, number] | null>(null)
    const [isLoadingCity, setIsLoadingCity] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (centerCity && centerCity.trim() !== '') {
            setIsLoadingCity(true)
            // Geocode the city using Nominatim API
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(centerCity)}&limit=1`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        setCityCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)])
                    }
                })
                .catch(err => console.error("Geocoding failed", err))
                .finally(() => setIsLoadingCity(false))
        } else {
            setCityCoords(null)
        }
    }, [centerCity])

    if (!mounted) return null

    const validMarkers = profissionais.filter(p => p.latitude && p.longitude).map(p => ({
        ...p,
        lat: Number(p.latitude),
        lng: Number(p.longitude)
    }))

    const markerPositions = validMarkers.map(m => [m.lat, m.lng] as [number, number])

    let mapCenter: [number, number] = [-15.7801, -47.9292] // Brazil default
    let bounds: L.LatLngBounds | undefined = undefined
    let zoom = 4

    if (cityCoords) {
        // If user searched for a city, center there
        mapCenter = cityCoords
        zoom = 12 // Zoom in on the city
    } else if (markerPositions.length > 0) {
        // Otherwise fit map to markers
        bounds = L.latLngBounds(markerPositions)
        mapCenter = markerPositions[0]
    }

    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative z-0">
            {isLoadingCity && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                    <span className="text-sm font-semibold text-slate-700">Encontrando localização...</span>
                </div>
            )}
            <MapContainer center={mapCenter} zoom={zoom} className="w-full h-full" scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={mapCenter} zoom={zoom} bounds={bounds} />

                <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
                    {validMarkers.map((p) => {
                        const rating = Number(p.prestador?.avaliacao_media || 0)
                        const iconColor = p.prestador?.verificado ? '#10b981' : '#4f46e5' // Emerald if verified, Indigo otherwise

                        return (
                            <Marker
                                key={p.id}
                                position={[p.lat, p.lng]}
                                icon={renderCustomIcon(iconColor)}
                            >
                                <Popup className="rounded-2xl overflow-hidden p-0">
                                    <div className="w-60 -m-3 p-3">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img
                                                src={p.foto_perfil || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                                alt={p.nome}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm leading-tight">{p.nome}</h4>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Star size={12} className="fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {p.prestador?.especialidade && (
                                            <p className="text-xs text-slate-600 font-medium mb-1">{p.prestador.especialidade}</p>
                                        )}
                                        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                                            <MapPin size={12} /> {p.cidade}, {p.estado}
                                        </p>
                                        <Link
                                            href={`/perfil/${p.id}`}
                                            className="block w-full py-2 text-center text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                                        >
                                            Ver Perfil
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    )
}
