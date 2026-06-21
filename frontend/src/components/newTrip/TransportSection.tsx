import { useState } from 'react'
import { NPIcon } from './icons'
import { NP_TRANSPORT, type TransportId } from './constants'
import VehicleDrawer from './VehicleDrawer'
import type { Vehicle } from '../../types'

interface TransportSectionProps {
  transport: TransportId
  setTransport: (id: TransportId) => void
  vehicles: Vehicle[]
  vehicleId: string | null
  setVehicleId: (id: string | null) => void
}

export default function TransportSection({ transport, setTransport, vehicles, vehicleId, setVehicleId }: TransportSectionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isCar = transport === 'CAR'
  const cars = vehicles.filter((v) => v.vehicleType === 'CAR_PRIVATE' || v.vehicleType === 'CAR_COMPANY')
  const selected = cars.find((v) => v.id === vehicleId) ?? null

  return (
    <div className="sec">
      <div className="sec__lbl">Jak dojedziesz?</div>
      <div className="chips">
        {NP_TRANSPORT.map((t) => {
          const TIco = t.icon
          return (
            <button
              key={t.id}
              type="button"
              className={'chip' + (transport === t.id ? ' chip--on' : '')}
              onClick={() => setTransport(t.id)}
            >
              <TIco /><span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {isCar && (
        <button type="button" className="np-vehicle" onClick={() => setDrawerOpen(true)}>
          <span className="np-vehicle__ico"><NPIcon.carP /></span>
          <span className="np-vehicle__main">
            {selected ? (
              <>
                <span className="np-vehicle__t">{selected.name ?? selected.licensePlate}</span>
                <span className="np-vehicle__s">
                  {selected.licensePlate}
                  {selected.fuelConsumption != null ? ` · ${selected.fuelConsumption} l/100 km` : ''}
                </span>
              </>
            ) : (
              <>
                <span className="np-vehicle__t">Wybierz pojazd</span>
                <span className="np-vehicle__s">{cars.length > 0 ? `${cars.length} na koncie` : 'brak pojazdów'}</span>
              </>
            )}
          </span>
          <span className="np-vehicle__chev"><NPIcon.chevron /></span>
        </button>
      )}

      <VehicleDrawer
        open={drawerOpen}
        vehicles={cars}
        selectedId={vehicleId}
        onSelect={setVehicleId}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
