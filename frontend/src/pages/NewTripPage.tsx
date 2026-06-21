import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CreateTripPayload, Vehicle } from '../types'
import { api } from '../lib/api'
import type { Place } from '../lib/geocode'
import { getRoute, type RouteResult } from '../lib/routing'
import type { Coord } from '../components/newTrip/RouteMap'
import {
  NewTripAppBar,
  RouteCard,
  BudgetHero,
  DateSection,
  TransportSection,
  TravelersSection,
  ExpensesSection,
  ExtrasSection,
  NP_CATS,
  NP_TRANSPORT,
  npFmt,
  npNum,
  sanitizeNum,
  type CategoryId,
  type TransportId,
} from '../components/newTrip'
import { NPIcon } from '../components/newTrip/icons'

const SYM = 'zł'

const EMPTY_AMOUNTS: Record<CategoryId, string> = {
  transport: '', stay: '', food: '', fun: '', shop: '', other: '',
}

const INITIAL_ACTIVE: Record<CategoryId, boolean> = {
  transport: true, stay: true, food: false, fun: false, shop: false, other: false,
}

const makeName = (a: string, b: string) => {
  if (a && b) return `${a} do ${b}`
  return b || a || ''
}

export default function NewTripPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [nameEdited, setNameEdited] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [toAddr, setToAddr] = useState('')
  const [fromCoord, setFromCoord] = useState<Coord | null>(null)
  const [toCoord, setToCoord] = useState<Coord | null>(null)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [transport, setTransport] = useState<TransportId>('CAR')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleId, setVehicleId] = useState<string | null>(null)
  const [budgetMode, setBudgetMode] = useState(false)
  const [pax, setPax] = useState(1)
  const [split, setSplit] = useState(true)
  const [budget, setBudget] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [amounts, setAmounts] = useState<Record<CategoryId, string>>(EMPTY_AMOUNTS)
  const [active, setActive] = useState<Record<CategoryId, boolean>>(INITIAL_ACTIVE)
  const [notes, setNotes] = useState<string[]>([])
  const [attachments, setAttachments] = useState<File[]>([])

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/v1/vehicles')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Vehicle[]) => setVehicles(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!fromCoord || !toCoord) {
      setRoute(null)
      return
    }
    const ctrl = new AbortController()
    getRoute(fromCoord, toCoord, ctrl.signal)
      .then((r) => setRoute(r))
      .catch(() => {})
    return () => ctrl.abort()
  }, [fromCoord?.lat, fromCoord?.lon, toCoord?.lat, toCoord?.lon])

  const toggle = (id: CategoryId) => setActive((a) => ({ ...a, [id]: !a[id] }))
  const setAmt = (id: CategoryId, v: string) => setAmounts((m) => ({ ...m, [id]: sanitizeNum(v) }))

  const planned = budgetMode
    ? NP_CATS.reduce((s, c) => s + (active[c.id] ? npNum(amounts[c.id]) : 0), 0)
    : npNum(amounts.transport)
  const budgetVal = npNum(budget)
  const pct = budgetVal > 0 ? Math.min(100, Math.round((planned / budgetVal) * 100)) : 0
  const over = budgetMode && budgetVal > 0 && planned > budgetVal

  const onNameChange = (v: string) => { setName(v); setNameEdited(true) }
  const setFromText = (v: string) => { setFrom(v); setFromCoord(null) }
  const setToText = (v: string) => { setTo(v); setToCoord(null); if (error) setError('') }
  const onPickFrom = (p: Place) => {
    setFrom(p.city); setFromCoord({ lat: p.lat, lon: p.lon })
    if (!nameEdited) setName(makeName(p.city, to))
  }
  const onPickTo = (p: Place) => {
    setTo(p.city); setToCoord({ lat: p.lat, lon: p.lon })
    if (error) setError('')
    if (!nameEdited) setName(makeName(from, p.city))
  }

  const swap = () => {
    setFrom(to); setTo(from)
    setFromCoord(toCoord); setToCoord(fromCoord)
    if (!nameEdited) setName(makeName(to, from))
  }

  const addFiles = (files: FileList) => setAttachments((a) => [...a, ...Array.from(files)])

  const handleSave = async () => {
    if (!to.trim()) {
      setError('Podaj miejsce docelowe (Dokąd)')
      return
    }
    setError('')
    setSaving(true)
    const transportMode = NP_TRANSPORT.find((t) => t.id === transport)!.vehicleType

    const categoryAmount = (id: CategoryId) =>
      active[id] && npNum(amounts[id]) > 0 ? npNum(amounts[id]) : undefined

    const payload: CreateTripPayload & { vehicleId?: string; distance?: number; note?: string } = {
      name: name || undefined,
      destinationFrom: from || undefined,
      destinationTo: to,
      destinationToAddress: toAddr || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      transportMode,
      distance: route ? Math.round(route.distanceKm) : undefined,
      travelersCount: budgetMode ? pax : 1,
      splitEqually: budgetMode ? split : false,
      budget: budgetMode && budgetVal > 0 ? budgetVal : undefined,
      budgetTransport: categoryAmount('transport'),
      budgetStay: categoryAmount('stay'),
      budgetFood: categoryAmount('food'),
      budgetFun: categoryAmount('fun'),
      budgetShop: categoryAmount('shop'),
      budgetOther: categoryAmount('other'),
      note: notes.length > 0 ? notes.join('\n') : undefined,
      ...(transport === 'CAR' && vehicleId ? { vehicleId } : {}),
    }

    try {
      const res = await api.post('/api/v1/trips', payload)
      if (!res.ok) throw new Error('Nie udało się zapisać podróży')
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Coś poszło nie tak')
      setSaving(false)
    }
  }

  return (
    <div className="np-screen">
      <NewTripAppBar onBack={() => navigate('/')} />

      <div className="form form--c">
        <div className="np-namefield">
          <NPIcon.spark />
          <input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Nazwij podróż…" aria-label="Nazwa podróży" />
        </div>

        <RouteCard
          from={from}
          to={to}
          toAddr={toAddr}
          fromCoord={fromCoord}
          toCoord={toCoord}
          route={route?.coords ?? null}
          routeDistanceKm={route?.distanceKm ?? null}
          routeDurationMin={route?.durationMin ?? null}
          setFromText={setFromText}
          setToText={setToText}
          setToAddr={setToAddr}
          onPickFrom={onPickFrom}
          onPickTo={onPickTo}
          onSwap={swap}
        />

        <label className="np-modetoggle">
          <span className="np-modetoggle__lbl">Budżet podróży</span>
          <span className="v-switch">
            <input type="checkbox" checked={budgetMode} onChange={(e) => setBudgetMode(e.target.checked)} />
            <span className="v-switch__track"><span className="v-switch__thumb" /></span>
          </span>
        </label>

        {budgetMode && (
          <BudgetHero budget={budget} setBudget={setBudget} sym={SYM} planned={planned} pax={pax} split={split} />
        )}

        <DateSection startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />

        <TransportSection
          transport={transport}
          setTransport={setTransport}
          vehicles={vehicles}
          vehicleId={vehicleId}
          setVehicleId={setVehicleId}
        />

        {budgetMode && <TravelersSection pax={pax} setPax={setPax} split={split} setSplit={setSplit} />}

        <ExpensesSection
          amounts={amounts}
          active={active}
          sym={SYM}
          setAmt={setAmt}
          toggle={toggle}
          mode={budgetMode ? 'full' : 'quick'}
        />

        <ExtrasSection
          notes={notes}
          attachments={attachments.map((f) => ({ name: f.name }))}
          onAddNote={(t) => setNotes((n) => [...n, t])}
          onRemoveNote={(i) => setNotes((n) => n.filter((_, idx) => idx !== i))}
          onAddFiles={addFiles}
          onRemoveAttachment={(i) => setAttachments((a) => a.filter((_, idx) => idx !== i))}
        />
      </div>

      <div className="footer">
        <div className="summary">
          <div>
            <div className="summary__lbl">{budgetMode ? 'Zaplanowano na start' : 'Koszt przejazdu'}</div>
            {budgetMode && <div className="summary__break">z budżetu {npFmt(budgetVal)} {SYM} · {pct}%</div>}
          </div>
          <div className={'summary__amt' + (over ? ' summary__amt--over' : '')}>{npFmt(planned)}<small>{SYM}</small></div>
        </div>
        {error && <div className="v-field__hint v-field__hint--error" style={{ marginBottom: 'var(--space-2)' }}>{error}</div>}
        <button className="v-btn v-btn--primary v-btn--lg v-btn--block" onClick={handleSave} disabled={saving}>
          {saving ? 'Zapisywanie…' : budgetMode ? 'Otwórz budżet i ruszaj' : 'Zarejestruj przejazd'}
        </button>
      </div>
    </div>
  )
}
