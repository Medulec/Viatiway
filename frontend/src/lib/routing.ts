export interface RouteResult {
  distanceKm: number
  durationMin: number
  coords: [number, number][]
}

interface OsrmResponse {
  code: string
  routes?: {
    distance: number
    duration: number
    geometry: { coordinates: [number, number][] }
  }[]
}

export async function getRoute(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  signal?: AbortSignal,
): Promise<RouteResult | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.lon},${from.lat};${to.lon},${to.lat}` +
    `?overview=full&geometries=geojson`

  const res = await fetch(url, { signal })
  if (!res.ok) return null

  const data: OsrmResponse = await res.json()
  const route = data.routes?.[0]
  if (data.code !== 'Ok' || !route) return null

  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    coords: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
  }
}
