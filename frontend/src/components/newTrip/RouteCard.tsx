import { NPIcon } from './icons'
import CitySearch from './CitySearch'
import RouteMap, { type Coord } from './RouteMap'
import { haversineKm, type Place } from '../../lib/geocode'

interface RouteCardProps {
  from: string
  to: string
  toAddr: string
  fromCoord: Coord | null
  toCoord: Coord | null
  route: [number, number][] | null
  routeDistanceKm: number | null
  routeDurationMin: number | null
  setFromText: (v: string) => void
  setToText: (v: string) => void
  setToAddr: (v: string) => void
  onPickFrom: (p: Place) => void
  onPickTo: (p: Place) => void
  onSwap: () => void
}

const fmtDuration = (min: number) => {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return h > 0 ? `${h} h ${m} min` : `${m} min`
}

export default function RouteCard({
  from, to, toAddr, fromCoord, toCoord, route, routeDistanceKm, routeDurationMin,
  setFromText, setToText, setToAddr, onPickFrom, onPickTo, onSwap,
}: RouteCardProps) {
  const hasRoad = routeDistanceKm != null
  const distance = hasRoad
    ? Math.round(routeDistanceKm)
    : fromCoord && toCoord
      ? Math.round(haversineKm(fromCoord, toCoord))
      : null

  return (
    <div className="routecard">
      <RouteMap from={fromCoord} to={toCoord} route={route} />
      {distance != null && (
        <div className="routecard__meta">
          <span className="routecard__meta-item"><NPIcon.road /><b className="tnum">{distance} km</b></span>
          <span className="routecard__meta-dot" />
          {hasRoad && routeDurationMin != null ? (
            <span className="routecard__meta-item"><NPIcon.clock />{fmtDuration(routeDurationMin)}</span>
          ) : (
            <span className="routecard__meta-item">w linii prostej</span>
          )}
          <button className="routecard__swap" type="button" onClick={onSwap} aria-label="Zamień kierunek"><NPIcon.swap /></button>
        </div>
      )}
      <div className="stops">
        <div className="stops__rail">
          <span className="stops__ring stops__ring--moss" />
          <span className="stops__line" />
          <span className="stops__ring stops__ring--end" />
        </div>
        <div className="stops__cols">
          <div className="stopblk">
            <CitySearch value={from} placeholder="Skąd" inputClassName="stop__city" onText={setFromText} onPick={onPickFrom} />
          </div>
          <div className="stopblk">
            <CitySearch value={to} placeholder="Dokąd" inputClassName="stop__city" onText={setToText} onPick={onPickTo} />
            <input className="stop__addr" value={toAddr} onChange={(e) => setToAddr(e.target.value)} placeholder="gdzie się zatrzymasz" />
          </div>
        </div>
      </div>
    </div>
  )
}
