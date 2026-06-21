import { NPIcon } from './icons'

interface TravelersSectionProps {
  pax: number
  setPax: (n: number) => void
  split: boolean
  setSplit: (v: boolean) => void
}

function Stepper({ value, set, min = 1, max = 12 }: { value: number; set: (n: number) => void; min?: number; max?: number }) {
  return (
    <div className="np-stepper">
      <button type="button" onClick={() => set(Math.max(min, value - 1))} disabled={value <= min} aria-label="Mniej">−</button>
      <span className="np-stepper__val">{value}</span>
      <button type="button" onClick={() => set(Math.min(max, value + 1))} disabled={value >= max} aria-label="Więcej">+</button>
    </div>
  )
}

export default function TravelersSection({ pax, setPax, split, setSplit }: TravelersSectionProps) {
  return (
    <div className="sec">
      <div className="sec__lbl">Podróżni</div>
      <div className="optcard optcard--row">
        <div className="optcard__head">
          <span className="optcard__ico optcard__ico--clay"><NPIcon.people /></span>
          <span className="optcard__cap">Liczba osób</span>
        </div>
        <Stepper value={pax} set={setPax} max={12} />
        <label className="optcard__switch">
          <span className="v-switch">
            <input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} />
            <span className="v-switch__track"><span className="v-switch__thumb" /></span>
            <span className="optcard__switch-lbl">Dziel po równo</span>
          </span>
        </label>
      </div>
    </div>
  )
}
