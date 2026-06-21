import { useRef, useState } from 'react'
import { NPIcon } from './icons'
import { npFmt, npNum, sanitizeNum } from './constants'

interface BudgetHeroProps {
  budget: string
  setBudget: (v: string) => void
  sym: string
  planned: number
  pax: number
  split: boolean
}

const PRESETS = ['2000', '3000', '5000']
const MAX = 10000
const STEP = 100

function BudgetRing({ frac, over }: { frac: number; over: boolean }) {
  const R = 64
  const C = 2 * Math.PI * R
  const dash = C * Math.min(1, frac)
  return (
    <svg viewBox="0 0 150 150" className="np-ring__svg">
      <defs>
        <linearGradient id="npgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5aab75" />
          <stop offset="100%" stopColor="#237344" />
        </linearGradient>
      </defs>
      <circle cx="75" cy="75" r={R} className="np-ring__track" />
      <circle
        cx="75"
        cy="75"
        r={R}
        className={'np-ring__fill' + (over ? ' np-ring__fill--over' : '')}
        strokeDasharray={`${dash} ${C}`}
        transform="rotate(-90 75 75)"
      />
    </svg>
  )
}

export default function BudgetHero({ budget, setBudget, sym, planned, pax, split }: BudgetHeroProps) {
  const ringRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const budgetVal = npNum(budget)
  const over = budgetVal > 0 && planned > budgetVal
  const frac = budgetVal / MAX
  const perPax = pax > 0 ? budgetVal / pax : budgetVal

  const updateFromPointer = (clientX: number, clientY: number) => {
    const el = ringRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    let angle = Math.atan2(clientX - cx, -(clientY - cy))
    if (angle < 0) angle += Math.PI * 2
    const value = Math.round((angle / (Math.PI * 2)) * MAX / STEP) * STEP
    setBudget(String(value))
  }

  return (
    <div className={'np-herorow' + (over ? ' np-herorow--over' : '')}>
      <div
        className="np-ring np-ring--sm np-ring--dial"
        ref={ringRef}
        onPointerDown={(e) => {
          setDragging(true)
          e.currentTarget.setPointerCapture(e.pointerId)
          updateFromPointer(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => dragging && updateFromPointer(e.clientX, e.clientY)}
        onPointerUp={(e) => {
          setDragging(false)
          e.currentTarget.releasePointerCapture(e.pointerId)
        }}
      >
        <BudgetRing frac={frac} over={over} />
        <div className="np-ring__center">
          <div className="np-ring__cap">Budżet</div>
          <div className={'np-ring__val tnum' + (over ? ' np-ring__val--over' : '')}>
            {npFmt(budgetVal)}<small>{sym}</small>
          </div>
          <div className="np-ring__sub">{planned > 0 ? `zaplanowano ${npFmt(planned)}` : 'przeciągnij, by ustawić'}</div>
        </div>
      </div>
      <div className="np-herorow__ctrl">
        <div className="np-herorow__cap">Budżet podróży</div>
        <label className="np-budget-input">
          <input value={budget} onChange={(e) => setBudget(sanitizeNum(e.target.value))} inputMode="decimal" aria-label="Budżet" />
          <span>{sym}</span>
        </label>
        <div className="np-presets">
          {PRESETS.map((p) => (
            <button key={p} type="button" className={'np-preset' + (budget === p ? ' np-preset--on' : '')} onClick={() => setBudget(p)}>
              {npFmt(npNum(p))}
            </button>
          ))}
        </div>
        {split && pax > 1 && (
          <div className="np-perpax"><NPIcon.people /> ≈ <b className="tnum">{npFmt(perPax)} {sym}</b> / os.</div>
        )}
      </div>
    </div>
  )
}
