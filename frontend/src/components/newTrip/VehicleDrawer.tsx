import { NPIcon } from './icons'
import type { Vehicle } from '../../types'

interface VehicleDrawerProps {
  open: boolean
  vehicles: Vehicle[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onClose: () => void
}

export default function VehicleDrawer({ open, vehicles, selectedId, onSelect, onClose }: VehicleDrawerProps) {
  return (
    <div className={'np-sheet' + (open ? ' np-sheet--open' : '')} aria-hidden={!open}>
      <div className="np-sheet__scrim" onClick={onClose} />
      <div className="np-sheet__panel" role="dialog" aria-label="Wybierz pojazd">
        <div className="np-sheet__grip" />
        <div className="np-sheet__head">
          <span className="np-sheet__title">Twoje pojazdy</span>
          <button className="np-sheet__close" type="button" onClick={onClose} aria-label="Zamknij"><NPIcon.close /></button>
        </div>

        {vehicles.length === 0 ? (
          <div className="np-vehicle-empty">Brak pojazdów na koncie — dodaj je w profilu.</div>
        ) : (
          <div className="np-sheet__list">
            {vehicles.map((v) => {
              const on = selectedId === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  className={'np-vehicle' + (on ? ' np-vehicle--on' : '')}
                  onClick={() => { onSelect(on ? null : v.id); onClose() }}
                >
                  <span className="np-vehicle__ico"><NPIcon.carP /></span>
                  <span className="np-vehicle__main">
                    <span className="np-vehicle__t">{v.name ?? v.licensePlate}</span>
                    <span className="np-vehicle__s">
                      {v.licensePlate}
                      {v.fuelConsumption != null ? ` · ${v.fuelConsumption} l/100 km` : ''}
                      {v.isDefault ? ' · domyślny' : ''}
                    </span>
                  </span>
                  <span className="np-vehicle__chev">{on ? <NPIcon.check /> : <NPIcon.chevron />}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
