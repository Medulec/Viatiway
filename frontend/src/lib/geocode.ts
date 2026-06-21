export interface Place {
  city: string
  label: string
  lat: number
  lon: number
}

interface NominatimResult {
  lat: string
  lon: string
  name?: string
  display_name: string
  address?: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    county?: string
    state?: string
    country?: string
  }
}

const localityName = (r: NominatimResult) => {
  const a = r.address ?? {}
  return a.city || a.town || a.village || a.municipality || r.name || r.display_name.split(',')[0]
}

const regionName = (r: NominatimResult) => {
  const a = r.address ?? {}
  return [a.state || a.county, a.country].filter(Boolean).join(', ')
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const url =
    'https://nominatim.openstreetmap.org/search' +
    `?format=jsonv2&addressdetails=1&limit=6&accept-language=pl&q=${encodeURIComponent(q)}`

  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) return []

  const data: NominatimResult[] = await res.json()
  const seen = new Set<string>()
  const places: Place[] = []

  for (const r of data) {
    const name = localityName(r)
    const region = regionName(r)
    const label = region ? `${name}, ${region}` : name
    if (seen.has(label)) continue
    seen.add(label)
    places.push({ city: name, label, lat: parseFloat(r.lat), lon: parseFloat(r.lon) })
  }

  return places
}

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
