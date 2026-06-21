import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export interface Coord {
  lat: number
  lon: number
}

const POLAND_CENTER: [number, number] = [52.07, 19.48]

function FitView({ from, to, route }: { from: Coord | null; to: Coord | null; route: [number, number][] | null }) {
  const map = useMap()
  useEffect(() => {
    if (route && route.length > 1) {
      map.fitBounds(route, { padding: [28, 28], maxZoom: 12 })
    } else if (from && to) {
      map.fitBounds([[from.lat, from.lon], [to.lat, to.lon]], { padding: [32, 32], maxZoom: 12 })
    } else if (from) {
      map.setView([from.lat, from.lon], 10)
    } else if (to) {
      map.setView([to.lat, to.lon], 10)
    }
  }, [map, from?.lat, from?.lon, to?.lat, to?.lon, route])
  return null
}

interface RouteMapProps {
  from: Coord | null
  to: Coord | null
  route: [number, number][] | null
}

export default function RouteMap({ from, to, route }: RouteMapProps) {
  return (
    <MapContainer
      className="np-leaflet"
      center={POLAND_CENTER}
      zoom={5}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {route && route.length > 1 ? (
        <Polyline positions={route} pathOptions={{ color: '#2f8f55', weight: 4 }} />
      ) : (
        from && to && (
          <Polyline positions={[[from.lat, from.lon], [to.lat, to.lon]]} pathOptions={{ color: '#2f8f55', weight: 3, dashArray: '6 6' }} />
        )
      )}
      {from && (
        <CircleMarker center={[from.lat, from.lon]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: '#237344', fillOpacity: 1 }}>
          <Tooltip>Start</Tooltip>
        </CircleMarker>
      )}
      {to && (
        <CircleMarker center={[to.lat, to.lon]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: '#c7583a', fillOpacity: 1 }}>
          <Tooltip>Cel</Tooltip>
        </CircleMarker>
      )}
      <FitView from={from} to={to} route={route} />
    </MapContainer>
  )
}
