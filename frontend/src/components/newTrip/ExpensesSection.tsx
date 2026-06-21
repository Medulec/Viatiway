import { useState } from 'react'
import { NPIcon } from './icons'
import { NP_CATS, sanitizeNum, type CategoryId, type CategoryOption } from './constants'

interface ExpensesSectionProps {
  amounts: Record<CategoryId, string>
  active: Record<CategoryId, boolean>
  sym: string
  setAmt: (id: CategoryId, v: string) => void
  toggle: (id: CategoryId) => void
  mode?: 'full' | 'quick'
}

interface RowProps {
  c: CategoryOption
  on: boolean
  amount: string
  sym: string
  setAmt: (v: string) => void
  onActivate?: () => void
}

function CostRow({ c, on, amount, sym, setAmt, onActivate }: RowProps) {
  const CIco = c.icon
  return (
    <div className={'crow' + (on ? '' : ' crow--toggle')} onClick={on ? undefined : onActivate}>
      <span className={'crow__ico crow__ico--' + c.tone}><CIco /></span>
      <div className="crow__main">
        <div className="crow__t">{c.label}</div>
        <div className="crow__s">{c.helper}</div>
      </div>
      {on ? (
        <label className="crow__input" onClick={(e) => e.stopPropagation()}>
          <input value={amount} onChange={(e) => setAmt(sanitizeNum(e.target.value))} placeholder="0" inputMode="decimal" />
          <span>{sym}</span>
        </label>
      ) : (
        <span className="crow__add"><NPIcon.plus /> Dodaj</span>
      )}
    </div>
  )
}

export default function ExpensesSection({ amounts, active, sym, setAmt, toggle, mode = 'full' }: ExpensesSectionProps) {
  const [showMore, setShowMore] = useState(false)
  const isQuick = mode === 'quick'
  const others = NP_CATS.filter((c) => c.id !== 'transport')
  const activeCount = NP_CATS.filter((c) => active[c.id]).length

  if (isQuick) {
    const transport = NP_CATS[0]
    return (
      <div className="sec">
        <div className="sec__lbl">Koszt przejazdu</div>
        <div className="clist">
          <CostRow c={transport} on amount={amounts.transport} sym={sym} setAmt={(v) => setAmt('transport', v)} />
        </div>
        <label className="np-modetoggle">
          <span className="np-modetoggle__lbl">Dodaj inne koszty</span>
          <span className="v-switch">
            <input type="checkbox" checked={showMore} onChange={(e) => setShowMore(e.target.checked)} />
            <span className="v-switch__track"><span className="v-switch__thumb" /></span>
          </span>
        </label>
        {showMore && (
          <div className="clist">
            {others.map((c) => (
              <CostRow
                key={c.id}
                c={c}
                on={active[c.id]}
                amount={amounts[c.id]}
                sym={sym}
                setAmt={(v) => setAmt(c.id, v)}
                onActivate={() => toggle(c.id)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="sec">
      <div className="sec__lbl">
        Wydatki na start
        <span className="sec__tag sec__tag--clay"><i />{activeCount} {activeCount === 1 ? 'kategoria' : 'kategorie'}</span>
      </div>
      <div className="clist">
        {NP_CATS.map((c) => (
          <CostRow
            key={c.id}
            c={c}
            on={active[c.id]}
            amount={amounts[c.id]}
            sym={sym}
            setAmt={(v) => setAmt(c.id, v)}
            onActivate={() => toggle(c.id)}
          />
        ))}
      </div>
    </div>
  )
}
