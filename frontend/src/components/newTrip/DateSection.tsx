interface DateSectionProps {
  startDate: string
  endDate: string
  setStartDate: (v: string) => void
  setEndDate: (v: string) => void
}

const dayMonth = (iso: string) => {
  if (!iso) return '—'
  const [, m, d] = iso.split('-')
  return `${d}.${m}`
}

const weekday = (iso: string) => {
  if (!iso) return 'wybierz'
  return new Date(iso + 'T00:00:00').toLocaleDateString('pl-PL', { weekday: 'long' })
}

const nightsWord = (n: number) => {
  if (n === 1) return 'noc'
  const last = n % 10
  const lastTwo = n % 100
  if (last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20)) return 'noce'
  return 'nocy'
}

const daysWord = (n: number) => (n === 1 ? 'dzień' : 'dni')

const openPicker = (e: { currentTarget: HTMLInputElement }) => {
  const el = e.currentTarget
  if (typeof el.showPicker === 'function') {
    try { el.showPicker() } catch { void 0 }
  }
}

export default function DateSection({ startDate, endDate, setStartDate, setEndDate }: DateSectionProps) {
  let days = 0
  let nights = 0
  if (startDate && endDate) {
    const diff = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000)
    if (diff >= 0) {
      days = diff + 1
      nights = diff
    }
  }

  return (
    <div className="sec">
      <div className="sec__lbl">Termin</div>
      <div className="grid3">
        <label className="minicard">
          <div className="minicard__cap">Wyjazd</div>
          <div className="minicard__val">{dayMonth(startDate)}</div>
          <div className="minicard__sub">{weekday(startDate)}</div>
          <input
            className="minicard__input"
            type="date"
            value={startDate}
            max={endDate || undefined}
            onClick={openPicker}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Data wyjazdu"
          />
        </label>
        <label className="minicard">
          <div className="minicard__cap">Powrót</div>
          <div className="minicard__val">{dayMonth(endDate)}</div>
          <div className="minicard__sub">{weekday(endDate)}</div>
          <input
            className="minicard__input"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onClick={openPicker}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="Data powrotu"
          />
        </label>
        <div className="minicard minicard--accent">
          <div className="minicard__cap">Długość</div>
          <div className="minicard__val">{days > 0 ? `${days} ${daysWord(days)}` : '—'}</div>
          <div className="minicard__sub">{days > 0 ? `${nights} ${nightsWord(nights)}` : ''}</div>
        </div>
      </div>
    </div>
  )
}
